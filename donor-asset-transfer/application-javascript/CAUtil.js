/**
 *
 * @param {*} FabricCAServices
 * @param {*} ccp
 * @param {string} caHostName
 * @return {*} caClient
 * @description Create a new CA client for interacting with the CA.
 */
exports.buildCAClient = (FabricCAServices, ccp, caHostName) => {
  const caInfo = ccp.certificateAuthorities[caHostName]; // lookup CA details from config
  const caTLSCACerts = caInfo.tlsCACerts.pem;
  const caClient = new FabricCAServices(caInfo.url, {trustedRoots: caTLSCACerts, verify: false}, caInfo.caName);

  console.log(`Built a CA Client named ${caInfo.caName}`);
  return caClient;
};

/**
 * @author Jathin Sreenivas
 * @param  {*} caClient
 * @param  {*} wallet
 * @param  {string} orgMspId
 * @param  {string} adminUserId
 * @param  {string} adminUserPasswd
 * @description Enrolls an admin to the orgMspId
 */
exports.enrollAdmin = async (caClient, wallet, orgMspId, adminUserId, adminUserPasswd) => {
  try {
    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(adminUserId);
    if (identity) {
      console.log('An identity for the admin user already exists in the wallet');
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await caClient.enroll({enrollmentID: adminUserId, enrollmentSecret: adminUserPasswd});
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: 'X.509',
    };
    await wallet.put(adminUserId, x509Identity);
    console.log('Successfully enrolled admin user and imported it into the wallet');
  } catch (error) {
    console.error(`Failed to enroll admin user : ${error}`);
  }
};


/**
 * @author Jathin Sreenivas
 * @param  {*} caClient
 * @param  {*} wallet
 * @param  {string} orgMspId
 * @param  {string} userId
 * @param  {string} adminUserId
 * @param  {string} attributes
 * @param  {string} affiliation
 * @description Method to create the user and enrol to the organization and adds the user to the wallet.
 */
exports.registerAndEnrollUser = async (caClient, wallet, orgMspId, userId, adminUserId, attributes, affiliation) => {
  try {
    // Check to see if we've already enrolled the user
    const userIdentity = await wallet.get(userId);
    if (userIdentity) {
      console.log(`An identity for the user ${userId} already exists in the wallet`);
      throw new Error(`An identity for the user ${userId} already exists in the wallet`);
    }

    // Must use an admin to register a new user
    const adminIdentity = await wallet.get(adminUserId);
    if (!adminIdentity) {
      console.log(`An identity for the admin user ${adminUserId} does not exist in the wallet`);
      throw new Error(`An identity for the admin user ${adminUserId} does not exist in the wallet`);
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

    // Get all the parameters from the JSON string
    attributes = JSON.parse(attributes);
    const fullName = attributes.fullName;
    const address = attributes.address;
    const phoneNumber = attributes.phoneNumber;
    const emergPhoneNumber = attributes.emergPhoneNumber;
    const role = attributes.role;
    const registration = (role === 'doctor')|| (role === 'technician')? attributes.registration : '';


    // Register the user, enroll the user, and import the new identity into the wallet.
    // if affiliation is specified by client, the affiliation value must be configured in CA
    // NOTE: Pubic key can be added into attrs
    const secret = await caClient.register({
      affiliation: affiliation,
      enrollmentID: userId,
      // NOTE: Role must be client, other roles access is denied
      // TODO: Check if other roles access can be granted in the ca config files of the organizations.
      // Changes to be made in fabric-ca-server-config.yaml ?? hf.Registrar.Roles and maps
      role: 'client',
      attrs: [{
        name: 'fullName',
        value: fullName,
        ecert: true,
      },
      {
        name: 'address',
        value: address,
        ecert: true,
      },
      {
        name: 'phoneNumber',
        value: phoneNumber,
        ecert: true,
      },
      {
        name: 'emergPhoneNumber',
        value: emergPhoneNumber,
        ecert: true,
      },
      {
        name: 'role',
        value: role,
        ecert: true,
      },
      {
        name: 'registration',
        value: registration,
        ecert: true,
      }],
    }, adminUser);
    const enrollment = await caClient.enroll({
      enrollmentID: userId,
      enrollmentSecret: secret,
      attrs: [{
        name: 'fullName',
        value: fullName,
        ecert: true,
      },
      {
        name: 'address',
        value: address,
        ecert: true,
      },
      {
        name: 'phoneNumber',
        value: phoneNumber,
        ecert: true,
      },
      {
        name: 'emergPhoneNumber',
        value: emergPhoneNumber,
        ecert: true,
      },
      {
        name: 'role',
        value: role,
        ecert: true,
      },
      {
        name: 'registration',
        value: registration,
        ecert: true,
      }],
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: orgMspId,
      type: 'X.509',
    };
    await wallet.put(userId, x509Identity);
    console.log(`Successfully registered and enrolled user ${userId} and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to register user ${userId} : ${error}`);
    throw new Error(`Failed to register user ${userId}`);
  }
};


exports.deleteAndRevokeUser = async (caClient, wallet, userId, adminUserId) => {
  try {
    console.log(userId);
    console.log(adminUserId);
    console.log(wallet);
    console.log(caClient);
    // Check if the user identity exists in the wallet
    const userIdentity = await wallet.get(userId);
    if (!userIdentity) {
      console.log(`Identity for user ${userId} not found in the wallet`);
      throw new Error(`Identity for user ${userId} not found in the wallet`);
    }

    // Must use an admin to delete a user
    const adminIdentity = await wallet.get(adminUserId);
    if (!adminIdentity) {
      console.log(`An identity for the admin user ${adminUserId} does not exist in the wallet`);
      throw new Error(`An identity for the admin user ${adminUserId} does not exist in the wallet`);
    }

    // build a user object for authenticating with the CA
    const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, adminUserId);

    // Revoke the user's certificate
    await caClient.revoke({
      enrollmentID: userId,
    }, adminUser);

    // Remove the identity from the wallet
    await wallet.remove(userId);

    console.log(`Successfully deleted user ${userId} and revoked the certificate`);
  } catch (error) {
    console.error(`Failed to delete user ${userId} : ${error}`);
    throw new Error(`Failed to delete user ${userId}`);
  }
};
