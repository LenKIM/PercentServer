class Item {
    constructor(itemId,
                itemBank,
                itemName,
                minInterestRate,
                maxInterestRate,
                interestRateType,
                repaymentType,
                overdueInterestRate1,
                overdueInterestRate2,
                overdueInterestRate3,
                overdueTime1,
                overdueTime2,
                overdueTime3,
                earlyRepaymentFee,
                loanType
    ) {
        this.itemId = itemId;
        this.itemBank = itemBank;
        this.itemName = itemName;
        this.minInterestRate = minInterestRate;
        this.maxInterestRate = maxInterestRate;
        this.interestRateType = interestRateType;
        this.repaymentType = repaymentType;
        this.overdueInterestRate1 = overdueInterestRate1;
        this.overdueInterestRate2 = overdueInterestRate2;
        this.overdueInterestRate3 = overdueInterestRate3;
        this.overdueTime1 = overdueTime1;
        this.overdueTime2 = overdueTime2;
        this.overdueTime3 = overdueTime3;
        this.earlyRepaymentFee = earlyRepaymentFee;
        this.loanType = loanType;
    }
}


module.exports = Item;