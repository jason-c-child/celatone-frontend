// TODO combine with codestable in codelist
import {
  Button,
  TableContainer,
  Td,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Icon,
  Text,
  Flex,
  Box,
  Tag,
} from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";
import { MdBookmarkBorder, MdHowToVote, MdSearchOff } from "react-icons/md";

import { useInternalNavigate } from "lib/app-provider";
import { ExplorerLink } from "lib/components/ExplorerLink";
import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state/EmptyState";
import type { Code } from "lib/types/projects";

interface CodesTableProps {
  codes: Code[];
  hasSearchInput?: boolean;
}
export const CodesTable = ({
  codes = [],
  hasSearchInput = true,
}: CodesTableProps) => {
  const navigate = useInternalNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredCodes = useMemo(() => {
    return matchSorter(codes, searchKeyword, {
      keys: ["id", "name"],
    });
  }, [codes, searchKeyword]);
  return (
    <Box>
      {hasSearchInput && (
        <Flex px="12">
          <TextInput
            variant="floating"
            value={searchKeyword}
            setInputState={setSearchKeyword}
            label="Search with code ID or code name"
            size="md"
            mb={6}
          />
        </Flex>
      )}
      {!filteredCodes.length ? (
        <Flex my={8}>
          <EmptyState message="No code found." icon={MdSearchOff} />
        </Flex>
      ) : (
        <TableContainer w="full">
          <Table variant="simple" sx={{ tableLayout: "auto" }}>
            <Thead>
              <Tr
                sx={{
                  "& th:first-of-type": { pl: "48px" },
                  "> th": {
                    textTransform: "capitalize",
                    borderColor: "pebble.700",
                  },
                }}
              >
                <Th width="10%">Code ID</Th>
                <Th width="30%">Code Name</Th>
                <Th width="10%" textAlign="center">
                  Contracts
                </Th>
                <Th width="15%">Uploader</Th>
                <Th width="15%">Permission</Th>
                <Th width="20%" />
              </Tr>
            </Thead>
            <Tbody>
              {/* TODO Link code id and row to code detail */}
              {filteredCodes.map((code) => (
                <Tr
                  key={code.id}
                  sx={{
                    "& td:first-of-type": { pl: "48px" },
                    "& td:last-of-type": { pr: "48px" },
                    "> td": { borderColor: "pebble.700" },
                  }}
                  transition="all .25s ease-in-out"
                  _hover={{ bg: "pebble.900" }}
                  onClick={() => navigate({ pathname: `/code/${code.id}` })}
                  cursor="pointer"
                >
                  <Td width="10%">
                    <ExplorerLink
                      type="code_id"
                      value={code.id.toString()}
                      canCopyWithHover
                    />
                  </Td>
                  <Td width="45%">
                    <Text variant="body2"> {code.name}</Text>
                  </Td>
                  <Td width="10%" textAlign="center">
                    <Text>todo</Text>
                  </Td>
                  <Td width="15%">
                    <Text>todo</Text>
                  </Td>
                  <Td width="15%">
                    {/* TODO: add condition for permission tag */}
                    <Tag borderRadius="full" bgColor="pebble.700">
                      Nobody
                    </Tag>
                    {/* <Tag borderRadius="full" bgColor="pebble.700">
                    OnlyAddress
                  </Tag>
                  <Tag borderRadius="full" bgColor="pebble.700">
                    AnyOfAddresses
                  </Tag>
                  <Tag borderRadius="full" bgColor="success.dark">
                    Everybody
                  </Tag> */}
                  </Td>
                  <Td width="20%">
                    <Flex gap={3} justifyContent="flex-end" alignItems="center">
                      <Button variant="outline-gray" size="sm">
                        <Icon as={MdHowToVote} boxSize={4} mr={1} />
                        Instantiate
                      </Button>
                      {/* TODO save code */}
                      <Icon
                        as={MdBookmarkBorder}
                        boxSize={6}
                        color="pebble.600"
                        cursor="pointer"
                      />
                    </Flex>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};
