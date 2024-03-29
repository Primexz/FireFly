"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisTubeHandler = void 0;
const ytdl_core_1 = __importDefault(require("@distube/ytdl-core"));
const ytpl_1 = __importDefault(require("@distube/ytpl"));
const _1 = require(".");
const __1 = require("..");
/**
 * DisTube's Handler
 * @extends DisTubeBase
 * @private
 */
class DisTubeHandler extends _1.DisTubeBase {
    constructor(distube) {
        super(distube);
        this.ytdlOptions = this.options.ytdlOptions;
        if (this.options.youtubeCookie) {
            const requestOptions = {
                headers: {
                    cookie: this.options.youtubeCookie,
                },
            };
            if (this.options.youtubeIdentityToken) {
                requestOptions.headers["x-youtube-identity-token"] = this.options.youtubeIdentityToken;
            }
            Object.assign(this.ytdlOptions, { requestOptions });
        }
        const client = this.client;
        if (this.options.leaveOnEmpty) {
            client.on("voiceStateUpdate", oldState => {
                if (!(oldState === null || oldState === void 0 ? void 0 : oldState.channel))
                    return;
                const queue = this.queues.get(oldState);
                if (!queue) {
                    if ((0, __1.isVoiceChannelEmpty)(oldState)) {
                        setTimeout(() => {
                            if (!this.queues.get(oldState) && (0, __1.isVoiceChannelEmpty)(oldState))
                                this.voices.leave(oldState);
                        }, this.options.emptyCooldown * 1e3).unref();
                    }
                    return;
                }
                if (queue.emptyTimeout) {
                    clearTimeout(queue.emptyTimeout);
                    delete queue.emptyTimeout;
                }
                if ((0, __1.isVoiceChannelEmpty)(oldState)) {
                    queue.emptyTimeout = setTimeout(() => {
                        delete queue.emptyTimeout;
                        if ((0, __1.isVoiceChannelEmpty)(oldState)) {
                            queue.voice.leave();
                            this.emit("empty", queue);
                            if (queue.stopped)
                                queue.delete();
                        }
                    }, this.options.emptyCooldown * 1e3).unref();
                }
            });
        }
    }
    /**
     * Create a new guild queue
     * @param {Discord.Message|Discord.VoiceChannel|Discord.StageChannel} message A user message | a voice channel
     * @param {Song|Song[]} song Song to play
     * @param {Discord.TextChannel} textChannel A text channel of the queue
     * @throws {Error}
     * @returns {Promise<Queue|true>} `true` if queue is not generated
     */
    async createQueue(message, song, textChannel = message.channel) {
        var _a, _b, _c;
        const voice = ((_c = (_b = (_a = message) === null || _a === void 0 ? void 0 : _a.member) === null || _b === void 0 ? void 0 : _b.voice) === null || _c === void 0 ? void 0 : _c.channel) || message;
        if (!voice || (0, __1.isMessageInstance)(voice))
            throw new __1.DisTubeError("NOT_IN_VOICE");
        if (!(0, __1.isSupportedVoiceChannel)(voice))
            throw new __1.DisTubeError("NOT_SUPPORTED_VOICE");
        return this.queues.create(voice, song, textChannel);
    }
    /**
     * @param {string} url url
     * @param {boolean} [basic=false] getBasicInfo?
     * @returns {Promise<ytdl.videoInfo>}
     */
    getYouTubeInfo(url, basic = false) {
        if (basic)
            return ytdl_core_1.default.getBasicInfo(url, this.ytdlOptions);
        return ytdl_core_1.default.getInfo(url, this.ytdlOptions);
    }
    /**
     * Resolve a Song
     * @param {Discord.GuildMember} member Requested user
     * @param {string|Song|SearchResult|Playlist} song URL | Search string | {@link Song}
     * @returns {Promise<Song|Playlist|null>} Resolved
     */
    async resolveSong(member, song) {
        if (!song)
            return null;
        if (song instanceof __1.Song || song instanceof __1.Playlist)
            return song._patchMember(member);
        if (song instanceof __1.SearchResult) {
            if (song.type === "video")
                return new __1.Song(song, member);
            return this.resolvePlaylist(member, song.url);
        }
        if (typeof song === "object")
            return new __1.Song(song, member);
        if (ytdl_core_1.default.validateURL(song))
            return new __1.Song(await this.getYouTubeInfo(song), member);
        if ((0, __1.isURL)(song)) {
            for (const plugin of this.distube.extractorPlugins) {
                if (await plugin.validate(song))
                    return plugin.resolve(song, member);
            }
            throw new __1.DisTubeError("NOT_SUPPORTED_URL");
        }
        throw new __1.DisTubeError("CANNOT_RESOLVE_SONG", typeof song);
    }
    /**
     * Resole Song[] or url to a Playlist
     * @param {Discord.GuildMember} member Requested user
     * @param {Song[]|string} playlist Resolvable playlist
     * @param {string} [source="youtube"] Playlist source
     * @returns {Promise<Playlist>}
     */
    async resolvePlaylist(member, playlist, source = "youtube") {
        if (playlist instanceof __1.Playlist)
            return playlist;
        let solvablePlaylist;
        if (typeof playlist === "string") {
            solvablePlaylist = await (0, ytpl_1.default)(playlist, { limit: Infinity });
            solvablePlaylist.items = solvablePlaylist.items
                .filter(v => !v.thumbnail.includes("no_thumbnail"))
                .map(v => new __1.Song(v, member));
        }
        else {
            solvablePlaylist = playlist;
        }
        return new __1.Playlist(solvablePlaylist, member, { source });
    }
    /**
     * Create a custom playlist
     * @returns {Promise<Playlist>}
     * @param {Discord.Message|Discord.GuildMember} message A message from guild channel | A guild member
     * @param {Array<string|Song|SearchResult>} songs Array of url, Song or SearchResult
     * @param {Object} [properties={}] Additional properties such as `name`
     * @param {boolean} [parallel=true] Whether or not fetch the songs in parallel
     * @example
     *     const songs = ["https://www.youtube.com/watch?v=xxx", "https://www.youtube.com/watch?v=yyy"];
     *     const playlist = await distube.handler.createCustomPlaylist(member, songs, { name: "My playlist name" }, true);
     *     // Or fetching custom playlist sequentially (reduce lag for low specs)
     *     const playlist = await distube.handler.createCustomPlaylist(member, songs, false);
     *     distube.playVoiceChannel(voiceChannel, playlist, { ... });
     */
    async createCustomPlaylist(message, songs, properties = {}, parallel = true) {
        var _a;
        const member = ((_a = message) === null || _a === void 0 ? void 0 : _a.member) || message;
        if (!Array.isArray(songs))
            throw new __1.DisTubeError("INVALID_TYPE", "Array", songs, "songs");
        if (!songs.length)
            throw new __1.DisTubeError("EMPTY_ARRAY", "songs");
        songs = songs.filter(song => song instanceof __1.Song || (song instanceof __1.SearchResult && song.type === "video") || (0, __1.isURL)(song));
        if (!songs.length)
            throw new __1.DisTubeError("NO_VALID_SONG");
        let resolvedSongs;
        if (parallel) {
            const promises = songs.map((song) => this.resolveSong(member, song).catch(() => undefined));
            resolvedSongs = (await Promise.all(promises)).filter((s) => !!s);
        }
        else {
            const resolved = [];
            for (const song of songs) {
                resolved.push(await this.resolveSong(member, song).catch(() => undefined));
            }
            resolvedSongs = resolved.filter((s) => !!s);
        }
        return new __1.Playlist(resolvedSongs, member, properties);
    }
    /**
     * Play / add a playlist
     * @returns {Promise<void>}
     * @param {Discord.Message|Discord.VoiceChannel|Discord.StageChannel} message A message | a voice channel
     * @param {Playlist|string} playlist A YouTube playlist url | a Playlist
     * @param {Discord.TextChannel|boolean} [textChannel] The default text channel of the queue
     * @param {boolean} [skip=false] Skip the playing song (if exists) and play the added playlist instantly
     * @param {boolean} [unshift=false] Add the playlist to the beginning of the queue (after the playing song if exists)
     */
    async handlePlaylist(message, playlist, textChannel, skip = false, unshift = false) {
        if (!(playlist instanceof __1.Playlist))
            throw new __1.DisTubeError("INVALID_TYPE", "Playlist", playlist, "playlist");
        if (!this.options.nsfw && !(textChannel === null || textChannel === void 0 ? void 0 : textChannel.nsfw))
            playlist.songs = playlist.songs.filter(s => !s.age_restricted);
        if (!playlist.songs.length) {
            if (!this.options.nsfw && !(textChannel === null || textChannel === void 0 ? void 0 : textChannel.nsfw))
                throw new __1.DisTubeError("EMPTY_FILTERED_PLAYLIST");
            throw new __1.DisTubeError("EMPTY_PLAYLIST");
        }
        const songs = playlist.songs;
        const queue = this.queues.get(message);
        if (queue) {
            queue.addToQueue(songs, skip || unshift ? 1 : -1);
            if (skip)
                queue.skip();
            else
                this.emit("addList", queue, playlist);
        }
        else {
            const newQueue = await this.createQueue(message, songs, textChannel);
            if (newQueue instanceof __1.Queue) {
                if (this.options.emitAddListWhenCreatingQueue)
                    this.emit("addList", newQueue, playlist);
                this.emit("playSong", newQueue, newQueue.songs[0]);
            }
        }
    }
    /**
     * Search for a song, fire {@link DisTube#event:error} if not found.
     * @param {Discord.Message} message The original message from an user
     * @param {string} query The query string
     * @returns {Promise<SearchResult?>} Song info
     */
    async searchSong(message, query) {
        var _a;

        if (typeof query !== "string")
            throw new __1.DisTubeError("INVALID_TYPE", "string", query, "query");
        if (query.length === 0)
            throw new __1.DisTubeError("EMPTY_STRING", "query");
        const limit = this.options.searchSongs > 1 ? this.options.searchSongs : 1;
        const results = await this.distube
            .search(query, {
            limit,
            safeSearch: this.options.nsfw ? false : !((_a = message.channel) === null || _a === void 0 ? void 0 : _a.nsfw),
        })
            .catch(() => {
            if (!this.emit("searchNoResult", message, query)) {
                // eslint-disable-next-line no-console
                console.warn("searchNoResult event does not have any listeners! Emits `error` event instead.");
                throw new __1.DisTubeError("NO_RESULT");
            }
        });
        if (!results)
            return null;
        return this.createSearchMessageCollector(message, results, query);
    }
    /**
     * Create a message collector for selecting search results.
     *
     * Needed events: {@link DisTube#event:searchResult}, {@link DisTube#event:searchCancel},
     * {@link DisTube#event:searchInvalidAnswer}, {@link DisTube#event:searchDone}.
     * @param {Discord.Message} message The original message from an user
     * @param {Array<SearchResult|Song|Playlist>} results The search results
     * @param {string?} [query] The query string
     * @returns {Promise<SearchResult|Song|Playlist|null>} Selected result
     */
    async createSearchMessageCollector(message, results, query) {

        if (!Array.isArray(results) || results.length == 0) {
            throw new __1.DisTubeError("INVALID_TYPE", "Array<SearchResult|Song|Playlist>", results, "results");
        }
        if (this.options.searchSongs > 1) {
            const searchEvents = [
                "searchNoResult",
                "searchResult",
                "searchCancel",
                "searchInvalidAnswer",
                "searchDone",
            ];
            for (const evn of searchEvents) {
                if (this.distube.listenerCount(evn) === 0) {
                    /* eslint-disable no-console */
                    console.warn(`"searchSongs" option is disabled due to missing "${evn}" listener.`);
                    console.warn(`If you don't want to use "${evn}" event, simply add an empty listener (not recommended):\n` +
                        `<DisTube>.on("${evn}", () => {})`);
                    /* eslint-enable no-console */
                    this.options.searchSongs = 0;
                }
            }
        }
        const limit = this.options.searchSongs > 1 ? this.options.searchSongs : 1;
        let result = results[0];
        if (limit > 1) {
            results.splice(limit);
            this.emit("searchResult", message, results, query);
            const c = message.channel;
            const answers = await (c.awaitMessages.length === 0
                ? c.awaitMessages({
                    filter: (m) => m.author.id === message.author.id,
                    max: 1,
                    time: this.options.searchCooldown * 1e3,
                    errors: ["time"],
                })
                : c.awaitMessages((m) => m.author.id === message.author.id, {
                    max: 1,
                    time: this.options.searchCooldown * 1e3,
                    errors: ["time"],
                })).catch(() => undefined);
            const ans = answers === null || answers === void 0 ? void 0 : answers.first();
            if (!ans) {
                this.emit("searchCancel", message, query);
                return null;
            }
            const index = parseInt(ans.content, 10);
            if (isNaN(index) || index > results.length || index < 1) {
                this.emit("searchInvalidAnswer", message, ans, query);
                return null;
            }
            this.emit("searchDone", message, ans, query);
            result = results[index - 1];
        }
        return result;
    }
    /**
     * Create a ytdl stream
     * @param {Queue} queue Queue
     * @returns {DisTubeStream}
     */
    createStream(queue) {
        var _a;
        const { duration, formats, isLive, source, streamURL } = queue.songs[0];
        const filterArgs = [];
        queue.filters.forEach((filter) => filterArgs.push(this.distube.filters[filter]));
        const ffmpegArgs = ((_a = queue.filters) === null || _a === void 0 ? void 0 : _a.length) ? ["-af", filterArgs.join(",")] : undefined;
        const seek = duration ? queue.beginTime : undefined;
        const streamOptions = { ffmpegArgs, seek, isLive };
        Object.assign(streamOptions, this.ytdlOptions);
        if (source === "youtube")
            return _1.DisTubeStream.YouTube(formats, streamOptions);
        return _1.DisTubeStream.DirectLink(streamURL, streamOptions);
    }
}
exports.DisTubeHandler = DisTubeHandler;
exports.default = DisTubeHandler;
//# sourceMappingURL=DisTubeHandler.js.map