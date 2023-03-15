import type { Log } from "@cosmjs/stargate/build/logs";

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

export const extractTxDetails = <T extends TypeUrl>(
  type: T,
  body: Omit<MsgBody, "@type">,
  log: Option<Log>
): MsgReturnType<T> => {
  switch (type) {
    case "/cosmwasm.wasm.v1.MsgStoreCode":
      return {
        type,
        ...(body as Omit<MsgStoreCodeDetails, "code_id">),
        code_id: findAttr(log, "store_code", "code_id"),
      } as MsgReturnType<T>;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract":
      return {
        type,
        ...(body as Omit<MsgInstantiateDetails, "contract_address">),
        contract_address: findAttr(log, "instantiate", "_contract_address"),
      } as MsgReturnType<T>;
    case "/cosmwasm.wasm.v1.MsgInstantiateContract2":
      return {
        type,
        ...(body as Omit<MsgInstantiate2Details, "contract_address">),
        contract_address: findAttr(log, "instantiate", "_contract_address"),
      } as MsgReturnType<T>;
    case "/cosmos.gov.v1beta1.MsgSubmitProposal":
      return {
        type,
        ...(body as Omit<
          MsgSubmitProposalDetails,
          "proposal_id" | "proposal_type"
        >),
        proposal_id: findAttr(log, "submit_proposal", "proposal_id"),
        proposal_type: findAttr(log, "submit_proposal", "proposal_type"),
      } as MsgReturnType<T>;
    default:
      return { type, ...body } as MsgReturnType<T>;
  }
};
