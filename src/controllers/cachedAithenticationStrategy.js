const SessionModel = require("../models/sessionModel");
const { getCachedData, cache } = require("../config/memecachedConfig.js")

class ChachedAuthenticationStrategy {
     constructor(auth, cache) {
        this.authetnticateCachedToken = auth;
        this.setCachedUathenticationToken = cache;
     }
}

class CachedAuthenticationStrategyFirebase extends ChachedAuthenticationStrategy {
    constructor() {
        super(
            async (token, companyId) => {
                return await SessionModel.authorizeCompanyAccess(companyId, token);
            },
            
        async (token, companyId) => {
            await SessionModel.registerSession(companyId, token);
        }
        )
    }
}

class CachedAuthenticationStrategyMemcached extends ChachedAuthenticationStrategy {
    constructor() {
        super(
            async (token, companyId) => {
                let cached =  await getCachedData(token);
                return companyId == cached?.companyId;
            },
            
        async (token, companyId) => {
            console.log(companyId)
            await cache(token, companyId);
        }
        )
    }
}

module.exports = {
    CachedAuthenticationStrategyFirebase,
    CachedAuthenticationStrategyMemcached
}