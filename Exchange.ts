import { ethers } from "hardhat"
import { expect } from "chai";

import { BigNumber } from "ethers";

import { Exchange } from "../typechain-types/contracts/Exchange"
import { Token } from "../typechain-types/contracts/Token";

const toWei = (value: number) => ethers.utils.parseEther(value.toString());

const toEther = (value : BigNumber) => ethers.utils.formatEther(value);
const getBalance = ethers.provider.getBalance;

describe("Exchange", () => {
    let owner: any;
    let user: any;
    let exchange: Exchange;
    let token: Token;
    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();

        const TokenFactory = await ethers.getContractFactory("Token");
        token = await TokenFactory.deploy("GrayToken", "GRAY", toWei(1000000));
        await token.deployed();

        const ExchangeFactory = await ethers.getContractFactory("Exchange");
        exchange = await ExchangeFactory.deploy(token.address);
        await exchange.deployed();
    });

    describe("addLiquidity", async () => {
        it ("add Liquidity", async() => {
            await token.approve(exchange.address, toWei(10000));
            await exchange.addLiquidity(toWei(1000), {value: toWei(1000)});

            expect(await getBalance(exchange.address)).to.equal(toWei(1000));
            expect(await token.balanceOf(exchange.address)).to.equal(toWei(1000));
        })
    });

    describe("getOutputAmount", async () => {
        it ("corect getOutputAmount", async() => {
            await token.approve(exchange.address, toWei(4000));
            //4:1
            await exchange.addLiquidity(toWei(4000), {value: toWei(1000)});

            //get 1ETH ??GRAY

            console.log(toEther(await exchange.getOutputAmount(toWei(1), getBalance(exchange.address), token.balanceOf(exchange.address))));
        })
    });
