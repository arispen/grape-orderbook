'use strict'
const { buy, sell } = require("./app");
const { getOrders } = require('./orders.service')
const { bootstrapPeer } = require('./networkingService.service')

describe('distributed exchange', () => {
    beforeAll((done) => {
        bootstrapPeer(()=>{
            done();
        })
    })
    it('should properly update orderBook after matching buy order with sell orders', () => {
        // TODO: add test
    })
})