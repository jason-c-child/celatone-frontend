import { Button, Flex, Heading, Icon, Text } from "@chakra-ui/react";
import type { StdFee } from "@cosmjs/stargate";
import { useWallet } from "@cosmos-kit/react";
import { useQuery } from "@tanstack/react-query";
import Long from "long";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiChevronLeft } from "react-icons/fi";
import { IoIosWarning } from "react-icons/io";

import { useFabricateFee, useSimulateFeeQuery } from "lib/app-provider";
import { useMigrateTx } from "lib/app-provider/tx/migrate";
import { CodeSelectSection } from "lib/components/CodeSelectSection";
import { EstimatedFeeRender } from "lib/components/EstimatedFeeRender";
import type { FormStatus } from "lib/components/forms";
import JsonInput from "lib/components/json/JsonInput";
import { useLCDEndpoint } from "lib/hooks";
import { useTxBroadcast } from "lib/providers/tx-broadcast";
import { getCodeIdInfo } from "lib/services/code";
import type { ComposedMsg, ContractAddr, HumanAddr } from "lib/types";
import { MsgType } from "lib/types";
import { composeMsg, jsonValidate } from "lib/utils";

interface MigrateContractProps {
  contractAddress: ContractAddr;
  codeIdParam: string;
  handleBack: () => void;
}

export const MigrateContract = ({
  contractAddress,
  codeIdParam,
  handleBack,
}: MigrateContractProps) => {
  const { address } = useWallet();
  const { broadcast } = useTxBroadcast();
  const endpoint = useLCDEndpoint();
  const migrateTx = useMigrateTx();
  const fabricateFee = useFabricateFee();

  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: { codeId: codeIdParam, migrateMsg: "{}" },
    mode: "all",
  });
  const { codeId, migrateMsg } = watch();
  const [status, setStatus] = useState<FormStatus>({ state: "init" });
  const [composedTxMsg, setComposedTxMsg] = useState<ComposedMsg[]>([]);
  const [estimatedFee, setEstimatedFee] = useState<StdFee>();
  const [simulateError, setSimulateError] = useState("");
  const [processing, setProcessing] = useState(false);

  const enableMigrate = !!(
    address &&
    codeId.length &&
    migrateMsg.trim().length &&
    jsonValidate(migrateMsg) === null &&
    status.state === "success"
  );

  const { isFetching: isSimulating } = useSimulateFeeQuery({
    enabled: composedTxMsg.length > 0,
    messages: composedTxMsg,
    onSuccess: (gasRes) => {
      if (gasRes) setEstimatedFee(fabricateFee(gasRes));
      else setEstimatedFee(undefined);
    },
    onError: (e) => {
      setSimulateError(e.message);
      setEstimatedFee(undefined);
    },
  });

  const { refetch } = useQuery(
    ["query", endpoint, codeId],
    async () => getCodeIdInfo(endpoint, Number(codeId)),
    {
      enabled: !!address && !!codeId.length,
      retry: false,
      cacheTime: 0,
      onSuccess(data) {
        const permission = data.code_info.instantiate_permission;
        if (
          address &&
          (permission.permission === "Everybody" ||
            permission.addresses.includes(address) ||
            permission.address === address)
        )
          setStatus({ state: "success" });
        else {
          setStatus({
            state: "error",
            message: "You can migrate to this code through proposal only",
          });
          setSimulateError("");
        }
      },
      onError() {
        setStatus({ state: "error", message: "This code ID does not exist" });
        setSimulateError("");
      },
    }
  );

  const proceed = useCallback(async () => {
    const stream = await migrateTx({
      contractAddress,
      codeId: Number(codeId),
      migrateMsg: JSON.parse(migrateMsg),
      estimatedFee,
      onTxSucceed: () => setProcessing(false),
      onTxFailed: () => setProcessing(false),
    });

    if (stream) {
      setProcessing(true);
      broadcast(stream);
    }
  }, [migrateTx, contractAddress, codeId, migrateMsg, estimatedFee, broadcast]);

  useEffect(() => {
    if (codeId.length) {
      setStatus({ state: "loading" });
      const timer = setTimeout(() => {
        refetch();
      }, 500);
      return () => clearTimeout(timer);
    }
    setStatus({ state: "init" });

    return () => {};
  }, [address, codeId, refetch]);

  useEffect(() => {
    if (enableMigrate) {
      setSimulateError("");
      const composedMsg = composeMsg(MsgType.MIGRATE, {
        sender: address as HumanAddr,
        contract: contractAddress as ContractAddr,
        codeId: Long.fromString(codeId),
        msg: Buffer.from(migrateMsg),
      });
      const timeoutId = setTimeout(() => {
        setComposedTxMsg([composedMsg]);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    return () => {};
  }, [address, codeId, contractAddress, enableMigrate, migrateMsg]);

  return (
    <>
      <Heading as="h6" variant="h6" mb={4}>
        To Code ID
      </Heading>
      <CodeSelectSection
        name="codeId"
        control={control}
        status={status}
        error={errors.codeId?.message}
        onCodeSelect={(code: string) => setValue("codeId", code)}
        codeId={codeId}
      />
      <Heading as="h6" variant="h6" mt={12} mb={6}>
        Migrate Message
      </Heading>
      <JsonInput
        text={migrateMsg}
        setText={(msg: string) => setValue("migrateMsg", msg)}
        height="120px"
      />
      {simulateError && (
        <Flex gap={2} mb={4}>
          <Icon as={IoIosWarning} boxSize={4} color="error.main" />
          <Text variant="body3" color="error.main">
            {simulateError}
          </Text>
        </Flex>
      )}
      <Flex
        fontSize="14px"
        color="text.dark"
        alignSelf="flex-start"
        alignItems="center"
        display="flex"
        gap="4px"
      >
        <p>Transaction Fee:</p>
        <EstimatedFeeRender
          estimatedFee={estimatedFee}
          loading={isSimulating}
        />
      </Flex>
      <Flex justify="space-between" w="100%" mt="32px">
        <Button
          size="md"
          variant="outline-gray"
          w="128px"
          leftIcon={
            <Icon as={FiChevronLeft} color="text.dark" fontSize="18px" />
          }
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          size="md"
          variant="primary"
          w="128px"
          disabled={!enableMigrate || !estimatedFee || isSimulating}
          onClick={proceed}
          isLoading={processing}
          sx={{ pointerEvents: processing && "none" }}
        >
          Migrate
        </Button>
      </Flex>
    </>
  );
};