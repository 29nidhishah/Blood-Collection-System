/**
 * @desc Technician specific methods - API documentation in http://localhost:3002/ swagger editor.
 */

// Bring common classes into scope, and Fabric SDK network class
const {ROLE_TECHNICIAN, capitalize, getMessage, validateRole} = require('../utils.js');
const network = require('../../donor-asset-transfer/application-javascript/app.js');


/**
 * @param  {Request} req Body must be a json, role in the header and donorId in the url
 * @param  {Response} res A 200 response if donor is updated successfully else a 500 response with s simple message json
 * @description Updates an existing asset(donor medical details) in the ledger. This method can be executed only by the technician.
 */

/**
 * @param  {Request} req role in the header and hospitalId, technicianId in the url
 * @param  {Response} res A 200 response if technician is present else a 500 response with a error json
 * @description This method retrives an existing technician
 */
exports.readBloodBag = async (req,res) => {
  const userRole = req.headers.role;
  await validateRole([ROLE_TECHNICIAN], userRole, res);
  let args=req.body;
  console.log(args);
  args=[JSON.stringify(args)];
  const networkObj = await network.connectToNetwork(req.headers.username);
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:readBag', args);
  console.log(response);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(response);
}

exports.bloodTestOfBloodBags = async (req,res) => {
  const userRole = req.headers.role;
  await validateRole([ROLE_TECHNICIAN], userRole, res);
  let args=req.body;
  console.log(args);
  args= [JSON.stringify(args)];
  const networkObj = await network.connectToNetwork(req.headers.username);
  // Invoke the smart contract function
  const response = await network.invoke(networkObj, false, capitalize(userRole) + 'Contract:inputBloodTestValues', args);
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(getMessage(false, 'Blood Test successful.'));
}

exports.getTechnicianById = async (req, res) => {
  // User role from the request header is validated
  const userRole = req.headers.role;
  await validateRole([ROLE_TECHNICIAN], userRole, res);
  const hospitalId = parseInt(req.params.hospitalId);
  // Set up and connect to Fabric Gateway
  const userId = hospitalId === 1 ? 'hosp1admin' : hospitalId === 2 ? 'hosp2admin' : 'hosp3admin';
  const technicianId = req.params.technicianId;
  const networkObj = await network.connectToNetwork(userId);
  // Use the gateway and identity service to get all users enrolled by the CA
  const response = await network.getAllTechniciansByHospitalId(networkObj, hospitalId);
  // Filter the result using the technicianId
  (response.error) ? res.status(500).send(response.error) : res.status(200).send(response.filter(
    function(response) {
      return response.id === technicianId;
    },
  )[0]);
};
