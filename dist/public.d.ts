type HttpResponseHeaders = Record<string, string | string[]>;
type HttpRequestHeaders = Record<string, string>;
interface HttpTransportResponseMetadata {
    readonly statusCode: number;
    readonly headers: HttpResponseHeaders;
}
interface HttpTransportResponse extends HttpTransportResponseMetadata {
    readonly body: Buffer;
}
interface HttpTransportDownloadResponse extends HttpTransportResponseMetadata {
    readonly filePath: string;
}
interface HttpTransportRequestOptions {
    readonly headers: HttpRequestHeaders;
    readonly body: Buffer | undefined;
    readonly proxy: string | undefined;
    readonly method: string;
    readonly url: string;
}

declare class ClientRequestMapper {
    toHttpTransportRequest(url: string, options?: RequestOptions): HttpTransportRequestOptions;
    private normalizeMethod;
    private normalizeHeaders;
    private normalizeBody;
}

type NativeAddonResponseHeader = readonly [name: string, value: string];
type NativeAddonRequestHeaders = Readonly<Record<string, string>>;
type NativeAddonResponseHeaders = readonly NativeAddonResponseHeader[];
interface NativeAddonRequestOptions {
    url: string;
    readonly method: string;
    readonly headers?: NativeAddonRequestHeaders;
    readonly body?: Buffer;
    readonly proxy?: string;
}
interface NativeAddonResponse {
    readonly statusCode: number;
    readonly headers: NativeAddonResponseHeaders;
    readonly data: Buffer;
}
interface NativeAddonDownloadResponse {
    readonly statusCode: number;
    readonly headers: NativeAddonResponseHeaders;
    readonly filePath: string;
}
interface NativeAddon {
    fetch(request: NativeAddonRequestOptions): Promise<NativeAddonResponse>;
    download(request: NativeAddonRequestOptions, destinationPath: string): Promise<NativeAddonDownloadResponse>;
}

declare class NativeTransportMapper {
    toNativeRequest(request: HttpTransportRequestOptions): NativeAddonRequestOptions;
    toHttpTransportResponse(response: NativeAddonResponse): HttpTransportResponse;
    toHttpTransportDownloadResponse(response: NativeAddonDownloadResponse): HttpTransportDownloadResponse;
    private normalizeResponseHeaders;
}

declare class NativeHttpTransport {
    private readonly addon;
    private readonly mapper;
    constructor(addon: NativeAddon, mapper: NativeTransportMapper);
    execute(request: HttpTransportRequestOptions): Promise<HttpTransportResponse>;
    download(request: HttpTransportRequestOptions, destination: string): Promise<HttpTransportDownloadResponse>;
}

declare class HttpResponse {
    private readonly body;
    readonly statusCode: number;
    readonly headers: HttpResponseHeaders;
    constructor(response: HttpTransportResponse);
    buffer(): Buffer;
    text(): string;
    json<T = unknown>(): T;
}

declare class HttpDownloadResponse {
    readonly statusCode: number;
    readonly headers: HttpResponseHeaders;
    readonly filePath: string;
    constructor(response: HttpTransportDownloadResponse);
}

declare class HttpRequestExecutor {
    private readonly transport;
    constructor(transport: NativeHttpTransport);
    execute(request: HttpTransportRequestOptions): Promise<HttpResponse>;
    download(request: HttpTransportRequestOptions, destination: string): Promise<HttpDownloadResponse>;
}

type HttpHeaders = Readonly<Record<string, string>>;
interface HttpOptions {
    readonly headers?: HttpHeaders;
    readonly proxy?: string;
}
interface HttpBodyOptions extends HttpOptions {
    readonly body?: Buffer;
}
interface RequestOptions extends HttpBodyOptions {
    method?: string;
}
declare class HttpClient {
    private readonly requestMapper;
    private readonly requestExecutor;
    constructor(requestMapper: ClientRequestMapper, requestExecutor: HttpRequestExecutor);
    get(url: string, options?: HttpOptions): Promise<HttpResponse>;
    head(url: string, options?: HttpOptions): Promise<HttpResponse>;
    post(url: string, options?: HttpBodyOptions): Promise<HttpResponse>;
    put(url: string, options?: HttpBodyOptions): Promise<HttpResponse>;
    patch(url: string, options?: HttpBodyOptions): Promise<HttpResponse>;
    delete(url: string, options?: HttpBodyOptions): Promise<HttpResponse>;
    request(url: string, options?: RequestOptions): Promise<HttpResponse>;
    download(url: string, destinationPath: string, options?: RequestOptions): Promise<HttpDownloadResponse>;
    private requestWithMethod;
}

declare const httpClient: HttpClient;
declare const request: (url: string, options?: RequestOptions) => Promise<HttpResponse>;

export { type HttpBodyOptions, HttpClient, HttpDownloadResponse, type HttpHeaders, type HttpOptions, HttpResponse, type HttpResponseHeaders, type RequestOptions, httpClient, request };
