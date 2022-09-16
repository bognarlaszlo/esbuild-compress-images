import { BuildResult, OnLoadArgs, OnLoadResult, Plugin, PluginBuild } from 'esbuild'

import sharp, { JpegOptions, PngOptions} from 'sharp'

interface EncodeOptions {
    [key: string]: JpegOptions | PngOptions
}

interface Options {
    disabled: boolean;
    extensions: RegExp;
    additionalSources?: Array<string>
    encodeOptions?: EncodeOptions
}

const NAMESPACE = 'esbuild-compress-images';
const CONFIG: Options = {
    disabled: false,
    extensions: /.(jpe?g|png)/,
    encodeOptions: {
        jpg: {},
        png: {}
    }
}

export default (options?: Options): Plugin => ({
    name: NAMESPACE,
    setup({onLoad, onEnd, initialOptions}: PluginBuild) {
        Object.assign(CONFIG, options)

        if (! CONFIG.disabled)
        {
            onLoad({filter: CONFIG.extensions, namespace: 'file'}, onLoadHandler)
            onEnd(onEndHandler)
        }
    }
})

const onLoadHandler = async ({path}: OnLoadArgs): Promise<OnLoadResult> => {
    const contents = await process(path)

    return {
        contents,
        loader: 'file',
        pluginName: NAMESPACE
    }
}

const onEndHandler = async ({metafile}: BuildResult) => {
    console.log(CONFIG.additionalSources);
}

const process = async (path: string) => {
    const image = sharp(path);

    return await image
        .metadata()
        .then(metadata => {
            return image
                .toFormat(metadata.format || 'jpg', CONFIG.encodeOptions)
                .toBuffer()
        })
}
