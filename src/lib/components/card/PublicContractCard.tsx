import { Button, Flex } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { AppLink } from "../AppLink";
import { ExplorerLink } from "../ExplorerLink";
import { ContractNameCell } from "../table";
import { getAddressTypeByLength } from "lib/app-provider";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import type { PublicContract } from "lib/types";

import { DefaultMobileCard } from "./DefaultMobileCard";

interface PublicContractCardProps {
  publicInfo: PublicContract;
}

export const PublicContractCard = ({ publicInfo }: PublicContractCardProps) => {
  const { currentChainName } = useWallet();
  return (
    <DefaultMobileCard
      topContent={
        <>
          <Flex align="start" direction="column">
            <MobileLabel variant="body2" label="Contract Address" />
            <ExplorerLink
              value={publicInfo.contractAddress}
              type="contract_address"
              showCopyOnHover
            />
          </Flex>
          <Flex
            gap={3}
            alignItems="center"
            justifyContent="center"
            onClick={(e) => e.stopPropagation()}
          >
            <AppLink href={`/query?contract=${publicInfo.contractAddress}`}>
              <Button variant="outline-gray" size="sm">
                Query
              </Button>
            </AppLink>
          </Flex>
        </>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex flex="1" direction="column">
            <Flex direction="column">
              <MobileLabel label="Contract Name" />
              <ContractNameCell contractLocalInfo={publicInfo} isReadOnly />
            </Flex>
          </Flex>
          <Flex flex="1" direction="column">
            <Flex direction="column">
              <MobileLabel label="Instantiated By" />
              <ExplorerLink
                value={publicInfo.instantiator}
                type={getAddressTypeByLength(
                  currentChainName,
                  publicInfo.instantiator
                )}
                showCopyOnHover
              />
            </Flex>
          </Flex>
        </Flex>
      }
    />
  );
};
