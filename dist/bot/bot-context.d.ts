export interface YCContext {
    token: {
        access_token: string;
    };
}
interface GlobalContext {
    context: YCContext | null;
}
export declare const globalContext: GlobalContext;
export {};
//# sourceMappingURL=bot-context.d.ts.map