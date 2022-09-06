'use strict'
const { buy, sell } = require("./app");
const { getOrders } = require('./orders.service')
const { bootstrapPeer } = require('./networking.service')

describe('distributed exchange', () => {
    beforeAll((done) => {
        bootstrapPeer(() => {
            done();
        })
    })
    it('should properly update orderBook after matching buy order with sell order', async () => {
        // buy 300 at price 10
        // sell 400 at price 9
        await buy(300, 10)
        await sell(400, 9)

        // remains: sell 100 at price 9
        const remainder = getOrders(o => {o.side === 'SELL' && o.price === 9})
        expect(remainder.amount).toEqual(100)
    })
})