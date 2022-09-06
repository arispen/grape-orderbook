'use strict'
const { buy, sell } = require("./app");
const { getOrders } = require('./orders.service')
const { bootstrapPeer } = require('./networkingService.service')

describe('distributed exchange', () => {
    beforeAll((done) => {
        bootstrapPeer(() => {
            done();
        })
    })
    it('should properly update orderBook after matching buy order with sell order', () => {
        // TODO: add test
        // buy 300 at price 10
        // sell 400 at price 9
        // remains: sell 100 at price 9
    })
})