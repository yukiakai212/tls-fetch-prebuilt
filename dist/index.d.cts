declare const TLSFetchCore: any;

declare abstract class TLSResponse {
    statusCode: number;
    headers: Record<string, string | string[] | undefined>;
    constructor(statusCode: number);
    setHeaders(headers: Array<[string, string]>): this;
}
declare class HttpStreamResponse extends TLSResponse {
    file: string;
    constructor(statusCode: number, file: string);
}
declare class HttpResponse<T> extends TLSResponse {
    private data;
    constructor(statusCode: number, data: Buffer);
    json(): T;
    text(): string;
    buffer(): Buffer;
}

interface HttpOptions {
    headers?: Record<string, string>;
    body?: Buffer;
    proxy?: string;
}
interface RequestOptions extends HttpOptions {
    method: string;
}
declare class TLSFetch {
    private static makeRequestOptions;
    static get<T = unknown>(url: string, options?: HttpOptions): Promise<HttpResponse<T>>;
    static post<T = unknown>(url: string, options?: HttpOptions): Promise<HttpResponse<T>>;
    static delete<T = unknown>(url: string, options?: HttpOptions): Promise<HttpResponse<T>>;
    static patch<T = unknown>(url: string, options?: HttpOptions): Promise<HttpResponse<T>>;
    static put<T = unknown>(url: string, options?: HttpOptions): Promise<HttpResponse<T>>;
    static fetch<T = unknown>(url: string, options: RequestOptions): Promise<HttpResponse<T>>;
    static stream(url: string, file: string, options?: RequestOptions): Promise<HttpStreamResponse>;
}
declare const tlsFetch: typeof TLSFetch;
declare const TlsFetch: typeof TLSFetch;
declare const fetch: typeof TLSFetch.fetch;

export { type HttpOptions, HttpResponse, HttpStreamResponse, type RequestOptions, TLSFetch, TLSFetchCore, TlsFetch, fetch, tlsFetch };
