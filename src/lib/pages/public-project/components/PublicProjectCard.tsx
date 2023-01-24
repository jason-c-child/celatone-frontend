import { Flex, Text, Image, Box } from "@chakra-ui/react";
import { observer } from "mobx-react-lite";
import { useClampText } from "use-clamp-text";

import { useInternalNavigate } from "lib/app-provider";
import type { PublicProjectInfo } from "lib/types";

import { BookmarkButton } from "./BookmarkButton";
import { SocialMedia } from "./SocialMedia";

interface PublicProjectCardProps {
  item: PublicProjectInfo["details"];
  slug: string;
}

export const PublicProjectCard = observer(
  ({ item, slug }: PublicProjectCardProps) => {
    const navigate = useInternalNavigate();
    const handleOnClick = () => {
      navigate({ pathname: `/public-project/${slug}` });
    };

    const [ref, { clampedText }] = useClampText({
      text: item?.description || "",
      ellipsis: "...",
      lines: 3,
    });

    return (
      <Flex
        px={4}
        pt={4}
        pb={2}
        alignItems="center"
        bg="gray.900"
        _hover={{ bg: "gray.800" }}
        transition="all 0.2s"
        borderRadius={4}
        gap={4}
        height="full"
        onClick={handleOnClick}
        cursor="pointer"
      >
        <Flex
          flexDirection="column"
          gap={3}
          w="full"
          height="full"
          justifyContent="space-between"
        >
          <Box>
            <Flex
              justifyContent="space-between"
              w="full"
              alignItems="flex-start"
            >
              <Flex gap={2}>
                <Image
                  src={item.logo}
                  borderRadius="full"
                  alt="Celatone"
                  width={7}
                  height={7}
                />
                <Text
                  variant="body1"
                  fontWeight="600"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  mt="3px"
                >
                  {item.name}
                </Text>
              </Flex>
              <BookmarkButton hasText={false} details={item} slug={slug} />
            </Flex>
            <Text
              ref={ref as React.MutableRefObject<HTMLParagraphElement>}
              variant="body3"
              color="text.primary"
              pt={3}
            >
              {clampedText}
            </Text>
          </Box>
          <SocialMedia details={item} />
        </Flex>
      </Flex>
    );
  }
);