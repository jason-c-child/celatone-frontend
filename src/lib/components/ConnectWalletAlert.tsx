import {
  Alert,
  AlertTitle,
  AlertDescription,
  Flex,
  Box,
  Button,
  Text,
} from "@chakra-ui/react";
import type { AlertProps } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";

import { AmpEvent, AmpTrack } from "lib/services/amplitude";

import { CustomIcon } from "./icon/CustomIcon";

interface ConnectWalletAlertProps extends AlertProps {
  title?: string;
  subtitle?: string;
}

export const ConnectWalletAlert = ({
  title,
  subtitle,
  ...alertProps
}: ConnectWalletAlertProps) => {
  const { address, connect } = useWallet();

  const onClickConnect: MouseEventHandler = async (e) => {
    AmpTrack(AmpEvent.USE_CLICK_WALLET);
    e.preventDefault();
    await connect();
  };

  return !address ? (
    <Alert
      {...alertProps}
      variant="honeydew"
      alignItems="center"
      justifyContent="space-between"
      py="12px"
    >
      <Flex gap={2}>
        <CustomIcon name="infoCircle" color="honeydew.main" boxSize="20px" />
        <Box>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{subtitle}</AlertDescription>
        </Box>
      </Flex>
      <Button variant="ghost-info" gap={2} onClick={onClickConnect}>
        <CustomIcon name="connect" color="honeydew.main" viewBox="0 -4 16 16" />
        <Text color="honeydew.main">Connect Wallet</Text>
      </Button>
    </Alert>
  ) : null;
};
