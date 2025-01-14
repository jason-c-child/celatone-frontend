import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

import { useChainId, useLCDEndpoint } from "lib/app-provider";
import type { PermissionFilterValue } from "lib/hooks";
import {
  useUserKey,
  useCodePermissionFilter,
  useCodeSearchFilter,
} from "lib/hooks";
import { useCodeStore } from "lib/providers/store";
import { getCodeIdInfo } from "lib/services/code";
import {
  useCodeDataByCodeId,
  useCodeListByCodeIds,
  useCodeListByWalletAddress,
} from "lib/services/codeService";
import {
  usePublicProjectByCodeId,
  usePublicProjectBySlug,
} from "lib/services/publicProjectService";
import type {
  CodeData,
  PublicDetail,
  Option,
  HumanAddr,
  CodeInfo,
  PublicCode,
} from "lib/types";
import { AccessConfigPermission } from "lib/types";

export interface CodeDataState {
  isLoading: boolean;
  chainId: string;
  codeData: Option<CodeData>;
  lcdCodeData: {
    codeHash: Option<string>;
    isLcdCodeLoading: boolean;
    isLcdCodeError: unknown;
  };
  publicProject: {
    publicCodeData: Option<PublicCode>;
    publicDetail: Option<PublicDetail>;
  };
}

export const useCodeData = (codeId: number): CodeDataState => {
  const endpoint = useLCDEndpoint();

  const { data: codeInfo, isLoading } = useCodeDataByCodeId(codeId);
  const { data: publicCodeInfo } = usePublicProjectByCodeId(codeId);
  const { data: publicInfoBySlug } = usePublicProjectBySlug(
    publicCodeInfo?.slug
  );
  const {
    data: lcdCode,
    isLoading: isLcdCodeLoading,
    error: isLcdCodeError,
  } = useQuery(
    ["query", "code_data", endpoint, codeId],
    async () => getCodeIdInfo(endpoint, codeId),
    { enabled: Boolean(endpoint) && Boolean(codeId), retry: false }
  );

  const chainId = useChainId();

  return {
    isLoading,
    chainId,
    codeData: codeInfo as CodeData,
    lcdCodeData: {
      codeHash: lcdCode?.code_info.data_hash,
      isLcdCodeLoading,
      isLcdCodeError,
    },
    publicProject: {
      publicCodeData: publicCodeInfo,
      publicDetail: publicInfoBySlug?.details,
    },
  };
};

const useStoredCodes = () => {
  const { address } = useWallet();
  const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();

  const { data: rawStoredCodes, isLoading } = useCodeListByWalletAddress(
    address as HumanAddr
  );

  const storedCodes =
    rawStoredCodes?.map<CodeInfo>((code) => ({
      ...code,
      name: getCodeLocalInfo(code.id)?.name,
      isSaved: isCodeIdSaved(code.id),
    })) ?? [];

  return { storedCodes, isLoading };
};

const useSavedCodes = () => {
  const userKey = useUserKey();
  const { lastSavedCodes, lastSavedCodeIds } = useCodeStore();

  const savedCodeIds = lastSavedCodeIds(userKey);
  const { data: rawSavedCodes, isLoading } = useCodeListByCodeIds(savedCodeIds);

  const savedCodes = lastSavedCodes(userKey).map<CodeInfo>((localSavedCode) => {
    const rawSavedCode = rawSavedCodes?.find(
      (savedCode) => savedCode.id === localSavedCode.id
    );
    return {
      ...localSavedCode,
      contractCount: rawSavedCode?.contractCount,
      instantiatePermission:
        rawSavedCode?.instantiatePermission ?? AccessConfigPermission.UNKNOWN,
      permissionAddresses: rawSavedCode?.permissionAddresses ?? [],
      cw2Contract: rawSavedCode?.cw2Contract,
      cw2Version: rawSavedCode?.cw2Version,
      isSaved: true,
    };
  });

  return { savedCodes, isLoading };
};

interface MyCodesData {
  savedCodes: CodeInfo[];
  storedCodes: CodeInfo[];
  savedCodesCount: number;
  storedCodesCount: number;
  allCodesCount: number;
  isStoredCodesLoading: boolean;
  isSavedCodesLoading: boolean;
}

export const useMyCodesData = (
  keyword: string,
  permissionValue: PermissionFilterValue
): MyCodesData => {
  const permissionFilterFn = useCodePermissionFilter(permissionValue);
  const searchFilterFn = useCodeSearchFilter(keyword);

  const { storedCodes, isLoading: isStoredCodesLoading } = useStoredCodes();
  const { savedCodes, isLoading: isSavedCodesLoading } = useSavedCodes();

  const [filteredSavedCodes, filteredStoredCodes] = useMemo(
    () => [
      savedCodes.filter(permissionFilterFn).filter(searchFilterFn),
      storedCodes.filter(permissionFilterFn).filter(searchFilterFn),
    ],
    [savedCodes, storedCodes, permissionFilterFn, searchFilterFn]
  );

  const storedCodesCount = storedCodes.length;
  const savedCodesCount = savedCodes.length;

  return {
    storedCodes: filteredStoredCodes,
    savedCodes: filteredSavedCodes,
    storedCodesCount,
    savedCodesCount,
    allCodesCount: storedCodesCount + savedCodesCount,
    isStoredCodesLoading,
    isSavedCodesLoading,
  };
};
