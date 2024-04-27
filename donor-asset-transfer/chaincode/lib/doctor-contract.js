/**
 * @author Varsha Kamath
 * @email varsha.kamath@stud.fra-uas.de
 * @create date 2021-01-14 21:50:38
 * @modify date 2021-02-05 20:03:33
 * @desc [Smartcontract to read, update donor details in legder]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

let Bag = require('./Bag.js');
let Donor = require('./Donor.js');
const AdminContract = require('./admin-contract.js');
const PrimaryContract = require("./primary-contract.js");
const { Context } = require('fabric-contract-api');

class DoctorContract extends AdminContract {

    //Read donor details based on donorId
    async readDonor(ctx, donorId) {

        let asset = await PrimaryContract.prototype.readDonor(ctx, donorId)

        // Get the doctorID, retrieves the id used to connect the network
        const doctorId = await this.getClientId(ctx);
        // Check if doctor has the permission to read the donor
        const permissionArray = asset.permissionGranted;
        if(!permissionArray.includes(doctorId)) {
            throw new Error(`The doctor ${doctorId} does not have permission to donor ${donorId}`);
        }
        asset = ({
            donorId: donorId,
            firstName: asset.firstName,
            lastName: asset.lastName,
            dob: asset.dob,
            bloodGroup: asset.bloodGroup,
            alert: asset.alert,
            isDiseased: asset.isDiseased,
            creditCard: asset.creditCard,
            donationStatus: asset.donationStatus,
            donationHistory: asset.donationHistory
        });
        return asset;
    }
    
    async createBag(ctx, args) {
        args = JSON.parse(args);
        let donor = await PrimaryContract.prototype.readDonor(ctx, args.donorId);
        console.log(donor);
       	const dod=new Date();
       	const dod_date=dod.toISOString().substring(0, 10);
       	let eod = new Date(dod_date);
        eod.setDate(dod.getDate() + 120);
        const expiry_date=eod.toISOString().substring(0, 10);
        let newBag = new Bag(args.bloodBagUnitNo, args.bloodBagSegmentNo, dod_date, expiry_date, args.quantity, donor.bloodGroup);
        const bagID ="T"+ args.bloodBagUnitNo + "S" + args.bloodBagSegmentNo;
        const buffer = Buffer.from(JSON.stringify(newBag));
        await ctx.stub.putState(bagID, buffer);
    }
    
    async bloodCollection(ctx, args){	//args here will contain: donorId, status(S/F) and blood parameters
        await this.createBag(ctx,args);
    	args = JSON.parse(args);
        let donorId = args.donorId;
        let donor = await PrimaryContract.prototype.readDonor(ctx, donorId);
        
        //if(donor.donationStatus !='in progress')
        //throw new Error(Do screening first);
	
        const numberOfDonation = Object.keys(donor.donationHistory).length;
	
	donor.donationHistory['donation' + (numberOfDonation)]['bloodBagUnitNo'] = args.bloodBagUnitNo;
	donor.donationHistory['donation' + (numberOfDonation)]['bloodBagSegmentNo'] = args.bloodBagSegmentNo;
	donor.donationHistory['donation' + (numberOfDonation)]['quantity'] = args.quantity;
	donor.donationHistory['donation' + (numberOfDonation)]['status'] = "successful";
	donor.donationHistory['donation' + (numberOfDonation)]['collectedBy'] = args.doctorId;
	donor.creditCard=(parseInt(donor.creditCard)+args.quantity).toString();
	donor.donationStatus='successful';
        
        
        const buffer = Buffer.from(JSON.stringify(donor));
        await ctx.stub.putState(donorId, buffer);
    }
    
    
    async screenDonor(ctx, args) {
        args = JSON.parse(args);
        let donorId = args.donorId;
        let donor = await PrimaryContract.prototype.readDonor(ctx, donorId);
        let status=''; 
        let reason='';
        let dod=new Date();
       	const dod_date=dod.toISOString().substring(0, 10);
        const age = (new Date(dod_date) - new Date(donor.dob)) / (1000*60*60*24*365);
        const numberOfDonationsMade = Object.keys(donor.donationHistory).length;
       	const dateOfLastDonation = numberOfDonationsMade>0?donor.donationHistory['donation' + (numberOfDonationsMade)]['dateOfDonation']:null;
       	const duration = (dateOfLastDonation!=null)?(new Date(dod_date) - new Date(dateOfLastDonation))/(1000*60*60*24) : null;
        
        let systolic=parseInt(args.systolic);
        let diastolic=parseInt(args.diastolic);
        let weight=parseInt(args.weight);
        
       	if(age<18 || age>60 ) 
        {
            status='ineligible';
            reason=age<18?'Under Age':'Above Age';
        }
        else if(duration!=null && duration<120)
        {
            status='ineligible';
            reason='Invalid Duration between two Collections';
        }
        else if(donor.isDiseased=='true')
        {
            status='ineligible';
            reason='Unhealthy';
        }
        else if(systolic<110 || systolic>140)
        {
            status='ineligible';
            reason='Abnormal Systolic Pressure';
        }
        else if(diastolic<70 || diastolic>100)
        {
            status='ineligible';
            reason='Abnormal Diastolic Pressure';
        }
        else if(weight<45)
        {
            status='ineligible';
            reason='Under-weight';
        }
        else
        {
            status='in progress';
        }
        
        if(status=='ineligible')
	{
            donor.donationHistory['donation' + (numberOfDonationsMade + 1)] = {'dateOfDonation': dod_date, 'status': "failed", 'reason': reason,'screenedBy':args.doctorId};
            donor.donationStatus="failed";
        }
        else
        {
            donor.donationHistory['donation' + (numberOfDonationsMade + 1)] = {'dateOfDonation': dod_date, 'status': status,'screenedBy':args.doctorId};
            donor.donationStatus="in progress";
        }
        const buffer = Buffer.from(JSON.stringify(donor));
        await ctx.stub.putState(donorId, buffer);
        
    }

    //This function is to update donor medical details. This function should be called by only doctor.
    async updateDonorMedicalDetails(ctx, args) {
        args = JSON.parse(args);
        let isDataChanged = false;
        let donorId = args.donorId;
        let newAlert = args.alert;
        let newIsDiseased = args.isDiseased;
        let newCreditCard = args.creditCard;
        let newDonationStatus = args.donationStatus;

        const donor = await PrimaryContract.prototype.readDonor(ctx, donorId);

        if (newAlert !== null && newAlert !== '' && donor.alert !== newAlert) {
            donor.alert = newAlert;
            isDataChanged = true;
        }

        if (newIsDiseased !== null && newIsDiseased !== '' && donor.isDiseased !== newIsDiseased) {
            donor.isDiseased = newIsDiseased;
            isDataChanged = true;
        }

        if (newCreditCard !== null && newCreditCard !== '' && donor.creditCard !== newCreditCard) {
            donor.creditCard = newCreditCard;
            isDataChanged = true;
        }

        if (newDonationStatus !== null && newDonationStatus !== '' && donor.donationStatus !== newDonationStatus) {
            donor.donationStatus = newDonationStatus;
            isDataChanged = true;
        }


        if (isDataChanged === false) return;

        const buffer = Buffer.from(JSON.stringify(donor));
        await ctx.stub.putState(donorId, buffer);
    }

    //Read donors based on lastname
    async queryDonorsByLastName(ctx, lastName) {
        return await super.queryDonorsByLastName(ctx, lastName);
    }

    //Read donors based on firstName
    async queryDonorsByFirstName(ctx, firstName) {
        return await super.queryDonorsByFirstName(ctx, firstName);
    }

    //Retrieves donor medical history based on donorId
    async getDonorHistory(ctx, donorId) {
        let resultsIterator = await ctx.stub.getHistoryForKey(donorId);
        let asset = await this.getAllDonorResults(resultsIterator, true);

        return this.fetchLimitedFields(asset, true);
    }

    //Retrieves all donors details
    async queryAllDonors(ctx, doctorId) {
        let resultsIterator = await ctx.stub.getStateByRange('', '');
        let asset = await this.getAllDonorResults(resultsIterator, false);
        const permissionedAssets = [];
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            if ('permissionGranted' in obj.Record && obj.Record.permissionGranted.includes(doctorId)) {
                permissionedAssets.push(asset[i]);
            }
        }

        return this.fetchLimitedFields(permissionedAssets);
    }

    fetchLimitedFields = (asset, includeTimeStamp = false) => {
        for (let i = 0; i < asset.length; i++) {
            const obj = asset[i];
            asset[i] = {
                donorId: obj.Key,
                firstName: obj.Record.firstName,
                lastName: obj.Record.lastName,
                dob: obj.Record.dob,
                bloodGroup: obj.Record.bloodGroup,
                alert: obj.Record.alert,
                isDiseased: obj.Record.isDiseased,
                creditCard: obj.Record.creditCard,
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
     * @description Get the client used to connect to the network.
     */
    async getClientId(ctx) {
        const clientIdentity = ctx.clientIdentity.getID();
        // Ouput of the above - 'x509::/OU=client/CN=hosp1admin::/C=US/ST=North Carolina/L=Durham/O=hosp1.lithium.com/CN=ca.hosp1.lithium.com'
        let identity = clientIdentity.split('::');
        identity = identity[1].split('/')[2].split('=');
        return identity[1].toString('utf8');
    }
}
module.exports = DoctorContract;
