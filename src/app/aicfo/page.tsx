"use client";

import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { usePlaidLink, type PlaidLinkOnSuccessMetadata, type PlaidLinkOnExitMetadata, type PlaidHandlerSubmissionData } from "react-plaid-link";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";

const AiCFOConnectPage: NextPage = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  const { data: plaidLinkToken, isLoading } = api.plaidLogin.getPlaidLinkToken.useQuery(
    undefined,
    {
      refetchOnWindowFocus: false,
    }
  );

  const { mutate } = api.plaidLogin.fetchAndStorePlaidAccessToken.useMutation();

  const router = useRouter();

  useEffect(() => {
    if (plaidLinkToken) {
      console.log("Setting link token", plaidLinkToken);
      setLinkToken(plaidLinkToken);
    }
  }, [plaidLinkToken]);

  const onSuccess = (public_token: string, metadata: PlaidLinkOnSuccessMetadata) => {
    console.log("Success!", public_token, metadata);
    
    mutate({ publicToken: public_token });

    // now we push to the next page
    router.push("/aicfo/dashboard");
  };

  const onExit = (error: Error | null, metadata: PlaidLinkOnExitMetadata) => {
    console.log("Exit!", error, metadata);
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { open, ready } = usePlaidLink({
    token: linkToken ?? "",
    onSuccess,
    // @ts-expect-error Plaid API does not have strict typing
    onExit,
  }) as unknown as { 
    open: () => void; 
    ready: boolean; 
    submit: (data: PlaidHandlerSubmissionData) => void;
    exit: (force?: boolean) => void;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[3rem]">
          AI CFO Demo
        </h1>
        
        <button
          onClick={() => open()}
          disabled={!ready || !linkToken || isLoading}
          className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "Connect your bank account"}
        </button>
      </div>
    </main>
  );
};

export default AiCFOConnectPage;