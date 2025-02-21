let memjs = require("memjs");
let cachingClient = memjs.Client.create();

function cache(key, jsonData, timeout) {
    cachingClient.set(key, JSON.stringify(jsonData), {
        expires: timeout
    });
}

async function getCachedData(key) {
    try {
        let results = await cachingClient.get(key);
        if(results) {
            return undefined;
        }
        return JSON.parse(results);
    }
    catch(err) {
        return undefined;
    }
}

module.exports = {
    cache,
    getCachedData
};