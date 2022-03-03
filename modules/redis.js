const {createClient} = require('redis')
require('dotenv').config()

module.exports.rCache = class rCache {
    redisClient

    constructor() {
        this.redisClient = createClient({
            url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
        })
    }

    async init() {
        await this.redisClient.connect();
        return this.redisClient
    }

    async disconnect() {
        await this.redisClient.quit()
    }
}


