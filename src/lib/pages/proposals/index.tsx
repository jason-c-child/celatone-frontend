import { Flex, Heading, Text, Switch, Tooltip } from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import { useRouter } from "next/router";
import type { ChangeEvent } from "react";
import { useState, useEffect } from "react";

import { useChainId } from "lib/app-provider";
import { NewProposalButton } from "lib/components/button/NewProposalButton";
import InputWithIcon from "lib/components/InputWithIcon";
import PageContainer from "lib/components/PageContainer";
import { Pagination } from "lib/components/pagination";
import { usePaginator } from "lib/components/pagination/usePaginator";
import { AmpEvent, AmpTrack } from "lib/services/amplitude";
import {
  useProposalList,
  useProposalListCount,
} from "lib/services/proposalService";
import type { ProposalStatus, ProposalType, Addr, Option } from "lib/types";

import { ProposalStatusFilter } from "./components/ProposalStatusFilter";
import { ProposalTypeFilter } from "./components/ProposalTypeFilter";
import { ProposalTable } from "./table/ProposalTable";

const Proposals = () => {
  const chainId = useChainId();
  const router = useRouter();
  const [statuses, setStatuses] = useState<ProposalStatus[]>([]);
  const [types, setTypes] = useState<ProposalType[]>([]);

  const { address } = useWallet();
  const [search, setSearch] = useState("");
  const [proposer, setProposer] = useState<Option<Addr>>();
  const [isSelected, setIsSelected] = useState(false);

  const { data: countProposals = 0 } = useProposalListCount(
    statuses,
    types,
    search,
    proposer
  );
  const {
    pagesQuantity,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    offset,
  } = usePaginator({
    total: countProposals,
    initialState: {
      pageSize: 10,
      currentPage: 1,
      isDisabled: false,
    },
  });
  const { data: proposals, isLoading } = useProposalList(
    offset,
    pageSize,
    statuses,
    types,
    search,
    proposer
  );

  useEffect(() => {
    if (router.isReady) AmpTrack(AmpEvent.TO_PROPOSALS);
  }, [router.isReady]);

  useEffect(() => {
    setPageSize(10);
    setCurrentPage(1);
  }, [chainId, setCurrentPage, setPageSize]);

  useEffect(() => {
    setIsSelected(false);
    setProposer(undefined);
  }, [chainId, address]);

  const onPageChange = (nextPage: number) => setCurrentPage(nextPage);

  const onPageSizeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const size = Number(e.target.value);
    setPageSize(size);
    setCurrentPage(1);
  };

  return (
    <PageContainer>
      <Flex justify="space-between">
        <Heading as="h5" variant="h5">
          Proposals
        </Heading>
        <NewProposalButton />
      </Flex>
      <Flex direction="column" my={8} gap={8}>
        <Flex justify="space-between" align="center">
          <InputWithIcon
            placeholder="Search with Proposal ID or Proposal Title"
            onChange={(e) => setSearch(e.target.value)}
            size="lg"
            value={search}
          />
          <Tooltip
            isDisabled={!!address}
            hasArrow
            label="You need to connect your wallet to see your proposals"
            placement="top"
            bg="honeydew.darker"
            maxW="240px"
            whiteSpace="pre-line"
            textAlign="center"
          >
            <div>
              <Switch
                alignItems="center"
                justifyContent="center"
                h="fit-content"
                minW="200px"
                display="flex"
                size="md"
                isChecked={isSelected}
                disabled={!address}
                onChange={(e) => {
                  if (e.target.checked && address) {
                    setProposer(address as Addr);
                  } else {
                    setProposer(undefined);
                  }
                  setIsSelected(e.target.checked);
                }}
              >
                <Text cursor={address ? "pointer" : "default"}>
                  My Proposals
                </Text>
              </Switch>
            </div>
          </Tooltip>
        </Flex>
        <Flex gap={2} pb={3}>
          <ProposalStatusFilter
            label="Filter by Status"
            result={statuses}
            setResult={setStatuses}
            placeholder="All Status"
          />
          <ProposalTypeFilter
            label="Filter by Type"
            result={types}
            setResult={setTypes}
            placeholder="All Type"
          />
        </Flex>
      </Flex>
      <ProposalTable proposals={proposals} isLoading={isLoading} />
      {countProposals > 10 && (
        <Pagination
          currentPage={currentPage}
          pagesQuantity={pagesQuantity}
          offset={offset}
          totalData={countProposals}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </PageContainer>
  );
};

export default Proposals;