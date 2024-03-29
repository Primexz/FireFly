"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisTubeError = void 0;
const ERROR_MESSAGES = {
    INVALID_TYPE: (expected, got, name) => {
        var _a, _b;
        return `Expected ${Array.isArray(expected) ? expected.map(e => (typeof e === "number" ? e : `'${e}'`)).join(" or ") : `'${expected}'`}${name ? ` for '${name}'` : ""}, but got ${JSON.stringify(got)} (${(_b = (_a = got === null || got === void 0 ? void 0 : got.constructor) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : typeof got})`;
    },
    NUMBER_COMPARE: (name, expected, value) => `'${name}' must be ${expected} ${value}`,
    EMPTY_ARRAY: (name) => `'${name}' is an empty array`,
    EMPTY_FILTERED_ARRAY: (name, type) => `There is no valid '${type}' in the '${name}' array`,
    INVALID_KEY: (obj, key) => `'${key}' does not need to be provided in ${obj}`,
    EMPTY_STRING: (name) => `'${name}' string must not be empty`,
    MISSING_INTENTS: (i) => `${i} intent must be provided for the Client`,
    DISABLED_OPTION: (o) => `DisTubeOptions.${o} is disabled`,
    ENABLED_OPTION: (o) => `DisTubeOptions.${o} is enabled`,
    NOT_IN_VOICE: "User is not in any voice channel",
    NOT_SUPPORTED_VOICE: "DisTubeVoice only supports VoiceChannel or a StageChannel",
    VOICE_FULL: "The voice channel is full",
    VOICE_CONNECT_FAILED: (s) => `Cannot connect to the voice channel after ${s} seconds`,
    VOICE_MISSING_PERMS: "You do not have permission to join this voice channel",
    VOICE_RECONNECT_FAILED: "Cannot reconnect to the voice channel",
    VOICE_CHANGE_GUILD: "Cannot join a channel in a different guild",
    VOICE_DEPRECATED_CONNECTION: "Cannot connect to the voice channel due to a deprecated connection is created.\n" +
        "Read more: https://distube.js.org/guide/additional-info/update.html#voice",
    NO_QUEUE: "There is no playing queue in this guild",
    QUEUE_EXIST: "This guild has a Queue already",
    ADD_BEFORE_PLAYING: "Cannot add Song before the playing Song",
    PAUSED: "The queue has been paused already",
    RESUMED: "The queue has been playing already",
    NO_PREVIOUS: "There is no previous song in this queue",
    NO_UP_NEXT: "There is no up next song",
    NO_SONG_POSITION: "Does not have any song at this position",
    NO_PLAYING: "There is no playing song in the queue",
    NO_RESULT: "No result found",
    NO_RELATED: "Cannot find any related songs",
    CANNOT_PLAY_RELATED: "Cannot play the related song",
    UNAVAILABLE_VIDEO: "This video is unavailable",
    UNPLAYABLE_FORMATS: "No playable format found",
    NON_NSFW: "Cannot play age-restricted content in non-NSFW channel",
    NOT_SUPPORTED_URL: "This url is not supported",
    CANNOT_RESOLVE_SONG: (t) => `Cannot resolve ${t} to a Song`,
    NO_VALID_SONG: "'songs' array does not have any valid Song, SearchResult or url",
    EMPTY_FILTERED_PLAYLIST: "There is no valid video in the playlist\n" +
        "Maybe age-restricted contents is filtered because you are in non-NSFW channel",
    EMPTY_PLAYLIST: "There is no valid video in the playlist",
};
const errMsg = (msg, ...args) => (typeof msg === "string" ? msg : msg(...args));
const haveCode = (code) => Object.keys(ERROR_MESSAGES).includes(code);
class DisTubeError extends Error {
    constructor(code, ...args) {
        if (haveCode(code))
            super(errMsg(ERROR_MESSAGES[code], ...args));
        else
            super(...args);
        this.errorCode = code;
        if (Error.captureStackTrace)
            Error.captureStackTrace(this, DisTubeError);
    }
    get name() {
        return `DisTubeError [${this.errorCode}]`;
    }
    get code() {
        return this.errorCode;
    }
}
exports.DisTubeError = DisTubeError;
exports.default = DisTubeError;
//# sourceMappingURL=DisTubeError.js.map