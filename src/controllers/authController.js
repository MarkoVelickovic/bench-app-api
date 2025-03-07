const admin = require('../config/firebaseConfig.js');
const axios = require('axios');
const SessionModel = require('../models/sessionModel.js');
const UserModel = require('../models/userModel.js');
const CompanyModel = require('../models/companyModel.js');
const EmployeeModel = require('../models/employeeModel.js');
const { CachedAuthenticationStrategyFirebase, CachedAuthenticationStrategyMemcached } = require('./cachedAithenticationStrategy.js');
const db = admin.firestore();
const jwt = require("jsonwebtoken");

const companyCollection = db.collection('companies');
const sessionsCollection = db.collection('sessions');


/**
 * Controller for authentication operations.
 */
class AuthController {

  static authenticationCachingStrategy = new CachedAuthenticationStrategyFirebase();
  static JWT_S_PART = "69b1c549fadaad949604bdf1fc515568e18169c2b55bb1c0fb2a58a13672d02adeaf8fb175bb2cbb9f17ec650e5c4178ddb256d20523af4219d820170163360db98a"

  /**
   * Register a new user (Company or Client).
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async signup(req, res) {
    const { email, password, userType, displayName } = req.body;

    if (!email || !password || !userType) {
      return res.status(400).json({ error: 'Email, password, and userType are required.' });
    }

    try {
      // Create a new user with Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName,
      });

      // Assign custom claims based on userType ('company' or 'client')
      await admin.auth().setCustomUserClaims(userRecord.uid, { userType });

      // Generate a custom token for the new user
      const customToken = await admin.auth().createCustomToken(userRecord.uid);
      const userRef = await UserModel.createUser({
        email: email,
        uuid: userRecord.uid
      });
      res.status(201).json({
        message: 'User registered successfully.',
        token: customToken,
        userId: userRef.id
      });
    } catch (error) {
      console.error('Error registering user:', error);
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Log in a user and issue an authentication token.
   * Note: Firebase Admin SDK doesn't support email/password login directly.
   * We'll use Firebase Authentication REST API for this purpose.
   * @param {Object} req - Express request object.
   * @param {Object} res - Express response object.
   */
  static async login(req, res) {
    const { email, password } = req.body;
    const firebaseApiKey = process.env.FIREBASE_API_KEY; // Ensure this is set in your .env file

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    try {
      // Use Firebase Authentication REST API to log in the user
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${firebaseApiKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      );

      const { idToken } = response.data;
      const jwtToken = jwt.sign(email, AuthController.JWT_S_PART + idToken);

      const user = await UserModel.getUserByEmail(email);
      let companyId = "";

      if(user.companyId) {
      companyId = await companyCollection.doc(user.companyId).id;
      // if(!companyId) {
      //   res.status(500).json({
      //     error: "No Company connected to the user."
      //   })
      // }

      console.log(companyId)

      if(companyId != undefined) {
        console.log(companyId)
      await AuthController.authenticationCachingStrategy.setCachedUathenticationToken("Bearer " + idToken, companyId);
      }
    }

      res.status(200).json({
        message: 'User logged in successfully.',
        token: idToken,
        backupToken: jwtToken,
        companyId: companyId ?? "",
        userId: user.id
      });
    } catch (error) {
      console.error('Error logging in user:', error.response ? error.response.data : error.message);
      res.status(400).json({ error: error.response ? error.response.data.error.message : error.message });
    }
  }

  static async getUser(email) {
    try {

    }
    catch(error) {

    }
  }

  static async deleteAccount(req, res) {
    const { companyId, userId } = req.body;

    try {
      if(companyId && !(await AuthController.authenticationCachingStrategy.authetnticateCachedToken(req.headers.authorization, companyId))) {
        return res.status(403).json({
          error: "Access not allowed."
        });
      }

      if(companyId) {
      const company = await CompanyModel.getCompanyById(companyId);
      const employees = await EmployeeModel.getEmployeesByCompanyId(companyId);

      employees.forEach(async (employee) => {
        await EmployeeModel.deleteEmployee(employee.id);
      });

      await CompanyModel.deleteCompany(company.id);
    }

      const firebaseUuid = (await UserModel.getUser(userId))?.uuid;
      await UserModel.deleteUser(userId);

      await admin.auth().deleteUser(firebaseUuid);

      return res.status(200).json({
        message: "Account deleted successfully."
      });
    }
    catch(error) {
      return res.status(500).json({
        error: `Error deleting account: ${error.message}`
      });
    }
  }
}

module.exports = AuthController;
