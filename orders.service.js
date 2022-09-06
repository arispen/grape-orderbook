const orderBook = [];

function submitOrder(amount, price, side) {
    // TODO: transaction, retry/revert in case of state mismatch
    // TODO: update local orderBook before pushing to it
    orderBook.push({
        side,
        amount,
        price,
        time: Date.now()
    })
    matchOrders()
    // TODO: distribute local orderBook after matching orders
}

function matchOrders() {

}