import { Text, Flex, Heading, Button } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { observer } from "mobx-react-lite";
import { useForm } from "react-hook-form";

import { useInternalNavigate } from "lib/app-provider";
import { OffChainForm } from "lib/components/OffChainForm";
import type { OffchainDetail } from "lib/components/OffChainForm";
import { useContractStore } from "lib/hooks";
import { useUserKey } from "lib/hooks/useUserKey";
import type { ContractAddr, LVPair } from "lib/types";

interface InstantiateOffChainFormProps {
  title?: string;
  subtitle?: string;
  cta?: boolean;
  contractAddress: ContractAddr;
  contractLabel: string;
}

export const InstantiateOffChainForm = observer(
  ({
    title,
    subtitle,
    cta = true,
    contractAddress,
    contractLabel,
  }: InstantiateOffChainFormProps) => {
    const { address = "" } = useWallet();
    const navigate = useInternalNavigate();
    const { updateContractLocalInfo } = useContractStore();
    const userKey = useUserKey();

    const {
      control,
      setValue,
      watch,
      handleSubmit,
      formState: { errors },
    } = useForm<OffchainDetail>({
      defaultValues: {
        name: "",
        description: "",
        tags: [],
        lists: [],
      },
      mode: "all",
    });

    const offchainState: OffchainDetail = {
      name: watch("name"),
      description: watch("description"),
      tags: watch("tags"),
      lists: watch("lists"),
    };
    const setTagsValue = (selectedTags: string[]) => {
      setValue("tags", selectedTags);
    };
    const setContractListsValue = (selectedLists: LVPair[]) => {
      setValue("lists", selectedLists);
    };

    const saveContract = () => {
      handleSubmit((data) => {
        updateContractLocalInfo(
          userKey,
          contractAddress,
          address,
          contractLabel,
          data.name,
          data.description,
          data.tags,
          data.lists
        );
        navigate({ pathname: "/contract-list/instantiated-by-me" });
      })();
    };

    return (
      <Flex direction="column" gap={8}>
        {title && subtitle && (
          <Flex direction="column" gap={1}>
            <Heading as="h6" variant="h6">
              {title}
            </Heading>
            <Text color="text.dark" variant="body2">
              {subtitle}
            </Text>
          </Flex>
        )}
        <OffChainForm<OffchainDetail>
          state={offchainState}
          contractLabel={contractLabel}
          control={control}
          setTagsValue={setTagsValue}
          setContractListsValue={setContractListsValue}
          errors={errors}
        />
        {cta && (
          <Flex gap={6} w="full" mt={4} justifyContent="center">
            <Button
              w="128px"
              onClick={saveContract}
              isDisabled={!!Object.keys(errors).length}
            >
              Save
            </Button>
            <Button
              w="128px"
              variant="outline-gray"
              onClick={() =>
                navigate({ pathname: "/contract-list/instantiated-by-me" })
              }
            >
              Skip
            </Button>
          </Flex>
        )}
      </Flex>
    );
  }
);
