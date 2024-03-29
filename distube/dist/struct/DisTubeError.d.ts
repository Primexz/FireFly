declare const ERROR_MESSAGES: {
    INVALID_TYPE: (expected: (number | string) | readonly (number | string)[], got: any, name?: string | undefined) => string;
    NUMBER_COMPARE: (name: string, expected: string, value: number) => string;
    EMPTY_ARRAY: (name: string) => string;
    EMPTY_FILTERED_ARRAY: (name: string, type: string) => string;
    INVALID_KEY: (obj: string, key: string) => string;
    EMPTY_STRING: (name: string) => string;
    MISSING_INTENTS: (i: string) => string;
    DISABLED_OPTION: (o: string) => string;
    ENABLED_OPTION: (o: string) => string;
    NOT_IN_VOICE: string;
    NOT_SUPPORTED_VOICE: string;
    VOICE_FULL: string;
    VOICE_CONNECT_FAILED: (s: number) => string;
    VOICE_MISSING_PERMS: string;
    VOICE_RECONNECT_FAILED: string;
    VOICE_CHANGE_GUILD: string;
    VOICE_DEPRECATED_CONNECTION: string;
    NO_QUEUE: string;
    QUEUE_EXIST: string;
    ADD_BEFORE_PLAYING: string;
    PAUSED: string;
    RESUMED: string;
    NO_PREVIOUS: string;
    NO_UP_NEXT: string;
    NO_SONG_POSITION: string;
    NO_PLAYING: string;
    NO_RESULT: string;
    NO_RELATED: string;
    CANNOT_PLAY_RELATED: string;
    UNAVAILABLE_VIDEO: string;
    UNPLAYABLE_FORMATS: string;
    NON_NSFW: string;
    NOT_SUPPORTED_URL: string;
    CANNOT_RESOLVE_SONG: (t: string) => string;
    NO_VALID_SONG: string;
    EMPTY_FILTERED_PLAYLIST: string;
    EMPTY_PLAYLIST: string;
};
declare type ErrorMessages = typeof ERROR_MESSAGES;
declare type ErrorCodes = keyof ErrorMessages;
declare type ErrorCode = {
    [K in ErrorCodes]-?: ErrorMessages[K] extends string ? K : never;
}[ErrorCodes];
declare type ErrorCodeTemplate = Exclude<keyof typeof ERROR_MESSAGES, ErrorCode>;
export declare class DisTubeError<T extends string> extends Error {
    errorCode: string;
    constructor(code: ErrorCode);
    constructor(code: T extends ErrorCodeTemplate ? T : never, ...args: Parameters<ErrorMessages[typeof code]>);
    constructor(code: ErrorCodeTemplate, _: never);
    constructor(code: T extends ErrorCodes ? "This is built-in error code" : T, message: string);
    get name(): string;
    get code(): string;
}
export default DisTubeError;
//# sourceMappingURL=DisTubeError.d.ts.map