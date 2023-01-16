import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  ModalCloseButton,
  TabList,
  Tabs,
  TabPanels,
  TabPanel,
  Heading,
  Icon,
  Box,
} from "@chakra-ui/react";
import { useWallet } from "@cosmos-kit/react";
import AceEditor from "react-ace";
import { MdCode } from "react-icons/md";

import { CopyButton } from "../CopyButton";
import { CustomTab } from "lib/components/CustomTab";
import { useEndpoint } from "lib/hooks";
import type { ContractAddr, HumanAddr } from "lib/types";

import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-sh";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";

interface CodeSnippetProps {
  isDisable?: boolean;
  contractAddress: HumanAddr | ContractAddr;
  // TODO get client: string;
  message: string;
  type: string;
}

const CodeSnippet = ({
  isDisable,
  contractAddress,
  message,
  type = "query",
}: CodeSnippetProps) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { currentChainRecord } = useWallet();
  const endpoint = useEndpoint();
  const client = currentChainRecord?.chain.daemon_name;
  const rpcUrl = currentChainRecord?.preferredEndpoints?.rpc?.[0];
  const chainId = currentChainRecord?.chain.chain_id;
  const codeSnippets = [
    {
      type: "query",
      snippets: [
        {
          name: "CLI",
          mode: "sh",
          string: `export CHAIN_ID=${chainId}\n
export CONTRACT_ADDRESS=${contractAddress}\n
export QUERY_MSG='\`${message}\`'\n
export RPC_URL=${rpcUrl}\n
${client} query wasm contract-state smart $CONTRACT_ADDRESS $QUERY_MSG 
    --chain-id $CHAIN_ID 
    --node $RPC_URL`,
        },
        {
          name: "Python",
          mode: "python",
          string: `import base64
import requests\n
CONTRACT_ADDRESS = "${contractAddress}"
LCD_URL = "${endpoint}"
QUERY_MSG = b'''${message}'''\n
query_b64encoded = base64.b64encode(QUERY_MSG).decode("ascii")
res = requests.get(
f"{LCD_URL}/cosmwasm/wasm/v1/contract/{CONTRACT_ADDRESS}/smart/{query_b64encoded}"
).json()\n
print(res)`,
        },
        {
          name: "CosmJS",
          mode: "javascript",
          string: `const {{ SigningCosmWasmClient }} = require("@cosmjs/cosmwasm-stargate");
const rpcURL = "${rpcUrl}";
const contractAddress =
  "${contractAddress}";
const queryMsg = \`${message}\`;\n
const queryContract = async (rpcURL, contractAddress, queryMsg) => {{
  const client = await SigningCosmWasmClient.connect(rpcURL);
  const queryResult = await client.queryContractSmart(
    contractAddress,
    JSON.parse(queryMsg)
  );
  console.log(queryResult);
}};\n
queryContract(rpcURL, contractAddress, queryMsg);
      `,
        },
        {
          name: "Axios",
          mode: "javascript",
          string: `const axios = require('axios');\n
const lcdURL = '${endpoint}';
const contractAddress =
  "${contractAddress}";
const queryMsg = \`${message}\`;\n
const queryContract = async () => {{
  const queryB64Encoded = Buffer.from(JSON.stringify(queryMsg)).toString('base64');
  console.log(res.data);
}};\n
queryContract();`,
        },
      ],
    },
    {
      type: "execute",
      snippets: [
        {
          name: "CLI",
          mode: "sh",
          string: `${client} keys add --recover celatone\n
export CHAIN_ID=${chainId}\n
export RPC_URL=${rpcUrl}\n
export CONTRACT_ADDRESS=${contractAddress}\n
export EXECUTE_MSG='\`${message}\`'\n
${client} tx wasm execute $CONTRACT_ADDRESS $EXECUTE_MSG \\
    --from celatone \\
    --chain-id $CHAIN_ID \\
    --node $RPC_URL"`,
        },
        {
          name: "CosmJs",
          mode: "javascript",
          string: `const { getOfflineSignerAmino, cosmwasm } = require('osmojs');
const { SigningCosmWasmClient } = require('@cosmjs/cosmwasm-stargate');
const { Dec, IntPretty } = require('@keplr-wallet/unit');
const { coins } = require('@cosmjs/amino');
const { toUtf8 } = require('@cosmjs/encoding');
const { chains } = require('chain-registry');
const { executeContract } = cosmwasm.wasm.v1.MessageComposer.withTypeUrl;\n
const chain = chains.find(({{ chain_name }}) => chain_name === 'osmosis');
const mnemonic = '<Mnemonic>';
const contractAddress = ${contractAddress}\n
const execute = async () => {{
  const signer = await getOfflineSignerAmino({{ mnemonic, chain }});
  const rpcEndpoint = '${rpcUrl}';
  const client = await SigningCosmWasmClient.connectWithSigner(rpcEndpoint, signer);
  const [sender] = await signer.getAccounts();\n
  const msg = executeContract({{
    sender: sender.address,
    contract: contractAddress,
    msg: toUtf8(JSON.stringify(JSON.parse(\`
${message}
    \`))),
    funds: [],
  }});\n
  const gasEstimated = await client.simulate(sender.address, [msg]);
  const fee = {{
    amount: coins(0, 'uosmo'),
    gas: new IntPretty(new Dec(gasEstimated).mul(new Dec(1.3)))
      .maxDecimals(0)
      .locale(false)
      .toString(),
  }};\n
  const tx = await client.signAndBroadcast(sender.address, [msg], fee);   
  console.log(tx);
}};\n
execute();`,
        },
      ],
    },
  ];

  return (
    <>
      <Button
        isDisabled={isDisable}
        variant="outline-info"
        size="sm"
        ml="auto"
        onClick={onOpen}
      >
        <Icon as={MdCode} boxSize={5} mr={1} />
        Code Snippet
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent w="840px">
          <ModalHeader>
            <Icon as={MdCode} color="text.dark" fontSize="24px" />
            <Heading as="h5" variant="h5">
              Code Snippet
            </Heading>
          </ModalHeader>
          <ModalCloseButton color="text.dark" />
          <ModalBody px={4} maxH="640px" overflow="scroll">
            <Tabs>
              <TabList borderBottom="1px solid" borderColor="divider.main">
                {codeSnippets
                  .find((each) => each.type === type)
                  ?.snippets.map((item) => (
                    <CustomTab key={`menu-${item.name}`}>{item.name}</CustomTab>
                  ))}
              </TabList>
              <TabPanels>
                {codeSnippets
                  .find((each) => each.type === type)
                  ?.snippets.map((item) => (
                    <TabPanel key={item.name} px={2} py={4}>
                      <Box
                        bgColor="gray.900"
                        p={4}
                        borderRadius={4}
                        position="relative"
                      >
                        <AceEditor
                          readOnly
                          mode={item.mode}
                          theme="monokai"
                          fontSize="14px"
                          style={{
                            width: "100%",
                            background: "transparent",
                          }}
                          value={item.string}
                          setOptions={{
                            showGutter: false,
                            useWorker: false,
                            printMargin: false,
                            wrap: true,
                          }}
                        />
                        <Box position="absolute" top={4} right={4}>
                          <CopyButton value={item.string} />
                        </Box>
                      </Box>
                    </TabPanel>
                  ))}
              </TabPanels>
            </Tabs>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CodeSnippet;
