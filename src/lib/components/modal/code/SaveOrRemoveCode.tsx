import { chakra, IconButton } from "@chakra-ui/react";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";

import type { CodeInfo } from "lib/types";

import { RemoveCode } from "./RemoveCode";
import { SaveCodeDetails } from "./SaveCodeDetails";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "36px",
  },
});

interface SaveOrRemoveCodeModalProps {
  codeInfo: CodeInfo;
}

export function SaveOrRemoveCode({ codeInfo }: SaveOrRemoveCodeModalProps) {
  return codeInfo.isSaved ? (
    <RemoveCode
      codeId={codeInfo.id}
      description={codeInfo.description}
      trigger={
        <StyledIconButton
          icon={<MdBookmark />}
          variant="ghost-gray"
          color="primary.main"
        />
      }
    />
  ) : (
    <SaveCodeDetails
      codeLocalInfo={codeInfo}
      triggerElement={
        <StyledIconButton
          icon={<MdBookmarkBorder />}
          variant="ghost-gray"
          color="gray.600"
        />
      }
    />
  );
}