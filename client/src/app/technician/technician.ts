export interface TechnicianRecord {
  userId: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  emergPhoneNumber: string;
  role: string;
  registration: string;
}

export class TechnicianViewRecord {
  userId = '';
  fullName = '';
  address = '';
  phoneNumber = '';
  emergPhoneNumber = '';
  role = '';
  registration='';

  constructor(readonly technicianRecord: TechnicianRecord) {
    this.userId = technicianRecord.userId;
    this.fullName = technicianRecord.fullName;
    this.address = technicianRecord.address;
    this.phoneNumber = technicianRecord.phoneNumber;
    this.emergPhoneNumber = technicianRecord.emergPhoneNumber;
    this.role = technicianRecord.role;
    this.registration = technicianRecord.registration;
  }
}

export class DisplayVal {
  keyName: string | number | boolean;
  displayName: string;

  constructor(key: string | number | boolean, value: string) {
    this.keyName = key;
    this.displayName = value;
  }
}
