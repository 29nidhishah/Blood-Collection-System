export interface DoctorRecord {
  id: string;
  fullName: string;
  address: string;
  phoneNumber: string;
  emergPhoneNumber: string;
  registration: string;
  role: string;
}

export class DoctorViewRecord {
  doctorId = '';
  fullName = '';
  address = '';
  registration = '';
  phoneNumber = '';
  role = '';
  emergPhoneNumber= '';

  constructor(readonly doctorRecord: DoctorRecord) {
    this.doctorId = doctorRecord.id;
    this.fullName = doctorRecord.fullName;
    this.address = doctorRecord.address;
    this.role = doctorRecord.role;
    this.phoneNumber = doctorRecord.phoneNumber;
    this.registration = doctorRecord.registration;
    this.emergPhoneNumber = doctorRecord.emergPhoneNumber;
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
