import { appendFile, writeFile } from "fs/promises";
import { BlockExplorer, NativeToken } from "../types/handler";
import { generateChainData } from "../lib/chainlist/utils/fetch";

/**
 * This produces dynamic types and constants for:
 * - CHAINS_IDS
 * - NETWORKS
 * - NETWORK_FAUCETS
 * - NETWORK_EXPLORERS
 * - NETWORK_CURRENCIES
 * - EXTRA_RPCS
 */

export async function createDynamicTypes() {
  const data = await generateChainData();
  const idToNetwork: Record<string, string> = {};
  const networkToId: Record<string, number> = {};
  const idToRpc: Record<string, string[]> = {};
  const idToFaucet: Record<string, string[]> = {};
  const idToExplorers = {} as Record<string, BlockExplorer[]>;
  const idToNativeCurrency: Record<string, NativeToken> = {};
  const extraRpcs: Record<string, string[]> = {};

  for (const chain of data) {
    let { name, chainId, networkId, rpc, faucets, explorers, nativeCurrency } = chain;
    name = name.toLowerCase().replace(/\s/g, "-");
    idToNetwork[chainId] = name;
    networkToId[name] = networkId;
    idToRpc[chainId] = rpc;
    idToFaucet[chainId] = faucets;

    if (explorers && explorers.length > 0) {
      idToExplorers[chainId] = explorers;
    }

    if (rpc && rpc.length > 0) {
      extraRpcs[chainId] = rpc;
    }

    idToNativeCurrency[chainId] = nativeCurrency;
  }

  const filename = "types/dynamic.ts";

  // Clear the file
  await writeFile(filename, "/* eslint-disable sonarjs/no-duplicate-string */\n\n");

  appendFile(filename, `\nexport const CHAINS_IDS = ${JSON.stringify(idToNetwork, null, 2)} as const;\n`);
  appendFile(filename, `\nexport const NETWORKS = ${JSON.stringify(networkToId, null, 2)} as const;\n`);
  appendFile(filename, `\nexport const NETWORK_FAUCETS = ${JSON.stringify(idToFaucet, null, 2)};\n`);
  appendFile(filename, `\nexport const NETWORK_EXPLORERS = ${JSON.stringify(idToExplorers, null, 2)};\n`);
  appendFile(filename, `\nexport const NETWORK_CURRENCIES = ${JSON.stringify(idToNativeCurrency, null, 2)};\n`);
  appendFile(filename, `\nexport const EXTRA_RPCS = ${JSON.stringify(extraRpcs, null, 2)};\n`);
}
