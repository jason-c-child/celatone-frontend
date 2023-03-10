import { Box, TableContainer } from "@chakra-ui/react";

import { Loading } from "lib/components/Loading";
import { EmptyState } from "lib/components/state";
import { TableTitle } from "lib/components/table";
import type { Unbonding } from "lib/pages/account-details/data";
import type { Option } from "lib/types";

import { BondedTableHeader } from "./BondedTableHeader";
import { BondedTableRow } from "./BondedTableRow";
import { TEMPLATE_COLUMNS } from "./constant";

interface UnbondingsTableProps {
  unbondings: Option<Unbonding[]>;
}

const UnbondingsTableBody = ({ unbondings }: UnbondingsTableProps) => {
  if (!unbondings) return <Loading />;
  if (!unbondings.length)
    return (
      <EmptyState
        message="This account does not have any assets that is currently unbonding."
        withBorder
      />
    );

  return (
    <TableContainer>
      <BondedTableHeader
        templateColumns={TEMPLATE_COLUMNS}
        isDelegation={false}
      />
      {unbondings.map((unbonding) => (
        <BondedTableRow
          key={`unbonding_${unbonding.validator.validatorAddress}_${unbonding.validator.moniker}`}
          bondedInfo={{
            validator: unbonding.validator,
            amount: unbonding.token,
            completionTime: unbonding.completionTime,
          }}
          templateColumns={TEMPLATE_COLUMNS}
        />
      ))}
    </TableContainer>
  );
};

export const UnbondingsTable = ({ unbondings }: UnbondingsTableProps) => (
  <Box>
    <TableTitle title="Unbonding" count={unbondings?.length ?? 0} mb={2} />
    <UnbondingsTableBody unbondings={unbondings} />
  </Box>
);
