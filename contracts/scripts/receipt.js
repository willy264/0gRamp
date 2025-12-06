const { ethers } = require("hardhat")

async function main() {
  const registryAddr = process.env.REGISTRY_ADDR
  if (!registryAddr) throw new Error('Set REGISTRY_ADDR env')
  const registry = await ethers.getContractAt('ReceiptRegistry', registryAddr)
  const txHash = ethers.hexlify(ethers.randomBytes(32))
  const cid = `cid_${Date.now()}`
  const tx = await registry.registerReceipt(txHash, cid)
  await tx.wait()
  const stored = await registry.getReceipt(txHash)
  console.log('Stored receipt for', txHash, 'cid', stored)
}

main().catch((e) => { console.error(e); process.exit(1) })