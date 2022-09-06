'use strict'
const ordersService = require("./orders.service")
const networkingService = require("./networking.service")

function submitOrder(amount, price, side) {
    // TODO: implement transaction here, retry/revert in case of state of orderBook mismatch
    ordersService.pushOrderToOrderBook(amount, price, side)
    ordersService.matchOrders()
    networkingService.distributeOrder({ amount, price, side })
}


function buy(amount, price) {
    submitOrder(amount, price, 'BUY')
}

function sell(amount, price) {
    submitOrder(amount, price, 'SELL')
}

module.exports = { buy, sell }