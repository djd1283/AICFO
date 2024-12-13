import { api } from "~/trpc/react";
import { type RouterOutputs } from "~/trpc/react";

type PlaidAccount = RouterOutputs["plaid"]["getPlaidAccounts"]["accounts"][number];

interface TransactionCountInfoProps {
  account: PlaidAccount;
}

export const TransactionCountInfo: React.FC<TransactionCountInfoProps> = ({ account }) => {
  const { data: transactionCount, isLoading } = api.plaid.getTransactionCount.useQuery({
    accountId: account.account_id,
  });

  if (isLoading) {
    return (
      <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4">
        <p className="text-gray-600">Loading transaction count...</p>
      </div>
    );
  }

  return (
    <div className="mt-4 space-y-2 rounded-lg bg-gray-50 p-4">
      <h3 className="font-medium">Transaction Summary</h3>
      <p className="text-gray-600">
        Total Transactions: {transactionCount ?? 0}
      </p>
    </div>
  );
}; 