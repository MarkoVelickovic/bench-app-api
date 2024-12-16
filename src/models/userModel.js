const admin = require('../config/firebaseConfig.js');
const db = admin.firestore();

// Reference to the 'sessions' collection
const usersCollection = db.collection('users');

class UserModel {
    static async getUser(email) {
        try {
            const user = await usersCollection.where("email", "==", email).get().docs.at(0);
            if(!user) {
                throw new Error("User does not exist");
            }

            return user;
        }
        catch(error) {
            throw new Error(`Error fetching user: ${error.message}`);
        }
    }

    static async createUser(user) {
        try {
            const userRef = await usersCollection.add(user);
            return userRef;
        }
        catch(error) {
            throw new Error(`Error createing user: ${error.message}`)
        }
    }

    static async deleteUser(userId) {
        try {
            (await usersCollection.doc(userId)).delete
        }
        catch(error) {
            throw new Error(`Error deleting user: ${error.message}`)
        } 
    }

    static async addCompany(userId, companyId) {
        try {
            (await usersCollection.doc(userId)).set({
                companyId: companyId
            }, {
                merge: true
            });
        }
        catch(error) {
            throw new Error(`Error adding company to user: ${error.message}`);
        }
    }

    static async getUserByEmail(email) {
        try {
            const user = (await usersCollection.where("email", "==", email).get()).docs.at(0);
            console.log(user.data());
            if(!user) {
                throw new Error("User not found.");
            }

            return {
                id: user.id,
                ...user.data()
            };
        }
        catch(error) {
            throw new Error(`Error while getting user: ${error.message}`)
        }
    }
}

module.exports = UserModel;