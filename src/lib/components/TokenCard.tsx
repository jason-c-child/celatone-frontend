import { Badge, Flex, Image, Text, Tooltip } from "@chakra-ui/react";
import { useState } from "react";

import { NAToken } from "lib/icon";
import type { BalanceWithAssetInfo, Token, U, USD } from "lib/types";
import {
  calAssetValueWithPrecision,
  formatPrice,
  formatUTokenWithPrecision,
} from "lib/utils";

import { Copier } from "./copy";

interface TokenCardProps {
  userBalance: BalanceWithAssetInfo;
  amptrackSection?: string;
}

export const TokenCard = ({ userBalance, amptrackSection }: TokenCardProps) => {
  const [logoError, setLogoError] = useState(false);
  const { symbol, price, amount, precision, id } = userBalance.balance;

  return (
    <Tooltip
      hasArrow
      label={`Token ID: ${id}`}
      placement="top"
      bg="honeydew.darker"
      maxW="240px"
      whiteSpace="pre-line"
      textAlign="center"
    >
      <Flex
        className="copier-wrapper"
        direction="column"
        minH="101px"
        gap={2}
        p={3}
        background="pebble.900"
        borderRadius="8px"
      >
        <Flex
          gap={1}
          alignItems="center"
          borderBottom="1px solid"
          borderBottomColor="pebble.700"
          pb={2}
        >
          {!logoError ? (
            <Image
              boxSize={6}
              src={userBalance.assetInfo?.logo}
              alt={symbol}
              onError={() => setLogoError(true)}
            />
          ) : (
            <NAToken />
          )}
          <Text
            variant="body2"
            className="ellipsis"
            maxW="91"
            fontWeight="bold"
          >
            {symbol}
          </Text>
          <Badge variant="gray" ml="6px">
            {price ? formatPrice(price as USD<number>) : "N/A"}
          </Badge>
          <Copier
            type={price ? "supported_asset" : "unsupported_asset"}
            value={id}
            copyLabel="Token ID Copied!"
            display="none"
            ml="1px"
            amptrackSection={amptrackSection}
          />
        </Flex>

        <Flex direction="column">
          <Text fontWeight="700" variant="body2">
            {formatUTokenWithPrecision(amount as U<Token>, precision)}
          </Text>
          <Text variant="body3" color="text.dark">
            {price
              ? `(${formatPrice(
                  calAssetValueWithPrecision(userBalance.balance)
                )})`
              : "N/A"}
          </Text>
        </Flex>
      </Flex>
    </Tooltip>
  );
};
