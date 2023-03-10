import { TableContainer } from "@chakra-ui/react";

import type { Redelegation } from "lib/pages/account-details/data";

import { RedelegationTableHeader } from "./RedelegationTableHeader";
import { RedelegationTableRow } from "./RedelegationTableRow";

const TEMPLATE_COLUMNS =
  "minmax(250px, 1fr) 50px minmax(250px, 1fr) minmax(350px, 1fr) minmax(250px, 1fr)";

interface RedelegationsTableProps {
  redelegations: Redelegation[];
}

export const RedelegationsTable = ({
  redelegations,
}: RedelegationsTableProps) => (
  <TableContainer>
    <RedelegationTableHeader templateColumns={TEMPLATE_COLUMNS} />
    {redelegations.map((redelegation) => (
      <RedelegationTableRow
        key={
          redelegation.srcValidator.validatorAddress +
          redelegation.dstValidator.validatorAddress +
          redelegation.token.amount +
          redelegation.token.amount +
          redelegation.completionTime
        }
        redelegation={redelegation}
        templateColumns={TEMPLATE_COLUMNS}
      />
    ))}
  </TableContainer>
);
