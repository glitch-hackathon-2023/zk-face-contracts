// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.18;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { IAccount, UserOperationVariant } from "./interfaces/IAccount.sol";
import { IUniswapV3Router } from "./dependencies/IUniswapV3Router.sol";

contract Account is IAccount {
    event AccountCreated(address addr);

    address public immutable wETH;

    constructor(address _wETH) {
        wETH = _wETH;

        emit AccountCreated(address(this));
    }

    receive() external payable {}

    function validateUserOp(UserOperationVariant calldata userOp) external {}

    function verify(bytes calldata proof) external view returns (bool) {
        // TODO: Not implemented.
        return true;
    }

    function exactInputSingle(
        address router,
        uint256 amountIn,
        uint256 amountOutMin,
        address tokenIn,
        address tokenOut,
        uint24 poolFee
    ) external payable returns (uint256 amountOut) {
        if (tokenIn != wETH) {
            IERC20(tokenIn).approve(router, amountIn);
        }

        IUniswapV3Router.ExactInputSingleParams memory params = IUniswapV3Router
            .ExactInputSingleParams({
                tokenIn: tokenIn,
                tokenOut: tokenOut,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: amountOutMin,
                sqrtPriceLimitX96: 0
            });

        if (tokenIn != wETH) {
            amountOut = IUniswapV3Router(router).exactInputSingle(params);
        } else {
            amountOut = IUniswapV3Router(router).exactInputSingle{
                value: amountIn
            }(params);
        }
    }
}
