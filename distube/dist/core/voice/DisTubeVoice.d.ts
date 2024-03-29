import { TypedEmitter } from "tiny-typed-emitter";
import type { DisTubeStream, DisTubeVoiceEvents, DisTubeVoiceManager } from "../..";
import type { AudioPlayer, AudioResource, VoiceConnection } from "@discordjs/voice";
import type { Snowflake, StageChannel, VoiceChannel, VoiceState } from "discord.js";
/**
 * Create a voice connection to the voice channel
 */
export declare class DisTubeVoice extends TypedEmitter<DisTubeVoiceEvents> {
    id: Snowflake;
    voices: DisTubeVoiceManager;
    audioPlayer: AudioPlayer;
    connection: VoiceConnection;
    audioResource?: AudioResource;
    emittedError: boolean;
    isDisconnected: boolean;
    private _channel;
    private _volume;
    constructor(voiceManager: DisTubeVoiceManager, channel: VoiceChannel | StageChannel);
    get channel(): VoiceChannel | StageChannel;
    set channel(channel: VoiceChannel | StageChannel);
    private _join;
    /**
     * Join a voice channel with this connection
     * @param {Discord.VoiceChannel|Discord.StageChannel} [channel] A voice channel
     * @private
     * @returns {Promise<DisTubeVoice>}
     */
    join(channel?: VoiceChannel | StageChannel): Promise<DisTubeVoice>;
    /**
     * Leave the voice channel of this connection
     * @param {Error} [error] Optional, an error to emit with 'error' event.
     */
    leave(error?: Error): void;
    /**
     * Stop the playing stream
     * @param {boolean} [force=false] If true, will force the {@link DisTubeVoice#audioPlayer} to enter the Idle state
     * even if the {@link DisTubeVoice#audioResource} has silence padding frames.
     * @private
     */
    stop(force?: boolean): void;
    /**
     * Play a readable stream
     * @private
     * @param {DisTubeStream} stream Readable stream
     */
    play(stream: DisTubeStream): void;
    set volume(volume: number);
    get volume(): number;
    /**
     * Playback duration of the audio resource in seconds
     * @type {number}
     */
    get playbackDuration(): number;
    pause(): void;
    unpause(): void;
    /**
     * Whether the bot is self-deafened
     * @type {boolean}
     */
    get selfDeaf(): boolean;
    /**
     * Whether the bot is self-muted
     * @type {boolean}
     */
    get selfMute(): boolean;
    /**
     * Self-deafens/undeafens the bot.
     * @param {boolean} selfDeaf Whether or not the bot should be self-deafened
     * @returns {boolean} true if the voice state was successfully updated, otherwise false
     */
    setSelfDeaf(selfDeaf: boolean): boolean;
    /**
     * Self-mutes/unmutes the bot.
     * @param {boolean} selfMute Whether or not the bot should be self-muted
     * @returns {boolean} true if the voice state was successfully updated, otherwise false
     */
    setSelfMute(selfMute: boolean): boolean;
    /**
     * The voice state of this connection
     * @type {Discord.VoiceState?}
     */
    get voiceState(): VoiceState | undefined;
}
export default DisTubeVoice;
//# sourceMappingURL=DisTubeVoice.d.ts.map