'use strict'
const { matchOrders, pushOrderToOrderBook, getOrders } = require("./orders.service")
const { distributeOrder } = require("./networking.service")

function submitOrder(amount, price, side) {
    // TODO: implement transaction here, retry/revert in case of state of orderBook mismatch
    pushOrderToOrderBook(amount, price, side)
    matchOrders()
    distributeOrder({ amount, price, side })
}


function buy(amount, price) {
    submitOrder(amount, price, 'BUY')
}

function sell(amount, price) {
    submitOrder(amount, price, 'SELL')
}

module.exports = { buy, sell }