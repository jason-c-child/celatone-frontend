import { SELECTED_CHAIN } from "env";

const APP_NAME = "SeiScan";

const Meta = () => {
  const chainName = SELECTED_CHAIN || "";
  const title = `${chainName.charAt(0).toUpperCase() + chainName.slice(1)}`;
  return (
    <>
      <meta name="application-name" content={APP_NAME} />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="apple-mobile-web-app-title" content={APP_NAME} />
      <meta name="format-detection" content="telephone=no" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="theme-color" content="#FFFFFF" />
      <title>{`${title} Explorer | SeiScan`}</title>
      <meta
        name="description"
        content="Explore the fastest Layer 1 blockchain, designed to scale with the industry"
      />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content="SeiScan" />
      <meta
        property="og:description"
        content="Explore the fastest Layer 1 blockchain, designed to scale with the industry"
      />
      <meta
        property="og:image"
        content="https://assets.alleslabs.dev/integrations/sei/cover.jpg"
      />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content="SeiScan" />
      <meta
        property="twitter:description"
        content="Explore the fastest Layer 1 blockchain, designed to scale with the industry"
      />
      <meta
        property="twitter:image"
        content="https://assets.alleslabs.dev/integrations/sei/cover.jpg"
      />
    </>
  );
};

export default Meta;
