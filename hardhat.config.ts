import "@nomicfoundation/hardhat-chai-matchers"
import "@nomiclabs/hardhat-ethers"
import "@nomiclabs/hardhat-etherscan"
import "@typechain/hardhat"
import * as dotenv from "dotenv"
import "hardhat-change-network"
import { HardhatUserConfig } from "hardhat/config"

dotenv.config()

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  paths: {
    sources: "./contracts",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      blockGasLimit: 30_000_000,
      forking: {
        url: "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78",
        enabled: true,
        blockNumber: 35825300,
      },
    },
    localhost: {
      url: "http://127.0.0.1:8545/",
    },
    polygonMumbai: {
      url: "https://polygon-mumbai.infura.io/v3/4458cf4d1689497b9a38b1d6bbf05e78",
      chainId: 80001,
      accounts: [`0x${process.env.MAINNET_PRIVATE_KEY}`],
    },
  },
  etherscan: {
    apiKey: {
      polygonMumbai: `${process.env.POLYGON_SCAN_API_KEY}`,
    },
  },
}

export default config
