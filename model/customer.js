/**
 * Customer Model
 */
class Customer {
    constructor(customerId,
                phoneNumber,
                mainBank,
                firstTime,
                lastTime,
                fcmToken) {
        this.customerId = customerId;
        this.phoneNumber = phoneNumber;
        this.mainBank = mainBank;
        this.firstTime = firstTime;
        this.lastTime = lastTime;
        this.fcmToken = fcmToken;
    }
}

module.exports = Customer;

