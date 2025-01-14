import { Text } from "@chakra-ui/react";
import type { TextProps } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import type { MouseEventHandler } from "react";

interface AssginMeProps {
  onClick?: MouseEventHandler<HTMLParagraphElement>;
  isDisable?: boolean;
  textAlign?: TextProps["textAlign"];
}

export const AssignMe = ({
  onClick,
  isDisable = false,
  textAlign = "right",
}: AssginMeProps) => {
  const { address: walletAddress } = useWallet();
  const enabled = Boolean(!isDisable && walletAddress);

  return (
    <Text
      textAlign={textAlign}
      mr={3}
      color={enabled ? "accent.main" : "text.disabled"}
      fontWeight={700}
      variant="body3"
      cursor={enabled ? "pointer" : "not-allowed"}
      minW={16}
      onClick={enabled ? onClick : undefined}
    >
      Assign me
    </Text>
  );
};
