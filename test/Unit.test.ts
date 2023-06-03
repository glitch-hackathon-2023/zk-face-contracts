import { setBalance, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers"
import { solidityEncode } from "@worldcoin/idkit"
import { expect } from "chai"
import { ethers } from "hardhat"
import { deployEntryPoint, deployMockAccountFactory } from "../scripts/deploy"

describe("Unit test", function () {
  before(async function () {
    // wMATIC on Polygon Mumbai.
    this.wETH = "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889"

    this.user = (await ethers.getSigners())[0]

    // Airdrop user.
    await setBalance(this.user.address, ethers.utils.parseEther("10000"))

    // Deploy AccountFactory.
    this.mockAccountFactory = await deployMockAccountFactory(this.wETH)

    // Deploy EntryPoint.
    this.entryPoint = await deployEntryPoint(this.mockAccountFactory.address)

    // World ID proof.
    this.merkleRoot = await ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      "0x13884656763e3f95f96aac8109832ee4e10deeb9fd8d7e6ac442523a14110da8"
    )[0]
    this.nullifierHash = await ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      "0x2c75a3db70790d1363cd617033f78cc201f57d3c2141fb871510efaccd7db573"
    )[0]
    this.proof = await ethers.utils.defaultAbiCoder.decode(
      ["uint256[8]"],
      "0x1d076b755824e45cb178407167f8ead55207468e39885de75009fe382197877818d1a101ed10bb03fb6cf7dd17330f051364c8d627dbaeb99d8ee9c428b5e86c1ffc830922ca5537681ef8b9e9d3f412e2464b80e13db4c56a49e93b8616bd4c12f41871663712b3419ec397f3dbcce80f3534355fa7700551db412b1fcf2f792f7e0f5a94d649416abb50d43a5a4b869e44972e4f268b71f4e68c687c03d69d0bc70092cc56a469d6bbdb53a0b3028904e55ceb87871a4b2d20f493ad63edaf078c9752ecf444cb3e6e83b4cea82d7e3bd7630bd124be38b2738f99d11cd0ff1fb79d6d3ad1832c2b0ece7345f06fe22e47dd9af9036eeef17f38ec6bc7e992"
    )[0]
    // this.signal = solidityEncode(["address"], ["0x7730809Fde523F8A8b064787Aa32Eb0df40768fC"])

    // Take snapshot.
    this.snapshot = await takeSnapshot()
  })

  beforeEach(async function () {
    // Restore snapshot.
    await this.snapshot.restore()
  })

  describe("Swap", async function () {
    it("should succeed to verify World ID", async function () {
      expect(
        await this.entryPoint.connect(this.user).verify(this.merkleRoot,  this.nullifierHash, this.proof)
      ).not.to.be.reverted
    })

    // it("should succeed when create account and call swap function", async function () {
    //   // Create account.
    //   const userOpCreateAccount: UserOperationVariant = {
    //     sender: "0x0000000000000000000000000000000000000000",
    //     callData: "0x",
    //     commitment: "0x",
    //     proof: "0x",
    //     callGasLimit: 30_000_000,
    //   }

    //   await this.entryPoint.connect(this.user).handleOps([userOpCreateAccount])

    //   // Airdrop the new account.
    //   const userAccount = await this.mockAccountFactory.connect(this.user).getLastAccount()
    //   await setBalance(userAccount, ethers.utils.parseEther("10000"))

    //   // Call swap function.
    //   const ABI = [
    //     {
    //       inputs: [
    //         {
    //           internalType: "address",
    //           name: "router",
    //           type: "address",
    //         },
    //         {
    //           internalType: "uint256",
    //           name: "amountIn",
    //           type: "uint256",
    //         },
    //         {
    //           internalType: "uint256",
    //           name: "amountOutMin",
    //           type: "uint256",
    //         },
    //         {
    //           internalType: "address",
    //           name: "tokenIn",
    //           type: "address",
    //         },
    //         {
    //           internalType: "address",
    //           name: "tokenOut",
    //           type: "address",
    //         },
    //         {
    //           internalType: "uint24",
    //           name: "poolFee",
    //           type: "uint24",
    //         },
    //       ],
    //       name: "exactInputSingle",
    //       outputs: [
    //         {
    //           internalType: "uint256",
    //           name: "amountOut",
    //           type: "uint256",
    //         },
    //       ],
    //       stateMutability: "payable",
    //       type: "function",
    //     },
    //   ]
    //   const _interface = new ethers.utils.Interface(ABI)
    //   const callData = _interface.encodeFunctionData("exactInputSingle", [
    //     "0xE592427A0AEce92De3Edee1F18E0157C05861564",
    //     ethers.utils.parseEther("0.01"),
    //     0,
    //     "0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889", // wMATIC
    //     "0xF14f9596430931E177469715c591513308244e8F", // DAI
    //     3000,
    //   ])

    //   const userOpCallSwapFunc: UserOperationVariant = {
    //     sender: userAccount,
    //     callData: callData,
    //     commitment: "0x",
    //     proof: "0x",
    //     callGasLimit: 30_000_000,
    //   }

    //   await this.entryPoint.connect(this.user).handleOps([userOpCallSwapFunc])
    // })
  })
})
