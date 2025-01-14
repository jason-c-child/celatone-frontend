import { useWallet } from "@cosmos-kit/react";
import type { UseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

import { useCelatoneApp } from "lib/app-provider";
import { getAccountIdByAddressQueryDocument } from "lib/query";
import type { Addr, Balance, Option } from "lib/types";

import { getAccountBalanceInfo } from "./account";

export const useAccountBalances = (
  walletAddress: Addr
): UseQueryResult<Balance[]> => {
  const { currentChainRecord } = useWallet();

  return useQuery(
    [
      "account_balance_info",
      walletAddress,
      currentChainRecord?.name,
      currentChainRecord?.chain.chain_id,
    ],
    async () =>
      getAccountBalanceInfo(
        walletAddress as Addr,
        currentChainRecord?.name,
        currentChainRecord?.chain.chain_id
      ),
    {
      enabled: !!currentChainRecord || !!walletAddress,
      retry: 1,
      refetchOnWindowFocus: false,
    }
  );
};

export const useAccountId = (
  walletAddress: Option<Addr>
): UseQueryResult<Option<number>> => {
  const { indexerGraphClient } = useCelatoneApp();
  const queryFn = () => {
    if (!walletAddress)
      throw new Error("Error fetching account id: failed to retrieve address.");
    return indexerGraphClient
      .request(getAccountIdByAddressQueryDocument, { address: walletAddress })
      .then<Option<number>>(({ accounts_by_pk }) => accounts_by_pk?.id);
  };
  return useQuery(["account_id", indexerGraphClient, walletAddress], queryFn, {
    enabled: Boolean(walletAddress),
    retry: 1,
    refetchOnWindowFocus: false,
  });
};
