import type { Chain, AssetList } from "@chain-registry/types";

export const neutrontestnet: Chain = {
  $schema: "../../chain.schema.json",
  chain_name: "neutrontestnet",
  chain_id: "pion-1",
  pretty_name: "Neutron Testnet",
  status: "live",
  network_type: "testnet",
  bech32_prefix: "neutron",
  daemon_name: "neutrond",
  node_home: "$HOME/.neutron",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "untrn",
        fixed_min_gas_price: 0,
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "https://rpc-palvus.pion-1.ntrn.tech:443",
      },
    ],
    rest: [
      {
        address: "https://rest-palvus.pion-1.ntrn.tech:443",
      },
    ],
  },
};

export const neutrontestnetAssets: AssetList = {
  $schema: "../../assetlist.schema.json",
  chain_name: "neutrontestnet",
  assets: [
    {
      description: "Neutron",
      denom_units: [
        {
          denom: "untrn",
          exponent: 6,
        },
      ],
      base: "untrn",
      name: "Neutron",
      display: "neutron",
      symbol: "NTRN",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/testnets/neutrontestnet/images/neutron.png",
      },
    },
  ],
};
