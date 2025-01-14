import { useWallet } from "@cosmos-kit/react";
import big from "big.js";
import { GraphQLClient } from "graphql-request";
import { observer } from "mobx-react-lite";
import type { ReactNode } from "react";
import { useEffect, useContext, useMemo, createContext } from "react";

import { useAmplitude } from "../hooks/useAmplitude";
import { useNetworkChange } from "../hooks/useNetworkChange";
import { getIndexerGraphClient } from "../query-client";
import type { AppConstants } from "../types";
import { LoadingOverlay } from "lib/components/LoadingOverlay";
import { DEFAULT_ADDRESS } from "lib/data";
import {
  useCodeStore,
  useContractStore,
  usePublicProjectStore,
} from "lib/providers/store";
import type { ChainGasPrice, Token, U } from "lib/types";
import { formatUserKey } from "lib/utils";

interface AppProviderProps<
  AppContractAddress,
  AppHumanAddress,
  Constants extends AppConstants
> {
  children: ReactNode;

  fallbackGasPrice: Record<string, ChainGasPrice>;

  appContractAddressMap: (currentChainName: string) => AppContractAddress;
  appHumanAddressMap: (currentChainName: string) => AppHumanAddress;

  constants: Constants;
}

interface AppContextInterface<
  ContractAddress,
  HumanAddress,
  Constants extends AppConstants = AppConstants
> {
  chainGasPrice: ChainGasPrice;
  appContractAddress: ContractAddress;
  appHumanAddress: HumanAddress;
  constants: Constants;
  indexerGraphClient: GraphQLClient;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AppContext = createContext<AppContextInterface<any, any, any>>({
  chainGasPrice: { denom: "", gasPrice: "0" as U<Token> },
  appContractAddress: {},
  appHumanAddress: {},
  constants: { gasAdjustment: 0 },
  indexerGraphClient: new GraphQLClient(""),
});

export const AppProvider = observer(
  <ContractAddress, HumanAddress, Constants extends AppConstants>({
    children,
    fallbackGasPrice,
    appContractAddressMap,
    appHumanAddressMap,
    constants,
  }: AppProviderProps<ContractAddress, HumanAddress, Constants>) => {
    const { currentChainName, currentChainRecord } = useWallet();
    const { setCodeUserKey, isCodeUserKeyExist } = useCodeStore();
    const { setContractUserKey, isContractUserKeyExist } = useContractStore();
    const { setProjectUserKey, isProjectUserKeyExist } =
      usePublicProjectStore();

    useEffect(() => {
      const handler = (e: BeforeUnloadEvent) => {
        e.stopImmediatePropagation();
      };

      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }, []);

    const chainGasPrice = useMemo(() => {
      if (
        !currentChainRecord ||
        !currentChainRecord.chain.fees ||
        !currentChainRecord.chain.fees.fee_tokens[0].average_gas_price
      )
        return fallbackGasPrice[currentChainName];
      return {
        denom: currentChainRecord.chain.fees?.fee_tokens[0].denom as string,
        gasPrice: big(
          currentChainRecord.chain.fees?.fee_tokens[0].average_gas_price ?? "0"
        ).toFixed() as U<Token>,
      };
    }, [currentChainName, currentChainRecord, fallbackGasPrice]);

    const chainBoundStates = useMemo(() => {
      return {
        indexerGraphClient: getIndexerGraphClient(currentChainName),
      };
    }, [currentChainName]);

    const states = useMemo<
      AppContextInterface<ContractAddress, HumanAddress, Constants>
    >(
      () => ({
        chainGasPrice,
        appContractAddress: appContractAddressMap(currentChainName),
        appHumanAddress: appHumanAddressMap(currentChainName),
        constants,
        ...chainBoundStates,
      }),
      [
        chainGasPrice,
        appContractAddressMap,
        currentChainName,
        appHumanAddressMap,
        constants,
        chainBoundStates,
      ]
    );

    useEffect(() => {
      if (currentChainName) {
        const userKey = formatUserKey(currentChainName, DEFAULT_ADDRESS);
        setCodeUserKey(userKey);
        setContractUserKey(userKey);
        setProjectUserKey(userKey);
      }
    }, [
      currentChainName,
      setCodeUserKey,
      setContractUserKey,
      setProjectUserKey,
    ]);

    useNetworkChange();

    useAmplitude();

    return isCodeUserKeyExist() &&
      isContractUserKeyExist() &&
      isProjectUserKeyExist() ? (
      <AppContext.Provider value={states}>{children}</AppContext.Provider>
    ) : (
      <LoadingOverlay />
    );
  }
);

export const useApp = <
  ContractAddress,
  HumanAddress,
  Constants extends AppConstants
>(): AppContextInterface<ContractAddress, HumanAddress, Constants> => {
  return useContext(AppContext);
};
