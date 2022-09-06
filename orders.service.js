'use strict'
const crypto = require('node:crypto');
const orderBook = [];

function pushOrderToOrderBook(amount, price, side) {
    const hash = crypto.createHash('sha256')
        .update(amount + price + side)
        .digest('hex');
    if (orderBook.find(order => order.hash === hash)) {
        throw new Error('hash collision in order book');
    }
    orderBook.push({
        side,
        amount,
        price,
        time: Date.now(),
        hash
    })
}

function matchOrders(order) {
    // orders are pushed to order book's end
    // to implement fifo, we just iterate from the beggining

}

function getOrders(predicate) {
    return orderBook.filter(predicate);
}

module.exports = { pushOrderToOrderBook, matchOrders, getOrders }