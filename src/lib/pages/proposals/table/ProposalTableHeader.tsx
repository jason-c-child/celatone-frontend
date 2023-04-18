import type { DividerProps, GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader, TableHeaderFreeze } from "lib/components/table";

export const ProposalTableHeader = ({
  templateColumns,
  boxShadow,
}: {
  templateColumns: GridProps["templateColumns"];
  boxShadow: DividerProps["boxShadow"];
}) => {
  // TODO - Revisit split columnsWidth
  const columnsWidth = templateColumns?.toString().split(" ");
  return (
    <Grid templateColumns={templateColumns} minW="min-content">
      <TableHeaderFreeze left="0">Proposal ID</TableHeaderFreeze>
      <TableHeaderFreeze
        left={columnsWidth && columnsWidth[0]}
        boxShadow={boxShadow}
      >
        Proposal Title/Type
      </TableHeaderFreeze>
      <TableHeader textAlign="center">Status</TableHeader>
      <TableHeader>Voting ends</TableHeader>
      <TableHeader>Resolved Block Height </TableHeader>
      <TableHeader>Proposed By </TableHeader>
    </Grid>
  );
};