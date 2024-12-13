import { type RouterOutputs } from "~/trpc/react";
import { BasicAccountInfo } from "./BasicAccountInfo";
import { TransactionCountInfo } from "./TransactionCountInfo";

type PlaidAccount = RouterOutputs["plaid"]["getPlaidAccounts"]["accounts"][number];

interface AccountCardProps {
  account: PlaidAccount;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  return (
    <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
      <BasicAccountInfo account={account} />
      <TransactionCountInfo account={account} />
      {/* Future components can be added here */}
    </div>
  );
}; 