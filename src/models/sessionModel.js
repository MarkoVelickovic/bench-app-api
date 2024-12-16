const admin = require('../config/firebaseConfig.js');
const db = admin.firestore();

// Reference to the 'sessions' collection
const sessionsCollection = db.collection('sessions');

class SessionModel {
    static async registerSession(companyId, token) {
        try {
            const sessionRef = await sessionsCollection.add({
                companyAccessId: companyId,
                token: token
            });
            return sessionRef.id;
          } catch (error) {
            throw new Error(`Error creating session: ${error.message}`);
          }
    }

    static async getSession(token) {
        try {
            const session = await sessionsCollection.where("token", "==", token).get();
            if(session.empty) {
                throw new Error("Error, user not logged in.");
            }
            return session.docs.at(0);
        }
        catch(error) {
            throw new Error(`Error fetching session: ${error.message}`);
        }
    }

    static async authorizeCompanyAccess(companyId, token) {
        try {
            const session = await this.getSession(token);
            console.log(session.data().companyAccessId + " " + companyId);
            if(session.data().companyAccessId == companyId) {
                return true;
            }
            return false;
        }
        catch(error) {
            throw new Error(`Authorization error: ${error.message}`);
        }
    }
}

module.exports = SessionModel;