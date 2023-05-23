import { Button } from "@chakra-ui/react";

interface ContractCmdButtonProps {
  cmd: string;
  onClickCmd: () => void;
}
export const ContractCmdButton = ({
  cmd,
  onClickCmd,
}: ContractCmdButtonProps) => (
  <Button
    variant="command-button"
    fontSize="12px"
    height="24px"
    px="10px"
    borderRadius="16px"
    onClick={onClickCmd}
  >
    {cmd}
  </Button>
);
