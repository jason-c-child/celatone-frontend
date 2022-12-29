import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Button,
  Icon,
  Menu,
  MenuList,
  MenuButton,
  MenuDivider,
  chakra,
  MenuItem,
} from "@chakra-ui/react";
import Link from "next/link";
import {
  MdMoreHoriz,
  MdMode,
  MdOutlineBookmark,
  MdDelete,
} from "react-icons/md";

import { ExplorerLink } from "lib/components/ExplorerLink";
import {
  AddToOtherList,
  EditContractDetails,
  RemoveContract,
} from "lib/components/modal/contract";
import type { ContractInfo } from "lib/stores/contract";
import type { Option } from "lib/types";

import { ContractNameCell } from "./table/ContractNameCell";
import { TagsCell } from "./table/TagsCell";

const StyledIcon = chakra(Icon, {
  baseStyle: {
    boxSize: "4",
    display: "flex",
    alignItems: "center",
  },
});

interface ContractListTableProps {
  contracts: ContractInfo[];
  contractRemovalInfo?: Option;
}

export const ContractListTable = ({
  contracts = [],
  contractRemovalInfo,
}: ContractListTableProps) => {
  return (
    <TableContainer w="full">
      <Table variant="simple" sx={{ tableLayout: "auto" }}>
        <Thead>
          <Tr
            sx={{
              "& th:first-of-type": { pl: "48px" },
              "> th": { borderColor: "divider.main" },
            }}
          >
            <Th width="15%">Contract Address</Th>
            <Th width="25%">Contract Name</Th>
            <Th width="25%">Tags</Th>
            <Th width="25%">Instantiator</Th>
            <Th width="10%" />
          </Tr>
        </Thead>
        <Tbody>
          {contracts.map((item) => (
            <Tr
              transition="all .25s ease-in-out"
              _hover={{ bg: "gray.900" }}
              key={
                item.name +
                item.contractAddress +
                item.description +
                item.tags +
                item.lists
              }
              sx={{
                "& td:first-of-type": { pl: "48px" },
                "& td:last-of-type": { pr: "48px" },
                "> td": { borderColor: "divider.main" },
              }}
            >
              <Td>
                <ExplorerLink
                  value={item.contractAddress}
                  type="contract_address"
                  canCopyWithHover
                />
              </Td>
              <Td>
                <ContractNameCell contract={item} />
              </Td>
              <Td>
                <TagsCell contractInfo={item} />
              </Td>
              {/* Instantiator */}
              <Td>
                <ExplorerLink
                  value={item.instantiator}
                  type="user_address"
                  canCopyWithHover
                />
              </Td>
              <Td>
                <Flex gap={3} justifyContent="flex-end">
                  <Link href={`/execute?contract=${item.contractAddress}`}>
                    <Button variant="outline-gray" size="sm">
                      Execute
                    </Button>
                  </Link>
                  <Link href={`/query?contract=${item.contractAddress}`}>
                    <Button variant="outline-gray" size="sm">
                      Query
                    </Button>
                  </Link>
                  <Menu>
                    <MenuButton
                      size="sm"
                      variant="ghost-gray"
                      focusBorderColor="primary.main"
                      as={Button}
                    >
                      <StyledIcon
                        as={MdMoreHoriz}
                        color="gray.600"
                        boxSize="6"
                      />
                    </MenuButton>
                    <MenuList>
                      <EditContractDetails
                        contractInfo={item}
                        triggerElement={
                          <MenuItem
                            icon={<StyledIcon as={MdMode} color="gray.600" />}
                          >
                            Edit details
                          </MenuItem>
                        }
                      />
                      <AddToOtherList
                        contractInfo={item}
                        menuItemProps={{
                          icon: (
                            <StyledIcon
                              as={MdOutlineBookmark}
                              color="gray.600"
                            />
                          ),
                          children: "Add or remove from other lists",
                        }}
                      />
                      {!!contractRemovalInfo && (
                        <>
                          <MenuDivider />
                          <RemoveContract
                            contractInfo={item}
                            contractRemovalInfo={contractRemovalInfo}
                            menuItemProps={{
                              icon: (
                                <StyledIcon as={MdDelete} color="error.light" />
                              ),
                              children: "Remove from this list",
                            }}
                          />
                        </>
                      )}
                    </MenuList>
                  </Menu>
                </Flex>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};