import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  Text,
  IconButton,
  DrawerOverlay,
  useDisclosure,
  Flex,
  FormControl,
  InputGroup,
  Input,
  InputRightElement,
  List,
  ListItem,
} from "@chakra-ui/react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { useRef, useState, useEffect } from "react";

import { CURR_THEME } from "env";
import { useInternalNavigate, useValidateAddress } from "lib/app-provider";
import { CustomIcon } from "lib/components/icon";
import { getChainConfig } from "lib/data";
import { AmpTrackUseMainSearch } from "lib/services/amplitude";
import { isBlock, isCodeId, isTxHash } from "lib/utils";

type SearchResultType =
  | "Code ID"
  | "Contract Address"
  | "Wallet Address"
  | "Transaction Hash"
  | "Proposal ID"
  | "Block";

const NOT_FOUND =
  "Matches not found. Please check your spelling or make sure you have selected the correct network.";
const NOT_SUPPORTED =
  "We currently only support searching by contract address and code ID.";

interface ResultItemProps {
  type?: SearchResultType;
  value: string;
  handleSelectResult: (type?: SearchResultType, isClick?: boolean) => void;
}

const getRoute = (type: SearchResultType) => {
  switch (type) {
    case "Code ID":
      return "/codes";
    case "Contract Address":
      return "/contracts";
    case "Wallet Address":
      return "/accounts";
    case "Transaction Hash":
      return "/txs";
    case "Block":
      return "/blocks";
    default:
      return null;
  }
};

const ResultItem = ({ type, value, handleSelectResult }: ResultItemProps) => {
  // TODO: should be removed once all types are supported
  // eslint-disable-next-line no-nested-ternary
  const text = type ? (getRoute(type) ? type : NOT_SUPPORTED) : NOT_FOUND;
  const route = type ? getRoute(type) : null;

  return (
    <ListItem p={2} borderBottomColor="gray.700" bg="gray.900">
      <Text variant="body2" fontWeight={500} color="text.dark" p={2}>
        {text}
      </Text>
      {route && (
        <Text
          variant="body2"
          p={2}
          borderRadius="8px"
          _hover={{ bg: "gray.800", cursor: "pointer" }}
          transition="all 0.25s ease-in-out"
          onClick={() => handleSelectResult(type, true)}
        >
          {value}
        </Text>
      )}
    </ListItem>
  );
};

export const SearchDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const boxRef = useRef<HTMLDivElement>(null);
  const navigate = useInternalNavigate();
  const { validateContractAddress, validateUserAddress } = useValidateAddress();

  const [keyword, setKeyword] = useState("");
  const [displayResults, setDisplayResults] = useState(false);
  const [results, setResults] = useState<SearchResultType[]>([]);

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    setKeyword(inputValue);
    setDisplayResults(inputValue.length > 0);
  };

  const handleSelectResult = (type?: SearchResultType, isClick = false) => {
    AmpTrackUseMainSearch(isClick);
    const route = type ? getRoute(type) : null;
    if (route) navigate({ pathname: `${route}/${keyword}` });
  };

  const handleOnKeyEnter = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSelectResult(results.at(0));
  };
  const placeholder = "Search";

  const chainConfig = getChainConfig();
  useEffect(() => {
    const res: SearchResultType[] = [];

    if (chainConfig.isWasm && isCodeId(keyword)) res.push("Code ID");
    else if (isBlock(keyword)) res.push("Block");

    if (!validateContractAddress(keyword)) res.push("Contract Address");

    if (!validateUserAddress(keyword)) res.push("Wallet Address");
    if (isTxHash(keyword)) res.push("Transaction Hash");
    // TODO: add proposal ID
    setResults(res);
  }, [
    chainConfig.isWasm,
    keyword,
    validateContractAddress,
    validateUserAddress,
  ]);

  return (
    <>
      <Button variant="outline-gray" size="sm" onClick={() => onOpen()}>
        <CustomIcon name="search" boxSize={3} />
      </Button>
      <Drawer isOpen={isOpen} onClose={onClose} placement="top">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerBody overflowY="scroll" p={2} m={2}>
            <FormControl ref={boxRef}>
              <InputGroup mb={4} alignItems="center">
                <IconButton
                  fontSize="24px"
                  variant="gray"
                  aria-label="back"
                  onClick={() => onClose()}
                  color="gray.600"
                  icon={<CustomIcon name="chevron-left" />}
                />
                <Input
                  value={keyword}
                  h="36px"
                  onChange={handleSearchChange}
                  placeholder={placeholder}
                  focusBorderColor="secondary.main"
                  onFocus={() => setDisplayResults(keyword.length > 0)}
                  onKeyDown={handleOnKeyEnter}
                />
                <InputRightElement pointerEvents="none" h="full">
                  <CustomIcon name="search" color="gray.600" bg="gray.900" />
                </InputRightElement>
              </InputGroup>
              {displayResults ? (
                <List borderRadius="8px" bg="gray.900" w="full">
                  {!results.length ? (
                    <ResultItem
                      key="Not Found"
                      value={keyword}
                      handleSelectResult={handleSelectResult}
                    />
                  ) : (
                    results.map((type) => (
                      <ResultItem
                        key={type}
                        type={type}
                        value={keyword}
                        handleSelectResult={handleSelectResult}
                      />
                    ))
                  )}
                </List>
              ) : (
                <Flex
                  bg="background.main"
                  p={5}
                  justify="center"
                  borderRadius={CURR_THEME.borderRadius.default}
                >
                  <Text variant="body2">Your result will display here </Text>
                </Flex>
              )}
            </FormControl>
            <Text variant="body3" textAlign="center" mt={2}>
              You can search by Block Height / Tx Hash / Code ID / Contract
              Address / Wallet Address
            </Text>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};
