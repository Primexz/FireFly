"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plugin = void 0;
/**
 * DisTube Plugin
 * @abstract
 * @private
 */
class Plugin {
    init(distube) {
        /**
         * DisTube
         * @type {DisTube}
         */
        this.distube = distube;
    }
    /**
     * Type of the plugin
     * @name Plugin#type
     * @type {PluginType}
     */
    /**
     * Emit the {@link DisTube} of this base
     * @param {string} eventName Event name
     * @param {...any} args arguments
     * @returns {boolean}
     */
    emit(eventName, ...args) {
        return this.distube.emit(eventName, ...args);
    }
    /**
     * Emit error event
     * @param {Error} error error
     * @param {Discord.TextChannel?} channel Text channel where the error is encountered.
     */
    emitError(error, channel) {
        this.distube.emitError(error, channel);
    }
    /**
     * The queue manager
     * @type {QueueManager}
     * @readonly
     */
    get queues() {
        return this.distube.queues;
    }
    /**
     * The voice manager
     * @type {DisTubeVoiceManager}
     * @readonly
     */
    get voices() {
        return this.distube.voices;
    }
    /**
     * Discord.js client
     * @type {Discord.Client}
     * @readonly
     */
    get client() {
        return this.distube.client;
    }
    /**
     * DisTube options
     * @type {DisTubeOptions}
     * @readonly
     */
    get options() {
        return this.distube.options;
    }
    /**
     * DisTube handler
     * @type {DisTubeHandler}
     * @readonly
     */
    get handler() {
        return this.distube.handler;
    }
    /**
     * Check if the url is working with this plugin
     * @param {string} url Input url
     * @returns {Promise<boolean>}
     */
    async validate(url) {
        return false;
    }
    /**
     * Get the stream url from {@link Song#url}. Returns {@link Song#url} by default.
     * Not needed if the plugin plays song from YouTube.
     * @param {string} url Input url
     * @returns {Promise<string>}
     */
    async getStreamURL(url) {
        return url;
    }
    /**
     * (Optional) Get related songs from a supported url. {@link Song#member} should be `undefined`.
     * Not needed to add {@link Song#related} because it will be added with this function later.
     * @param {string} url Input url
     * @returns {Promise<Song[]>}
     */
    async getRelatedSongs(url) {
        return [];
    }
}
exports.Plugin = Plugin;
exports.default = Plugin;
//# sourceMappingURL=Plugin.js.map