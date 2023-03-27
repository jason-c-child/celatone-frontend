import { useRouter } from "next/router";
import type { Router } from "next/router";
import type { ParsedUrlQueryInput } from "node:querystring";
import { useCallback } from "react";

interface NavigationArgs {
  pathname: string;
  query?: ParsedUrlQueryInput;
  options?: Parameters<Pick<Router, "push">["push"]>[2];
  replace?: boolean;
}

export const useInternalNavigate = () => {
  const router = useRouter();

  return useCallback(
    ({
      pathname,
      query = {},
      options = {},
      replace = false,
    }: NavigationArgs) => {
      const routerFn = replace ? router.replace : router.push;
      routerFn(
        {
          pathname: `/[network]${pathname}`,
          query: {
            network:
              // eslint-disable-next-line no-nested-ternary
              router.query.network === "testnet"
                ? "testnet"
                : router.query.network === "localnet"
                ? "localnet"
                : "mainnet",
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
