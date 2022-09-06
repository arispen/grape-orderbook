'use strict'
const crypto = require('node:crypto');
const orderBook = [];

function pushOrderToOrderBook(amount, price, side, time, hash) {
    time = time || Date.now()
    // TODO: wiser hashing
    hash = hash || crypto.createHash('sha256')
        .update(amount + price + side + time)
        .digest('hex');
    if (orderBook.find(order => order.hash === hash)) {
        return console.warn('hash collision in order book');
    }
    const order = {
        side,
        amount,
        price,
        time,
        hash
    }
    orderBook.push(order)
    return order
}

function matchOrders(order) {
    // orders are pushed to orderbook's tail
    // to implement FIFO, we just look up from the beggining
    let match;

    if (order.side === 'BUY') {
        // if BUY, find first SELL with price <= order.price
        match = orderBook.find(o => { o.side === 'SELL' && o.price <= order.price })
        if (!match) {
            return
        }
        //  if SELL amount > BUY amount, push SELL-BUY to order book at order.price
        if (match.amount > order.amount) {
            pushOrderToOrderBook(match.amount - order.amount, match.price, 'SELL')
            removeOrder(order.hash)
        } else if (match.amount < order.amount) {
            pushOrderToOrderBook(order.amount - match.amount, order.price, 'BUY')
            removeOrder(match.hash)
        } else {
            removeOrder(order.hash)
            removeOrder(match.hash)
        }
        
    } else if (order.side === 'SELL') {
        // if SELL, find first BUY with price >= order.price
        match = orderBook.find(o => { o.side === 'BUY' && o.price >= order.price})
        if (!match) {
            return
        }
        // if BUY amount > SELL amount, push BUY-SELL to order book at order.price
        if (match.amount > order.amount) {
            pushOrderToOrderBook(match.amount - order.amount, match.price, 'BUY')
            removeOrder(order.hash)
        } else if (match.amount < order.amount) {
            pushOrderToOrderBook(order.amount - match.amount, order.price, 'SELL')
            removeOrder(match.hash)
        } else {
            removeOrder(order.hash)
            removeOrder(match.hash)
        }
    } else {
        throw new Error('invalid order side')
    }
}

function getOrders(predicate) {
    return orderBook.filter(predicate);
}

function removeOrder(hash) {
    // TODO: use lodash or rewrite this completely
    orderBook = orderBook.filter(o => o.hash !== hash)
}

module.exports = { pushOrderToOrderBook, matchOrders, getOrders }