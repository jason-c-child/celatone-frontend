import type { BigSource, Big } from "big.js";
import big from "big.js";

import type {
  AssetInfo,
  Balance,
  BalanceWithAssetInfo,
  Option,
  Token,
  TokenWithValue,
  U,
  USD,
} from "lib/types";

import { toToken } from "./formatter";

export const calculateAssetValue = (
  amount: Token<BigSource>,
  price: USD<number>
): USD<Big> => big(amount).mul(price) as USD<Big>;

export const calAssetValueWithPrecision = (balance: Balance): USD<Big> => {
  if (balance.price) {
    return calculateAssetValue(
      toToken(balance.amount as U<Token>, balance.precision),
      balance.price as USD<number>
    );
  }
  return big(0) as USD<Big>;
};

export const calTotalValue = (assets: BalanceWithAssetInfo[]): USD<Big> =>
  assets.reduce(
    (acc: USD<Big>, curr: BalanceWithAssetInfo) =>
      acc.add(calAssetValueWithPrecision(curr.balance)) as USD<Big>,
    big(0) as USD<Big>
  );

export const coinToTokenWithValue = (
  denom: string,
  amount: string,
  assetInfo: Option<AssetInfo>
): TokenWithValue => {
  const tokenAmount = big(amount) as U<Token<Big>>;
  return {
    denom,
    amount: tokenAmount,
    symbol: assetInfo?.symbol,
    logo: assetInfo?.logo,
    precision: assetInfo?.precision,
    value: assetInfo
      ? calculateAssetValue(
          toToken(tokenAmount, assetInfo.precision),
          assetInfo.price as USD<number>
        )
      : undefined,
  };
};

export const addTokenWithValue = (
  oldTotal: Option<TokenWithValue>,
  token: TokenWithValue
): TokenWithValue =>
  !oldTotal
    ? token
    : {
        ...oldTotal,
        amount: oldTotal.amount.add(token.amount) as U<Token<Big>>,
        value: oldTotal.value?.add(token.value ?? 0) as USD<Big>,
      };
