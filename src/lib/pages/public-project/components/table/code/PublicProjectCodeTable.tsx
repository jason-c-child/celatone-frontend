import { TableContainer, Grid, Box } from "@chakra-ui/react";
import { matchSorter } from "match-sorter";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";

import { TextInput } from "lib/components/forms";
import { EmptyState } from "lib/components/state";
import { TableHeader, TableTitle, ViewMore } from "lib/components/table";
import { useCodeStore } from "lib/providers/store";
import type { Option, PublicCode, CodeInfo } from "lib/types";

import { PublicProjectCodeRow } from "./PublicProjectCodeRow";

export interface PublicCodeInfo {
  localInfo: CodeInfo;
  publicInfo: PublicCode;
}

interface PublicProjectCodeTableProps {
  codes: PublicCode[];
  onViewMore?: () => void;
}

const TEMPLATE_COLUMNS =
  "max(100px) minmax(250px, 1fr) minmax(200px, 1fr) max(100px) max(160px) 150px 180px";

const CodeTableHeader = () => (
  <Grid templateColumns={TEMPLATE_COLUMNS} minW="min-content">
    <TableHeader>Code ID</TableHeader>
    <TableHeader>Code Name</TableHeader>
    <TableHeader>CW2 Info</TableHeader>
    <TableHeader textAlign="center">Contracts</TableHeader>
    <TableHeader>Uploader</TableHeader>
    <TableHeader>Permission</TableHeader>
    <TableHeader />
  </Grid>
);

export const PublicProjectCodeTable = observer(
  ({ codes = [], onViewMore }: PublicProjectCodeTableProps) => {
    const [searchKeyword, setSearchKeyword] = useState("");
    const { getCodeLocalInfo, isCodeIdSaved } = useCodeStore();

    const filteredCodes = useMemo(() => {
      return onViewMore
        ? codes.slice(0, 5)
        : matchSorter(codes, searchKeyword, {
            keys: ["name", "id"],
            threshold: matchSorter.rankings.CONTAINS,
          });
    }, [codes, onViewMore, searchKeyword]);

    const publicCodes: Option<PublicCodeInfo[]> = filteredCodes?.map(
      (code) => ({
        localInfo: {
          contractCount: code.contractCount,
          instantiatePermission: code.instantiatePermission,
          permissionAddresses: code.permissionAddresses,
          id: code.id,
          uploader: code.uploader,
          cw2Contract: code.cw2Contract,
          cw2Version: code.cw2Version,
          isSaved: isCodeIdSaved(code.id),
          ...getCodeLocalInfo(code.id),
        },
        publicInfo: {
          ...code,
        },
      })
    );

    return (
      <Box mt={12} mb={4}>
        <TableTitle title="Codes" count={codes.length} />
        {!onViewMore && (
          <TextInput
            variant="floating"
            value={searchKeyword}
            setInputState={setSearchKeyword}
            placeholder="Search with Code ID or Code Name"
            size="lg"
            mb={6}
          />
        )}
        {!publicCodes.length ? (
          <EmptyState
            message="There is currently no code related to this project."
            imageVariant={onViewMore && "empty"}
            withBorder
          />
        ) : (
          <>
            <TableContainer>
              <CodeTableHeader />
              {publicCodes.map((code) => (
                <PublicProjectCodeRow
                  key={code.publicInfo.id}
                  publicCodeInfo={code}
                  templateColumns={TEMPLATE_COLUMNS}
                />
              ))}
            </TableContainer>
            {codes.length > 5 && onViewMore && (
              <ViewMore onClick={onViewMore} />
            )}
          </>
        )}
      </Box>
    );
  }
);
