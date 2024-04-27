/**
 * @author Varsha Kamath
 * @email varsha.kamath@stud.fra-uas.de
 * @create date 2021-01-23 21:50:38
 * @modify date 2021-01-30 19:52:41
 * @desc [Primary Smartcontract to initiate ledger with donor details]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';

const { Contract } = require('fabric-contract-api');
let Donor = require('./Donor.js');
let Bag = require('./Bag.js');
let initLedgerMaster = require('./initLedgerMaster.json');
let initLedgerDonor = require('./initLedgerDonor.json');

class PrimaryContract extends Contract {

    async initLedger(ctx) {
        console.info('============= START : Initialize Ledger ===========');
        for (let i = 0; i < initLedgerDonor.length; i++) {
            initLedgerDonor[i].docType = 'donor';
            await ctx.stub.putState('PID' + i, Buffer.from(JSON.stringify(initLedgerDonor[i])));
            console.info('Added <--> ', initLedgerDonor[i]);
        }
        console.info('============= END : Initialize Ledger ===========');
        
        console.info('============= START : Initialize Ledger ===========');
        for (let i = 0; i < initLedgerMaster.length; i++) {
            if(initLedgerMaster[i]["type"]=="tempRecord")
                await ctx.stub.putState('T' + initLedgerMaster[i]["bloodBagUnitNo"] +"S"+ initLedgerMaster[i]["bloodBagSegmentNo"], Buffer.from(JSON.stringify(initLedgerMaster[i])));
            else
                await ctx.stub.putState('F' + initLedgerMaster[i]["bloodBagUnitNo"]+"S"+ initLedgerMaster[i]["bloodBagSegmentNo"], Buffer.from(JSON.stringify(initLedgerMaster[i])));
        }
        console.info('============= END : Initialize Ledger ===========');
    }

    //Read donor details based on donorId
    async readDonor(ctx, donorId) {
        const exists = await this.donorExists(ctx, donorId);
        if (!exists) {
            throw new Error(`The donor ${donorId} does not exist`);
        }

        const buffer = await ctx.stub.getState(donorId);
        let asset = JSON.parse(buffer.toString());
        asset = ({
            donorId: donorId,
            firstName: asset.firstName,
            lastName: asset.lastName,
            dob: asset.dob,
            phoneNumber: asset.phoneNumber,
            aadhar: asset.aadhar,
            address: asset.address,
            bloodGroup: asset.bloodGroup,
            donationHistory: asset.donationHistory,
            alert: asset.alert,
            isDiseased: asset.isDiseased,
            creditCard: asset.creditCard,
            donationStatus: asset.donationStatus,
            permissionGranted: asset.permissionGranted,
            password: asset.password,
            pwdTemp: asset.pwdTemp
        });
        return asset;
    }

    async readBag(ctx, bagId) {
        const exists = await this.bagExists(ctx, bagId);
        if (!exists) {
            throw new Error(`The bag ${bagId} does not exist`);
        }

        const buffer = await ctx.stub.getState(bagId);
        let asset = JSON.parse(buffer.toString());
        asset = ({
            bloodBagUnitNo: asset.bloodBagUnitNo,
            bloodBagSegmentNo: asset.bloodBagSegmentNo,
            type: asset.type,
            dateOfCollection:asset.dateOfCollection,
            dateOfExpiry:asset.dateOfExpiry,
            quantity: asset.quantity,
            bloodGroup: asset.bloodGroup,
            healthy: asset.healthy,
            results: asset.results
        });
        return asset;
    }
    
    async donorExists(ctx, donorId) {
        const buffer = await ctx.stub.getState(donorId);
        return (!!buffer && buffer.length > 0);
    }
    
    async bagExists(ctx, bagId) {
        const buffer = await ctx.stub.getState(bagId);
        return (!!buffer && buffer.length > 0);
    }

    async getQueryResultForQueryString(ctx, queryString) {
        let resultsIterator = await ctx.stub.getQueryResult(queryString);
        console.info('getQueryResultForQueryString <--> ', resultsIterator);
        let results = await this.getAllDonorResults(resultsIterator, false);
        return JSON.stringify(results);
    }

    async getAllDonorResults(iterator, isHistory) {
        let allResults = [];
        while (true) {
            let res = await iterator.next();

            if (res.value && res.value.value.toString()) {
                let jsonRes = {};
                console.log(res.value.value.toString('utf8'));

                if (isHistory && isHistory === true) {
                    jsonRes.Timestamp = res.value.timestamp;
                }
                jsonRes.Key = res.value.key;

                try {
                    jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
                } catch (err) {
                    console.log(err);
                    jsonRes.Record = res.value.value.toString('utf8');
                }
                allResults.push(jsonRes);
            }
            if (res.done) {
                console.log('end of data');
                await iterator.close();
                console.info(allResults);
                return allResults;
            }
        }
    }
}
module.exports = PrimaryContract;
