/* eslint-disable new-cap */
const fs = require('fs');
const {enrollAdminHosp1} = require('./enrollAdmin-Hospital1');
const {enrollAdminHosp2} = require('./enrollAdmin-Hospital2');
const {enrollRegisterUser} = require('./registerUser');
const {createRedisClient} = require('./utils');

const redis = require('redis');


/**
 * @description Enrolls and registers the donors in the initLedger as users.
 */
async function initLedger() {
  try {
    const jsonString = fs.readFileSync('../donor-asset-transfer/chaincode/lib/initLedgerDonor.json');
    const donors = JSON.parse(jsonString);
    let i = 0;
    for (i = 0; i < donors.length; i++) {
      const attr = {firstName: donors[i].firstName, lastName: donors[i].lastName, role: 'donor'};
      await enrollRegisterUser('1', 'PID'+i, JSON.stringify(attr));
    }
  } catch (err) {
    console.log(err);
  }
}
/**
 * @description Init the redis db with the admins credentials
 */
async function initRedis() {
  let redisUrl = 'redis://127.0.0.1:6379';
  let redisPassword = 'hosp1lithium';
  let redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);
  redisClient.SET('hosp1admin', redisPassword);
  redisClient.QUIT();

  redisUrl = 'redis://127.0.0.1:6380';
  redisPassword = 'hosp2lithium';
  redisClient = redis.createClient(redisUrl);
  redisClient.AUTH(redisPassword);
  redisClient.SET('hosp2admin', redisPassword);
  console.log('Done');
  redisClient.QUIT();
  return;
}

/**
 * @description Create doctors in both organizations based on the initDoctors JSON
 */
async function enrollAndRegisterDoctors() {
  try {
    const jsonString = fs.readFileSync('./initDoctors.json');
    const doctors = JSON.parse(jsonString);
    for (let i = 0; i < doctors.length; i++) {
      const attr = {fullName: doctors[i].fullName, address: doctors[i].address, phoneNumber: doctors[i].phoneNumber, emergPhoneNumber: doctors[i].emergPhoneNumber, role: 'doctor', registration: doctors[i].registration};
      // Create a redis client and add the doctor to redis
      doctors[i].hospitalId = parseInt(doctors[i].hospitalId);
      const redisClient = createRedisClient(doctors[i].hospitalId);
      (await redisClient).SET('HOSP' + doctors[i].hospitalId + '-' + 'DOC' + doctors[i].registration, 'password');
      await enrollRegisterUser(doctors[i].hospitalId, 'HOSP' + doctors[i].hospitalId + '-' + 'DOC' + doctors[i].registration, JSON.stringify(attr));
      (await redisClient).QUIT();
    }
  } catch (error) {
    console.log(error);
  }
};

async function enrollAndRegisterTechnicians() {
  try {
    const jsonString = fs.readFileSync('./initTechnicians.json');
    const technicians = JSON.parse(jsonString);
    for (let i = 0; i < technicians.length; i++) {
      const attr = {fullName: technicians[i].fullName, address: technicians[i].address, phoneNumber: technicians[i].phoneNumber, emergPhoneNumber: technicians[i].emergPhoneNumber, role: 'technician', registration: technicians[i].registration};
      // Create a redis client and add the doctor to redis
      technicians[i].hospitalId = parseInt(technicians[i].hospitalId);
      const redisClient = createRedisClient(technicians[i].hospitalId);
      (await redisClient).SET('HOSP' + technicians[i].hospitalId + '-' + 'TECH' + technicians[i].registration, 'password');
      await enrollRegisterUser(technicians[i].hospitalId, 'HOSP' + technicians[i].hospitalId + '-' + 'TECH' + technicians[i].registration, JSON.stringify(attr));
      (await redisClient).QUIT();
    }
  } catch (error) {
    console.log(error);
  }
};

/**
 * @description Function to initialise the backend server, enrolls and regsiter the admins and initLedger donors.
 * @description Need not run this manually, included as a prestart in package.json
 */
async function main() {

  /*await enrollAdminHosp1();
  await enrollAdminHosp2();
  await initLedger();
  await initRedis();
  await enrollAndRegisterDoctors();
  await enrollAndRegisterTechnicians();*/
 
}

main();
