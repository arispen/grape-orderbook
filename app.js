'use strict'
const ordersService = require("./orders.service")
const networkingService = require("./networking.service")

async function submitOrder(amount, price, side) {
    // TODO: implement transaction here, retry/revert in case of state of orderBook mismatch
    const order = ordersService.pushOrderToOrderBook(amount, price, side)
    ordersService.matchOrders(order)
    await networkingService.distributeOrder(order)
}


async function buy(amount, price) {
    await submitOrder(amount, price, 'BUY')
}

async function sell(amount, price) {
    await submitOrder(amount, price, 'SELL')
}

module.exports = { buy, sell }