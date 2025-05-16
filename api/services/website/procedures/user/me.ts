import { db, eq, users, solUserWallets } from "@libs/neon";
import { TRPCError } from "@trpc/server";
import { protectedProcedure } from "../../../../trpc";
import { z } from "zod";

import { Keypair } from "@solana/web3.js";
import Logger from "@libs/logger";
const schema = {
  output: z.object({
    email: z.string(),
    id: z.string(),
    image: z.string().nullable(),
    name: z.string(),
    solanaWalletPublicKey: z.string(),
  }),
};

const handleSolanaWallet = async (userId: string, logger: Logger) => {
  const solanaWallet = await db.user.query.solUserWallets.findFirst({
    where: eq(solUserWallets.userId, userId),
  });

  if (!solanaWallet) {
    logger.info("No solana wallet found for user", userId);
    logger.info("Generating new solana wallet...");
    const userWallet = Keypair.generate();
    const publicKey = userWallet.publicKey.toBase58();
    const secretKey = JSON.stringify(Array.from(userWallet.secretKey));

    //store the user wallet in the database
    await db.user.insert(solUserWallets).values({
      userId,
      publicKey,
      secretKey,
    });

    logger.info("New solana wallet generated", {
      publicKey,
    });

    return publicKey;
  }
  return solanaWallet.publicKey;
};

export default protectedProcedure
  .output(schema.output)
  .query(async ({ ctx: { uid: userId, logger } }) => {
    const user = await db.user.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        email: true,
        id: true,
        image: true,
        name: true,
      },
    });

    const solanaWalletPublicKey = await handleSolanaWallet(userId, logger);

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return { ...user, solanaWalletPublicKey };
  });
