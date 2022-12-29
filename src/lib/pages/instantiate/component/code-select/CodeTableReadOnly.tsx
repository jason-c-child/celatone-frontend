import {
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

import { ExplorerLink } from "lib/components/ExplorerLink";
import type { CodeInfo } from "lib/types";

interface TableRowProps {
  onCodeSelect: (newVal: string) => void;
  codeDetail: CodeInfo;
}

const TableRow = ({ onCodeSelect, codeDetail }: TableRowProps) => {
  return (
    <Tr
      sx={{
        "& td:first-of-type": { pl: "60px" },
        "& td:last-child": { pr: "60px" },
      }}
      cursor="pointer"
      _hover={{ bg: "gray.900", transition: "all .2s" }}
      onClick={() => onCodeSelect(codeDetail.id.toString())}
    >
      <Td width="20%">
        <Text variant="body2">{codeDetail.id}</Text>
      </Td>
      <Td width="40%">
        <Text variant="body2" className="ellipsis">
          {codeDetail?.description ?? "No Description"}
        </Text>
      </Td>
      <Td width="15%" textAlign="center">
        <Text variant="body2">{codeDetail.contracts}</Text>
      </Td>
      <Td width="25%">
        <ExplorerLink
          value={codeDetail.uploader}
          type="user_address"
          isReadOnly
        />
      </Td>
    </Tr>
  );
};

interface CodeTableReadOnlyProps {
  onCodeSelect: (code: string) => void;
  codes: CodeInfo[];
}

export const CodeTableReadOnly = ({
  onCodeSelect,
  codes,
}: CodeTableReadOnlyProps) => {
  return (
    <TableContainer w="full" my="16px">
      <Table variant="simple">
        <Thead>
          <Tr
            sx={{
              "& th:first-of-type": { pl: "60px" },
              "& th:last-child": { pr: "60px" },
              "& th": { textTransform: "none", border: "none", color: "white" },
            }}
          >
            <Th width="20%">Code ID</Th>
            <Th width="40%">Description</Th>
            <Th width="15%">Contracts</Th>
            <Th width="25%">Uploader</Th>
          </Tr>
        </Thead>
        <Tbody>
          {codes.map((code, index) => (
            <TableRow
              key={code.id + index.toString()}
              codeDetail={code}
              onCodeSelect={onCodeSelect}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};