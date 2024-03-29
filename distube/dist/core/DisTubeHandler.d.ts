import ytdl from "@distube/ytdl-core";
import { DisTubeBase, DisTubeStream } from ".";
import { Playlist, Queue, SearchResult, Song } from "..";
import type { DisTube, OtherSongInfo } from "..";
import type { GuildMember, Message, StageChannel, TextChannel, VoiceChannel } from "discord.js";
/**
 * DisTube's Handler
 * @extends DisTubeBase
 * @private
 */
export declare class DisTubeHandler extends DisTubeBase {
    ytdlOptions: ytdl.downloadOptions;
    constructor(distube: DisTube);
    /**
     * Create a new guild queue
     * @param {Discord.Message|Discord.VoiceChannel|Discord.StageChannel} message A user message | a voice channel
     * @param {Song|Song[]} song Song to play
     * @param {Discord.TextChannel} textChannel A text channel of the queue
     * @throws {Error}
     * @returns {Promise<Queue|true>} `true` if queue is not generated
     */
    createQueue(message: Message | VoiceChannel | StageChannel, song: Song | Song[], textChannel?: TextChannel): Promise<Queue | true>;
    /**
     * @param {string} url url
     * @param {boolean} [basic=false] getBasicInfo?
     * @returns {Promise<ytdl.videoInfo>}
     */
    getYouTubeInfo(url: string, basic?: boolean): Promise<ytdl.videoInfo>;
    /**
     * Resolve a Song
     * @param {Discord.GuildMember} member Requested user
     * @param {string|Song|SearchResult|Playlist} song URL | Search string | {@link Song}
     * @returns {Promise<Song|Playlist|null>} Resolved
     */
    resolveSong(member: GuildMember, song: string | ytdl.videoInfo | Song | Playlist | SearchResult | OtherSongInfo | ytdl.relatedVideo | null): Promise<Song | Playlist | null>;
    /**
     * Resole Song[] or url to a Playlist
     * @param {Discord.GuildMember} member Requested user
     * @param {Song[]|string} playlist Resolvable playlist
     * @param {string} [source="youtube"] Playlist source
     * @returns {Promise<Playlist>}
     */
    resolvePlaylist(member: GuildMember, playlist: Playlist | Song[] | string, source?: string): Promise<Playlist>;
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
    createCustomPlaylist(message: Message | GuildMember, songs: (string | Song | SearchResult)[], properties?: any, parallel?: boolean): Promise<Playlist>;
    /**
     * Play / add a playlist
     * @returns {Promise<void>}
     * @param {Discord.Message|Discord.VoiceChannel|Discord.StageChannel} message A message | a voice channel
     * @param {Playlist|string} playlist A YouTube playlist url | a Playlist
     * @param {Discord.TextChannel|boolean} [textChannel] The default text channel of the queue
     * @param {boolean} [skip=false] Skip the playing song (if exists) and play the added playlist instantly
     * @param {boolean} [unshift=false] Add the playlist to the beginning of the queue (after the playing song if exists)
     */
    handlePlaylist(message: Message | VoiceChannel | StageChannel, playlist: Playlist, textChannel?: TextChannel, skip?: boolean, unshift?: boolean): Promise<void>;
    /**
     * Search for a song, fire {@link DisTube#event:error} if not found.
     * @param {Discord.Message} message The original message from an user
     * @param {string} query The query string
     * @returns {Promise<SearchResult?>} Song info
     */
    searchSong(message: Message, query: string): Promise<SearchResult | null>;
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
    createSearchMessageCollector<R extends SearchResult | Song | Playlist>(message: Message, results: Array<R>, query?: string): Promise<R | null>;
    /**
     * Create a ytdl stream
     * @param {Queue} queue Queue
     * @returns {DisTubeStream}
     */
    createStream(queue: Queue): DisTubeStream;
}
export default DisTubeHandler;
//# sourceMappingURL=DisTubeHandler.d.ts.map