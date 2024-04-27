export interface Timestamp {
  nanos: number;
  seconds: ISeconds;
}

export interface ISeconds {
  high: number;
  low: number;
  unsigned: boolean;
}

export interface DonationDetails {
    dateOfDonation: string;
    status: string;
    bloodBagUnitNo: string;
    bloodBagSegmentNo: string;
    quantity: string;
    reason: string;
    screenedBy: string;
    collectedBy: string;
}

export interface DonationHistory {
    [donationNumber: string]: DonationDetails;
}

export interface DonorRecord {
  donorId: string;
  firstName: string;
  lastName: string;
  address: string;
  dob: string;
  aadhar: string;
  phoneNumber: string;
  bloodGroup: string;
  alert: boolean;
  isDiseased: boolean;
  creditCard: string;
  donationStatus: string;
  donationHistory: DonationHistory;
  docType: string;
  changedBy: string;
  Timestamp: Timestamp;
}

/*export interface ResRecord {
  Key: string;
  Record: DonorRecord;
}*/

export class DonorViewRecord {
  donorId = '';
  firstName = '';
  lastName = '';
  address = '';
  dob = '';
  aadhar = '';
  phoneNumber = '';
  bloodGroup = '';
  alert = false;
  isDiseased = false;
  creditCard = '';
  donationStatus = '';
  donationHistory: DonationHistory = {};
  docType = '';
  changedBy = '';
  Timestamp = '';

  constructor(readonly donorRecord: DonorRecord) {
    this.donorId = donorRecord.donorId;
    this.firstName = donorRecord.firstName;
    this.lastName = donorRecord.lastName;
    this.address = donorRecord.address;
    this.dob = donorRecord.dob;
    this.aadhar = donorRecord.aadhar;
    this.phoneNumber = donorRecord.phoneNumber;
    this.bloodGroup = donorRecord.bloodGroup;
    this.alert = donorRecord.alert;
    this.isDiseased = donorRecord.isDiseased;
    this.creditCard = donorRecord.creditCard;
    this.donationStatus = donorRecord.donationStatus;
    this.donationHistory = donorRecord.donationHistory;
    this.docType = donorRecord.docType;
    this.changedBy = donorRecord.changedBy;
    this.Timestamp = donorRecord.Timestamp ? new Date(donorRecord.Timestamp.seconds.low * 1000).toDateString() : '';
  }
}

export class DonorAdminViewRecord {
  donorId = '';
  firstName = '';
  lastName = '';
  docType = '';
  aadhar = '';
  phoneNumber = '';

  constructor(readonly donorRecord: DonorRecord) {
    this.donorId = donorRecord.donorId;
    this.firstName = donorRecord.firstName;
    this.lastName = donorRecord.lastName;
    this.docType = donorRecord.docType;
    this.aadhar = donorRecord.aadhar;
    this.phoneNumber = donorRecord.phoneNumber;
  }
}

export class DonorDoctorViewRecord {
  donorId = '';
  firstName = '';
  lastName = '';
  bloodGroup = '';
  alert = false;
  isDiseased = false;
  creditCard = '';
  donationStatus = '';
  donationHistory= {} ;

  constructor(readonly donorRecord: DonorRecord) {
    this.donorId = donorRecord.donorId;
    this.firstName = donorRecord.firstName;
    this.lastName = donorRecord.lastName;
    this.bloodGroup = donorRecord.bloodGroup;
    this.alert = donorRecord.alert;
    this.isDiseased = donorRecord.isDiseased;
    this.creditCard = donorRecord.creditCard;
    this.donationStatus = donorRecord.donationStatus;
    this.donationHistory = donorRecord.donationHistory;
  }
}

export class DisplayVal {
  keyName: string | number | boolean | DonationHistory;
  displayName: string;

  constructor(key: string | number | boolean | DonationHistory, value: string) {
    this.keyName = key;
    this.displayName = value;
  }
}

