import { Flex } from "@chakra-ui/react";
import {
  FaTwitter,
  FaGithub,
  FaTelegram,
  FaDiscord,
  FaInfo,
} from "react-icons/fa";

import { IconButton } from "lib/components/button/IconButton";
import { CustomIcon } from "lib/components/icon/CustomIcon";
import { AmpTrackSocial } from "lib/services/amplitude";
import type { Option, PublicDetail } from "lib/types";

export const renderSocial = (name: string) => {
  switch (name) {
    case "twitter":
      return FaTwitter;
    case "telegram":
      return FaTelegram;
    case "discord":
      return FaDiscord;
    default:
      return FaInfo;
  }
};

interface SocialMediaProps {
  details: Option<PublicDetail>;
}
export const SocialMedia = ({ details }: SocialMediaProps) => {
  if (!details) return null;
  return (
    <Flex
      alignItems="center"
      onClick={(e) => e.stopPropagation()}
      minHeight="32px"
    >
      {details.website && (
        <CustomIcon name="website" boxSize="20px" />
        // <IconButton
        //   href={details.website}
        //   icon={MdLanguage}
        //   onClick={() => AmpTrackWebsite(details.website)}
        // />
      )}
      {details.github && <IconButton href={details.github} icon={FaGithub} />}
      {details.socials.length &&
        details.socials.map(
          (social) =>
            social.url !== "" && (
              <IconButton
                key={social.name}
                href={social.url}
                icon={renderSocial(social.name)}
                onClick={() => AmpTrackSocial(social.url)}
              />
            )
        )}
    </Flex>
  );
};
