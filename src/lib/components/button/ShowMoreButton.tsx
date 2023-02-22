import { Button, Text } from "@chakra-ui/react";

import { CustomIcon } from "../icon/CustomIcon";

interface ShowMoreButtonProps {
  showMoreText: string;
  showLessText: string;
  toggleShowMore: boolean;
  setToggleShowMore: () => void;
}
export const ShowMoreButton = ({
  showMoreText = "View Full",
  showLessText = "View Less",
  toggleShowMore,
  setToggleShowMore,
}: ShowMoreButtonProps) => (
  <Button
    p="0"
    rightIcon={
      toggleShowMore ? (
        <CustomIcon name="chevronUp" />
      ) : (
        <CustomIcon name="chevronDown" />
      )
    }
    color="lilac.main"
    variant="none"
    w="fit-content"
    onClick={setToggleShowMore}
  >
    <Text variant="body3" color="lilac.main" fontWeight="700">
      {toggleShowMore ? showLessText : showMoreText}
    </Text>
  </Button>
);
