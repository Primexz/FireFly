"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Queue = void 0;
const core_1 = require("../core");
const __1 = require("..");
/**
 * Represents a queue.
 * @extends DisTubeBase
 */
class Queue extends core_1.DisTubeBase {
    /**
     * Create a queue for the guild
     * @param {DisTube} distube DisTube
     * @param {DisTubeVoice} voice Voice connection
     * @param {Song|Song[]} song First song(s)
     * @param {Discord.TextChannel?} textChannel Default text channel
     */
    constructor(distube, voice, song, textChannel) {
        var _a;
        super(distube);
        /**
         * The client user as a `GuildMember` of this queue's guild
         * @type {Discord.GuildMember}
         */
        this.clientMember = (_a = voice.channel.guild) === null || _a === void 0 ? void 0 : _a.me;
        /**
         * Voice connection of this queue.
         * @type {DisTubeVoice}
         */
        this.voice = voice;
        /**
         * Queue id (Guild id)
         * @type {Discord.Snowflake}
         */
        this.id = voice.id;
        /**
         * Get or set the stream volume. Default value: `50`.
         * @type {number}
         */
        this.volume = 50;
        /**
         * List of songs in the queue (The first one is the playing song)
         * @type {Array<Song>}
         */
        this.songs = Array.isArray(song) ? [...song] : [song];
        /**
         * List of the previous songs.
         * @type {Array<Song>}
         */
        this.previousSongs = [];
        /**
         * Whether stream is currently stopped.
         * @type {boolean}
         * @private
         */
        this.stopped = false;
        /**
         * Whether or not the last song was skipped to next song.
         * @type {boolean}
         * @private
         */
        this.next = false;
        /**
         * Whether or not the last song was skipped to previous song.
         * @type {boolean}
         * @private
         */
        this.prev = false;
        /**
         * Whether or not the stream is currently playing.
         * @type {boolean}
         */
        this.playing = true;
        /**
         * Whether or not the stream is currently paused.
         * @type {boolean}
         */
        this.paused = false;
        /**
         * Type of repeat mode (`0` is disabled, `1` is repeating a song, `2` is repeating all the queue).
         * Default value: `0` (disabled)
         * @type {RepeatMode}
         */
        this.repeatMode = __1.RepeatMode.DISABLED;
        /**
         * Whether or not the autoplay mode is enabled.
         * Default value: `false`
         * @type {boolean}
         */
        this.autoplay = false;
        /**
         * Enabled audio filters.
         * Available filters: {@link Filters}
         * @type {Array<string>}
         */
        this.filters = [];
        /**
         * What time in the song to begin (in seconds).
         * @type {number}
         */
        this.beginTime = 0;
        /**
         * The text channel of the Queue. (Default: where the first command is called).
         * @type {Discord.TextChannel?}
         */
        this.textChannel = textChannel;
        /**
         * Timeout for checking empty channel
         * @type {*}
         * @private
         */
        this.emptyTimeout = undefined;
        /**
         * Task queuing system
         * @type {TaskQueue}
         * @private
         */
        this.taskQueue = new __1.TaskQueue();
        /**
         * DisTubeVoice listener
         * @type {Object}
         * @private
         */
        this.listeners = undefined;
    }
    /**
     * Formatted duration string.
     * @type {string}
     */
    get formattedDuration() {
        return (0, __1.formatDuration)(this.duration);
    }
    /**
     * Queue's duration.
     * @type {number}
     */
    get duration() {
        return this.songs.length ? this.songs.reduce((prev, next) => prev + next.duration, 0) : 0;
    }
    /**
     * What time in the song is playing (in seconds).
     * @type {number}
     */
    get currentTime() {
        return this.voice.playbackDuration + this.beginTime;
    }
    /**
     * Formatted {@link Queue#currentTime} string.
     * @type {string}
     */
    get formattedCurrentTime() {
        return (0, __1.formatDuration)(this.currentTime);
    }
    /**
     * The voice channel playing in.
     * @type {Discord.VoiceChannel|Discord.StageChannel|null}
     */
    get voiceChannel() {
        return this.clientMember.voice.channel;
    }
    get volume() {
        return this.voice.volume;
    }
    set volume(value) {
        this.voice.volume = value;
    }
    /**
     * Add a Song or an array of Song to the queue
     * @param {Song|Song[]} song Song to add
     * @param {number} [position=-1] Position to add, < 0 to add to the end of the queue
     * @param {boolean} [queuing=true] Wether or not waiting for unfinished tasks
     * @throws {Error}
     * @returns {Queue} The guild queue
     */
    addToQueue(song, position = -1) {
        const isArray = Array.isArray(song);
        if (!song || (isArray && !song.length)) {
            throw new __1.DisTubeError("INVALID_TYPE", ["Song", "SearchResult", "Array<Song|SearchResult>"], song, "song");
        }
        if (position === 0)
            throw new __1.DisTubeError("ADD_BEFORE_PLAYING");
        if (position < 0) {
            if (isArray)
                this.songs.push(...song);
            else
                this.songs.push(song);
        }
        else if (isArray) {
            this.songs.splice(position, 0, ...song);
        }
        else {
            this.songs.splice(position, 0, song);
        }
        if (isArray)
            song.map(s => delete s.formats);
        else
            delete song.formats;
        return this;
    }
    /**
     * Pause the guild stream
     * @returns {Queue} The guild queue
     */
    pause() {
        if (this.paused)
            throw new __1.DisTubeError("PAUSED");
        this.playing = false;
        this.paused = true;
        this.voice.pause();
        return this;
    }
    /**
     * Resume the guild stream
     * @returns {Queue} The guild queue
     */
    resume() {
        if (this.playing)
            throw new __1.DisTubeError("RESUMED");
        this.playing = true;
        this.paused = false;
        this.voice.unpause();
        return this;
    }
    /**
     * Set the guild stream's volume
     * @param {number} percent The percentage of volume you want to set
     * @returns {Queue} The guild queue
     */
    setVolume(percent) {
        this.volume = percent;
        return this;
    }
    /**
     * Skip the playing song if there is a next song in the queue.
     * <info>If {@link Queue#autoplay} is `true` and there is no up next song,
     * DisTube will add and play a related song.</info>
     * @returns {Promise<Song>} The song will skip to
     * @throws {Error}
     */
    async skip() {
        await this.taskQueue.queuing();
        try {
            if (this.songs.length <= 1) {
                if (this.autoplay)
                    await this.addRelatedSong();
                else
                    throw new __1.DisTubeError("NO_UP_NEXT");
            }
            const song = this.songs[1];
            this.next = true;
            this.voice.stop();
            return song;
        }
        finally {
            this.taskQueue.resolve();
        }
    }
    /**
     * Play the previous song if exists
     * @returns {Song} The guild queue
     * @throws {Error}
     */
    async previous() {
        var _a;
        await this.taskQueue.queuing();
        try {
            if (!this.options.savePreviousSongs)
                throw new __1.DisTubeError("DISABLED_OPTION", "savePreviousSongs");
            if (((_a = this.previousSongs) === null || _a === void 0 ? void 0 : _a.length) === 0 && this.repeatMode !== __1.RepeatMode.QUEUE) {
                throw new __1.DisTubeError("NO_PREVIOUS");
            }
            const song = this.repeatMode === 2 ? this.songs[this.songs.length - 1] : this.previousSongs[this.previousSongs.length - 1];
            this.prev = true;
            this.voice.stop();
            return song;
        }
        finally {
            this.taskQueue.resolve();
        }
    }
    /**
     * Shuffle the queue's songs
     * @returns {Promise<Queue>} The guild queue
     */
    async shuffle() {
        await this.taskQueue.queuing();
        try {
            if (!this.songs.length)
                return this;
            const playing = this.songs.shift();
            for (let i = this.songs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [this.songs[i], this.songs[j]] = [this.songs[j], this.songs[i]];
            }
            this.songs.unshift(playing);
            return this;
        }
        finally {
            this.taskQueue.resolve();
        }
    }
    /**
     * Jump to the song position in the queue.
     * The next one is 1, 2,...
     * The previous one is -1, -2,...
     * @param {number} position The song position to play
     * @returns {Promise<Queue>} The guild queue
     * @throws {Error} if `num` is invalid number
     */
    async jump(position) {
        await this.taskQueue.queuing();
        try {
            if (typeof position !== "number")
                throw new __1.DisTubeError("INVALID_TYPE", "number", position, "position");
            if (!position || position > this.songs.length || -position > this.previousSongs.length) {
                throw new __1.DisTubeError("NO_SONG_POSITION");
            }
            if (position > 0) {
                const nextSongs = this.songs.splice(position - 1);
                if (this.options.savePreviousSongs) {
                    this.previousSongs.push(...this.songs);
                }
                else {
                    this.previousSongs.push(...this.songs.map(s => {
                        return { id: s.id };
                    }));
                }
                this.songs = nextSongs;
                this.next = true;
            }
            else if (!this.options.savePreviousSongs) {
                throw new __1.DisTubeError("DISABLED_OPTION", "savePreviousSongs");
            }
            else {
                this.prev = true;
                if (position !== -1)
                    this.songs.unshift(...this.previousSongs.splice(position + 1));
            }
            this.voice.stop();
            return this;
        }
        finally {
            this.taskQueue.resolve();
        }
    }
    /**
     * Set the repeat mode of the guild queue.\
     * Toggle mode `(Disabled -> Song -> Queue -> Disabled ->...)` if `mode` is `undefined`
     * @param {RepeatMode?} [mode] The repeat modes (toggle if `undefined`)
     * @returns {RepeatMode} The new repeat mode
     */
    setRepeatMode(mode) {
        if (mode !== undefined && !Object.values(__1.RepeatMode).includes(mode)) {
            throw new __1.DisTubeError("INVALID_TYPE", ["RepeatMode", "undefined"], mode, "mode");
        }
        if (mode === undefined)
            this.repeatMode = (this.repeatMode + 1) % 3;
        else if (this.repeatMode === mode)
            this.repeatMode = __1.RepeatMode.DISABLED;
        else
            this.repeatMode = mode;
        return this.repeatMode;
    }
    /**
     * Enable or disable filter(s) of the queue.
     * Available filters: {@link Filters}
     * @param {string|string[]|false} filter A filter name, an array of filter name or `false` to clear all the filters
     * @param {boolean} [force=false] Force enable the input filter(s) even if it's enabled
     * @returns {Array<string>} Enabled filters.
     * @throws {Error}
     */
    setFilter(filter, force = false) {
        if (Array.isArray(filter)) {
            filter = filter.filter(f => Object.prototype.hasOwnProperty.call(this.distube.filters, f));
            if (!filter.length)
                throw new __1.DisTubeError("EMPTY_FILTERED_ARRAY", "filter", "filter name");
            for (const f of filter) {
                if (this.filters.includes(f)) {
                    if (!force)
                        this.filters.splice(this.filters.indexOf(f), 1);
                }
                else {
                    this.filters.push(f);
                }
            }
        }
        else if (filter === false) {
            this.filters = [];
        }
        else if (!Object.prototype.hasOwnProperty.call(this.distube.filters, filter)) {
            throw new __1.DisTubeError("INVALID_TYPE", "filter name", filter, "filter");
        }
        else if (this.filters.includes(filter)) {
            if (!force)
                this.filters.splice(this.filters.indexOf(filter), 1);
        }
        else {
            this.filters.push(filter);
        }
        this.beginTime = this.currentTime;
        this.queues.playSong(this);
        return this.filters;
    }
    /**
     * Set the playing time to another position
     * @param {number} time Time in seconds
     * @returns {Queue} The guild queue
     */
    seek(time) {
        if (typeof time !== "number")
            throw new __1.DisTubeError("INVALID_TYPE", "number", time, "time");
        if (isNaN(time) || time < 0)
            throw new __1.DisTubeError("NUMBER_COMPARE", "time", "bigger or equal to", 0);
        this.beginTime = time;
        this.queues.playSong(this);
        return this;
    }
    /**
     * Add a related song of the playing song to the queue
     * @returns {Promise<Song>} The added song
     * @throws {Error}
     */
    async addRelatedSong() {
        var _a;
        if (!((_a = this.songs) === null || _a === void 0 ? void 0 : _a[0]))
            throw new __1.DisTubeError("NO_PLAYING");
        const related = this.songs[0].related.find(v => !this.previousSongs.map(s => s.id).includes(v.id));
        if (!related || !(related instanceof __1.Song))
            throw new __1.DisTubeError("NO_RELATED");
        const song = await this.handler.resolveSong(this.clientMember, related.url);
        if (!(song instanceof __1.Song))
            throw new __1.DisTubeError("CANNOT_PLAY_RELATED");
        this.addToQueue(song);
        return song;
    }
    /**
     * Stop the guild stream
     */
    async stop() {
        await this.taskQueue.queuing();
        try {
            this.stopped = true;
            if (this.options.leaveOnStop)
                this.voice.leave();
            else
                this.voice.stop();
            this.delete();
        }
        finally {
            this.taskQueue.resolve();
        }
    }
    /**
     * Delete the queue from the manager
     * (This does not leave the queue even if {@link DisTubeOptions|DisTubeOptions.leaveOnStop} is enabled)
     * @private
     */
    delete() {
        this.stopped = true;
        this.songs = [];
        this.previousSongs = [];
        if (this.listeners) {
            for (const event of Object.keys(this.listeners)) {
                this.voice.removeListener(event, this.listeners[event]);
            }
        }
        this.queues.delete(this.id);
        this.emit("deleteQueue", this);
    }
    /**
     * Toggle autoplay mode
     * @returns {boolean} Autoplay mode state
     */
    toggleAutoplay() {
        this.autoplay = !this.autoplay;
        return this.autoplay;
    }
}
exports.Queue = Queue;
exports.default = Queue;
//# sourceMappingURL=Queue.js.map