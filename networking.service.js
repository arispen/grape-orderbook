'use strict'
const { PeerRPCServer } = require('grenache-nodejs-http')
const { PeerRPCClient } = require('grenache-nodejs-http')
const Link = require('grenache-nodejs-link')
const ordersService = require('./orders.service')

const link = new Link({
    grape: 'http://127.0.0.1:30001'
})


function bootstrapPeer(callback) {
    link.start()

    const peerRPCServer = new PeerRPCServer(link, {
        timeout: 300000
    })
    peerRPCServer.init()

    const port = 1024 + Math.floor(Math.random() * 1000)
    const service = peerRPCServer.transport('server')
    service.listen(port)

    setInterval(function () {
        link.announce('rpc_test', service.port, {})
    }, 1000)

    service.on('request', (rid, key, payload, handler) => {
        console.log(payload) //  { msg: {amount, price, side} }
        ordersService.pushOrderToOrderBook({ ...payload.msg })
        handler.reply(null, { msg: 'ok' })
    })

    // FIXME: spawning client can cause nondeterministic
    //  'Error: ERR_REQUEST_GENERIC: connect ECONNREFUSED'
    setTimeout(() => {
        const peerRPCClient = new PeerRPCClient(link, {})
        peerRPCClient.init()
        callback()
    }, 1500)
}


function distributeOrder(order) {
    return new Promise((resolve, reject) => {
        peerRPCClient.request('rpc_test', { msg: order }, { timeout: 10000 }, (err, data) => {
            if (err) {
                console.error(err)
                reject(err);
                process.exit(-1)
            }
            console.log(data) // { msg: 'ok' }
            resolve(data);
        })
    });

}

module.exports = { distributeOrder, bootstrapPeer }