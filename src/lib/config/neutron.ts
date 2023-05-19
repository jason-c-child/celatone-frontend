import type { Chain, AssetList } from "@chain-registry/types";

export const neutron: Chain = {
  $schema: "../../chain.schema.json",
  chain_name: "neutron",
  status: "live",
  network_type: "mainnet",
  pretty_name: "Neutron",
  chain_id: "neutron-1",
  bech32_prefix: "neutron",
  daemon_name: "neutrond",
  node_home: "$HOME/.neutrond",
  key_algos: ["secp256k1"],
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "untrn",
        low_gas_price: 0.01,
        average_gas_price: 0.025,
        high_gas_price: 0.05,
      },
    ],
  },
  codebase: {
    git_repo: "https://github.com/neutron-org/neutron",
    recommended_version: "v1.0.1",
    compatible_versions: [],
    cosmos_sdk_version: "0.45",
    cosmwasm_version: "0.31",
    cosmwasm_enabled: true,
    ibc_go_version: "4.3.0",
    genesis: {
      genesis_url:
        "https://raw.githubusercontent.com/neutron-org/mainnet-assets/main/neutron-1-genesis.json",
    },
  },
  logo_URIs: {
    png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-black-logo.png",
    svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron-black-logo.svg",
  },
  peers: {
    seeds: [
      {
        id: "24f609fb5946ca3a979f40b7f54132c00104433e",
        address: "p2p-erheim.neutron-1.neutron.org:26656",
        provider: "Neutron",
      },
      {
        id: "b1c6fa570a184c56d0d736d260b8065d887e717c",
        address: "p2p-kralum.neutron-1.neutron.org:26656",
        provider: "Neutron",
      },
      {
        id: "20e1000e88125698264454a884812746c2eb4807",
        address: "seeds.lavenderfive.com:19156",
        provider: "Lavender.Five Nodes 🐝",
      },
    ],
    persistent_peers: [
      {
        id: "e5d2743d9a3de514e4f7b9461bf3f0c1500c58d9",
        address: "neutron.peer.stakewith.us:39956",
        provider: "StakeWithUs",
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "https://rpc-kralum.neutron-1.neutron.org",
        provider: "Neutron",
      },
    ],
    rest: [
      {
        address: "https://rest-kralum.neutron-1.neutron.org",
        provider: "Neutron",
      },
    ],
    grpc: [
      {
        address: "grpc-kralum.neutron-1.neutron.org:80",
        provider: "Neutron",
      },
    ],
  },
};

export const neutronAssets: AssetList = {
  $schema: "../../assetlist.schema.json",
  chain_name: "neutron",
  assets: [
    {
      description: "The native token of Neutron chain.",
      denom_units: [
        {
          denom: "untrn",
          exponent: 0,
        },
        {
          denom: "ntrn",
          exponent: 6,
        },
      ],
      base: "untrn",
      name: "Neutron",
      display: "ntrn",
      symbol: "NTRN",
      logo_URIs: {
        png: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron.png",
        svg: "https://raw.githubusercontent.com/cosmos/chain-registry/master/neutron/images/neutron.svg",
      },
    },
  ],
};
