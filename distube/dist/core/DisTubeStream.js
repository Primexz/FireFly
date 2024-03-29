"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisTubeStream = exports.chooseBestVideoFormat = void 0;
const __1 = require("..");
const prism_media_1 = require("prism-media");
const struct_1 = require("../struct");
const voice_1 = require("@discordjs/voice");
const chooseBestVideoFormat = (formats, isLive = false) => {
    let filter = (format) => format.hasAudio;
    if (isLive)
        filter = (format) => format.hasAudio && format.isHLS;
    formats = formats
        .filter(filter)
        .sort((a, b) => Number(b.audioBitrate) - Number(a.audioBitrate) || Number(a.bitrate) - Number(b.bitrate));
    return formats.find(format => !format.hasVideo) || formats.sort((a, b) => Number(a.bitrate) - Number(b.bitrate))[0];
};
exports.chooseBestVideoFormat = chooseBestVideoFormat;
/**
 * Create a stream to play with {@link DisTubeVoice}
 * @private
 */
class DisTubeStream {
    /**
     * Create a DisTubeStream to play with {@link DisTubeVoice}
     * @param {string} url Stream URL
     * @param {StreamOptions} options Stream options
     * @private
     */
    constructor(url, options) {
        /**
         * Stream URL
         * @type {string}
         */
        this.url = url;
        /**
         * Stream type
         * @type {DiscordVoice.StreamType.Raw}
         */
        this.type = voice_1.StreamType.Raw;
        const args = [
            "-reconnect",
            "1",
            "-reconnect_streamed",
            "1",
            "-reconnect_delay_max",
            "5",
            "-i",
            url,
            "-analyzeduration",
            "0",
            "-loglevel",
            "0",
            "-ar",
            "48000",
            "-ac",
            "2",
            "-f",
            "s16le",
        ];
        if (typeof options.seek === "number" && options.seek > 0) {
            args.unshift("-ss", options.seek.toString());
        }
        if (Array.isArray(options.ffmpegArgs)) {
            args.push(...options.ffmpegArgs);
        }
        /**
         * FFmpeg stream (Duplex)
         * @type {FFmpeg}
         */
        this.stream = new prism_media_1.FFmpeg({ args, shell: false });
    }
    /**
     * Create a stream from ytdl video formats
     * @param {ytdl.videoFormat[]} formats ytdl video formats
     * @param {StreamOptions} options options
     * @returns {DisTubeStream}
     * @private
     */
    static YouTube(formats, options = {}) {
        if (!formats || !formats.length)
            throw new struct_1.DisTubeError("UNAVAILABLE_VIDEO");
        if (!options || typeof options !== "object" || Array.isArray(options)) {
            throw new struct_1.DisTubeError("INVALID_TYPE", "object", options, "options");
        }
        const bestFormat = (0, exports.chooseBestVideoFormat)(formats, options.isLive);
        if (!bestFormat)
            throw new struct_1.DisTubeError("UNPLAYABLE_FORMATS");
        return new DisTubeStream(bestFormat.url, options);
    }
    /**
     * Create a stream from a stream url
     * @param {string} url stream url
     * @param {StreamOptions} options options
     * @returns {DisTubeStream}
     * @private
     */
    static DirectLink(url, options = {}) {
        if (!options || typeof options !== "object" || Array.isArray(options)) {
            throw new struct_1.DisTubeError("INVALID_TYPE", "object", options, "options");
        }
        if (typeof url !== "string" || !(0, __1.isURL)(url)) {
            throw new struct_1.DisTubeError("INVALID_TYPE", "an URL", url);
        }
        return new DisTubeStream(url, options);
    }
}
exports.DisTubeStream = DisTubeStream;
exports.default = DisTubeStream;
//# sourceMappingURL=DisTubeStream.js.map