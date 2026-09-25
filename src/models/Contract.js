export class ContractModel {
  constructor(data) {
    this.validate(data);
    this.clientId = data.clientId;
    this.planId = data.planId;
    this.conditions = data.conditions || 'Standard Gym Contract Terms';
    this.durationMonths = data.durationMonths;
    this.price = data.price;
    this.startDate = data.startDate;
    this.endDate = data.endDate;
    this.status = 'active';
  }

  validate(data) {
    if (!data.clientId) throw new Error('Contract requires a clientId.');
    if (!data.planId) throw new Error('Contract requires a planId.');
    if (typeof data.price !== 'number' || data.price <= 0) throw new Error('Invalid contract price.');
  }

  toValuesArray() {
    return [
      this.clientId,
      this.planId,
      this.conditions,
      this.durationMonths,
      this.price,
      this.startDate,
      this.endDate,
      this.status
    ];
  }
}