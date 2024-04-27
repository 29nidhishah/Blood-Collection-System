/**
 * @author Varsha Kamath
 * @email varsha.kamath@stud.fra-uas.de
 * @create date 2020-12-14 21:50:38
 * @modify date 2021-02-05 20:15:21
 * @desc [Donor Smartcontract to read, update and delete donor details in legder]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

let Donor = require('./Donor.js');
const crypto = require('crypto');
const PrimaryContract = require('./primary-contract.js');
const { Context } = require('fabric-contract-api');

class DonorContract extends PrimaryContract {

    //Read donor details based on donorId
    async readDonor(ctx, donorId) {
        return await super.readDonor(ctx, donorId);
    }

    //Delete donor from the ledger based on donorId
    async deleteDonor(ctx, donorId) {
        const exists = await this.donorExists(ctx, donorId);
        if (!exists) {
            throw new Error(`The donor ${donorId} does not exist`);
        }
        await ctx.stub.deleteState(donorId);
    }

    //This function is to update donor personal details. This function should be called by donor.
    async updateDonorPersonalDetails(ctx, args) {
        args = JSON.parse(args);
        let isDataChanged = false;
        let donorId = args.donorId;
        let newFirstname = args.firstName;
        let newLastName = args.lastName;
        let newDob = args.dob;
        let newPhoneNumber = args.phoneNumber;
        let newAadhar = args.aadhar;
        let newAddress = args.address;

        const donor = await this.readDonor(ctx, donorId)
        if (newFirstname !== null && newFirstname !== '' && donor.firstName !== newFirstname) {
            donor.firstName = newFirstname;
            isDataChanged = true;
        }

        if (newLastName !== null && newLastName !== '' && donor.lastName !== newLastName) {
            donor.lastName = newLastName;
            isDataChanged = true;
        }

        if (newDob !== null && newDob !== '' && donor.dob !== newDob) {
            donor.dob = newDob;
            isDataChanged = true;
        }

        if (newPhoneNumber !== null && newPhoneNumber !== '' && donor.phoneNumber !== newPhoneNumber) {
            donor.phoneNumber = newPhoneNumber;
            isDataChanged = true;
        }

        if (newAadhar !== null && newAadhar !== '' && donor.aadhar !== newAadhar) {
            donor.aadhar = newAadhar;
            isDataChanged = true;
        }

        if (newAddress !== null && newAddress !== '' && donor.address !== newAddress) {
            donor.address = newAddress;
            isDataChanged = true;
        }

        if (isDataChanged === false) return;

        const buffer = Buffer.from(JSON.stringify(donor));
        await ctx.stub.putState(donorId, buffer);
    }

    //This function is to update donor password. This function should be called by donor.
    async updateDonorPassword(ctx, args) {
        args = JSON.parse(args);
        let donorId = args.donorId;
        let newPassword = args.newPassword;

        if (newPassword === null || newPassword === '') {
            throw new Error(`Empty or null values should not be passed for newPassword parameter`);
        }

        const donor = await this.readDonor(ctx, donorId);
        donor.password = crypto.createHash('sha256').update(newPassword).digest('hex');
        if(donor.pwdTemp){
            donor.pwdTemp = false;
        }
        const buffer = Buffer.from(JSON.stringify(donor));
        await ctx.stub.putState(donorId, buffer);
    }

    //Returns the donor's password
    async getDonorPassword(ctx, donorId) {
        let donor = await this.readDonor(ctx, donorId);
        donor = ({
            password: donor.password,
            pwdTemp: donor.pwdTemp})
        return donor;
    }

    //Retrieves donor medical history based on donorId
    async getDonorHistory(ctx, donorId) {
        let resultsIterator = await ctx.stub.getHistoryForKey(donorId);
        let asset = await this.getAllDonorResults(resultsIterator, true);

        return this.fetchLimitedFields(asset, true);
    }

    fetchLimitedFields = (asset, includeTimeStamp = false) => {
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            asset[i] = {
                donorId: obj.Key,
                firstName: obj.Record.firstName,
                lastName: obj.Record.lastName,
                dob: obj.Record.dob,
                address: obj.Record.address,
                phoneNumber: obj.Record.phoneNumber,
                aadhar: obj.Record.aadhar,
                bloodGroup: obj.Record.bloodGroup,
                alert: obj.Record.alert,
                isDiseased: obj.Record.isDiseased,
                creditCard: obj.Record.creditCard,
                donationHistory: obj.Record.donationHistory,
                donationStatus: obj.Record.donationStatus
            };
            if (includeTimeStamp) {
                asset[i].Timestamp = obj.Timestamp;
            }
        }

        return asset;
    };

    /**
     * @author Jathin Sreenivas
     * @param  {Context} ctx
     * @param  {JSON} args containing donorId and doctorId
     * @description Add the doctor to the permissionGranted array
     */
    async grantAccessToDoctor(ctx, args) {
        args = JSON.parse(args);
        let donorId = args.donorId;
        let doctorId = args.doctorId;

        // Get the donor asset from world state
        const donor = await this.readDonor(ctx, donorId);
        // unique doctorIDs in permissionGranted
        if (!donor.permissionGranted.includes(doctorId)) {
            donor.permissionGranted.push(doctorId);
        }
        const buffer = Buffer.from(JSON.stringify(donor));
        // Update the ledger with updated permissionGranted
        await ctx.stub.putState(donorId, buffer);
    };

    /**
     * @author Jathin Sreenivas
     * @param  {Context} ctx
     * @param  {JSON} args containing donorId and doctorId
     * @description Remove the doctor from the permissionGranted array
     */
    async revokeAccessFromDoctor(ctx, args) {
        args = JSON.parse(args);
        let donorId = args.donorId;
        let doctorId = args.doctorId;

        // Get the donor asset from world state
        const donor = await this.readDonor(ctx, donorId);
        // Remove the doctor if existing
        if (donor.permissionGranted.includes(doctorId)) {
            donor.permissionGranted = donor.permissionGranted.filter(doctor => doctor !== doctorId);
        }
        const buffer = Buffer.from(JSON.stringify(donor));
        // Update the ledger with updated permissionGranted
        await ctx.stub.putState(donorId, buffer);
    };
}
module.exports = DonorContract;
