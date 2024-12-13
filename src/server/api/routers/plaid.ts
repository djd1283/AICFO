import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { Configuration, PlaidApi } from "plaid";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { env } from "~/env";

const configuration = new Configuration({
  basePath: env.PLAID_ENV === "sandbox" ? "https://sandbox.plaid.com" : "https://development.plaid.com",
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': env.PLAID_CLIENT_ID,
      'PLAID-SECRET': env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export const plaidRouter = createTRPCRouter({
  getPlaidAccounts: protectedProcedure.query(async ({ ctx }) => {
    // grab the access token from the user
    const accessToken = await ctx.db.query.users.findFirst({
      where: eq(users.id, ctx.session.user.id),
      columns: {
        plaidAccessToken: true,
      },
    });

    if (!accessToken?.plaidAccessToken) {
      throw new Error("User does not have a Plaid access token");
    }

    const response = await plaidClient.accountsGet({
      access_token: accessToken.plaidAccessToken,
      
    });
    
    console.log("Plaid API Response:", {
      status: response.status,
      data: response.data,
    });
    
    return response.data;
  }),

  getTransactionCount: protectedProcedure
    .input(z.object({
      accountId: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const { accountId } = input;
      
      const accessToken = await ctx.db.query.users.findFirst({
        where: eq(users.id, ctx.session.user.id),
        columns: {
          plaidAccessToken: true,
        },
      });
  
      if (!accessToken?.plaidAccessToken) {
        throw new Error("User does not have a Plaid access token");
      }
      
      const endDate = new Date().toISOString().split('T')[0] ?? '';

      // Get transaction count from Plaid
      const response = await plaidClient.transactionsGet({
        access_token: accessToken.plaidAccessToken,
        start_date: '2024-01-01', // You might want to make this configurable
        end_date: endDate,
        options: {
          account_ids: [accountId],
          count: 1, // We only need the count
          offset: 0,
        },
      });

      return response.data.total_transactions;
    }),
});
