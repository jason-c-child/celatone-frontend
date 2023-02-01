import type { GridProps } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";

import { TableHeader } from "lib/components/table";

export const PastTxsTableHeader = ({
  templateColumns,
}: {
  templateColumns: GridProps["templateColumns"];
}) => {
  return (
    <Grid templateColumns={templateColumns}>
      <TableHeader pl="48px">Tx Hash</TableHeader>
      <TableHeader />
      <TableHeader>Messages</TableHeader>
      <TableHeader>Timestamp</TableHeader>
      <TableHeader />
      <TableHeader />
    </Grid>
  );
};