import { Button, Flex, Heading } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import {
  useCelatoneApp,
  useFabricateFee,
  useInternalNavigate,
  useSimulateFeeQuery,
  useUpdateAdminTx,
} from "lib/app-provider";
import { ConnectWalletAlert } from "lib/components/ConnectWalletAlert";
import { ContractSelectSection } from "lib/components/ContractSelectSection";
import { ErrorMessageRender } from "lib/components/ErrorMessageRender";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import type { FormStatus } from "lib/components/forms";
import { TextInput } from "lib/components/forms";
import WasmPageContainer from "lib/components/WasmPageContainer";
import {
  useLCDEndpoint,
  useGetAddressType,
  useValidateAddress,
} from "lib/hooks";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { queryInstantiateInfo } from "lib/services/contract";
import type { ContractAddr, HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, getFirstQueryParam } from "lib/utils";

const UpdateAdmin = () => {
  const router = useRouter();
  const { address } = useWallet();
  const { validateContractAddress, validateUserAddress } = useValidateAddress();
  const getAddressType = useGetAddressType();
  const navigate = useInternalNavigate();
  const fabricateFee = useFabricateFee();
  const updateAdminTx = useUpdateAdminTx();
  const { broadcast } = useTxBroadcast();
  const endpoint = useLCDEndpoint();
  const { indexerGraphClient } = useCelatoneApp();

  const [adminAddress, setAdminAddress] = useState("");
  const [adminFormStatus, setAdminFormStatus] = useState<FormStatus>({
    state: "init",
    message: "",
  });
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState<string>();

  const contractAddressParam = getFirstQueryParam(
    router.query.contract
  ) as ContractAddr;

  const onContractPathChange = useCallback(
    (contract?: ContractAddr) => {
      navigate({
        pathname: "/admin",
        query: { ...(contract && { contract }) },
        options: { shallow: true },
      });
    },
    [navigate]
  );

  const { isFetching } = useSimulateFeeQuery({
    enabled:
      !!address &&
      !!contractAddressParam &&
      adminFormStatus.state === "success",
    messages: [
      composeMsg(MsgType.UPDATE_ADMIN, {
        sender: address as HumanAddr,
        newAdmin: adminAddress as HumanAddr | ContractAddr,
        contract: contractAddressParam,
      }),
    ],
    onSuccess: (fee) => {
      if (fee) {
        setSimulateError(undefined);
        setEstimatedFee(fabricateFee(fee));
      } else setEstimatedFee(undefined);
    },
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
  });

  const proceed = useCallback(async () => {
    const stream = await updateAdminTx({
      contractAddress: contractAddressParam,
      newAdmin: adminAddress as HumanAddr | ContractAddr,
      estimatedFee,
    });

    if (stream) broadcast(stream);
  }, [
    adminAddress,
    contractAddressParam,
    updateAdminTx,
    broadcast,
    estimatedFee,
  ]);

  /**
   * @remarks Contract admin validation
   */
  useQuery(
    ["query", "instantiate_info", endpoint, contractAddressParam],
    async () =>
      queryInstantiateInfo(endpoint, indexerGraphClient, contractAddressParam),
    {
      enabled: !!contractAddressParam,
      refetchOnWindowFocus: false,
      retry: 0,
      onSuccess: (contractInfo) => {
        if (contractInfo.admin !== address) onContractPathChange();
      },
      onError: onContractPathChange,
    }
  );

  useEffect(() => {
    if (contractAddressParam && validateContractAddress(contractAddressParam)) {
      onContractPathChange();
    }
  }, [contractAddressParam, onContractPathChange, validateContractAddress]);

  /**
   * @remarks Admin address input validation
   */
  useEffect(() => {
    if (!adminAddress) setAdminFormStatus({ state: "init" });
    else {
      const addressType = getAddressType(adminAddress);
      if (addressType === "invalid_address") {
        setAdminFormStatus({
          state: "error",
          message: "Invalid address length",
        });
      } else {
        const validateResult =
          addressType === "user_address"
            ? validateUserAddress(adminAddress)
            : validateContractAddress(adminAddress);
        if (validateResult) {
          setAdminFormStatus({ state: "error", message: validateResult });
        } else {
          setAdminFormStatus({ state: "success" });
        }
      }
    }
  }, [
    adminAddress,
    getAddressType,
    validateContractAddress,
    validateUserAddress,
  ]);

  return (
    <WasmPageContainer>
      <Heading as="h4" variant="h4" mb="24px">
        Update Admin
      </Heading>
      <ConnectWalletAlert
        mb="24px"
        subtitle="You need to connect your wallet to perform this action"
      />
      <ContractSelectSection
        mode="only-admin"
        contractAddress={contractAddressParam}
        onContractSelect={(contract) => onContractPathChange(contract)}
      />
      <TextInput
        variant="floating"
        label="New Admin Address"
        helperText="This address will be an admin for the deployed smart contract."
        value={adminAddress}
        setInputState={setAdminAddress}
        mt="48px"
        status={adminFormStatus}
      />
      <Flex
        fontSize="14px"
        color="text.dark"
        alignItems="center"
        alignSelf="flex-start"
        gap={1}
        mt="48px"
      >
        <p>Transaction Fee:</p>
        <EstimatedFeeRender estimatedFee={estimatedFee} loading={isFetching} />
      </Flex>
      {simulateError && (
        <ErrorMessageRender
          error={simulateError}
          mt={4}
          alignSelf="flex-start"
        />
      )}
      <Button
        disabled={!estimatedFee || isFetching}
        onClick={proceed}
        mt="48px"
      >
        Update Admin
      </Button>
    </WasmPageContainer>
  );
};

export default UpdateAdmin;