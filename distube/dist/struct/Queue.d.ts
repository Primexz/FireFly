/// <reference types="node" />
import { DisTubeBase } from "../core";
import { RepeatMode, Song, TaskQueue } from "..";
import type { GuildMember, Snowflake, TextChannel } from "discord.js";
import type { DisTube, DisTubeVoice, DisTubeVoiceEvents, SearchResult } from "..";
/**
 * Represents a queue.
 * @extends DisTubeBase
 */
export declare class Queue extends DisTubeBase {
    id: Snowflake;
    /**
     * Voice connection of this queue
     */
    voice: DisTubeVoice;
    /**
     * List of songs in the queue (The first one is the playing song)
     */
    songs: Song[];
    /**
     * List of the previous songs.
     */
    previousSongs: Song[];
    /**
     * Whether stream is currently stopped.
     * @private
     */
    stopped: boolean;
    /**
     * Whether or not the last song was skipped to next song.
     * @private
     */
    next: boolean;
    /**
     * Whether or not the last song was skipped to previous song.
     * @private
     */
    prev: boolean;
    /**
     * Whether or not the stream is currently playing.
     */
    playing: boolean;
    /**
     * Whether or not the stream is currently paused.
     */
    paused: boolean;
    /**
     * Type of repeat mode (`0` is disabled, `1` is repeating a song, `2` is repeating all the queue).
     * Default value: `0` (disabled)
     */
    repeatMode: RepeatMode;
    /**
     * Whether or not the autoplay mode is enabled.
     * Default value: `false`
     */
    autoplay: boolean;
    /**
     * Enabled audio filters.
     * Available filters: {@link Filters}
     */
    filters: string[];
    /**
     * What time in the song to begin (in seconds).
     */
    beginTime: number;
    /**
     * The text channel of the Queue. (Default: where the first command is called).
     */
    textChannel?: TextChannel;
    /**
     * Timeout for checking empty channel
     * @private
     */
    emptyTimeout?: NodeJS.Timeout;
    /**
     * The client user as a `GuildMember` of this queue's guild
     */
    clientMember: GuildMember;
    /**
     * Task queuing system
     */
    taskQueue: TaskQueue;
    listeners?: DisTubeVoiceEvents;
    /**
     * Create a queue for the guild
     * @param {DisTube} distube DisTube
     * @param {DisTubeVoice} voice Voice connection
     * @param {Song|Song[]} song First song(s)
     * @param {Discord.TextChannel?} textChannel Default text channel
     */
    constructor(distube: DisTube, voice: DisTubeVoice, song: Song | Song[], textChannel?: TextChannel);
    /**
     * Formatted duration string.
     * @type {string}
     */
    get formattedDuration(): string;
    /**
     * Queue's duration.
     * @type {number}
     */
    get duration(): number;
    /**
     * What time in the song is playing (in seconds).
     * @type {number}
     */
    get currentTime(): number;
    /**
     * Formatted {@link Queue#currentTime} string.
     * @type {string}
     */
    get formattedCurrentTime(): string;
    /**
     * The voice channel playing in.
     * @type {Discord.VoiceChannel|Discord.StageChannel|null}
     */
    get voiceChannel(): import("discord.js").VoiceBasedChannel | null;
    get volume(): number;
    set volume(value: number);
    /**
     * Add a Song or an array of Song to the queue
     * @param {Song|Song[]} song Song to add
     * @param {number} [position=-1] Position to add, < 0 to add to the end of the queue
     * @param {boolean} [queuing=true] Wether or not waiting for unfinished tasks
     * @throws {Error}
     * @returns {Queue} The guild queue
     */
    addToQueue(song: Song | SearchResult | (Song | SearchResult)[], position?: number): Queue;
    /**
     * Pause the guild stream
     * @returns {Queue} The guild queue
     */
    pause(): Queue;
    /**
     * Resume the guild stream
     * @returns {Queue} The guild queue
     */
    resume(): Queue;
    /**
     * Set the guild stream's volume
     * @param {number} percent The percentage of volume you want to set
     * @returns {Queue} The guild queue
     */
    setVolume(percent: number): Queue;
    /**
     * Skip the playing song if there is a next song in the queue.
     * <info>If {@link Queue#autoplay} is `true` and there is no up next song,
     * DisTube will add and play a related song.</info>
     * @returns {Promise<Song>} The song will skip to
     * @throws {Error}
     */
    skip(): Promise<Song>;
    /**
     * Play the previous song if exists
     * @returns {Song} The guild queue
     * @throws {Error}
     */
    previous(): Promise<Song>;
    /**
     * Shuffle the queue's songs
     * @returns {Promise<Queue>} The guild queue
     */
    shuffle(): Promise<Queue>;
    /**
     * Jump to the song position in the queue.
     * The next one is 1, 2,...
     * The previous one is -1, -2,...
     * @param {number} position The song position to play
     * @returns {Promise<Queue>} The guild queue
     * @throws {Error} if `num` is invalid number
     */
    jump(position: number): Promise<Queue>;
    /**
     * Set the repeat mode of the guild queue.\
     * Toggle mode `(Disabled -> Song -> Queue -> Disabled ->...)` if `mode` is `undefined`
     * @param {RepeatMode?} [mode] The repeat modes (toggle if `undefined`)
     * @returns {RepeatMode} The new repeat mode
     */
    setRepeatMode(mode?: RepeatMode): RepeatMode;
    /**
     * Enable or disable filter(s) of the queue.
     * Available filters: {@link Filters}
     * @param {string|string[]|false} filter A filter name, an array of filter name or `false` to clear all the filters
     * @param {boolean} [force=false] Force enable the input filter(s) even if it's enabled
     * @returns {Array<string>} Enabled filters.
     * @throws {Error}
     */
    setFilter(filter: string | string[] | false, force?: boolean): Array<string>;
    /**
     * Set the playing time to another position
     * @param {number} time Time in seconds
     * @returns {Queue} The guild queue
     */
    seek(time: number): Queue;
    /**
     * Add a related song of the playing song to the queue
     * @returns {Promise<Song>} The added song
     * @throws {Error}
     */
    addRelatedSong(): Promise<Song>;
    /**
     * Stop the guild stream
     */
    stop(): Promise<void>;
    /**
     * Delete the queue from the manager
     * (This does not leave the queue even if {@link DisTubeOptions|DisTubeOptions.leaveOnStop} is enabled)
     * @private
     */
    delete(): void;
    /**
     * Toggle autoplay mode
     * @returns {boolean} Autoplay mode state
     */
    toggleAutoplay(): boolean;
}
export default Queue;
//# sourceMappingURL=Queue.d.ts.map