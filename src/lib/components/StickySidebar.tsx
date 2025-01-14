import type { BoxProps } from "@chakra-ui/react";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Text,
} from "@chakra-ui/react";

import {
  useCurrentNetwork,
  useInternalNavigate,
  useSelectChain,
} from "lib/app-provider";
import type { Network } from "lib/data";
import { getChainNameByNetwork } from "lib/data";
import { AmpTrackUseRightHelperPanel } from "lib/services/amplitude";

import { CustomIcon } from "./icon";

export interface SidebarMetadata {
  page: string;
  title: string;
  description: React.ReactElement;
  toNetwork?: boolean;
  toPagePath?: string;
  toPageTitle?: string;
  toPage?: boolean;
}

export type SidebarDetails = Record<Network, SidebarMetadata>;

interface StickySidebarProps extends BoxProps {
  metadata: SidebarDetails;
}

interface ToPageProps {
  onClick: () => void;
  title: string;
}
const ToPage = ({ onClick, title }: ToPageProps) => (
  <Flex
    align="center"
    cursor="pointer"
    borderRadius={8}
    p={1}
    gap={2}
    width="fit-content"
    transition="all 0.25s ease-in-out"
    color="secondary.main"
    _hover={{
      color: "secondary.light",
      bgColor: "secondary.background",
    }}
    onClick={onClick}
  >
    <Text variant="body3" color="inherit" fontWeight={700}>
      {title}
    </Text>
    <CustomIcon name="chevron-right" color="secondary.main" boxSize={3} m={0} />
  </Flex>
);

export const StickySidebar = ({
  metadata,
  ...boxProps
}: StickySidebarProps) => {
  const navigate = useInternalNavigate();
  const selectChain = useSelectChain();
  const { isMainnet } = useCurrentNetwork();
  const { network } = useCurrentNetwork();
  const {
    title,
    description,
    toNetwork,
    toPagePath,
    toPageTitle,
    toPage,
    page,
  } = metadata[network];
  const hasAction = toPage;
  return (
    <Box flex="4" px={8} position="relative" {...boxProps}>
      <Flex position="fixed" width="full">
        <Accordion allowToggle width={96} defaultIndex={[0]}>
          <AccordionItem borderTop="none" borderColor="gray.700">
            <AccordionButton py={3} px={0}>
              <Text
                variant="body2"
                fontWeight={700}
                color="text.main"
                textAlign="start"
              >
                {title}
              </Text>
              <AccordionIcon color="gray.600" ml="auto" />
            </AccordionButton>
            <AccordionPanel
              py={3}
              px={0}
              borderTop="1px solid"
              borderColor="gray.700"
            >
              <Text
                variant="body2"
                color="text.dark"
                mb={hasAction ? 3 : 0}
                pb={2}
              >
                {description}
              </Text>
              {toNetwork && (
                <ToPage
                  onClick={() => {
                    AmpTrackUseRightHelperPanel(page, "change-network");
                    selectChain(
                      getChainNameByNetwork(isMainnet ? "testnet" : "mainnet")
                    );
                  }}
                  title={isMainnet ? "Switch To Testnet" : "Switch To Mainnet"}
                />
              )}
              {toPage && toPagePath && toPageTitle && (
                <ToPage
                  onClick={() => {
                    AmpTrackUseRightHelperPanel(page, `to-${toPagePath}`);
                    navigate({ pathname: toPagePath });
                  }}
                  title={toPageTitle}
                />
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Flex>
    </Box>
  );
};
