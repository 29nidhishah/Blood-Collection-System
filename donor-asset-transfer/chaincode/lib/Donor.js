/**
 * @author Varsha Kamath
 * @email varsha.kamath@stud.fra-uas.de
 * @create date 2021-01-04 19:06:47
 * @modify date 2021-01-04 19:06:47
 * @desc [The base donor class]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */

const crypto = require('crypto');

class Donor {

    constructor(donorId, firstName, lastName, password, dob, phoneNumber, aadhar, address, bloodGroup, donationHistory = {},
     alert = 'false', isDiseased = 'false', creditCard = '0', donationStatus = '-')
    {
        this.donorId = donorId;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = crypto.createHash('sha256').update(password).digest('hex');
        this.dob = dob;
        this.phoneNumber = phoneNumber;
        this.aadhar = aadhar;
        this.address = address;
        this.bloodGroup = bloodGroup;
        this.donationHistory = donationHistory;
        this.alert = alert;
        this.isDiseased = isDiseased;
        this.creditCard = creditCard;
        this.donationStatus = donationStatus;
        this.pwdTemp = true;
        this.permissionGranted = [];
        return this;
    }
}
module.exports = Donor

