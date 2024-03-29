import type { GuildIDResolvable } from ".";
import type { AudioPlayer, AudioPlayerStatus, VoiceConnection, VoiceConnectionStatus } from "@discordjs/voice";
import type { Client, ClientOptions, Guild, GuildMember, Message, Snowflake, StageChannel, TextChannel, VoiceChannel, VoiceState } from "discord.js";
/**
 * Format duration to string
 * @param {number} sec Duration in seconds
 * @returns {string}
 */
export declare function formatDuration(sec: number): string;
/**
 * Convert formatted duration to seconds
 * @param {*} input Formatted duration string
 * @returns {number}
 */
export declare function toSecond(input: any): number;
/**
 * Parse number from input
 * @param {*} input Any
 * @returns {number}
 */
export declare function parseNumber(input: any): number;
/**
 * Check if the string is an URL
 * @param {string} input input
 * @returns {boolean}
 */
export declare function isURL(input: any): boolean;
/**
 * Check if the Client has enough intents to using DisTube
 * @param {ClientOptions} options options
 */
export declare function checkIntents(options: ClientOptions): void;
/**
 * Check if the voice channel is empty
 * @param {Discord.VoiceState} voiceState voiceState
 * @returns {boolean}
 */
export declare function isVoiceChannelEmpty(voiceState: VoiceState): boolean;
export declare function isSnowflake(id: any): id is Snowflake;
export declare function isMemberInstance(member: any): member is GuildMember;
export declare function isTextChannelInstance(channel: any): channel is TextChannel;
export declare function isMessageInstance(message: any): message is Message;
export declare function isSupportedVoiceChannel(channel: any): channel is VoiceChannel | StageChannel;
export declare function isGuildInstance(guild: any): guild is Guild;
export declare function resolveGuildID(resolvable: GuildIDResolvable): Snowflake;
export declare function isClientInstance(client: any): client is Client;
export declare function checkInvalidKey(target: Record<string, any>, source: Record<string, any> | string[], sourceName: string): void;
export declare function entersState<T extends VoiceConnection | AudioPlayer>(target: T, status: T extends VoiceConnection ? VoiceConnectionStatus : AudioPlayerStatus, maxTime: number): Promise<T>;
//# sourceMappingURL=util.d.ts.map