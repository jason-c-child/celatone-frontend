import { Flex, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { ConnectWalletBtn } from "lib/components/button";
import { EmptyState } from "lib/components/state/EmptyState";
import type { CodeInfo } from "lib/types";

import { CodeTableReadOnly } from "./CodeTableReadOnly";

interface MyStoredCodeContentProps {
  handleSelect: (code: string) => void;
  storedCodes: CodeInfo[];
}

export const MyStoredCodeContent = ({
  handleSelect,
  storedCodes,
}: MyStoredCodeContentProps) => {
  const { address } = useWallet();
  if (!address) {
    return (
      <Flex
        align="center"
        py="64px"
        direction="column"
        gap={2}
        borderY="1px solid"
        borderColor="pebble.700"
      >
        <Text variant="body1" color="text.main">
          Connect your wallet to upload and see your stored Codes.
        </Text>
        <ConnectWalletBtn />
      </Flex>
    );
  }

  if (!storedCodes.length) {
    return (
      <Flex
        py="64px"
        direction="column"
        borderY="1px solid"
        borderColor="pebble.700"
      >
        <EmptyState message="You don’t have any stored codes." />
      </Flex>
    );
  }
  return <CodeTableReadOnly onCodeSelect={handleSelect} codes={storedCodes} />;
};