/**
 * Apartment Model
 */
class Apt {
    constructor(aptId,
                region1,
                region2,
                region3,
                aptName,
                registerTime,
                aptSizeSupply,
                aptSizeExclusive,
                aptPrice,
                aptKBId) {
        this.aptId = aptId;
        this.region1 = region1;
        this.region2 = region2;
        this.region3 = region3;
        this.aptName = aptName;
        this.registerTime = registerTime;
        this.aptSizeSupply = aptSizeSupply;
        this.aptSizeExclusive = aptSizeExclusive;
        this.aptPrice = aptPrice;
        this.aptKBId = aptKBId;
    }
}

module.exports = Apt;