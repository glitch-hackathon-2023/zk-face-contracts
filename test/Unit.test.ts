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
      "0x06c497bc6ecb60d064b612d1a59eaaefc253f9bef904c8d6f5c1f46640d3a4c7"
    )[0]
    this.nullifierHash = await ethers.utils.defaultAbiCoder.decode(
      ["uint256"],
      "0x0ee07808f36969982d25288cef01767c9eebd1d019a1c3a3ad200c5b5e55cae8"
    )[0]
    this.proof = await ethers.utils.defaultAbiCoder.decode(
      ["uint256[8]"],
      "0x1ea1a378a9e0c6d610bb28c3d22f208082215932b3863b3f075cf33fcda7a23929902c22bc1e57f21e3f132488828786f1c2770095807a5511ce678e47e6adbb2636aad6a44fc4a24b45981313ed9298b709f082a391999675ebaf074b5b386b2fd2bb2953d4dce4a8a18e75ccc27ff5909f5671da2273a97bffc1f105b25b42099381e8191568b5cc1095e2f50ad322cb63deb9ae8930b9e39b48ee170485702f5913e5236fc2cdad7c121394ccae47afab8dd1ac7ac74888a5143f0da26c600f6507ac650a8af6c9db11c999c11f9064d023159dfcbcb2729257c7756096fb2eeecd0524953cb12f171c47583e5e0f844b7839415fb8ccd2d144c69b77f842"
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
