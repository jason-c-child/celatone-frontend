import { Flex, Text } from "@chakra-ui/react";

import { ExplorerLink } from "../ExplorerLink";
import { ContractNameCell, TagsCell } from "../table";
import { InstantiatorRender } from "../table/contracts/ContractsTableRow";
import type { CTAInfo } from "../table/contracts/ContractsTableRowCTA";
import { ContractsTableRowCTA } from "../table/contracts/ContractsTableRowCTA";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import type { ContractHistoryRemark, ContractInfo, Option } from "lib/types";
import { RemarkOperation } from "lib/types";
import { dateFromNow, formatUTC } from "lib/utils";

import { DefaultMobileCard } from "./DefaultMobileCard";

interface InstantiatedContractCardProps {
  contractInfo: ContractInfo;
  withCTA?: CTAInfo;
}
const instantiatorRemark = (remark: Option<ContractHistoryRemark>) => {
  if (!remark) {
    return <MobileLabel variant="body2" label="Instantiated by" />;
  }
  if (
    remark.operation ===
    RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_GENESIS
  )
    return <MobileLabel variant="body2" label="Genesis" />;
  if (
    remark.operation ===
    RemarkOperation.CONTRACT_CODE_HISTORY_OPERATION_TYPE_MIGRATE
  )
    return <MobileLabel variant="body2" label="Migrated by" />;

  return <MobileLabel variant="body2" label="Instantiated by" />;
};
export const InstantiatedContractCard = ({
  contractInfo,
  withCTA,
}: InstantiatedContractCardProps) => (
  <DefaultMobileCard
    topContent={
      <>
        <Flex gap={2}>
          <MobileLabel variant="body2" label="Contract Address" />
          <ExplorerLink
            value={contractInfo.contractAddress}
            type="contract_address"
            showCopyOnHover
          />
        </Flex>
        <ContractsTableRowCTA
          showLastUpdate={false}
          contractInfo={contractInfo}
          withCTA={withCTA}
        />
      </>
    }
    middleContent={
      <Flex gap={3} direction="column">
        <Flex direction="column" gap={0}>
          <MobileLabel variant="body2" label="Contract Name" />
          <ContractNameCell contractLocalInfo={contractInfo} isReadOnly />
        </Flex>
        <Flex>
          <Flex direction="column" gap={0} flex="1">
            {instantiatorRemark(contractInfo.remark)}
            <InstantiatorRender
              contractInfo={contractInfo}
              isReadOnly={false}
            />
          </Flex>
          <Flex direction="column" gap={0} flex="1">
            <MobileLabel variant="body2" label="Tags" />
            <TagsCell
              tagSize="xs"
              contractLocalInfo={contractInfo}
              isReadOnly
            />
          </Flex>
        </Flex>
      </Flex>
    }
    bottomContent={
      <>
        {contractInfo.latestUpdated && (
          <Flex direction="column" gap={0}>
            <Text variant="body3">{formatUTC(contractInfo.latestUpdated)}</Text>
            <Text variant="body3" color="text.dark">
              {`(${dateFromNow(contractInfo.latestUpdated)})`}
            </Text>
          </Flex>
        )}
      </>
    }
  />
);
