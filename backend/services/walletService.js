const ethers = require('ethers')

const ERC20_ABI = [
  'function transfer(address to, uint256 value) returns (bool)'
]

const VAULT_ABI = [
  'function withdraw(address token, uint256 amount, address to) external'
]

function mockTxHash() {
  const rand = Math.random().toString(16).slice(2)
  return `0x${rand.padEnd(64, '0')}`
}

exports.transferStablecoin = async (toWallet, amountUSDC) => {
  const rpcUrl = process.env.OG_RPC_URL
  const privateKey = process.env.OPERATOR_PRIVATE_KEY
  const usdcAddress = process.env.USDC_ADDRESS
  const decimals = Number(process.env.USDC_DECIMALS || 6)
  const vaultAddress = process.env.RAMP_VAULT_ADDRESS

  if (!rpcUrl || !privateKey || !usdcAddress) {
    console.warn('[walletService] Missing OG_RPC_URL/OPERATOR_PRIVATE_KEY/USDC_ADDRESS; using mock tx hash')
    return mockTxHash()
  }

  const provider = new ethers.JsonRpcProvider(rpcUrl)
  const signer = new ethers.Wallet(privateKey, provider)

  const amount = ethers.parseUnits(String(amountUSDC), decimals)

  let tx
  if (vaultAddress) {
    const vault = new ethers.Contract(vaultAddress, VAULT_ABI, signer)
    tx = await vault.withdraw(usdcAddress, amount, toWallet)
  } else {
    const token = new ethers.Contract(usdcAddress, ERC20_ABI, signer)
    tx = await token.transfer(toWallet, amount)
  }

  const receipt = await tx.wait()
  return receipt?.hash || tx?.hash
}