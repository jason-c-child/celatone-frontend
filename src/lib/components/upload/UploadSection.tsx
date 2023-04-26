import { Box, Button, Flex } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { DropZone } from "../dropzone";
import { ControllerInput } from "../forms";
import {
  useFabricateFee,
  useSimulateFee,
  useSimulateFeeForStoreCode,
  useUploadContractTx,
  useValidateAddress,
} from "lib/app-provider";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import { CustomIcon } from "lib/components/icon";
import { getMaxCodeNameLengthError, MAX_CODE_NAME_LENGTH } from "lib/data";
import { useCodeStore } from "lib/providers/store";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import type { Addr, HumanAddr, UploadSectionState } from "lib/types";
import { AccessType } from "lib/types";

import { InstantiatePermissionRadio } from "./InstantiatePermissionRadio";
import { SimulateMessageRender } from "./SimulateMessageRender";
import { UploadCard } from "./UploadCard";

interface UploadSectionProps {
  handleBack: () => void;
  isMigrate?: boolean;
}

export const UploadSection = ({
  handleBack,
  isMigrate = false,
}: UploadSectionProps) => {
  const { simulate, loading } = useSimulateFee();
  const fabricateFee = useFabricateFee();
  const { address } = useWallet();
  const { broadcast } = useTxBroadcast();
  const { updateCodeInfo } = useCodeStore();
  const postUploadTx = useUploadContractTx(isMigrate);
  const { validateUserAddress, validateContractAddress } = useValidateAddress();

  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState<string>();

  const simulateSuccessText = "Valid Wasm file and instantiate permission";

  const {
    control,
    setValue,
    watch,
    formState: { errors },
    trigger,
  } = useForm<UploadSectionState>({
    defaultValues: {
      wasmFile: undefined,
      codeName: "",
      permission: AccessType.ACCESS_TYPE_EVERYBODY,
      addresses: [{ address: "" as Addr }],
    },
    mode: "all",
  });

  const { wasmFile, codeName, addresses, permission } = watch();

  const setDefaultBehavior = () => {
    setSimulateError(undefined);
    setEstimatedFee(undefined);
  };

  const isAddressesError = addresses.some((addr) =>
    Boolean(
      validateUserAddress(addr.address) && validateContractAddress(addr.address)
    )
  );

  // Should not simulate when permission is any of addresses and address input is not filled, invalid, or empty
  const isAnyAddrWithoutInput =
    permission === AccessType.ACCESS_TYPE_ANY_OF_ADDRESSES &&
    (!addresses.some((addr) => addr.address !== "") || isAddressesError);

  const { isFetching: isSimulating } = useSimulateFeeForStoreCode({
    enabled: Boolean(wasmFile && address && !isAnyAddrWithoutInput),
    wasmFile,
    permission,
    addresses,
    onSuccess: (fee) => {
      if (wasmFile && address) {
        if (isAnyAddrWithoutInput) {
          setDefaultBehavior();
        }
        if (fee) {
          setSimulateError(simulateSuccessText);
          setEstimatedFee(fabricateFee(fee));
        }
      }
    },
    onError: (e) => {
      if (isAnyAddrWithoutInput) {
        setDefaultBehavior();
      } else {
        setSimulateError(e.message);
        setEstimatedFee(undefined);
      }
    },
  });

  const proceed = useCallback(async () => {
    if (address) {
      AmpTrack(AmpEvent.ACTION_UPLOAD);
      const stream = await postUploadTx({
        wasmFileName: wasmFile?.name,
        wasmCode: wasmFile?.arrayBuffer(),
        addresses: addresses.map((addr) => addr.address),
        permission,
        codeName,
        estimatedFee,
        onTxSucceed: (codeId: number) => {
          updateCodeInfo(
            codeId,
            address as HumanAddr,
            codeName || `${wasmFile?.name}(${codeId})`
          );
        },
      });

      if (stream) broadcast(stream);
    }
  }, [
    address,
    postUploadTx,
    wasmFile,
    addresses,
    permission,
    codeName,
    estimatedFee,
    broadcast,
    updateCodeInfo,
  ]);

  useEffect(() => {
    (async () => {
      if (wasmFile && address && isAnyAddrWithoutInput) {
        setDefaultBehavior();
      }
    })();
  }, [
    wasmFile,
    address,
    simulate,
    fabricateFee,
    setValue,
    permission,
    addresses,
    isSimulating,
    isAnyAddrWithoutInput,
  ]);

  return (
    <>
      {wasmFile ? (
        <UploadCard
          file={wasmFile}
          deleteFile={() => {
            setValue("wasmFile", undefined);
            setEstimatedFee(undefined);
          }}
        />
      ) : (
        <DropZone setFile={(file) => setValue("wasmFile", file)} />
      )}
      <ControllerInput
        name="codeName"
        control={control}
        label="Code Name (Optional)"
        placeholder="Untitled Name"
        helperText="A short description of what your code does. This is stored locally on your device and can be added or changed later."
        rules={{
          maxLength: MAX_CODE_NAME_LENGTH,
        }}
        error={errors.codeName && getMaxCodeNameLengthError(codeName.length)}
        variant="floating"
        my="32px"
      />
      <InstantiatePermissionRadio
        control={control}
        setValue={setValue}
        trigger={trigger}
      />

      <Box mt={10} width="full">
        {(simulateError || isSimulating) && (
          <SimulateMessageRender
            value={
              isSimulating
                ? "Checking Wasm and permission validity"
                : simulateError
            }
            isLoading={isSimulating}
            mb={2}
            isSuccess={simulateError === simulateSuccessText}
          />
        )}

        <Flex
          fontSize="14px"
          color="text.dark"
          alignSelf="flex-start"
          alignItems="center"
          display="flex"
        >
          <p>Transaction Fee:</p>
          <EstimatedFeeRender estimatedFee={estimatedFee} loading={loading} />
        </Flex>
      </Box>

      <Flex justify="space-between" w="100%" mt="32px">
        <Button
          size="md"
          variant="outline-gray"
          w="128px"
          leftIcon={<CustomIcon name="chevron-left" />}
          onClick={handleBack}
        >
          Previous
        </Button>
        <Button
          size="md"
          variant="primary"
          w="128px"
          disabled={
            isSimulating || isAnyAddrWithoutInput || Boolean(simulateError)
          }
          onClick={proceed}
        >
          Upload
        </Button>
      </Flex>
    </>
  );
};
