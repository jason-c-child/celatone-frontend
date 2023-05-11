import type { Chain, AssetList } from "@chain-registry/types";

export const beebchain: Chain = {
  $schema: "../../chain.schema.json",
  chain_name: "beebchain",
  status: "live",
  network_type: "localnet",
  pretty_name: "BeebChain",
  chain_id: "beebchain",
  bech32_prefix: "osmo",
  daemon_name: "osmosisd",
  node_home: "$HOME/.osmosisd",
  slip44: 118,
  fees: {
    fee_tokens: [
      {
        denom: "stake",
        fixed_min_gas_price: 0,
        low_gas_price: 0.15,
        average_gas_price: 0.15,
        high_gas_price: 0.15,
      },
    ],
  },
  staking: {
    staking_tokens: [
      {
        denom: "stake",
      },
    ],
  },
  apis: {
    rpc: [
      {
        address: "https://beebchain-api.alleslabs.dev/rpc/",
      },
    ],
    rest: [
      {
        address: "https://beebchain-api.alleslabs.dev/lcd/",
      },
    ],
    grpc: [],
  },
  keywords: ["testnet"],
};

export const beebchainAssets: AssetList = {
  $schema: "../../assetlist.schema.json",
  chain_name: "beebchain",
  assets: [
    {
      description: "The native token of Beeb",
      denom_units: [
        {
          denom: "stake",
          exponent: 0,
          aliases: [],
        },
      ],
      base: "stake",
      name: "Stake",
      display: "stake",
      symbol: "STAKE",
    },
  ],
};
