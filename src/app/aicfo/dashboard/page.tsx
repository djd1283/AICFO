"use client";

import { type NextPage } from "next";
import { api } from "~/trpc/react";
import { AccountCard } from "./components/AccountCard";

const FinancialDashboardPage: NextPage = () => {
  const { data: plaidData, isLoading, error } = api.plaid.getPlaidAccounts.useQuery();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading your financial data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-red-500">Error: {error.message}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="mb-6 text-3xl font-bold">Financial Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {plaidData?.accounts.map((account) => (
          <AccountCard 
            key={account.account_id} 
            account={account}
          />
        ))}
      </div>
    </div>
  );
};

export default FinancialDashboardPage;