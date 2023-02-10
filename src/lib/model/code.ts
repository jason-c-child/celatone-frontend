import { useWallet } from "@cosmos-kit/react";

import { useContractStore } from "lib/hooks";
import {
  useCodeInfoByCodeId,
  useContractListByCodeId,
  useContractListCountByCodeId,
} from "lib/services/codeService";
import {
  usePublicProjectByCodeId,
  usePublicProjectBySlug,
} from "lib/services/publicProjectService";
import type { ContractLocalInfo } from "lib/stores/contract";
import type {
  CodeData,
  ContractInstances,
  PublicDetail,
  Option,
  PublicCodeData,
} from "lib/types";

export interface CodeDataState {
  isLoading: boolean;
  codeData: CodeData;
  publicProject: {
    publicCodeData: Option<PublicCodeData>;
    publicDetail: Option<PublicDetail>;
  };
}

export const useCodeData = (codeId: number): Option<CodeDataState> => {
  const { currentChainRecord } = useWallet();
  const { data: codeInfo, isLoading } = useCodeInfoByCodeId(codeId);
  const { data: publicCodeInfo } = usePublicProjectByCodeId(codeId);
  const { data: publicInfoBySlug } = usePublicProjectBySlug(
    publicCodeInfo?.slug
  );

  if (!currentChainRecord || (!codeInfo && !isLoading)) return undefined;

  return {
    isLoading,
    codeData: {
      chainId: currentChainRecord.chain.chain_id,
      ...codeInfo,
    } as CodeData,
    publicProject: {
      publicCodeData: publicCodeInfo,
      publicDetail: publicInfoBySlug?.details,
    },
  };
};

export const useCodeContractInstances = (
  codeId: number,
  offset: number,
  pageSize: number
): ContractInstances => {
  const { data: contractList } = useContractListByCodeId(
    codeId,
    offset,
    pageSize
  );
  const { data: count } = useContractListCountByCodeId(codeId);
  const { getContractLocalInfo } = useContractStore();
  const data = contractList?.map((contract) => {
    const contractLocalInfo = getContractLocalInfo(contract.contractAddress);
    return {
      ...contractLocalInfo,
      ...contract,
    } as ContractLocalInfo;
  });

  return {
    contractList: data,
    count,
  };
};
