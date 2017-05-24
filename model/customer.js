class Customer {
    constructor(customerId,
                mainBank,
                firstTime,
                lastTime) {
        this.customerId = customerId;
        this.mainBank = mainBank;
        this.firstTime = firstTime;
        this.lastTime = lastTime;
    }
}

module.exports = Customer;

