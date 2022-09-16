var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import sharp from 'sharp';
const NAMESPACE = 'esbuild-compress-images';
const CONFIG = {
    disabled: false,
    extensions: /.(jpe?g|png)/,
    encodeOptions: {
        jpg: {},
        png: {}
    }
};
export default (options) => ({
    name: NAMESPACE,
    setup({ onLoad, onEnd, initialOptions }) {
        Object.assign(CONFIG, options);
        if (!CONFIG.disabled) {
            onLoad({ filter: CONFIG.extensions, namespace: 'file' }, onLoadHandler);
            onEnd(onEndHandler);
        }
    }
});
const onLoadHandler = ({ path }) => __awaiter(void 0, void 0, void 0, function* () {
    const contents = yield process(path);
    return {
        contents,
        loader: 'file',
        pluginName: NAMESPACE
    };
});
const onEndHandler = ({ metafile }) => __awaiter(void 0, void 0, void 0, function* () {
    const images = (metafile === null || metafile === void 0 ? void 0 : metafile['esbuild-copy']) || [];
    console.log(images);
});
const process = (path) => __awaiter(void 0, void 0, void 0, function* () {
    const image = sharp(path);
    return yield image
        .metadata()
        .then(metadata => {
        return image
            .toFormat(metadata.format || 'jpg', CONFIG.encodeOptions)
            .toBuffer();
    });
});
