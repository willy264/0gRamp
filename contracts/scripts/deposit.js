const { ethers } = require("hardhat")

async function main() {
  const [signer] = await ethers.getSigners()

  const vaultAddr = process.env.VAULT_ADDR
  const usdcAddr = process.env.USDC_ADDR
  if (!vaultAddr || !usdcAddr) throw new Error('Set VAULT_ADDR and USDC_ADDR env')

  const usdc = await ethers.getContractAt('MockUSDC', usdcAddr)
  const vault = await ethers.getContractAt('RampVault', vaultAddr)

  const amount = ethers.parseUnits('1000', 18)
  await (await usdc.approve(vaultAddr, amount)).wait()
  const tx = await vault.deposit(usdcAddr, amount)
  await tx.wait()
  console.log('Deposited 1000 USDC, tx:', tx.hash)
}

main().catch((e) => { console.error(e); process.exit(1) })