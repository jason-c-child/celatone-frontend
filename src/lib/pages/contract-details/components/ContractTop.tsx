import {
  Flex,
  Heading,
  Text,
  Button,
  IconButton,
  Image,
} from "@chakra-ui/react";
import router from "next/router";

import { useInternalNavigate } from "lib/app-provider";
import { AdminButton } from "lib/components/button";
import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { GitHubLink } from "lib/components/links";
import {
  AddToOtherListModal,
  EditContractDetailsModal,
  SaveContractDetailsModal,
} from "lib/components/modal";
import type { ContractAddr, ContractData } from "lib/types";
import { getFirstQueryParam } from "lib/utils";

interface ContractTopProps {
  contractData: ContractData;
}
export const ContractTop = ({ contractData }: ContractTopProps) => {
  const navigate = useInternalNavigate();
  const { contractLocalInfo, instantiateInfo, publicProject } = contractData;
  const contractAddress = getFirstQueryParam(router.query.contractAddress);

  const displayName =
    contractLocalInfo?.name ||
    publicProject.publicInfo?.name ||
    instantiateInfo?.label;

  const goToQuery = () => {
    navigate({
      pathname: "/query",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };

  const goToExecute = () => {
    navigate({
      pathname: "/execute",
      query: { ...(contractAddress && { contract: contractAddress }) },
    });
  };

  const renderSaveButton = () => {
    if (contractLocalInfo) {
      return (
        <AddToOtherListModal
          contractLocalInfo={contractLocalInfo}
          triggerElement={
            <IconButton
              fontSize="24px"
              variant="none"
              size={{ base: "sm", md: "md" }}
              aria-label="save"
              icon={
                contractLocalInfo.lists ? (
                  <CustomIcon name="bookmark-solid" color="primary.light" />
                ) : (
                  <CustomIcon name="bookmark" color="gray.600" />
                )
              }
            />
          }
        />
      );
    }
    if (instantiateInfo) {
      return (
        <SaveContractDetailsModal
          contractLocalInfo={{
            contractAddress: contractAddress as ContractAddr,
            instantiator: instantiateInfo.instantiator,
            label: instantiateInfo.label,
          }}
          triggerElement={
            <IconButton
              fontSize="24px"
              variant="none"
              aria-label="save"
              color="gray.600"
              icon={<CustomIcon name="bookmark" />}
            />
          }
        />
      );
    }
    return null;
  };

  return (
    <Flex
      justify="space-between"
      my={{ base: 0, md: 6 }}
      align={{ base: "center", md: "start" }}
      direction={{ base: "column", md: "row" }}
    >
      <Flex
        direction="column"
        textOverflow="ellipsis"
        maxW="670px"
        gap={{ base: 2, md: 1 }}
      >
        <Flex gap={1}>
          {publicProject.publicDetail?.logo && (
            <Image
              src={publicProject.publicDetail.logo}
              borderRadius="full"
              alt={publicProject.publicDetail.name}
              width={7}
              height={7}
            />
          )}
          <Heading as="h5" variant="h5" className="ellipsis">
            {displayName}
          </Heading>
        </Flex>
        <Flex
          mt={{ base: 2, md: 0 }}
          gap={{ base: 0, md: 2 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text
            color="text.dark"
            variant="body2"
            fontWeight={500}
            whiteSpace="nowrap"
          >
            Contract Address:
          </Text>
          <CopyLink
            value={contractAddress}
            amptrackSection="contract_top"
            type="contract_address"
          />
        </Flex>
        <Flex
          gap={{ base: 0, md: 2 }}
          direction={{ base: "column", md: "row" }}
        >
          <Text color="text.dark" variant="body2" fontWeight={500}>
            Label:
          </Text>
          <Text variant="body2" className="ellipsis">
            {contractData.instantiateInfo?.label}
          </Text>
        </Flex>
        {publicProject.publicInfo?.name && (
          <Flex direction={{ base: "column", md: "row" }}>
            <Text color="text.dark" variant="body2" fontWeight={500}>
              Public Contract Name:
            </Text>
            <Text variant="body2" className="ellipsis">
              {publicProject.publicInfo?.name}
            </Text>
          </Flex>
        )}
        {publicProject.publicInfo?.github && (
          <GitHubLink github={publicProject.publicInfo?.github} />
        )}
      </Flex>
      <Flex gap={{ base: 2, md: 4 }} mt={{ base: 8, md: 0 }}>
        <AdminButton
          contractAddress={contractAddress as ContractAddr}
          admin={instantiateInfo?.admin}
        />
        <Button
          variant="outline-primary"
          leftIcon={<CustomIcon name="query" />}
          onClick={goToQuery}
          size={{ base: "sm", md: "md" }}
        >
          Query
        </Button>
        <Button
          variant="outline-primary"
          leftIcon={<CustomIcon name="execute" />}
          onClick={goToExecute}
          size={{ base: "sm", md: "md" }}
        >
          Execute
        </Button>
        <Flex>
          {contractLocalInfo && (
            <EditContractDetailsModal
              contractLocalInfo={contractLocalInfo}
              triggerElement={
                <IconButton
                  fontSize="24px"
                  variant="none"
                  aria-label="edit"
                  color="gray.600"
                  size={{ base: "sm", md: "md" }}
                  icon={<CustomIcon name="edit" />}
                />
              }
            />
          )}
          {renderSaveButton()}
        </Flex>
      </Flex>
    </Flex>
  );
};
