export class ClientModel {
    constructor(data) {
      this.validate(data);
      this.name = data.name;
      this.email = data.email;
      this.phone = data.phone;
      this.createdAt = new Date();
    }
  
    validate(data) {
      if (!data.name || typeof data.name !== 'string') throw new Error('Invalid or missing client name.');
      if (!data.email || !data.email.includes('@')) throw new Error('Invalid or missing client email.');
      if (!data.phone || typeof data.phone !== 'string') throw new Error('Invalid or missing phone number.');
    }
  
    toBson() {
      return {
        name: this.name,
        email: this.email,
        phone: this.phone,
        createdAt: this.createdAt
      };
    }
  }