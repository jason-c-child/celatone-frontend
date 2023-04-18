import { Flex, Image } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import { getChainApiPath } from "env";
import { ExplorerLink } from "lib/components/ExplorerLink";
import type { ValidatorInfo } from "lib/types";

interface ValidatorBadgeProps {
  validator: ValidatorInfo;
}

export const ValidatorBadge = ({ validator }: ValidatorBadgeProps) => {
  const { currentChainName } = useWallet();

  return (
    <Flex alignItems="center" gap={2}>
      <Image
        boxSize={10}
        src={`https://raw.githubusercontent.com/cosmostation/chainlist/master/chain/${getChainApiPath(
          currentChainName
        )}/${validator.validatorAddress}.png`}
        alt={validator.moniker}
        fallbackSrc={`https://ui-avatars.com/api/?name=${
          validator.moniker ?? ""
        }&background=9793F3&color=fff`}
        borderRadius="50%"
      />
      <ExplorerLink
        value={validator.moniker ?? validator.validatorAddress}
        copyValue={validator.validatorAddress}
        type="validator_address"
        textFormat="ellipsis"
        showCopyOnHover
      />
    </Flex>
  );
};