const { ethers } = require("hardhat")
const fs = require('fs')
const path = require('path')
const hre = require('hardhat')

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log("Deploying with:", deployer.address)

  const Admin = await ethers.getContractFactory("RampAdmin")
  const admin = await Admin.deploy(deployer.address, 50) // 0.5% fee
  await admin.waitForDeployment()
  const adminAddr = await admin.getAddress()
  console.log("RampAdmin:", adminAddr)

  const Vault = await ethers.getContractFactory("RampVault")
  const vault = await Vault.deploy(deployer.address)
  await vault.waitForDeployment()
  const vaultAddr = await vault.getAddress()
  console.log("RampVault:", vaultAddr)

  const Registry = await ethers.getContractFactory("ReceiptRegistry")
  const registry = await Registry.deploy()
  await registry.waitForDeployment()
  const registryAddr = await registry.getAddress()
  console.log("ReceiptRegistry:", registryAddr)

  const USDC = await ethers.getContractFactory("MockUSDC")
  const usdc = await USDC.deploy()
  await usdc.waitForDeployment()
  const usdcAddr = await usdc.getAddress()
  console.log("MockUSDC:", usdcAddr)

  // Write addresses to deployments/<network>.json
  const outDir = path.join(__dirname, '..', 'deployments')
  fs.mkdirSync(outDir, { recursive: true })
  const networkName = hre.network.name
  const outfile = path.join(outDir, `${networkName}.json`)
  const addresses = {
    RampAdmin: adminAddr,
    RampVault: vaultAddr,
    ReceiptRegistry: registryAddr,
    MockUSDC: usdcAddr,
  }
  fs.writeFileSync(outfile, JSON.stringify(addresses, null, 2))
  console.log('Saved deployment addresses to', outfile)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})