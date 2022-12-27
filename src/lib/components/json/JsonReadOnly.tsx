import type { LayoutProps } from "@chakra-ui/react";
import { Text, Box } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

import { CopyButton } from "../CopyButton";
import { jsonValidate } from "lib/utils";

import { ViewFullMsgButton } from "./ViewFullMsgButton";

const BUTTON_EXPAND_PADDING = "60px";

const JsonEditor = dynamic(() => import("lib/components/json/JsonEditor"), {
  ssr: false,
});

interface JsonReadOnlyProps {
  topic?: string;
  text: string;
  height?: LayoutProps["height"];
  canCopy?: boolean;
  canViewFull?: boolean;
}

const JsonReadOnly = ({
  topic,
  text,
  height,
  canCopy,
  canViewFull,
}: JsonReadOnlyProps) => {
  const [viewFull, setViewFull] = useState(false);

  const isJsonValid = useMemo(() => {
    return jsonValidate(text) === null || text.length === 0;
  }, [text]);

  return (
    <Box
      m={height === 0 ? 0 : "8px 0 16px"}
      p={height === 0 ? 0 : "16px 12px"}
      borderWidth={height === 0 ? "none" : "thin"}
      borderColor={!isJsonValid ? "error.main" : "divider.main"}
      borderRadius="4px"
      position="relative"
      transition="all .2s"
      _hover={{
        borderColor: isJsonValid && "gray.600",
        "& .copy-button-box": { display: "block" },
      }}
      paddingBottom={viewFull ? BUTTON_EXPAND_PADDING : "12px"}
    >
      <JsonEditor
        value={text}
        readOnly
        isValid={isJsonValid}
        height={height}
        showFullMsg={viewFull}
      />
      {!!topic && (
        <Text
          top="-10px"
          background="background.main"
          textColor={!isJsonValid ? "error.main" : "gray.500"}
          fontSize="12px"
          position="absolute"
        >
          {topic}
        </Text>
      )}
      {canViewFull && (
        <ViewFullMsgButton
          onClick={() => setViewFull((prev) => !prev)}
          viewFull={viewFull}
        />
      )}
      {canCopy && height !== 0 && (
        <Box
          position="absolute"
          top="10px"
          right="10px"
          className="copy-button-box"
          display="none"
        >
          <CopyButton value={text} />
        </Box>
      )}
    </Box>
  );
};

export default JsonReadOnly;
