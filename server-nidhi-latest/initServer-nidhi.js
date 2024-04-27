/* eslint-disable new-cap */
const fs = require('fs');
const {enrollAdminHosp1} = require('./enrollAdmin-Hospital1');
const {enrollAdminHosp2} = require('./enrollAdmin-Hospital2');
const {enrollRegisterUser} = require('./registerUser');
const {createRedisClient} = require('./utils');

const redis = require('redis');
const IPFS = require('ipfs-api');

// Create an instance of IPFS client
const ipfs = new IPFS({ host: 'localhost', port: 5001, protocol: 'http' });


/**
 * @description Enrolls and registers the donors in the initLedger as users.
 */
async function initLedger() {
  try {
    const jsonString = fs.readFileSync('../donor-asset-transfer/chaincode/lib/initLedger.json');
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

// Function to upload data to IPFS
async function uploadToIPFS(data) {
    const bufferData = Buffer.from(data); // Convert JSON data to buffer
    return new Promise((resolve, reject) => {
        ipfs.add(bufferData, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result[0].hash);
            }
        });
    });
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
      const ipfsHashValue = await uploadToIPFS(JSON.stringify(attr));
      console.log(ipfsHashValue+" "+i);
      const enrollmentAttr = { ipfsHash: ipfsHashValue, role: 'doctor' };
      console.log(enrollmentAttr);
      await enrollRegisterUser(doctors[i].hospitalId, 'HOSP' + doctors[i].hospitalId + '-' + 'DOC' + doctors[i].registration, JSON.stringify(enrollmentAttr));
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
  await initRedis();*/
  await enrollAndRegisterDoctors();
}

main();
