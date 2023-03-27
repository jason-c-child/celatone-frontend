import { Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

export const AppLink = ({
  children,
  ...linkProps
}: React.ComponentProps<typeof Link>) => {
  const router = useRouter();
  const componentHref = linkProps.href.toString();
  return (
    <Link
      {...linkProps}
      href={
        // eslint-disable-next-line no-nested-ternary
        router.query.network === "testnet"
          ? `/testnet${componentHref}`
          : router.query.network === "localnet"
          ? `/localnet${componentHref}`
          : `/mainnet${componentHref}`
      }
    >
      {typeof children === "string" ? (
        <Text variant="body2" color={linkProps.color}>
          {children}
        </Text>
      ) : (
        children
      )}
    </Link>
  );
};
