import { Button } from "@chakra-ui/react";
import type { MouseEventHandler } from "react";

import { CustomIcon } from "../icon";
import { useCurrentNetwork, useInternalNavigate } from "lib/app-provider";

export const FaucetBtn = () => {
  const navigate = useInternalNavigate();
  const { isTestnet } = useCurrentNetwork();

  const onClick: MouseEventHandler = async (e) => {
    e.preventDefault();
    navigate({
      pathname: "/faucet",
    });
  };

  return isTestnet ? (
    <Button
      variant="outline-gray"
      leftIcon={<CustomIcon name="faucet" />}
      onClick={onClick}
    >
      Faucet
    </Button>
  ) : null;
};
