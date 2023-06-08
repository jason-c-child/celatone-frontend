import { Flex, HStack, Text } from "@chakra-ui/react";

import { InstantiateButton } from "../button";
import { ExplorerLink } from "../ExplorerLink";
import { SaveOrRemoveCodeModal } from "../modal";
import { PermissionChip } from "../PermissionChip";
import { CodeNameCell } from "../table";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import type { CodeInfo, PublicCode } from "lib/types";
import { getCw2Info } from "lib/utils";

import { DefaultMobileCard } from "./DefaultMobileCard";

interface StoredCodeCardProps {
  codeInfo: CodeInfo | PublicCode;
}
export const StoredCodeCard = ({ codeInfo }: StoredCodeCardProps) => {
  const cw2Info = getCw2Info(codeInfo.cw2Contract, codeInfo.cw2Version);
  return (
    <DefaultMobileCard
      topContent={
        <>
          <Flex gap={2} align="center">
            <MobileLabel variant="body2" label="Code ID" />
            <ExplorerLink
              type="code_id"
              value={codeInfo.id.toString()}
              showCopyOnHover
            />
          </Flex>
          <HStack onClick={(e) => e.stopPropagation()}>
            <InstantiateButton
              instantiatePermission={codeInfo.instantiatePermission}
              permissionAddresses={codeInfo.permissionAddresses}
              codeId={codeInfo.id}
            />
            <SaveOrRemoveCodeModal codeInfo={codeInfo} />
          </HStack>
        </>
      }
      middleContent={
        <Flex direction="column" gap={3}>
          <Flex direction="column">
            <MobileLabel label="Code Name" />
            <CodeNameCell code={codeInfo} isReadOnly />
          </Flex>
          <Flex direction="column">
            <MobileLabel label="CW2 Info" />
            <Text
              color={cw2Info ? "text.main" : "text.disabled"}
              wordBreak="break-all"
            >
              {cw2Info ?? "N/A"}
            </Text>
          </Flex>
        </Flex>
      }
      bottomContent={
        <Flex gap={3} w="full">
          <Flex direction="column" flex="1">
            <MobileLabel label="Contracts" />
            <Text
              variant="body3"
              onClick={(e) => e.stopPropagation()}
              cursor="text"
              color={codeInfo.contractCount ? "text.main" : "text.disabled"}
            >
              {codeInfo.contractCount ?? "N/A"}
            </Text>
          </Flex>
          <Flex direction="column" flex="1">
            <MobileLabel label="Permission" />
            <PermissionChip
              instantiatePermission={codeInfo.instantiatePermission}
              permissionAddresses={codeInfo.permissionAddresses}
              tagSize="xs"
            />
          </Flex>
        </Flex>
      }
    />
  );
};