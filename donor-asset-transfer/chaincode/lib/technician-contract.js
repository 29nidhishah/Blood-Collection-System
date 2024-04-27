/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';
const PrimaryContract = require('./primary-contract.js');
const { Contract } = require('fabric-contract-api');

class TechnicianContract extends PrimaryContract
{
    async readBag(ctx,args){
    let ar=JSON.parse(args);
    let bagID=(ar.bloodBagType=='temprecord'?'T':'F')+ar.bloodBagUnitNo +'S'+ ar.bloodBagSegmentNo;
    let asset = await PrimaryContract.prototype.readBag(ctx, bagID)
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
    async inputBloodTestValues(ctx, args) {
        let ar=JSON.parse(args);
        let bloodBagUnitNo = ar.bloodBagUnitNo;
        let bloodBagSegmentNo = ar.bloodBagSegmentNo;
        let bagID="T" + bloodBagUnitNo +"S"+ bloodBagSegmentNo;
        let bag = await PrimaryContract.prototype.readBag(ctx, bagID);
  
        bag.type="finalRecord";
        bag.results["malaria"]=ar.malaria;
        bag.results["syphilis"]=ar.syphilis;
        bag.results["hcv"]= ar.hcv;
        bag.results["hepatitisB"]= ar.hepatitisB;
        bag.results["irregularAntibody"]= ar.irregularAntibody;
        bag.results["checkedBy"]= ar.technicianId;
        
        if(ar.malaria == 'true' || ar.hcv == 'true' || ar.hepatitisB == 'true' || ar.irregularAntibody == 'true')
        {
           bag.healthy = 'false';
        }
        else
        {
            bag.healthy = 'true';
        }
        
        let nbagID='F' + bloodBagUnitNo +"S"+ bloodBagSegmentNo;
        const nbuffer = Buffer.from(JSON.stringify(bag));
        await ctx.stub.putState(nbagID, nbuffer);
        
        bag.type="tempRecord";
        const buffer = Buffer.from(JSON.stringify(bag));
        await ctx.stub.putState(bagID, buffer);
    }
}
module.exports = TechnicianContract;
