export class ContractModel {
    constructor(data) {
      this.validate(data);
      this.clientId = data.clientId;
      this.planId = data.planId;
      this.conditions = data.conditions || 'Standard Gym Contract Terms';
      this.durationMonths = data.durationMonths;
      this.price = data.price;
      this.startDate = new Date(data.startDate);
      this.endDate = new Date(data.endDate);
      this.status = 'active'; // active, cancelled, finalized
    }
  
    validate(data) {
      if (!data.clientId) throw new Error('Contract requires a clientId.');
      if (!data.planId) throw new Error('Contract requires a planId.');
      if (typeof data.price !== 'number' || data.price <= 0) throw new Error('Invalid contract price.');
    }
  
    toBson() {
      return {
        clientId: this.clientId,
        planId: this.planId,
        conditions: this.conditions,
        durationMonths: this.durationMonths,
        price: this.price,
        startDate: this.startDate,
        endDate: this.endDate,
        status: this.status
      };
    }
  }