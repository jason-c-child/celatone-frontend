import { useWallet } from "@cosmos-kit/react";
import { DefaultSeo } from "next-seo";

export const CelatoneSeo = () => {
  const { currentChainRecord } = useWallet();
  const title = `${currentChainRecord?.chain.pretty_name} Explorer | SeiScan`;

  return (
    <DefaultSeo
      title={title}
      description="Explore the fastest Layer 1 blockchain, designed to scale with the industry"
      openGraph={{
        type: "website",
        description:
          "Explore the fastest Layer 1 blockchain, designed to scale with the industry",
        images: [
          {
            url: "https://assets.alleslabs.dev/integrations/sei/cover.jpg",
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }}
      twitter={{
        handle: "@SeiNetwork",
        cardType: "summary_large_image",
      }}
    />
  );
};
