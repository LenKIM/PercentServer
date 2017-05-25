/**
 * Request Model
 */
class Request {
    constructor(requestId,
                customerId,
                selectedEstimateId,
                loanType,
                loanAmount,
                scheduledTime,
                overdueRecord,
                interestRateType,
                loanPeriod,
                registerTime,
                startTime,
                endTime,
                extra,
                jobType,
                status,
                region1,
                region2,
                region3,
                aptName,
                aptKBId,
                aptPrice,
                aptSizeSupply,
                aptSizeExclusive) {
        this.requestId = requestId;
        this.customerId = customerId;
        this.selectedEstimateId = selectedEstimateId;
        this.loanType = loanType;
        this.loanAmount = loanAmount;
        this.scheduledTime = scheduledTime;
        this.overdueRecord = overdueRecord;
        this.interestRateType = interestRateType;
        this.loanPeriod = loanPeriod;
        this.registerTime = registerTime;
        this.startTime = startTime;
        this.endTime = endTime;
        this.extra = extra;
        this.jobType = jobType;
        this.status = status;
        this.region1 = region1;
        this.region2 = region2;
        this.region3 = region3;
        this.aptName = aptName;
        this.aptKBId = aptKBId;
        this.aptPrice = aptPrice;
        this.aptSizeSupply = aptSizeSupply;
        this.aptSizeExclusive = aptSizeExclusive;
    }
}

module.exports = Request;