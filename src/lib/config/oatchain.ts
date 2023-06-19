import type { Chain, AssetList } from "@chain-registry/types";

export const oatchain: Chain = {
  $schema: "../chain.schema.json",
  chain_name: "oatchain",
  status: "live",
  network_type: "testnet",
  pretty_name: "Oat Chain",
  chain_id: "oatchain",
  bech32_prefix: "osmo",
  daemon_name: "osmosisd",
  node_home: "$HOME/.osmosisd",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "uosmo",
        fixed_min_gas_price: 0,
        low_gas_price: 0.0025,
        average_gas_price: 0.025,
        high_gas_price: 0.04,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: "uosmo",
      },
    ],
  },
  codebase: {
    git_repo: "https://github.com/osmosis-labs/osmosis",
    recommended_version: "v15.0.0",
    compatible_versions: ["v15.0.0"],
    cosmos_sdk_version: "0.45",
    cosmwasm_version: "0.30",
    cosmwasm_enabled: true,
    genesis: {
      genesis_url: "https://genesis.osmotest5.osmosis.zone/genesis.json",
    },
  },
  peers: {
    seeds: [
      {
        id: "bb197876fd952d245ef6377e3651c157e3d7ed81",
        address: "157.245.26.231:26656",
        provider: "",
      },
      {
        id: "7c2b9e76be5c2142c76b429d9c29e902599ceb44",
        address: "157.245.21.183:26656",
        provider: "",
      },
    ],
    persistent_peers: [
      {
        id: "51084fccec1c309a415e89d39e6f0881c49493ed",
        address: "95.217.144.107:12556",
        provider: "",
      },
      {
        id: "a5c34bdd777dd418ff7152a8646fd2f31f53f8a5",
        address: "46.232.248.117:2000",
        provider: "",
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "https://oatchain-api.alleslabs.dev/rpc/",
      },
    ],
    rest: [
      {
        address: "https://oatchain-api.alleslabs.dev/lcd",
      },
    ],
  },
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmosis-chain-logo.png",
  },
  keywords: ["dex", "testnet"],
};

export const oatchainAsset: AssetList = {
  $schema: "../assetlist.schema.json",
  chain_name: "oatchain",
  assets: [
    {
      description: "The native token of Osmosis",
      denom_units: [
        {
          denom: "uosmo",
          exponent: 0,
          aliases: [],
        },
        {
          denom: "osmo",
          exponent: 6,
          aliases: [],
        },
      ],
      base: "uosmo",
      name: "Osmosis",
      display: "osmo",
      symbol: "OSMO",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/osmo.svg",
      },
      coingecko_id: "osmosis",
      keywords: ["dex", "staking"],
    },
    {
      denom_units: [
        {
          denom: "uion",
          exponent: 0,
        },
        {
          denom: "ion",
          exponent: 6,
        },
      ],
      base: "uion",
      name: "Ion",
      display: "ion",
      symbol: "ION",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/ion.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/osmosis/images/ion.svg",
      },
      coingecko_id: "ion",
      keywords: ["memecoin"],
    },
  ],
};
