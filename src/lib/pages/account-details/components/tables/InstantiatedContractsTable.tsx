import { Box } from "@chakra-ui/react";
import type { ChangeEvent } from "react";

import { ErrorFetching } from "../ErrorFetching";
import { useInternalNavigate } from "lib/app-provider";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { EmptyState } from "lib/components/state";
import { ContractsTable, TableTitle, ViewMore } from "lib/components/table";
import { useAccountContracts } from "lib/pages/account-details/data";
import type { ContractAddr, HumanAddr, Option } from "lib/types";

interface InstantiatedContractsTableProps {
  walletAddress: HumanAddr;
  scrollComponentId: string;
  totalData: Option<number>;
  refetchCount: () => void;
  onViewMore?: () => void;
}

export const InstantiatedContractsTable = ({
  walletAddress,
  scrollComponentId,
  totalData,
  refetchCount,
  onViewMore,
}: InstantiatedContractsTableProps) => {
  const navigate = useInternalNavigate();
  const onRowSelect = (contract: ContractAddr) =>
    navigate({
      pathname: "/contracts/[contract]",
      query: { contract },
    });

  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: totalData,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { contracts, isLoading } = useAccountContracts(
    walletAddress,
    offset,
    onViewMore ? 5 : pageSize
  );

  const onPageChange = (nextPage: number) => {
    refetchCount();
    setCurrentPage(nextPage);
  };

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    refetchCount();
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <Box mt={8}>
      <TableTitle
        title="Contract Instances"
        count={totalData ?? 0}
        helperText="This account instantiated the following contracts"
        mb={2}
      />
      <ContractsTable
        contracts={contracts}
        isLoading={isLoading}
        emptyState={
          <EmptyState
            message={
              !contracts ? (
                <ErrorFetching />
              ) : (
                "This account did not instantiate any contracts before."
              )
            }
            withBorder
          />
        }
        onRowSelect={onRowSelect}
      />
      {!!totalData &&
        (onViewMore
          ? totalData > 5 && <ViewMore onClick={onViewMore} />
          : totalData > 10 && (
              <Pagination
                currentPage={currentPage}
                pagesQuantity={pagesQuantity}
                offset={offset}
                totalData={totalData}
                scrollComponentId={scrollComponentId}
                pageSize={pageSize}
                onPageChange={onPageChange}
                onPageSizeChange={onPageSizeChange}
              />
            ))}
    </Box>
  );
};
