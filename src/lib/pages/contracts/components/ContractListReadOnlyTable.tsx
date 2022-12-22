import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Text,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";

import type { ContractInfo } from "lib/stores/contract";
import { truncate } from "lib/utils";

import { ContractNameCell } from "./table/ContractNameCell";
import { TagsCell } from "./table/TagsCell";

interface ContractListReadOnlyTableProps {
  contracts: ContractInfo[];
  onContractSelect: (addr: string) => void;
}
export const ContractListReadOnlyTable = ({
  contracts = [],
  onContractSelect,
}: ContractListReadOnlyTableProps) => {
  const { address } = useWallet();

  return (
    <TableContainer w="full" my="16px">
      <Table variant="simple" sx={{ tableLayout: "auto" }}>
        <Thead>
          <Tr>
            <Th width="10%">Contract Address</Th>
            <Th width="50%">Contract Name</Th>
            <Th width="30%">Tags</Th>
            <Th width="10%">Instantiator</Th>
          </Tr>
        </Thead>
        <Tbody>
          {contracts.map((item) => (
            <Tr
              transition="all .25s ease-in-out"
              _hover={{ bg: "gray.900" }}
              key={item.address}
              onClick={() => {
                onContractSelect(item.address);
              }}
              cursor="pointer"
            >
              <Td width="10%">
                <Text variant="body2">{truncate(item.address)}</Text>
              </Td>
              <Td width="40%">
                <ContractNameCell contract={item} isReadOnly />
              </Td>
              <Td width="30%">
                <TagsCell contractInfo={item} isReadOnly />
              </Td>
              <Td width="10%">
                <Text variant="body2">
                  {address === item.instantiator
                    ? "Me"
                    : truncate(item.instantiator)}
                </Text>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
