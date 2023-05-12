import {
  Button,
  chakra,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";

import { TooltipComponent } from "../TooltipComponent";
import { useCurrentNetwork, useInternalNavigate } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";

const StyledMenuItem = chakra(MenuItem, {
  baseStyle: {
    fontSize: "14px",
  },
});

export const NewProposalButton = () => {
  const navigate = useInternalNavigate();
  const { isTestnet } = useCurrentNetwork();

  return (
    <Menu>
      <MenuButton
        onClick={() => AmpTrack(AmpEvent.USE_CREATE_NEW_PROPOSAL)}
        variant="primary"
        color="text.main"
        as={Button}
        rightIcon={<CustomIcon name="chevron-down" color="text.main" />}
      >
        Create New Proposal
      </MenuButton>
      <MenuList>
        <StyledMenuItem
          icon={<CustomIcon name="code" />}
          onClick={() => {
            navigate({
              pathname: "/proposal/store-code",
            });
          }}
        >
          To Store Code
        </StyledMenuItem>
        {/* <StyledMenuItem
          icon={<CustomIcon name="contract-address" />}
          onClick={() => {
            // TODO - Change navigation path
            navigate({
              pathname: "/proposal-instantiate",
            });
          }}
        >
          To Instantiate Contract
        </StyledMenuItem> */}
        <TooltipComponent
          label={isTestnet ? "Not available in testnet" : undefined}
        >
          <StyledMenuItem
            isDisabled={isTestnet}
            icon={<CustomIcon name="admin" />}
            onClick={() => {
              navigate({
                pathname: "/proposal/whitelist",
              });
            }}
          >
            To Whitelist
          </StyledMenuItem>
        </TooltipComponent>
      </MenuList>
    </Menu>
  );
};
