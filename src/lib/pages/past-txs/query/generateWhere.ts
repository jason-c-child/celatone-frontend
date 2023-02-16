import type { Filters, HumanAddr, ContractAddr } from "lib/types";

const actions = {
  isExecute: "is_execute",
  isInstantiate: "is_instantiate",
  isUpload: "is_store_code",
  isIbc: "is_ibc",
  isSend: "is_send",
  isMigrate: "is_migrate",
  isUpdateAdmin: "is_update_admin",
  isClearAdmin: "is_clear_admin",
};

/**
 * Generate action filter for where clause used in graphql. Only return action that is true
 *
 * @example
 * is_send: {_eq: true}, is_execute: {_eq: true}
 *
 */
export const generateActionsFilter = (filters: Filters) => {
  return Object.keys(filters).reduce((acc: string, key: string) => {
    if (filters[key as keyof typeof filters]) {
      return `${acc} ${actions[key as keyof Filters]}: {_eq: true },`;
    }
    return acc;
  }, "");
};

/**
 * Generate action filter for where clause used in graphql for default case (no filter is chosen)
 *
 */
const generateActionsFilterDefault = () => {
  return `${Object.keys(actions).reduce((acc: string, key: string) => {
    if (key !== "isIbc") {
      return `${acc} {${actions[key as keyof Filters]}: {_eq: true }},`;
    }
    return acc;
  }, "_or: [")}]`;
};

const chooseActionFilter = (filters: Filters) => {
  if (
    Object.keys(filters).every(
      (value) => !filters[value as keyof typeof filters]
    )
  ) {
    return generateActionsFilterDefault();
  }
  return generateActionsFilter(filters);
};
interface GenerateWhereForContractTx {
  userAddress: HumanAddr;
  contractAddress: ContractAddr;
  filters: Filters;
}

/**
 * @remark
 * For contract_transactions table
 *
 */
export const generateWhereForContractTx = ({
  userAddress,
  contractAddress,
  filters,
}: GenerateWhereForContractTx) => {
  const actionFilter = chooseActionFilter(filters);

  return `{
    transaction: { 
      account: { address: { _eq: "${userAddress}" } },
      ${actionFilter !== "" ? `${actionFilter},` : ""}
    }
    ${
      contractAddress && `contract: { address: { _eq: "${contractAddress}" } },`
    }
  }`;
};

export const generateWhereForContractTxView = ({
  userAddress,
  contractAddress,
  filters,
}: GenerateWhereForContractTx) => {
  const actionFilter = chooseActionFilter(filters);

  return `{
    sender: { _eq: "${userAddress}" },
    ${actionFilter && `${actionFilter},`}
    ${contractAddress && `contract_address: { _eq: "${contractAddress}" } ,`}
  }`;
};

interface GenerateWhereForTx {
  userAddress: HumanAddr;
  txHash?: string;
  filters: Filters;
}

/**
 * @remark
 * For transactions table
 *
 */
export const generateWhereForTx = ({
  userAddress,
  txHash,
  filters,
}: GenerateWhereForTx) => {
  const actionFilter = chooseActionFilter(filters);

  return ` {
    account: { address: { _eq: "${userAddress}" } },
    ${actionFilter !== "" ? `${actionFilter},` : ""}
    ${txHash && `hash: {_eq: "\\\\x${txHash}"}, `}        
  }`;
};
