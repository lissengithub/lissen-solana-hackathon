import {
  db,
  eq,
  GemTransactionHistory,
  gemTransactionHistory,
  solUserWallets,
  sql,
  usersGems,
} from "@libs/neon";
import { protectedProcedure } from "../../../trpc";
import Logger from "@libs/logger";
import {
  getOrCreateAssociatedTokenAccount,
  createTransferInstruction,
} from "@solana/spl-token";
import {
  Connection,
  Keypair,
  PublicKey,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";

const SOLANA_NETWORK_URL = "https://api.devnet.solana.com"; // Using Devnet
// const LISSEN_GEM_DECIMALS = 0; // For 1:1 gem parity - Used implicitly if amount is whole number

export const rewardGemToken = async (
  uid: string,
  amount: number, // This is the actual number of gems, e.g., 1, 5, 10
  logger: Logger,
) => {
  logger.info(
    `Attempting to reward ${amount} LissenGem SPL tokens to user ${uid}`,
  );

  const [userSolWalletRecord, lissenMasterWalletRecord] = await Promise.all([
    db.user.query.solUserWallets.findFirst({
      where: eq(solUserWallets.userId, uid),
    }),
    db.user.query.solMaster.findFirst(),
  ]);

  if (!userSolWalletRecord) {
    logger.error("User's Solana wallet record not found in DB", { uid });
    return;
  }
  if (!lissenMasterWalletRecord) {
    logger.error("Lissen master wallet record not found in DB");
    return;
  }
  if (!lissenMasterWalletRecord.secretKey) {
    logger.error("Lissen master wallet secret key is missing from DB record");
    return;
  }
  if (!lissenMasterWalletRecord.lissenGemMintAddress) {
    logger.error(
      "LissenGem Mint Address is missing from master wallet DB record",
    );
    return;
  }

  let masterWalletKeypair: Keypair;
  try {
    // Assuming secretKey is stored as a JSON string representation of a Uint8Array
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
    return;
  }

  const lissenGemMintPk = new PublicKey(
    lissenMasterWalletRecord.lissenGemMintAddress,
  );
  const userSolanaPk = new PublicKey(userSolWalletRecord.publicKey);
  const masterWalletPk = masterWalletKeypair.publicKey; // Derived from the reconstructed Keypair

  const connection = new Connection(SOLANA_NETWORK_URL, "confirmed");

  try {
    logger.info(
      "Fetching/creating source ATA (Master Wallet's LissenGem ATA)...",
    );
    const sourceATA = await getOrCreateAssociatedTokenAccount(
      connection,
      masterWalletKeypair, // Payer for creation (if needed, though it should exist)
      lissenGemMintPk, // Mint
      masterWalletPk, // Owner of this ATA
    );
    logger.info(`Source ATA (Master Wallet): ${sourceATA.address.toBase58()}`);

    logger.info("Fetching/creating destination ATA (User's LissenGem ATA)...");
    const destinationATA = await getOrCreateAssociatedTokenAccount(
      connection,
      masterWalletKeypair, // Payer for creation (if user's ATA doesn't exist yet)
      lissenGemMintPk, // Mint
      userSolanaPk, // Owner of this ATA is the user
    );
    logger.info(
      `Destination ATA (User ${uid}): ${destinationATA.address.toBase58()}`,
    );

    // Amount to transfer (since LISSEN_GEM_DECIMALS = 0, amount is direct)
    // If decimals were > 0, it would be: amount * (10 ** LISSEN_GEM_DECIMALS)
    const amountToTransfer = amount;

    logger.info(
      `Preparing to transfer ${amountToTransfer} LissenGems from ${sourceATA.address.toBase58()} to ${destinationATA.address.toBase58()}`,
    );

    const transaction = new Transaction().add(
      createTransferInstruction(
        sourceATA.address, // Source ATA
        destinationATA.address, // Destination ATA
        masterWalletPk, // Owner of source ATA (the master wallet)
        amountToTransfer, // Amount
      ),
    );

    const signature = await sendAndConfirmTransaction(
      connection,
      transaction,
      [masterWalletKeypair], // Master wallet signs to authorize transfer from its ATA and pay fees
    );

    logger.info(
      `Successfully transferred ${amountToTransfer} LissenGem(s) to user ${uid}. Transaction: ${signature}`,
    );
    // Optionally, store the transaction signature in your GemTransactionHistory or a new table
  } catch (error) {
    logger.error(`Failed to transfer LissenGem SPL tokens to user ${uid}`, {
      error,
      userSolanaPk: userSolanaPk.toBase58(),
      lissenGemMint: lissenGemMintPk.toBase58(),
    });
  }
};

export const rewardGem = async (
  data: {
    action: GemTransactionHistory["action"];
    amount: number;
    artistId: string | null;
    accessId: string | null;
    userVoucherId: string | null;
    songId: string | null;
  },
  shouldRewardToken: boolean = false,
  uid: string,
  logger: Logger,
) => {
  logger.info(`Rewarding ${data.amount} gems for ${data.action}`, { data });

  if (shouldRewardToken) {
    rewardGemToken(uid, data.amount, logger).catch((error) => {
      logger.error("Failed to reward gem token", { error });
    });
  }
  await Promise.all([
    db.user
      .insert(gemTransactionHistory)
      .values([{ ...data, userId: uid }])
      .onConflictDoNothing(),

    db.user
      .update(usersGems)
      .set({
        gems: sql`${usersGems.gems} + ${data.amount}`,
      })
      .where(eq(usersGems.userId, uid)),
  ]);
};

export default protectedProcedure.mutation(async () => {
  return { gemsAdded: 0 };
});
