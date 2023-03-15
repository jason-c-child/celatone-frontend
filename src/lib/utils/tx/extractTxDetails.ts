import type { Log } from "@cosmjs/stargate/build/logs";
import { snakeCase } from "snake-case";

import type { MsgBody, TypeUrl } from "lib/services/tx";
import type { Option } from "lib/types";

import { findAttr } from "./findAttr";
import type {
  MsgReturnType,
  MsgStoreCodeDetails,
  MsgInstantiateDetails,
  MsgInstantiate2Details,
  MsgSubmitProposalDetails,
} from "./types";

type MsgBodyWithoutType = Omit<MsgBody, "@type">;

const transformKeyToSnake = (obj: MsgBodyWithoutType): MsgBodyWithoutType => {
  return Object.entries(obj).reduce((acc, entry) => {
    const [k, v] = entry;
    acc[snakeCase(k)] = v;
    return acc;
  }, {} as MsgBodyWithoutType);
};

export const extractTxDetails = <T extends TypeUrl>(
  type: T,
  body: MsgBodyWithoutType,
  log: Option<Log>
): MsgReturnType<T> => {
  const msgBody = transformKeyToSnake(body);
  switch (type) {
    case "/cosmwasm.wasm.v1.MsgStoreCode":
      return {
        type,
        ...(msgBody as Omit<MsgStoreCodeDetails, "code_id">),
        code_id: findAttr(log, "store_code", "code_id"),
      } as MsgReturnType<T>;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract":
      return {
        type,
        ...(msgBody as Omit<MsgInstantiateDetails, "contract_address">),
        contract_address: findAttr(log, "instantiate", "_contract_address"),
      } as MsgReturnType<T>;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      return {
        type,
        ...(msgBody as Omit<MsgInstantiate2Details, "contract_address">),
        contract_address: findAttr(log, "instantiate", "_contract_address"),
      } as MsgReturnType<T>;
    case "/cosmos.gov.v1beta1.MsgSubmitProposal":
      return {
        type,
        ...(msgBody as Omit<
          MsgSubmitProposalDetails,
          "proposal_id" | "proposal_type"
        >),
        proposal_id: findAttr(log, "submit_proposal", "proposal_id"),
        proposal_type: findAttr(log, "submit_proposal", "proposal_type"),
      } as MsgReturnType<T>;
    default:
      return { type, ...msgBody } as MsgReturnType<T>;
  }
};
