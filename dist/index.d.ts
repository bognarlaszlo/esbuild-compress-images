import { Plugin } from 'esbuild';
import { JpegOptions, PngOptions } from 'sharp';
interface EncodeOptions {
    [key: string]: JpegOptions | PngOptions;
}
interface Options {
    disabled: boolean;
    extensions: RegExp;
    encodeOptions?: EncodeOptions;
}
declare const _default: (options?: Options | undefined) => Plugin;
export default _default;
