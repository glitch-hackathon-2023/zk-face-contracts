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
      "0x17869c4684747240504086bef80c44740263839630ba6c2cb4d3e462bc96ff4f"
    )[0]
    this.nullifierHash = await ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      "0x1ca39bc0e45f8f09fd02907d374fd6b5c22f5bad4478b0ba715e842122596087"
    )[0]
    this.proof = await ethers.utils.defaultAbiCoder.decode(
      ["uint256[8]"],
      "0x118bf1ee034004ab849a66db34d6091e644de71424c2cd4935fbc77b30d0f4071a2f16c4943d88c146fc3c684dc2df6c40dd21f392a01486e03b130e0bbda0c507ddddd4106aede69e0faf3d6c95bbb36867b1ff7567fb661576cf6443222d2409bd04fe6c74eae0c10c8db4cf10d1e6ee613549943c225906f11cb147709a280dbc00261d5546b9a129ff397fbbcfa28ad994d15fa21358b5bad701798df0df2bde76b961c284981b270c15e1b8e284172b1b50a901b6be659dcd00a2b0220406b7de9d938be2e9c09f9753c412983187c40de835dfff940708e795859e7bf526fae30c8dcbbb85a63e71786384da673cc35569b354c14b3516e110fffc8d5d"
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
