const sdk = require("@defillama/sdk");
import { sumSingleBalance } from "../helper/generalUtil";
import { bridgedSupply, solanaMintedOrBridged } from "../helper/getSupply";
import {
  ChainBlocks,
  PeggedIssuanceAdapter,
  Balances,
} from "../peggedAsset.type";

type ChainContracts = {
  [chain: string]: {
    [contract: string]: string[];
  };
};

const chainContracts: ChainContracts = {
  ethereum: {
    issued: ["0x820802Fa8a99901F52e39acD21177b0BE6EE2974"],
  },
  polygon: {
    issued: ["0x820802Fa8a99901F52e39acD21177b0BE6EE2974"],
  },
  arbitrum: {
    issued: ["0xcF985abA4647a432E60efcEeB8054BBd64244305"],
  },
  avax: {
    issued: ["0x820802Fa8a99901F52e39acD21177b0BE6EE2974"],
  },
  solana: {
    issued: ["2VhjJ9WxaGC3EZFwJG9BDUs9KxKCAjQY4vgd1qxgYWVg"], 
  },
  optimism: {
    issued: ["0x820802Fa8a99901F52e39acD21177b0BE6EE2974"],
  },
};

async function chainMinted(chain: string, decimals: number) {
  return async function (
    _timestamp: number,
    _ethBlock: number,
    _chainBlocks: ChainBlocks
  ) {
    let balances = {} as Balances;
    for (let issued of chainContracts[chain].issued) {
      const totalSupply = (
        await sdk.api.abi.call({
          abi: "erc20:totalSupply",
          target: issued,
          block: _chainBlocks?.[chain],
          chain: chain,
        })
      ).output;
      sumSingleBalance(
        balances,
        "peggedEUR",
        totalSupply / 10 ** decimals,
        "issued",
        false
      );
    }
    return balances;
  };
}

const adapter: PeggedIssuanceAdapter = {
  ethereum: {
    minted: chainMinted("ethereum", 6),
    unreleased: async () => ({}),
  },
  polygon: {
    minted: chainMinted("polygon", 6),
    unreleased: async () => ({}),
  },
  arbitrum: {
    minted: chainMinted("arbitrum", 6),
    unreleased: async () => ({}),
  },
  avalanche: {
    minted: chainMinted("avax", 6),
    unreleased: async () => ({}),
  },
  solana: {
    minted: solanaMintedOrBridged(chainContracts.solana.issued, "peggedEUR"),
    unreleased: async () => ({}),
  },
  optimism: {
    minted: chainMinted("optimism", 6),
    unreleased: async () => ({}),
  },
};

export default adapter;