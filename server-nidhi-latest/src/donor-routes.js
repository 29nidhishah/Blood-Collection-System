/**
 * @desc Paient specific methods - API documentation in http://localhost:3002/ swagger editor.
 */

// Bring common classes into scope, and Fabric SDK network class
const {ROLE_ADMIN, ROLE_DOCTOR, ROLE_DONOR, capitalize, getMessage, validateRole} = require('../utils.js');
const network = require('../../donor-asset-transfer/application-javascript/app.js');


/**
 * @param  {Request} req Role in the header and donorId in the url
 * @param  {Response} res Body consists of json of the donor object
 * @description This method retrives an existing donor from the ledger
 */
exports.getDonorById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR, ROLE_DONOR], userRole, res);
  const donorId = req.params.donorId;
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:readDonor', donorId);
  (response.error) ? res.status(400).send(response.error) : res.status(200).send(JSON.parse(response));
};

/**
 * @param  {Request} req Body must be a json, role in the header and donorId in the url
 * @param  {Response} res A 200 response if donor is updated successfully else a 500 response with s simple message json
 * @description  This method updates an existing donor personal details. This method can be executed only by the donor.
 */
exports.updateDonorPersonalDetails = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DONOR], userRole, res);
  // The request present in the body is converted into a single json string
  let args = req.body;
  args.donorId = req.params.donorId;
  args.changedBy = req.params.donorId;
  args= [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:updateDonorPersonalDetails', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Updated Donor.'));
};

/**
 * @param  {Request} req Role in the header and donorId in the url
 * @param  {Response} res Body consists of json of history of the donor object consists of time stamps and donor object
 * @description Retrives the history transaction of an asset(Donor) in the ledger
 */
exports.getDonorHistoryById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR, ROLE_DONOR], userRole, res);
  const donorId = req.params.donorId;
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, true, capitalize(userRole) + 'Contract:getDonorHistory', donorId);
  const parsedResponse = await JSON.parse(response);
  (response.error) ? res.status(400).send(response.error) : res.status(200).send(parsedResponse);
};

/**
 * @param  {Request} req Role in the header and hospitalId in the url
 * @param  {Response} res 200 response with array of all doctors else 500 with the error message
 * @description Get all the doctors of the mentioned hospitalId
 */
exports.getDoctorsByHospitalId = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DONOR, ROLE_ADMIN], userRole, res);
  const hospitalId = parseInt(req.params.hospitalId);
  // Set up and connect to Fabric Gateway
  userId = hospitalId === 1 ? 'hosp1admin' : hospitalId === 2 ? 'hosp2admin' : 'hosp3admin';
  const networkObj = await network.connectToNetwork(userId);
  // Use the gateway and identity service to get all users enrolled by the CA
  const response = await network.getAllDoctorsByHospitalId(networkObj, hospitalId);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(response);
};
/**
 * @param  {Request} req Role in the header. donorId, doctorId in the url
 * @param  {Response} res 200 response if access was granted to the doctor else 500 with the error message
 * @description Donor grants access to the doctor.
 */
exports.grantAccessToDoctor = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DONOR], userRole, res);
  const donorId = req.params.donorId;
  const doctorId = req.params.doctorId;
  let args = {donorId: donorId, doctorId: doctorId};
  args= [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:grantAccessToDoctor', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, `Access granted to ${doctorId}`));
};
/**
 * @param  {Request} req Role in the header. donorId, doctorId in the url
 * @param  {Response} res 200 response if access was revoked from the doctor else 500 with the error message
 * @description Donor revokes access from the doctor.
 */
exports.revokeAccessFromDoctor = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DONOR], userRole, res);
  const donorId = req.params.donorId;
  const doctorId = req.params.doctorId;
  let args = {donorId: donorId, doctorId: doctorId};
  args= [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:revokeAccessFromDoctor', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, `Access revoked from ${doctorId}`));
};
