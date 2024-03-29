"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entersState = exports.checkInvalidKey = exports.isClientInstance = exports.resolveGuildID = exports.isGuildInstance = exports.isSupportedVoiceChannel = exports.isMessageInstance = exports.isTextChannelInstance = exports.isMemberInstance = exports.isSnowflake = exports.isVoiceChannelEmpty = exports.checkIntents = exports.isURL = exports.parseNumber = exports.toSecond = exports.formatDuration = void 0;
const url_1 = require("url");
const _1 = require(".");
const discord_js_1 = require("discord.js");
const formatInt = (int) => (int < 10 ? `0${int}` : int);
/**
 * Format duration to string
 * @param {number} sec Duration in seconds
 * @returns {string}
 */
function formatDuration(sec) {
    if (!sec || !Number(sec))
        return "00:00";
    const seconds = Math.round(sec % 60);
    const minutes = Math.floor((sec % 3600) / 60);
    const hours = Math.floor(sec / 3600);
    if (hours > 0)
        return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
    if (minutes > 0)
        return `${formatInt(minutes)}:${formatInt(seconds)}`;
    return `00:${formatInt(seconds)}`;
}
exports.formatDuration = formatDuration;
/**
 * Convert formatted duration to seconds
 * @param {*} input Formatted duration string
 * @returns {number}
 */
function toSecond(input) {
    if (!input)
        return 0;
    if (typeof input !== "string")
        return Number(input) || 0;
    if (input.match(/:/g)) {
        const time = input.split(":").reverse();
        let s = 0;
        for (let i = 0; i < 3; i++)
            if (time[i])
                s += Number(time[i].replace(/[^\d.]+/g, "")) * Math.pow(60, i);
        if (time.length > 3)
            s += Number(time[3].replace(/[^\d.]+/g, "")) * 24 * 60 * 60;
        return s;
    }
    else {
        return Number(input.replace(/[^\d.]+/g, "")) || 0;
    }
}
exports.toSecond = toSecond;
/**
 * Parse number from input
 * @param {*} input Any
 * @returns {number}
 */
function parseNumber(input) {
    if (typeof input === "string")
        return Number(input.replace(/[^\d.]+/g, "")) || 0;
    return Number(input) || 0;
}
exports.parseNumber = parseNumber;
/**
 * Check if the string is an URL
 * @param {string} input input
 * @returns {boolean}
 */
function isURL(input) {
    if (typeof input !== "string" || input.includes(" "))
        return false;
    try {
        const url = new url_1.URL(input);
        if (!["https:", "http:"].includes(url.protocol) || !url.host)
            return false;
    }
    catch {
        return false;
    }
    return true;
}
exports.isURL = isURL;
/**
 * Check if the Client has enough intents to using DisTube
 * @param {ClientOptions} options options
 */
function checkIntents(options) {
    var _a, _b;
    const requiredIntents = ["GUILD_VOICE_STATES"];
    const bitfield = (_a = options.intents) !== null && _a !== void 0 ? _a : (_b = options === null || options === void 0 ? void 0 : options.ws) === null || _b === void 0 ? void 0 : _b.intents;
    if (typeof bitfield === "undefined")
        return;
    const intents = new discord_js_1.Intents(bitfield);
    for (const intent of requiredIntents) {
        if (!intents.has(intent))
            throw new _1.DisTubeError("MISSING_INTENTS", intent.toString());
    }
}
exports.checkIntents = checkIntents;
/**
 * Check if the voice channel is empty
 * @param {Discord.VoiceState} voiceState voiceState
 * @returns {boolean}
 */
function isVoiceChannelEmpty(voiceState) {
    var _a, _b, _c;
    const voiceChannel = (_c = (_b = (_a = voiceState.guild) === null || _a === void 0 ? void 0 : _a.me) === null || _b === void 0 ? void 0 : _b.voice) === null || _c === void 0 ? void 0 : _c.channel;
    if (!voiceChannel)
        return false;
    const members = voiceChannel.members.filter(m => !m.user.bot);
    return !members.size;
}
exports.isVoiceChannelEmpty = isVoiceChannelEmpty;
function isSnowflake(id) {
    try {
        return discord_js_1.SnowflakeUtil.deconstruct(id).timestamp > discord_js_1.SnowflakeUtil.EPOCH;
    }
    catch {
        return false;
    }
}
exports.isSnowflake = isSnowflake;
function isMemberInstance(member) {
    var _a, _b;
    return (!!member &&
        isSnowflake(member.id) &&
        isSnowflake((_a = member.guild) === null || _a === void 0 ? void 0 : _a.id) &&
        isSnowflake((_b = member.user) === null || _b === void 0 ? void 0 : _b.id) &&
        member.id === member.user.id);
}
exports.isMemberInstance = isMemberInstance;
function isTextChannelInstance(channel) {
    var _a;
    return (!!channel &&
        isSnowflake(channel.id) &&
        isSnowflake((_a = channel.guild) === null || _a === void 0 ? void 0 : _a.id) &&
        typeof channel.send === "function" &&
        typeof channel.awaitMessages === "function");
}
exports.isTextChannelInstance = isTextChannelInstance;
function isMessageInstance(message) {
    var _a, _b;
    // Simple check for using distube normally
    return (!!message &&
        isSnowflake(message.id) &&
        isSnowflake((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id) &&
        isTextChannelInstance(message.channel) &&
        isMemberInstance(message.member) &&
        isSnowflake((_b = message.author) === null || _b === void 0 ? void 0 : _b.id) &&
        message.member.id === message.author.id &&
        message.guild.id === message.channel.guild.id);
}
exports.isMessageInstance = isMessageInstance;
function isSupportedVoiceChannel(channel) {
    var _a;
    return (!!channel &&
        typeof channel.joinable === "boolean" &&
        isSnowflake(channel.id) &&
        isSnowflake((_a = channel.guild) === null || _a === void 0 ? void 0 : _a.id) &&
        typeof channel.full === "boolean" &&
        [
            // Djs v12
            "voice",
            "stage",
            // Djs v13
            "GUILD_VOICE",
            "GUILD_STAGE_VOICE",
        ].includes(channel.type));
}
exports.isSupportedVoiceChannel = isSupportedVoiceChannel;
function isGuildInstance(guild) {
    return !!guild && isSnowflake(guild.id) && typeof guild.fetchAuditLogs === "function";
}
exports.isGuildInstance = isGuildInstance;
function resolveGuildID(resolvable) {
    let guildID;
    if (typeof resolvable === "string") {
        guildID = resolvable;
    }
    else if (typeof resolvable === "object") {
        if (resolvable instanceof _1.Queue || resolvable instanceof _1.DisTubeVoice)
            guildID = resolvable.id;
        else if ("guild" in resolvable && isGuildInstance(resolvable.guild))
            guildID = resolvable.guild.id;
        else if ("id" in resolvable && isGuildInstance(resolvable))
            guildID = resolvable.id;
    }
    if (!isSnowflake(guildID))
        throw new _1.DisTubeError("INVALID_TYPE", "GuildIDResolvable", resolvable);
    return guildID;
}
exports.resolveGuildID = resolveGuildID;
function isClientInstance(client) {
    return !!client && typeof client.login === "function";
}
exports.isClientInstance = isClientInstance;
function checkInvalidKey(target, source, sourceName) {
    if (typeof target !== "object" || Array.isArray(target)) {
        throw new _1.DisTubeError("INVALID_TYPE", "object", target, sourceName);
    }
    const sourceKeys = Array.isArray(source) ? source : Object.keys(source);
    const invalidKey = Object.keys(target).find(key => !sourceKeys.includes(key));
    if (invalidKey)
        throw new _1.DisTubeError("INVALID_KEY", sourceName, invalidKey);
}
exports.checkInvalidKey = checkInvalidKey;
async function waitEvent(target, status, maxTime) {
    let cleanup = () => undefined;
    try {
        await new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error(`Didn't trigger ${status} within ${maxTime}ms`)), maxTime);
            target.once(status, resolve);
            target.once("error", reject);
            cleanup = () => {
                clearTimeout(timeout);
                target.off(status, resolve);
                target.off("error", reject);
            };
        });
        return target;
    }
    finally {
        cleanup();
    }
}
async function entersState(target, status, maxTime) {
    if (target.state.status === status)
        return target;
    return waitEvent(target, status, maxTime);
}
exports.entersState = entersState;
//# sourceMappingURL=util.js.map