import type { ImageProps } from "@chakra-ui/react";
import { Flex, Image, Text } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { getChainApiPath } from "env";
import { useMobile } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { MobileLabel } from "lib/pages/account-details/components/mobile/MobileLabel";
import type { ValidatorInfo } from "lib/types";
import { removeSpecialChars } from "lib/utils";

interface ValidatorBadgeProps {
  validator: ValidatorInfo | null;
  badgeSize?: ImageProps["boxSize"];
  maxWidth?: string;
}

const FallbackRender = ({
  badgeSize,
}: {
  badgeSize: ValidatorBadgeProps["badgeSize"];
}) => (
  <>
    <Image
      boxSize={badgeSize}
      src="https://assets.alleslabs.dev/integrations/sei/illustration/na-token.svg"
      alt="N/A"
      borderRadius="50%"
    />
    <Text variant="body2" color="text.disabled">
      N/A
    </Text>
  </>
);

export const ValidatorBadge = ({
  validator,
  badgeSize = 10,
  maxWidth = "160px",
}: ValidatorBadgeProps) => {
  const { currentChainName } = useWallet();
  const isMobile = useMobile();
  return (
    <Flex alignItems="center" gap={2}>
      {validator ? (
        <>
          <Image
            boxSize={badgeSize}
            src={`https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/${getChainApiPath(
              currentChainName
            )}/moniker/${validator.validatorAddress}.png`}
            alt={validator.moniker}
            fallbackSrc={`https://ui-avatars.com/api/?name=${removeSpecialChars(
              validator.moniker ?? ""
            )}&background=6C80B2&color=fff`}
            borderRadius="50%"
          />
          <Flex direction="column">
            {isMobile && <MobileLabel label="Validator" />}
            <ExplorerLink
              value={validator.moniker ?? validator.validatorAddress}
              copyValue={validator.validatorAddress}
              type="validator_address"
              textFormat="ellipsis"
              showCopyOnHover
              maxWidth={maxWidth}
            />
          </Flex>
        </>
      ) : (
        <FallbackRender badgeSize={badgeSize} />
      )}
    </Flex>
  );
};
