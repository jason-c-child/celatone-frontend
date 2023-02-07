import { chakra, IconButton } from "@chakra-ui/react";
import { MdBookmark, MdBookmarkBorder } from "react-icons/md";

import type { CodeInfo } from "lib/types";

import { RemoveCodeModal } from "./RemoveCode";
import { SaveCodeDetailsModal } from "./SaveCodeDetails";

const StyledIconButton = chakra(IconButton, {
  baseStyle: {
    display: "flex",
    alignItems: "center",
    fontSize: "22px",
    borderRadius: "full",
  },
});

interface SaveOrRemoveCodeModalProps {
  codeInfo: CodeInfo;
}

export function SaveOrRemoveCodeModal({
  codeInfo,
}: SaveOrRemoveCodeModalProps) {
  return codeInfo.isSaved ? (
    <RemoveCodeModal
      codeId={codeInfo.id}
      description={codeInfo.description}
      trigger={
        <StyledIconButton
          icon={<MdBookmark />}
          variant="ghost-gray"
          color="lilac.main"
        />
      }
    />
  ) : (
    <SaveCodeDetailsModal
      codeLocalInfo={codeInfo}
      triggerElement={
        <StyledIconButton
          icon={<MdBookmarkBorder />}
          variant="ghost-gray"
          color="pebble.600"
        />
      }
    />
  );
}
