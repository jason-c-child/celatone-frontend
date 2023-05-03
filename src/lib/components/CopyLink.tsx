import { Flex, Text, Tooltip, useClipboard } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useState } from "react";

import { AmpTrackCopier } from "lib/services/amplitude";

import { CustomIcon } from "./icon";

interface CopyLinkProps {
  value: string;
  amptrackSection?: string;
  type: string;
}

export const CopyLink = ({ value, amptrackSection, type }: CopyLinkProps) => {
  const { address } = useWallet();
  const { onCopy, hasCopied } = useClipboard(value);
  const [isHover, setIsHover] = useState(false);
  return (
    <Tooltip
      hasArrow
      isOpen={isHover || hasCopied}
      label={hasCopied ? "Copied!" : "Click to copy"}
      placement="top"
      arrowSize={8}
      closeOnClick={false}
    >
      <Flex
        align="center"
        onClick={() => {
          AmpTrackCopier(amptrackSection, type);
          onCopy();
        }}
        _hover={{
          textDecoration: "underline",
          textDecorationColor: "lilac.light",
          "& > p": { color: "lilac.light" },
        }}
        cursor="pointer"
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <Text
          variant="body2"
          color="lilac.main"
          transition="all .25s ease-in-out"
        >
          {value === address ? `${value} (Me)` : value}
        </Text>
        <CustomIcon cursor="pointer" marginLeft={2} name="copy" boxSize={3} />
      </Flex>
    </Tooltip>
  );
};
