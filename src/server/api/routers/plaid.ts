import { eq } from "drizzle-orm";
import { transactions, users } from "~/server/db/schema";
import { Configuration, PlaidApi } from "plaid";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { env } from "~/env";
import { db } from "~/server/db";

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
      const startDate = '2024-01-01'; // You might want to make this configurable

      // Get transaction count from Plaid
      const { transactions: plaidTransactions } = response.data;

      const records = plaidTransactions.map((pTx) => ({
        plaidAccountId: pTx.account_id,
        transactionId: pTx.transaction_id,
        pendingTransactionId: pTx.pending_transaction_id ?? null,

        accountId: ctx.session.user.id, // Ensure this matches an existing account

        amount: pTx.amount.toPrecision(10),
        isoCurrencyCode: pTx.iso_currency_code ?? null,
        unofficialCurrencyCode: pTx.unofficial_currency_code ?? null,

        date: pTx.date,
        authorizedDate: pTx.authorized_date ?? null,

        name: pTx.name,
        merchantName: pTx.merchant_name ?? null,
        category: pTx.personal_finance_category?.primary ?? null,
        pending: pTx.pending,
        paymentChannel: pTx.payment_channel ?? null,

        address: pTx.location?.address ?? null,
        city: pTx.location?.city ?? null,
        region: pTx.location?.region ?? null,
        postalCode: pTx.location?.postal_code ?? null,
        country: pTx.location?.country ?? null,
      }));

      await ctx.db.transaction(async (tx) => {
        await tx.insert(transactions)
          .values(records)
          .onConflictDoNothing();
      });

      return response.data.total_transactions;
    }),
});
