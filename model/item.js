class Item {
    constructor(itemId,
                itemBank,
                itemName,
                interestRate,
                interestRateType,
                overdueInterestRate01,
                overdueInterestRate02,
                overdueInterestRate03,
                overdueTime01,
                overdueTime02,
                overdueTime03,
                earlyRepaymentFee) {
        this.itemId = itemId;
        //agent_id 외래키로 존재한다.
        this.itemBank = itemBank;
        this.itemName = itemName;
        this.interestRate = interestRate;
        this.interestRateType = interestRateType;
        this.overdueInterestRate01 = overdueInterestRate01;
        this.overdueInterestRate02 = overdueInterestRate02;
        this.overdueInterestRate03 = overdueInterestRate03;
        this.overdueTime01 = overdueTime01;
        this.overdueTime02 = overdueTime02;
        this.overdueTime03 = overdueTime03;
        this.earlyRepaymentFee = earlyRepaymentFee;
    }

}


module.exports = Item;