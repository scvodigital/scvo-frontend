/// <reference types="node" />
import * as stream from 'stream';
export declare function fsPdf(ids: string[], subdomain: string, title?: string, subtitle?: string | null): Promise<stream.PassThrough>;
