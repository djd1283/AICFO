import { type RouterOutputs } from "~/trpc/react";

type PlaidAccount = RouterOutputs["plaid"]["getPlaidAccounts"]["accounts"][number];

interface AccountCardProps {
  account: PlaidAccount;
}

export const AccountCard: React.FC<AccountCardProps> = ({ account }) => {
  return (
    <div 
      className="rounded-lg border border-gray-200 p-4 shadow-sm"
    >
      <h2 className="mb-2 text-xl font-semibold">{account.name}</h2>
      <div className="space-y-2">
        <p className="text-gray-600">Type: {account.type}</p>
        <p className="text-gray-600">Subtype: {account.subtype}</p>
        <p className="font-medium">
          Balance: ${account.balances.current?.toFixed(2)}
          {account.balances.limit && (
            <span className="text-sm text-gray-500">
              {' '}(Limit: ${account.balances.limit.toFixed(2)})
            </span>
          )}
        </p>
      </div>
    </div>
  );
}; 