class Estimate {
    constructor(estimateId,
                requestId,
                agentId,
                registerTime,
                itemBank,
                itemName,
                interestRate,
                interestRateType,
                repaymentType,
                overdueInterestRate1,
                overdueInterestRate2,
                overdueInterestRate3,
                overdueTime1,
                overdueTime2,
                overdueTime3,
                earlyRepaymentFee) {
        this.estimateId = estimateId;
        this.requestId = requestId;
        this.agentId = agentId;
        this.registerTime = registerTime;
        this.itemBank = itemBank;
        this.itemName = itemName;
        this.interestRate = interestRate;
        this.interestRateType = interestRateType;
        this.repaymentType = repaymentType;
        this.overdueInterestRate1 = overdueInterestRate1;
        this.overdueInterestRate2 = overdueInterestRate2;
        this.overdueInterestRate3 = overdueInterestRate3;
        this.overdueTime1 = overdueTime1;
        this.overdueTime2 = overdueTime2;
        this.overdueTime3 = overdueTime3;
        this.earlyRepaymentFee = earlyRepaymentFee;
    }
}

module.exports = Estimate;