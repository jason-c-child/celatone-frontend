import { useRouter } from "next/router";
import type { Router } from "next/router";
import type { ParsedUrlQueryInput } from "node:querystring";
import { useCallback } from "react";

interface NavigationArgs {
  pathname: string;
  query?: ParsedUrlQueryInput;
  options?: Parameters<Pick<Router, "push">["push"]>[2];
}

export const useInternalNavigate = () => {
  const router = useRouter();

  return useCallback(
    ({ pathname, query = {}, options = {} }: NavigationArgs) => {
      router.push(
        {
          pathname: `/[network]${pathname}`,
          /**
           * @todos Change default to mainnet later (right now is testnet)
           */
          query: {
            network: router.query.network === "mainnet" ? "mainnet" : "testnet",
            ...query,
          },
        },
        undefined,
        options
      );
    },
    [router]
  );
};