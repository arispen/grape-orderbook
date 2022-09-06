'use strict'
const orderBook = [];

function pushOrderToOrderBook(amount, price, side) {
    orderBook.push({
        side,
        amount,
        price,
        time: Date.now()
    })
}

function matchOrders() {

}

function getOrders(predicate) {
    return orderBook.find(predicate);
}

module.exports = { pushOrderToOrderBook, matchOrders, getOrders }