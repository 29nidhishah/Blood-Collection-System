/**
 * @desc [The base donor class]
 */
/*
 * SPDX-License-Identifier: Apache-2.0
 */

class Bag {

    constructor(bloodBagUnitNo, bloodBagSegmentNo, dateOfCollection, dateOfExpiry, quantity, bloodGroup)
    {
    	this.type = "tempRecord";
        this.bloodBagUnitNo = bloodBagUnitNo;
        this.bloodBagSegmentNo = bloodBagSegmentNo;
        this.dateOfCollection = dateOfCollection;
        this.dateOfExpiry = dateOfExpiry;
        this.quantity = quantity;
        this.bloodGroup = bloodGroup;
        this.healthy="-";
        this.results= {};
        return this;
    }
}
module.exports = Bag
