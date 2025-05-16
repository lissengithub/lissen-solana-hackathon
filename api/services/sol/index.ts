import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";
import {
  and,
  db,
  eq,
  solUnlockedSongs,
  sql,
  usersGems,
  solUserWallets,
} from "@libs/neon";
import { TRPCError } from "@trpc/server";
import Logger from "@libs/logger";
import {
  Keypair,
  PublicKey,
  Connection,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

// TODO: Ensure SOLANA_NETWORK_URL is configured in your environment
const GEM_COST = 10;
const SOLANA_NETWORK_URL = "https://api.devnet.solana.com";

export const spendGemToken = async (
  uid: string,
  amount: number, // This is the actual number of gems to be spent, e.g., 1, 5, 10
  logger: Logger,
): Promise<boolean> => {
  logger.info(
    `Attempting to spend ${amount} LissenGem SPL tokens from user ${uid}`,
  );

  const [userSolWalletRecord, lissenMasterWalletRecord] = await Promise.all([
    db.user.query.solUserWallets.findFirst({
      where: eq(solUserWallets.userId, uid),
    }),
    db.user.query.solMaster.findFirst(),
  ]);

  if (!userSolWalletRecord) {
    logger.error("User's Solana wallet record not found in DB", { uid });
    return false;
  }
  if (!userSolWalletRecord.secretKey) {
    logger.error("User's Solana wallet secret key not found in DB", { uid });
    return false;
  }
  if (!lissenMasterWalletRecord) {
    logger.error("Lissen master wallet record not found in DB");
    return false;
  }
  if (!lissenMasterWalletRecord.secretKey) {
    logger.error("Lissen master wallet secret key is missing from DB record");
    return false;
  }
  if (!lissenMasterWalletRecord.lissenGemMintAddress) {
    logger.error(
      "LissenGem Mint Address is missing from master wallet DB record",
    );
    return false;
  }

  let masterWalletKeypair: Keypair;
  try {
    const secretKeyArray = JSON.parse(lissenMasterWalletRecord.secretKey);
    if (
      !Array.isArray(secretKeyArray) ||
      !secretKeyArray.every((num) => typeof num === "number")
    ) {
      throw new Error(
        "Master wallet secret key in DB is not a valid JSON array of numbers.",
      );
    }
    masterWalletKeypair = Keypair.fromSecretKey(
      Uint8Array.from(secretKeyArray),
    );
  } catch (e) {
    logger.error("Failed to parse Lissen master wallet secret key from DB", {
      error: e,
      secretKeyStored: lissenMasterWalletRecord.secretKey,
    });
    return false;
  }

  let userKeypair: Keypair;
  try {
    const userSecretKeyArray = JSON.parse(userSolWalletRecord.secretKey);
    if (
      !Array.isArray(userSecretKeyArray) ||
      !userSecretKeyArray.every((num) => typeof num === "number")
    ) {
      throw new Error(
        "User wallet secret key in DB is not a valid JSON array of numbers.",
      );
    }
    userKeypair = Keypair.fromSecretKey(Uint8Array.from(userSecretKeyArray));
  } catch (e) {
    logger.error("Failed to parse user wallet secret key from DB", {
      error: e,
      userId: uid,
      secretKeyStored: userSolWalletRecord.secretKey,
    });
    return false;
  }

  const lissenGemMintPk = new PublicKey(
    lissenMasterWalletRecord.lissenGemMintAddress,
  );
  const userSolanaPk = new PublicKey(userSolWalletRecord.publicKey);
  const masterWalletPk = masterWalletKeypair.publicKey;

  const connection = new Connection(SOLANA_NETWORK_URL, "confirmed");

  try {
    logger.info("Fetching/creating source ATA (User's LissenGem ATA)...");
    const sourceATA = await getOrCreateAssociatedTokenAccount(
      connection,
      masterWalletKeypair, // Payer for ATA creation if needed
      lissenGemMintPk,
      userSolanaPk,
    );
    logger.info(`Source ATA (User ${uid}): ${sourceATA.address.toBase58()}`);

    logger.info(
      "Fetching/creating destination ATA (Master Wallet's LissenGem ATA)...",
    );
    const destinationATA = await getOrCreateAssociatedTokenAccount(
      connection,
      masterWalletKeypair, // Payer for ATA creation (if needed, though it should exist)
      lissenGemMintPk, // Mint
      masterWalletPk, // Owner of this ATA
    );
    logger.info(
      `Destination ATA (Master Wallet): ${destinationATA.address.toBase58()}`,
    );

    const amountToTransfer = amount;

    logger.info(
      `Preparing to transfer ${amountToTransfer} LissenGems from User ${uid} (${sourceATA.address.toBase58()}) to Master Wallet (${destinationATA.address.toBase58()})`,
    );

    const transaction = new Transaction().add(
      createTransferInstruction(
        sourceATA.address,
        destinationATA.address,
        userKeypair.publicKey, // User is the authority for their ATA
        amountToTransfer,
      ),
    );

    transaction.feePayer = masterWalletKeypair.publicKey; // Master wallet pays the fees

    // Signers: user to authorize transfer from their ATA, master wallet to pay fees
    const signature = await sendAndConfirmTransaction(connection, transaction, [
      userKeypair,
      masterWalletKeypair,
    ]);

    logger.info(
      `Successfully transferred ${amountToTransfer} LissenGem(s) from user ${uid} to master wallet. Transaction: ${signature}`,
    );
    return true;
  } catch (error) {
    logger.error(
      `Failed to transfer LissenGem SPL tokens from user ${uid} to master wallet`,
      {
        error,
        userSolanaPk: userSolanaPk.toBase58(),
        masterWalletPk: masterWalletPk.toBase58(),
        lissenGemMint: lissenGemMintPk.toBase58(),
      },
    );
    return false;
  }
};

export const checkUserLissenGemBalance = async (
  uid: string,
  logger: Logger,
): Promise<number> => {
  logger.info(`Checking LissenGem SPL token balance for user ${uid}`);

  const [userSolWalletRecord, lissenMasterWalletRecord] = await Promise.all([
    db.user.query.solUserWallets.findFirst({
      where: eq(solUserWallets.userId, uid),
    }),
    db.user.query.solMaster.findFirst(),
  ]);

  if (!userSolWalletRecord) {
    logger.error("User's Solana wallet record not found in DB", { uid });
    return 0;
  }
  if (!userSolWalletRecord.secretKey) {
    logger.error("User's Solana wallet secret key not found in DB", { uid });
    return 0;
  }
  if (!lissenMasterWalletRecord) {
    logger.error("Lissen master wallet record not found in DB");
    return 0;
  }
  if (!lissenMasterWalletRecord.lissenGemMintAddress) {
    logger.error(
      "LissenGem Mint Address is missing from master wallet DB record",
    );
    return 0;
  }

  const userSolanaPk = new PublicKey(userSolWalletRecord.publicKey);
  const lissenGemMintPk = new PublicKey(
    lissenMasterWalletRecord.lissenGemMintAddress,
  );

  const connection = new Connection(SOLANA_NETWORK_URL, "confirmed");

  try {
    const userLissenGemAtaPk = await getAssociatedTokenAddress(
      lissenGemMintPk,
      userSolanaPk,
      false, // allowOwnerOffCurve
    );

    logger.info(
      `Derived LissenGem ATA for user ${uid}: ${userLissenGemAtaPk.toBase58()}`,
    );

    const balanceResponse =
      await connection.getTokenAccountBalance(userLissenGemAtaPk);

    if (balanceResponse?.value) {
      const balance = Number(balanceResponse.value.amount);
      logger.info(
        `User ${uid} LissenGem token balance: ${balance} (raw units), UI amount: ${balanceResponse.value.uiAmountString}`,
      );
      return balance;
    } else {
      logger.warn(
        `No balance response or value for LissenGem ATA ${userLissenGemAtaPk.toBase58()} of user ${uid}. Assuming 0.`,
      );
      return 0;
    }
  } catch (error: any) {
    if (
      error.message?.includes("could not find account") ||
      error.message?.includes("Account does not exist") ||
      error.name === "TokenAccountNotFoundError" ||
      error.message?.includes("Invalid param: could not find account")
    ) {
      logger.info(
        `LissenGem ATA for user ${uid} likely does not exist. Error: ${error.message}. Returning 0 balance.`,
        { ataAddress: userSolWalletRecord.publicKey }, // userLissenGemAtaPk might not be defined if getAssociatedTokenAddress failed.
      );
      return 0;
    }
    logger.error(`Failed to get LissenGem token balance for user ${uid}`, {
      error: error.message,
      userSolanaPk: userSolanaPk.toBase58(),
      lissenGemMint: lissenGemMintPk.toBase58(),
    });
    return 0;
  }
};

export const solRouter = router({
  unlockSong: protectedProcedure
    .input(
      z.object({
        songId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { songId } = input;
      const { uid, logger } = ctx;

      // Check if already unlocked
      const alreadyUnlocked = await db.user.query.solUnlockedSongs.findFirst({
        where: and(
          eq(solUnlockedSongs.userId, uid),
          eq(solUnlockedSongs.songId, songId),
        ),
      });

      if (alreadyUnlocked) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Song already unlocked",
        });
      }

      // Check if user has enough gems in the database
      const gemsRecord = await db.user.query.usersGems.findFirst({
        where: eq(usersGems.userId, uid),
      });
      const gemCount = gemsRecord?.gems || 0;

      if (gemCount < GEM_COST) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Not enough gems in database. Found ${gemCount}, need ${GEM_COST}.`,
        });
      }

      // Check user's on-chain LissenGem token balance
      const lissenGemTokenBalance = await checkUserLissenGemBalance(
        uid,
        logger,
      );
      logger.info(
        `User ${uid} on-chain LissenGem token balance: ${lissenGemTokenBalance}`,
      );
      if (lissenGemTokenBalance < GEM_COST) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: `Not enough LissenGem tokens on-chain. Found ${lissenGemTokenBalance}, need ${GEM_COST}.`,
        });
      }

      let gemDeductedInDb = false;
      try {
        // 1. Deduct gems from the database
        logger.info(
          `Attempting to deduct ${GEM_COST} gems from user ${uid} in DB.`,
        );
        const updateResult = await db.user
          .update(usersGems)
          .set({
            gems: sql`${usersGems.gems} - ${GEM_COST}`,
          })
          .where(
            and(
              eq(usersGems.userId, uid),
              sql`${usersGems.gems} >= ${GEM_COST}`, // Ensure enough gems before deducting
            ),
          )
          .returning(); // Check if any row was updated

        if (updateResult.length === 0) {
          // This means gems were not deducted, either because the user didn't have enough (despite initial check)
          // or another concurrent transaction modified the balance.
          logger.warn(
            `Failed to deduct gems for user ${uid} in DB. Update returned 0 rows. Initial gem count: ${gemCount}`,
          );
          throw new TRPCError({
            code: "BAD_REQUEST", // Or CONFLICT if it implies a race condition
            message:
              "Failed to deduct gems. Insufficient gems or concurrent update.",
          });
        }
        gemDeductedInDb = true;
        logger.info(
          `Successfully deducted ${GEM_COST} gems from user ${uid} in DB.`,
        );

        // 2. Attempt to spend the SPL token on-chain
        logger.info(
          `Attempting to spend ${GEM_COST} LissenGem tokens on-chain for user ${uid}.`,
        );
        const spendSuccess = await spendGemToken(uid, GEM_COST, logger);

        if (!spendSuccess) {
          logger.error(`On-chain token spend failed for user ${uid}.`);
          // This error will be caught by the outer catch, which will trigger gem reversal
          throw new Error(
            "On-chain LissenGem token spend failed. Your gems will be refunded.",
          );
        }
        logger.info(
          `Successfully spent ${GEM_COST} LissenGem tokens on-chain for user ${uid}.`,
        );

        // 3. If both are successful, record the unlocked song
        logger.info(`Recording unlocked song ${songId} for user ${uid}.`);
        await db.user.insert(solUnlockedSongs).values({
          userId: uid,
          songId: songId,
        });
        logger.info(`Successfully unlocked song ${songId} for user ${uid}.`);

        return { success: true, message: "Song unlocked successfully." };
      } catch (error: any) {
        logger.error(
          `Error during song unlock process for user ${uid}, song ${songId}.`,
          { error: error.message },
        );

        if (gemDeductedInDb) {
          logger.warn(
            `Unlock process failed after gems were deducted for ${uid}. Attempting to revert gem deduction.`,
          );
          try {
            await db.user
              .update(usersGems)
              .set({
                gems: sql`${usersGems.gems} + ${GEM_COST}`,
              })
              .where(eq(usersGems.userId, uid));
            logger.info(`Successfully reverted gem deduction for user ${uid}.`);
          } catch (reversalError: any) {
            logger.error(
              `CRITICAL: Failed to revert gem deduction for user ${uid} after unlock failure. Manual intervention required.`,
              {
                originalError: error.message,
                reversalError: reversalError.message,
              },
            );
            // Even if reversal fails, throw an error indicating the original problem,
            // but with a severe warning about the inconsistent state.
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message:
                "Song unlock failed, and we encountered an issue refunding your gems. Please contact support.",
              cause: reversalError,
            });
          }
        }

        // Propagate the error to the client
        if (error instanceof TRPCError) {
          throw error; // Re-throw TRPCError as is
        }
        // For other errors (like the one we threw for spendGemToken failure)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error.message || "Failed to unlock song.",
          cause: error,
        });
      }
    }),
});
