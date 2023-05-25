import { Flex, Text, Button, Image } from "@chakra-ui/react";
import Link from "next/link";

import { useMobile } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import type { IconKeys } from "lib/components/icon";
import { AmpEvent, AmpTrack, AmpTrackCelatone } from "lib/services/amplitude";

interface SocialMenuType {
  url: string;
  icon: IconKeys;
  slug: string;
}

const socialMenu: SocialMenuType[] = [
  {
    url: "https://github.com/alleslabs",
    icon: "github-solid",
    slug: "github",
  },
  {
    url: "https://twitter.com/celatone_",
    icon: "twitter-solid",
    slug: "twitter",
  },
  {
    url: "https://blog.alleslabs.com",
    icon: "medium-solid",
    slug: "medium",
  },
  {
    url: "https://t.me/celatone_announcements",
    icon: "telegram-solid",
    slug: "telegram",
  },
];
const seiSocial: SocialMenuType[] = [
  {
    url: "https://t.me/seinetwork",
    icon: "telegram-solid",
    slug: "telegram",
  },
  {
    url: "https://twitter.com/SeiNetwork",
    icon: "twitter-solid",
    slug: "twitter",
  },
  {
    url: "https://discord.com/invite/sei",
    icon: "discord-solid",
    slug: "discord",
  },
  {
    url: "https://github.com/sei-protocol/sei-chain",
    icon: "github-solid",
    slug: "github",
  },
];

const Footer = () => {
  const isMobile = useMobile();
  return (
    <Flex
      as="footer"
      align={{ base: "center", md: "end" }}
      justifyContent="space-between"
      px={{ base: 4, md: 12 }}
      py={6}
      mx={1}
      background="background.overlay"
      direction={{ base: "column", md: "row" }}
      gap={{ base: 8, md: 1 }}
    >
      <Flex direction="column" gap={3} align="start">
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={{ base: 2, md: 1 }}
          align="center"
          w={{ base: "full", md: "auto" }}
        >
          <Link
            href="https://www.sei.io/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="https://www.sei.io/_next/static/media/logo-light.1249fa55.svg"
              h={7}
              mr={3}
            />
          </Link>
          {isMobile && (
            <Text
              variant="body3"
              color="gray.400"
              mb={2}
              textAlign={{ base: "center", md: "left" }}
            >
              Explore the fastest Layer 1 blockchain, designed to scale with the
              industry
            </Text>
          )}
          <Flex direction="row" gap={1} align="center">
            {seiSocial.map((item) => (
              <Link
                key={`social-sei-${item.slug}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => AmpTrackCelatone(item.url)}
              >
                <Button variant="ghost" size="xs" px="0">
                  <CustomIcon
                    name={item.icon}
                    boxSize="6"
                    color="accent.main"
                  />
                </Button>
              </Link>
            ))}
          </Flex>
        </Flex>
        {!isMobile && (
          <Text variant="body3" color="gray.400">
            Explore the fastest Layer 1 blockchain, designed to scale with the
            industry
          </Text>
        )}
      </Flex>
      <Flex
        direction="row"
        alignItems="end"
        minW="60px"
        pr={{ base: 8, md: 0 }}
      >
        <Button
          variant="ghost-gray"
          size="xs"
          sx={{ _hover: { "> div > svg": { opacity: "100" } } }}
        >
          <Link
            href="https://celat.one/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => AmpTrack(AmpEvent.ALLESLABS)}
          >
            <Flex
              gap={1}
              align="center"
              sx={{ _hover: { "> div": { opacity: "100" } } }}
            >
              <Flex opacity="0" transition="all .25s ease-in-out">
                <CustomIcon name="celatone" />
              </Flex>
              <Text variant="body3" color="text.dark">
                Powered by
              </Text>
              <Text
                variant="body3"
                color="secondary.main"
                transition="all .25s ease-in-out"
                _hover={{ color: "secondary.light" }}
              >
                Celatone
              </Text>
            </Flex>
          </Link>
        </Button>
        <Flex>
          <Link
            href="https://feedback.alleslabs.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => AmpTrack(AmpEvent.FEEDBACK)}
          >
            <Button variant="ghost-gray" size="xs" pl="1" mr="1">
              <Flex gap={1} align="center">
                <CustomIcon name="feedback" color="gray.600" />
                <Text variant="body3" color="text.dark">
                  Feedback
                </Text>
              </Flex>
            </Button>
          </Link>
          <Flex direction="row" gap={1} align="center">
            {socialMenu.map((item) => (
              <Link
                key={`social-${item.slug}`}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => AmpTrackCelatone(item.url)}
              >
                <Button variant="ghost" size="xs" px="0">
                  <CustomIcon name={item.icon} boxSize="4" color="gray.600" />
                </Button>
              </Link>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Footer;
