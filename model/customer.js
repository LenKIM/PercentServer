/**
 * Customer Model
 */
class Customer {
    constructor(customerId,
                phoneNumber,
                mainBank,
                firstTime,
                lastTime) {
        this.customerId = customerId;
        this.phoneNumber = phoneNumber;
        this.mainBank = mainBank;
        this.firstTime = firstTime;
        this.lastTime = lastTime;
    }
}

module.exports = Customer;

