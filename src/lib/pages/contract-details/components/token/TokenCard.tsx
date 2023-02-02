import { Flex, Image, Text } from "@chakra-ui/react";

import type { BalanceWithAssetInfo, Token } from "lib/types";
import { formatTokenWithPrecision } from "lib/utils";

interface TokenCardProps {
  userBalance: BalanceWithAssetInfo;
}

export const TokenCard = ({ userBalance }: TokenCardProps) => (
  <Flex
    gap={1}
    p={2}
    background="pebble.900"
    borderRadius="8px"
    alignItems="center"
  >
    <Image
      boxSize="20px"
      src={userBalance.assetInfo?.logo}
      alt={userBalance.balance.symbol}
    />
    <Text fontWeight="700">
      {formatTokenWithPrecision(
        userBalance.balance.amount as Token,
        userBalance.balance.precision
      )}
    </Text>
    <Text>{userBalance.balance.symbol}</Text>
  </Flex>
);
