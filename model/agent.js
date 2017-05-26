/**
 * Agent Model
 */
class Agent {
    constructor(agentId,
                password,
                name,
                photo,
                greeting,
                companyName,
                registerNumber,
                region1,
                region2,
                registerTime) {
        this.agentId = agentId;
        this.password = password;
        this.name = name;
        this.photo = photo;
        this.greeting = greeting;
        this.companyName = companyName;
        this.registerNumber = registerNumber;
        this.region1 = region1;
        this.region2 = region2;
        this.registerTime = registerTime;
    }
}

module.exports = Agent;