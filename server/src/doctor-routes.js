/**
 * @desc Doctor specific methods - API documentation in http://localhost:3002/ swagger editor.
 */

// Bring common classes into scope, and Fabric SDK network class
const {ROLE_DOCTOR, capitalize, getMessage, validateRole} = require('../utils.js');
const network = require('../../donor-asset-transfer/application-javascript/app.js');


/**
 * @param  {Request} req Body must be a json, role in the header and donorId in the url
 * @param  {Response} res A 200 response if donor is updated successfully else a 500 response with s simple message json
 * @description Updates an existing asset(donor medical details) in the ledger. This method can be executed only by the doctor.
 */
exports.updateDonorMedicalDetails = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR], userRole, res);
  let args = req.body;
  args.donorId = req.params.donorId;
  args.changedBy = req.headers.username;
  args= [JSON.stringify(args)];
  // Set up and connect to Fabric Gateway
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:updateDonorMedicalDetails', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Successfully Updated Donor.'));
};

exports.screenDonor = async (req,res) => {
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR], userRole, res);
  let args=req.body;
  console.log(args);
  args= [JSON.stringify(args)];
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:screenDonor', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Screening successful.'));
}

exports.collectBlood = async (req,res) => {
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR], userRole, res);
  let args=req.body;
  console.log(args);
  args= [JSON.stringify(args)];
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:bloodCollection', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Blood Collection successful.'));
}
/**
 * @param  {Request} req role in the header and hospitalId, doctorId in the url
 * @param  {Response} res A 200 response if doctor is present else a 500 response with a error json
 * @description This method retrives an existing doctor
 */
exports.getDoctorById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_DOCTOR], userRole, res);
  const hospitalId = parseInt(req.params.hospitalId);
  // Set up and connect to Fabric Gateway
  const userId = hospitalId === 1 ? 'hosp1admin' : hospitalId === 2 ? 'hosp2admin' : 'hosp3admin';
  const doctorId = req.params.doctorId;
  const networkObj = await network.connectToNetwork(userId);
  // Use the gateway and identity service to get all users enrolled by the CA
  const response = await network.getAllDoctorsByHospitalId(networkObj, hospitalId);
  // Filter the result using the doctorId
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(response.filter(
    function(response) {
      return response.id === doctorId;
    },
  )[0]);
};
