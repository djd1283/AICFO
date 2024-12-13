import { z } from "zod";
import { Configuration, CountryCode, PlaidApi, Products } from "plaid";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";
import { env } from "~/env";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const configuration = new Configuration({
  basePath: process.env.PLAID_ENV === "sandbox" ? "https://sandbox.plaid.com" : "https://development.plaid.com",
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': env.PLAID_CLIENT_ID,
      'PLAID-SECRET': env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export const plaidLoginRouter = createTRPCRouter({
  getPlaidLinkToken: protectedProcedure.query(async ({ ctx }) => {
    // pull Plaid client id and secret from env
    
    const request = {
      user: {
        client_user_id: ctx.session.user.id,
      },
      client_name: "AICFO",
      products: [Products.Auth],
      country_codes: [CountryCode.Us],
      language: "en",
    };

    const response = await plaidClient.linkTokenCreate(request);
    return response.data.link_token;

  }),

  fetchAndStorePlaidAccessToken: protectedProcedure
    .input(z.object({ publicToken: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const plaidClientId = process.env.PLAID_CLIENT_ID;
      const plaidSecret = process.env.PLAID_SECRET;

    const request = {
      client_id: plaidClientId,
      secret: plaidSecret,
      public_token: input.publicToken,
    };

    const response = await plaidClient.itemPublicTokenExchange(request);

    // now we need to store the access token in the database
    await ctx.db.update(users)
      .set({
        plaidAccessToken: response.data.access_token,
      })
      .where(eq(users.id, ctx.session.user.id));
  }),
});
