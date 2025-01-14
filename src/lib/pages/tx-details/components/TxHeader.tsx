import type { FlexProps } from "@chakra-ui/react";
import { Button, Box, Flex, Heading, Text } from "@chakra-ui/react";

import { CopyLink } from "lib/components/CopyLink";
import { CustomIcon } from "lib/components/icon";
import { useOpenTxTab } from "lib/hooks";
import { AmpTrackViewJson } from "lib/services/amplitude";
import type { TxData } from "lib/services/txService";
import { dateFromNow, formatUTC } from "lib/utils";

interface TxHeaderProps extends FlexProps {
  txData: TxData;
}

const DotSeparator = () => (
  <Box bg="secondary.darker" borderRadius="50%" w={1} h={1} />
);

export const TxHeader = ({ txData, ...flexProps }: TxHeaderProps) => {
  const openLcdTab = useOpenTxTab("lcd");
  return (
    <Flex direction="column" gap={2} {...flexProps}>
      <Flex justify="space-between" align="center">
        <Heading as="h5" variant="h5">
          Transaction Details
        </Heading>
        <Button
          variant="ghost-gray"
          padding={2}
          rightIcon={<CustomIcon name="launch" boxSize={3} color="text.dark" />}
          onClick={() => {
            AmpTrackViewJson("tx_page_transaction_hash");
            openLcdTab(txData.txhash);
          }}
        >
          View in JSON
        </Button>
      </Flex>
      <Flex direction="column" gap={1}>
        <Flex gap={2} fontSize="14px" w="full">
          <Text variant="body2" fontWeight={500} color="text.dark">
            Transaction Hash:
          </Text>
          <CopyLink
            value={txData.txhash}
            amptrackSection="tx_header"
            type="tx_hash"
          />
        </Flex>
        <Flex gap={2} fontSize="14px" color="text.dark" align="center">
          <Flex
            align="center"
            gap={1}
            color={txData.isTxFailed ? "error.main" : "success.main"}
          >
            {txData.isTxFailed ? (
              <>
                <CustomIcon
                  name="close-circle-solid"
                  boxSize={3}
                  m={0}
                  color="error.main"
                />
                <p>Failed</p>
              </>
            ) : (
              <>
                <CustomIcon
                  name="check-circle-solid"
                  boxSize={3}
                  m={0}
                  color="success.main"
                />
                <p>Success</p>
              </>
            )}
          </Flex>
          <DotSeparator />
          {txData.timestamp ? (
            <>
              <p>{dateFromNow(txData.timestamp)}</p>
              <DotSeparator />
              <p>{formatUTC(txData.timestamp)}</p>
            </>
          ) : (
            <p>N/A</p>
          )}
        </Flex>
      </Flex>
    </Flex>
  );
};
