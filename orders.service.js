'use strict'
const crypto = require('node:crypto');
const orderBook = [];

function pushOrderToOrderBook(amount, price, side) {
    // TODO: probably adding userId would make more sense here
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
    // to implement FIFO, we just look up from the beggining
    let match;

    if (order.side === 'BUY') {
        // if BUY, find first SELL with price <= order.price
        match = orderBook.find(o => { o.side === 'SELL' && o.price <= order.price })
        //  if SELL amount > BUY amount, push SELL-BUY to order book at order.price
        const remainder = match.amount - order.amount;
        if (remainder > 0) {
            pushOrderToOrderBook(remainder, match.price, 'SELL')
        }

    } else if (order.side === 'SELL') {
        // if SELL, find first BUY with price >= order.price
        match = orderBook.find(o => { o.side === 'BUY' && o.price >= order.price})
        // if BUY amount > SELL amount, push BUY-SELL to order book at order.price
        const remainder = match.amount - order.amount;
        if (remainder > 0) {
            pushOrderToOrderBook(remainder, match.price, 'BUY')
        }
    } else {
        throw new Error('invalid order side')
    }

    // remove match from the list
    // TODO: use at least lodash
    if (match) {
        orderBook = orderBook.filter(o => o.hash !== match.hash)
    }
}

function getOrders(predicate) {
    return orderBook.filter(predicate);
}

module.exports = { pushOrderToOrderBook, matchOrders, getOrders }