import {
  Alert,
  AlertDescription,
  Flex,
  Heading,
  Button,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import { useEffect, useMemo } from "react";

import { useCurrentNetwork, useInternalNavigate } from "lib/app-provider";
import { ButtonCard } from "lib/components/ButtonCard";
import { CustomIcon } from "lib/components/icon";
import { Loading } from "lib/components/Loading";
import { Stepper } from "lib/components/stepper";
import WasmPageContainer from "lib/components/WasmPageContainer";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import { useUploadAccessParams } from "lib/services/proposalService";
import type { HumanAddr } from "lib/types";
import { AccessConfigPermission } from "lib/types";

const Deploy = () => {
  const { isMainnet } = useCurrentNetwork();
  const router = useRouter();
  const navigate = useInternalNavigate();
  const { address } = useWallet();
  const { data, isFetching } = useUploadAccessParams();

  const isPermissionedNetwork =
    data?.permission !== AccessConfigPermission.EVERYBODY;

  const enableUpload = useMemo(() => {
    if (!isPermissionedNetwork) return true;
    return Boolean(data?.addresses?.includes(address as HumanAddr));
  }, [data, address, isPermissionedNetwork]);

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_DEPLOY);
  }, [router.isReady]);

  if (isFetching) return <Loading />;

  return (
    <WasmPageContainer>
      <Text variant="body1" color="text.dark" mb={3} fontWeight={700}>
        DEPLOY NEW CONTRACT
      </Text>
      <Stepper mode="deploy" currentStep={1} />
      <Heading as="h5" variant="h5" my="48px">
        Select Deploy Option
      </Heading>
      {isMainnet && (
        <Alert variant="primary" mb="16px" alignItems="flex-start" gap="1">
          <CustomIcon name="info-circle-solid" boxSize="20px" />
          <AlertDescription>
            Uploading new Wasm files on permissioned chains is coming soon to
            SeiScan. Currently, you can upload codes and instantiate contracts
            without permission on testnet.
          </AlertDescription>
        </Alert>
      )}
      <ButtonCard
        title="Upload new WASM File"
        description={
          isPermissionedNetwork
            ? "Available for whitelisted addresses only"
            : "Store a new Wasm file on-chain"
        }
        disabled={!enableUpload || !address}
        onClick={() => navigate({ pathname: "/upload" })}
        mb="16px"
      />
      <ButtonCard
        title="Use existing Code IDs"
        description="Input code ID or select from previously stored or saved codes"
        onClick={() => navigate({ pathname: "/instantiate" })}
        disabled={!address}
      />
      <Flex justify="center" w="100%" mt="32px">
        <Button
          onClick={() => {
            router.back();
          }}
          variant="ghost-gray"
        >
          Cancel
        </Button>
      </Flex>
    </WasmPageContainer>
  );
};

export default Deploy;
