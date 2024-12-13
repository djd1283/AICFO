import { type RouterOutputs } from "~/trpc/react";

type PlaidAccount = RouterOutputs["plaid"]["getPlaidAccounts"]["accounts"][number];

interface BasicAccountInfoProps {
  account: PlaidAccount;
}

export const BasicAccountInfo: React.FC<BasicAccountInfoProps> = ({ account }) => {
  return (
    <div className="space-y-2">
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