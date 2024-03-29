"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisTubeVoice = void 0;
const tiny_typed_emitter_1 = require("tiny-typed-emitter");
const __1 = require("../..");
const voice_1 = require("@discordjs/voice");
/**
 * Create a voice connection to the voice channel
 */
class DisTubeVoice extends tiny_typed_emitter_1.TypedEmitter {
    constructor(voiceManager, channel) {
        super();
        if (!(0, __1.isSupportedVoiceChannel)(channel))
            throw new __1.DisTubeError("NOT_SUPPORTED_VOICE");
        if (!channel.joinable) {
            if (channel.full)
                throw new __1.DisTubeError("VOICE_FULL");
            else
                throw new __1.DisTubeError("VOICE_MISSING_PERMS");
        }
        this.isDisconnected = false;
        this.id = channel.guild.id;
        this.channel = channel;
        /**
         * The voice manager that instantiated this connection
         * @type {DisTubeVoiceManager}
         */
        this.voices = voiceManager;
        this.voices.add(this.id, this);
        this._volume = 0.5;
        this.audioPlayer = (0, voice_1.createAudioPlayer)()
            .on(voice_1.AudioPlayerStatus.Idle, oldState => {
            if (oldState.status !== voice_1.AudioPlayerStatus.Idle) {
                delete this.audioResource;
                this.emit("finish");
            }
        })
            .on("error", error => {
            if (this.emittedError)
                return;
            this.emittedError = true;
            this.emit("error", error);
        });
        this.connection
            .on(voice_1.VoiceConnectionStatus.Disconnected, (_, newState) => {
            if (newState.reason === voice_1.VoiceConnectionDisconnectReason.WebSocketClose && newState.closeCode === 4014) {
                (0, __1.entersState)(this.connection, voice_1.VoiceConnectionStatus.Connecting, 5e3).catch(() => {
                    this.leave();
                });
            }
            else if (this.connection.rejoinAttempts < 5) {
                setTimeout(() => {
                    this.connection.rejoin();
                }, (this.connection.rejoinAttempts + 1) * 5e3).unref();
            }
            else if (this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                this.leave(new __1.DisTubeError("VOICE_RECONNECT_FAILED"));
            }
        })
            .on(voice_1.VoiceConnectionStatus.Destroyed, () => {
            this.leave();
        })
            // eslint-disable-next-line no-console
            .on("error", console.warn);
        this.connection.subscribe(this.audioPlayer);
        /**
         * Get or set the volume percentage
         * @name DisTubeVoice#volume
         * @type {number}
         */
    }
    get channel() {
        return this._channel;
    }
    set channel(channel) {
        if (!(0, __1.isSupportedVoiceChannel)(channel))
            throw new __1.DisTubeError("NOT_SUPPORTED_VOICE");
        if (channel.guild.id !== this.id)
            throw new __1.DisTubeError("VOICE_CHANGE_GUILD");
        this.connection = this._join(channel);
        this._channel = channel;
    }
    _join(channel) {
        return (0, voice_1.joinVoiceChannel)({
            channelId: channel.id,
            guildId: this.id,
            adapterCreator: channel.guild.voiceAdapterCreator || (0, __1.createDiscordJSAdapter)(channel),
        });
    }
    /**
     * Join a voice channel with this connection
     * @param {Discord.VoiceChannel|Discord.StageChannel} [channel] A voice channel
     * @private
     * @returns {Promise<DisTubeVoice>}
     */
    async join(channel) {
        var _a;
        const TIMEOUT = 30e3;
        if (channel) {
            this.channel = channel;
        }
        try {
            await (0, __1.entersState)(this.connection, voice_1.VoiceConnectionStatus.Ready, TIMEOUT);
        }
        catch {
            if (this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                this.connection.destroy();
            }
            this.voices.delete(this.id);
            if ((_a = this.voiceState) === null || _a === void 0 ? void 0 : _a.connection)
                throw new __1.DisTubeError("VOICE_DEPRECATED_CONNECTION");
            throw new __1.DisTubeError("VOICE_CONNECT_FAILED", TIMEOUT / 1e3);
        }
        return this;
    }
    /**
     * Leave the voice channel of this connection
     * @param {Error} [error] Optional, an error to emit with 'error' event.
     */
    leave(error) {
        this.stop(true);
        if (!this.isDisconnected) {
            this.emit("disconnect", error);
            this.isDisconnected = true;
        }
        if (this.connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed)
            this.connection.destroy();
        this.voices.delete(this.id);
    }
    /**
     * Stop the playing stream
     * @param {boolean} [force=false] If true, will force the {@link DisTubeVoice#audioPlayer} to enter the Idle state
     * even if the {@link DisTubeVoice#audioResource} has silence padding frames.
     * @private
     */
    stop(force = false) {
        this.audioPlayer.stop(force);
    }
    /**
     * Play a readable stream
     * @private
     * @param {DisTubeStream} stream Readable stream
     */
    play(stream) {
        this.emittedError = false;
        stream.stream.on("error", (error) => {
            if (this.emittedError || error.code === "ERR_STREAM_PREMATURE_CLOSE")
                return;
            this.emittedError = true;
            this.emit("error", error);
        });
        this.audioResource = (0, voice_1.createAudioResource)(stream.stream, {
            inputType: stream.type,
            inlineVolume: true,
        });
        // eslint-disable-next-line no-self-assign
        this.volume = this.volume;
        this.audioPlayer.play(this.audioResource);
    }
    set volume(volume) {
        var _a, _b;
        if (typeof volume !== "number" || isNaN(volume)) {
            throw new __1.DisTubeError("INVALID_TYPE", "number", volume, "volume");
        }
        if (volume < 0) {
            throw new __1.DisTubeError("NUMBER_COMPARE", "Volume", "bigger or equal to", 0);
        }
        this._volume = volume / 100;
        (_b = (_a = this.audioResource) === null || _a === void 0 ? void 0 : _a.volume) === null || _b === void 0 ? void 0 : _b.setVolume(Math.pow(this._volume, 0.5 / Math.log10(2)));
    }
    get volume() {
        return this._volume * 100;
    }
    /**
     * Playback duration of the audio resource in seconds
     * @type {number}
     */
    get playbackDuration() {
        var _a;
        return (((_a = this.audioResource) === null || _a === void 0 ? void 0 : _a.playbackDuration) || 0) / 1000;
    }
    pause() {
        this.audioPlayer.pause();
    }
    unpause() {
        this.audioPlayer.unpause();
    }
    /**
     * Whether the bot is self-deafened
     * @type {boolean}
     */
    get selfDeaf() {
        return this.connection.joinConfig.selfDeaf;
    }
    /**
     * Whether the bot is self-muted
     * @type {boolean}
     */
    get selfMute() {
        return this.connection.joinConfig.selfMute;
    }
    /**
     * Self-deafens/undeafens the bot.
     * @param {boolean} selfDeaf Whether or not the bot should be self-deafened
     * @returns {boolean} true if the voice state was successfully updated, otherwise false
     */
    setSelfDeaf(selfDeaf) {
        if (typeof selfDeaf !== "boolean") {
            throw new __1.DisTubeError("INVALID_TYPE", "boolean", selfDeaf, "selfDeaf");
        }
        return this.connection.rejoin({
            ...this.connection.joinConfig,
            selfDeaf,
        });
    }
    /**
     * Self-mutes/unmutes the bot.
     * @param {boolean} selfMute Whether or not the bot should be self-muted
     * @returns {boolean} true if the voice state was successfully updated, otherwise false
     */
    setSelfMute(selfMute) {
        if (typeof selfMute !== "boolean") {
            throw new __1.DisTubeError("INVALID_TYPE", "boolean", selfMute, "selfMute");
        }
        return this.connection.rejoin({
            ...this.connection.joinConfig,
            selfMute,
        });
    }
    /**
     * The voice state of this connection
     * @type {Discord.VoiceState?}
     */
    get voiceState() {
        var _a, _b, _c;
        return (_c = (_b = (_a = this.channel) === null || _a === void 0 ? void 0 : _a.guild) === null || _b === void 0 ? void 0 : _b.me) === null || _c === void 0 ? void 0 : _c.voice;
    }
}
exports.DisTubeVoice = DisTubeVoice;
exports.default = DisTubeVoice;
//# sourceMappingURL=DisTubeVoice.js.map