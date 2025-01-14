import { TableContainer, Grid, Box } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { useMemo, useState } from "react";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state";
import { TableHeader, TableTitle, ViewMore } from "lib/components/table";
import type { Account } from "lib/types";

import { PublicProjectAccountRow } from "./PublicProjectAccountRow";

interface PublicProjectAccountTableProps {
  accounts: Account[];
  onViewMore?: () => void;
}

const TEMPLATE_COLUMNS = "160px 320px minmax(250px, 1fr)";

const AccountTableHeader = () => (
  <Grid templateColumns={TEMPLATE_COLUMNS} minW="min-content">
    <TableHeader>Address</TableHeader>
    <TableHeader>Account Name</TableHeader>
    <TableHeader>Description</TableHeader>
  </Grid>
);

export const PublicProjectAccountTable = ({
  accounts = [],
  onViewMore,
}: PublicProjectAccountTableProps) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const filteredAccounts = useMemo(() => {
    return onViewMore
      ? accounts.slice(0, 5)
      : matchSorter(accounts, searchKeyword, {
          keys: ["name", "address", "description"],
          threshold: matchSorter.rankings.CONTAINS,
        });
  }, [accounts, onViewMore, searchKeyword]);

  return (
    <Box mt={12} mb={4}>
      <TableTitle title="Accounts" count={accounts.length} />
      {!onViewMore && (
        <TextInput
          variant="floating"
          value={searchKeyword}
          setInputState={setSearchKeyword}
          placeholder="Search with Account Address, Name, or Description"
          size="lg"
          mb={6}
        />
      )}
      {!filteredAccounts.length ? (
        <EmptyState
          message="There is currently no accounts related to this project."
          imageVariant={onViewMore && "empty"}
          withBorder
        />
      ) : (
        <>
          <TableContainer mb={4}>
            <AccountTableHeader />
            {filteredAccounts.map((account) => (
              <PublicProjectAccountRow
                key={account.address}
                accountInfo={account}
                templateColumns={TEMPLATE_COLUMNS}
              />
            ))}
          </TableContainer>
          {accounts.length > 5 && onViewMore && (
            <ViewMore onClick={onViewMore} />
          )}
        </>
      )}
    </Box>
  );
};
