// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.18;

import { UserOperationVariant } from "./UserOperationVariant.sol";

interface IAccount {
    function validateUserOp(UserOperationVariant calldata userOp) external;

    function verify(bytes calldata proof) external view returns (bool);
}
