/*
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const { DonorContract } = require('..');
const winston = require('winston');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logging = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('DonorContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new DonorContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1001').resolves(Buffer.from('{"value":"donor 1001 value"}'));
        ctx.stub.getState.withArgs('1002').resolves(Buffer.from('{"value":"donor 1002 value"}'));
    });

    describe('#donorExists', () => {

        it('should return true for a donor', async () => {
            await contract.donorExists(ctx, '1001').should.eventually.be.true;
        });

        it('should return false for a donor that does not exist', async () => {
            await contract.donorExists(ctx, '1003').should.eventually.be.false;
        });

    });

    describe('#createDonor', () => {

        it('should create a donor', async () => {
            await contract.createDonor(ctx, '1003', 'donor 1003 value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1003', Buffer.from('{"value":"donor 1003 value"}'));
        });

        it('should throw an error for a donor that already exists', async () => {
            await contract.createDonor(ctx, '1001', 'myvalue').should.be.rejectedWith(/The donor 1001 already exists/);
        });

    });

    describe('#readDonor', () => {

        it('should return a donor', async () => {
            await contract.readDonor(ctx, '1001').should.eventually.deep.equal({ value: 'donor 1001 value' });
        });

        it('should throw an error for a donor that does not exist', async () => {
            await contract.readDonor(ctx, '1003').should.be.rejectedWith(/The donor 1003 does not exist/);
        });

    });

    describe('#updateDonor', () => {

        it('should update a donor', async () => {
            await contract.updateDonor(ctx, '1001', 'donor 1001 new value');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('1001', Buffer.from('{"value":"donor 1001 new value"}'));
        });

        it('should throw an error for a donor that does not exist', async () => {
            await contract.updateDonor(ctx, '1003', 'donor 1003 new value').should.be.rejectedWith(/The donor 1003 does not exist/);
        });

    });

    describe('#deleteDonor', () => {

        it('should delete a donor', async () => {
            await contract.deleteDonor(ctx, '1001');
            ctx.stub.deleteState.should.have.been.calledOnceWithExactly('1001');
        });

        it('should throw an error for a donor that does not exist', async () => {
            await contract.deleteDonor(ctx, '1003').should.be.rejectedWith(/The donor 1003 does not exist/);
        });

    });

});
