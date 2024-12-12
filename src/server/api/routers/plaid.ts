import { eq } from "drizzle-orm";
import { users } from "~/server/db/schema";
import { Configuration, PlaidApi } from "plaid";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

const configuration = new Configuration({
  basePath: process.env.PLAID_ENV === "sandbox" ? "https://sandbox.plaid.com" : "https://development.plaid.com",
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID!,
      'PLAID-SECRET': process.env.PLAID_SECRET!,
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

    try {
      const response = await plaidClient.accountsGet({
        access_token: accessToken.plaidAccessToken,
        
      });
      
      console.log("Plaid API Response:", {
        status: response.status,
        data: response.data,
      });
      
      return response.data;
    } catch (error) {
      // Log the detailed error information
      console.error("Plaid API Error Details:", {
        message: error.message,
        response: error.response?.data,  // This will show Plaid's error message
        status: error.response?.status,
        plaidAccessToken: accessToken.plaidAccessToken?.slice(-4), // Only log last 4 chars for security
      });
      throw error;
    }
  }),
});
