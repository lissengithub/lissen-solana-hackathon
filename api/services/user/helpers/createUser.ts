import {
  consumerWallets,
  consumers,
  db,
  gemTransactionHistory,
  paymentProfiles,
  users,
  usersGems,
} from "@libs/neon";
import Logger from "@libs/logger";
import dayjs from "dayjs";
import { ethers } from "ethers";
import { v4 as uuid } from "uuid";
import { ValidTerritoryCode } from "@libs/utils";

const projectId = process.env.PROJECT_ID;
type PaymentProfileInsert = typeof paymentProfiles.$inferInsert;

export default async function createUser({
  email,
  logger,
  uid,
  territoryCode,
  stripeCustomerId,
}: {
  email: string;
  logger: Logger;
  uid: string;
  territoryCode: ValidTerritoryCode;
  stripeCustomerId?: string;
}) {
  const now = dayjs();
  const walletId = uuid();
  const consumerId = uuid();
  const { address, privateKey, mnemonic } = ethers.Wallet.createRandom();
  const name = `User#${now.unix().toString().slice(-6)}`;

  // Add random avatar selection
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  const defaultProfileImage = `https://cdn.${projectId}.lissen.live/images/_default_profile_images/${randomNumber}.svg`;

  logger.info(
    `Creating user in db: userId: ${uid}, email: ${email}, name: ${name}, consumerId: ${consumerId}, walletId: ${walletId}`,
  );

  // base data
  const userBase = {
    id: uid,
    email,
    name,
    flags: {
      welcome_seen: false,
    },
    image: defaultProfileImage,
  };

  const walletBase = {
    id: walletId,
    eoa: address,
    privateKey: privateKey,
    seedPhrase: mnemonic.phrase,
  };

  const consumerBase = {
    subscription: "free",
  } as const;

  const paymentProfile: PaymentProfileInsert = {
    amountPaid: "1",
    amountReceived: "0",
    amountNet: "1",
    currency: "GBP",
    provider: "lissen",
    taxPercentage: "0",
    status: "active",
    startDate: now.toISOString(),
    consumerId,
  };

  await Promise.all([
    db.user.insert(consumerWallets).values(walletBase),
    db.user.insert(consumers).values({
      walletId,
      id: consumerId,
      ...consumerBase,
    }),
    db.user.insert(users).values({
      consumerId,
      countryCode: territoryCode,
      stripeCustomerId,
      ...userBase,
    }),
    db.user.insert(paymentProfiles).values(paymentProfile),
    db.user.insert(usersGems).values({ userId: uid, gems: 5 }),
    db.user.insert(gemTransactionHistory).values({
      userId: uid,
      amount: 5,
      action: "signup",
    }),
  ]);

  return { uid };
}
