import { createConfig } from 'wagmi'
import { http, defineChain, type Chain } from 'viem'
import { mainnet } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// 0G Galileo testnet definition
export const ogGalileo = defineChain({
  id: 16602,
  name: '0G Galileo Testnet',
  network: 'ogGalileo',
  nativeCurrency: { name: 'OG', symbol: 'OG', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://evmrpc-testnet.0g.ai'] },
    public: { http: ['https://evmrpc-testnet.0g.ai'] },
  },
  blockExplorers: {
    default: { name: '0G Explorer', url: 'https://explorer-testnet.0g.ai' },
  },
  testnet: true,
})

export const localhost = defineChain({
  id: 31337,
  name: 'Hardhat Local',
  network: 'localhost',
  nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: { http: ['http://127.0.0.1:8545'] },
    public: { http: ['http://127.0.0.1:8545'] },
  },
  testnet: true,
})

const chains = [ogGalileo, localhost, mainnet] as const satisfies readonly [Chain, ...Chain[]]

const transports = {
  [ogGalileo.id]: http(ogGalileo.rpcUrls.default.http[0]!),
  [localhost.id]: http(localhost.rpcUrls.default.http[0]!),
  [mainnet.id]: http(mainnet.rpcUrls.default.http[0]!),
} as const

export const wagmiConfig = createConfig({
  chains,
  transports,
  connectors: [injected({ shimDisconnect: true })],
})