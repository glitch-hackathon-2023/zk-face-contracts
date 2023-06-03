// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.18;

import { ByteHasher } from "./libraries/ByteHasher.sol";
import { IEntryPoint, UserOperationVariant } from "./interfaces/IEntryPoint.sol";
import { IAccount } from "./interfaces/IAccount.sol";
import { IAccountFactory } from "./interfaces/IAccountFactory.sol";
import { IWorldIDGroups } from "./interfaces/IWorldIDGroups.sol";

import "hardhat/console.sol";
contract EntryPoint is IEntryPoint {
    using ByteHasher for bytes;

    IAccountFactory public accountFactory;

    constructor(IAccountFactory _accountFactory) {
        accountFactory = _accountFactory;
    }

    function verify(
        uint256 root,
        // uint256 signalHash,
        uint256 nullifierHash,
        // uint256 externalNullifierHash,
        uint256[8] calldata proof
    ) external {
        uint256 signalHash = abi.encodePacked("my_signal").hashToField();
        uint256 externalNullifierHash = abi
            .encodePacked(abi.encodePacked("app_5bf8fcd0369d5ac0ec85529e347b5d57").hashToField(), "test_2")
            .hashToField();

        console.log(signalHash);
        console.log(externalNullifierHash);

        IWorldIDGroups(address(0x515f06B36E6D3b707eAecBdeD18d8B384944c87f))
            .verifyProof(
                root,
                1, // Or `0` if you want to check for phone verification only
                signalHash,
                nullifierHash,
                externalNullifierHash,
                proof
            );
    }

    function handleOps(UserOperationVariant[] calldata ops) external {
        for (uint256 i = 0; i < ops.length; i++) {
            UserOperationVariant calldata op = ops[i];

            address sender = op.sender;

            if (sender == address(0)) {
                sender = accountFactory.createAccount(op.commitment);
            }

            try IAccount(sender).validateUserOp(op) returns (uint256) {} catch {
                revert("EntryPoint: invalid UserOperationVariant");
            }

            require(
                IAccount(sender).verify(op.commitment, op.proof),
                "EntryPoint: invalid proof"
            );

            if (op.callData.length == 0) {
                continue;
            }

            // require(
            //     _handleOp(sender, 0, op.callData, op.callGasLimit),
            //     "EntryPoint: _handleOp failed"
            // );
        }
    }

    function _handleOp(
        address to,
        uint256 value,
        bytes memory callData,
        uint256 txGas
    ) internal returns (bool success) {
        assembly {
            success := call(
                txGas,
                to,
                value,
                add(callData, 0x20),
                mload(callData),
                0,
                0
            )
        }
    }
}
