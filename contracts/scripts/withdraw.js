const { ethers } = require("hardhat")

async function main() {
  const [worker] = await ethers.getSigners()

  const vaultAddr = process.env.VAULT_ADDR
  const usdcAddr = process.env.USDC_ADDR
  const to = process.env.TO_ADDR || worker.address
  if (!vaultAddr || !usdcAddr) throw new Error('Set VAULT_ADDR and USDC_ADDR env')

  const vault = await ethers.getContractAt('RampVault', vaultAddr)
  const amount = ethers.parseUnits('100', 18)
  const tx = await vault.withdraw(usdcAddr, amount, to)
  await tx.wait()
  console.log('Withdrawn 100 USDC to', to, 'tx', tx.hash)
}

main().catch((e) => { console.error(e); process.exit(1) })