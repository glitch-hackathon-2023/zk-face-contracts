import { setBalance, takeSnapshot } from "@nomicfoundation/hardhat-network-helpers"
import { expect } from "chai"
import { ethers } from "hardhat"
import { deployEntryPoint, deployMockAccountFactory } from "../scripts/deploy"

import { solidityEncode } from '@worldcoin/idkit'


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
      "0x1a8e50d7070f41529d44a62a476819f34207317930ab4cca740c6232fdce4ed6"
    )[0]
    this.nullifierHash = await ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      "0x1ca39bc0e45f8f09fd02907d374fd6b5c22f5bad4478b0ba715e842122596087"
    )[0]
    this.proof = await ethers.utils.defaultAbiCoder.decode(
      ["uint256[8]"],
      "0x0fd3e28301df0cc38fd7c5961e5dc387cb768fcaa74f2cafc171c5f53ec43e7e22c9f0f19c2f81681a48d021b63adc030995c9e76162c6383a735985cb00f6f8093deaceb1f82e96f786417df57176bfc192e249457e9c30a49db99170780ab52aed546ac321b54ea54e224c8c5b8e37c37e4e777434c809c3ac2b22a973136119437700c5e4ee9bceef5b5aaef57120859272eed04af4f6674b4f7d354e8c212b6e02a453c115e0a65ab4327bdef62adc684b48df39a91dc02ea494d75bd5cc1df0d0e0b223a9261e14a3a02b745c740c078c5c8682ee6bdbc00d5b8de436df0b6be0465a069c00c758e583ee17604cdfc84d7c41f62c718fde2ae6508fb60c"
    )[0]

    console.log(this.merkleRoot)
    console.log(this.nullifierHash)
    console.log(this.proof)

    // Take snapshot.
    this.snapshot = await takeSnapshot()
  })

  beforeEach(async function () {
    // Restore snapshot.
    await this.snapshot.restore()
  })

  describe("Swap", async function () {
    it("should succeed to verify World ID", async function () {
      expect(await this.entryPoint.connect(this.user).verify(this.merkleRoot, this.nullifierHash, this.proof)).not.to.be
        .reverted
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
