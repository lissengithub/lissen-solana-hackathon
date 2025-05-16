import { httpBatchLink } from "@trpc/client";

export const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/api/trpc/v1`;

type TRPC_TRANSFORMER = Extract<
  Parameters<typeof httpBatchLink>[0]["transformer"],
  { input: unknown; output: unknown }
>;

export const transformer: TRPC_TRANSFORMER = {
  input: {
    serialize: (object) => {
      // TRPC client sending data
      // TRPC client sends data as string with quotes when batching is off so we are overriding the serialize method to send data as object
      // Also since TRPC client sets content-type to application/json, we need to actually send valid JSON
      if (typeof object === "string") {
        return { internalData: object };
      } else {
        return object;
      }
    },
    deserialize: (object) => {
      // TRPC server receiving data
      if (typeof object === "object" && "internalData" in object) {
        return object.internalData;
      } else {
        return object;
      }
    },
  },
  output: {
    // TRPC server sending data
    serialize: (object) => object,
    // TRPC client receiving data
    deserialize: (object) => object,
  },
};
