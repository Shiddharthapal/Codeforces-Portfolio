import { A as AstroError, f as NoImageMetadata, F as FailedToFetchRemoteImageDimensions, g as ExpectedImageOptions, h as ExpectedImage, i as ExpectedNotESMImage, r as resolveSrc, j as isRemoteImage, k as isCoreRemotePath, l as isESMImportedImage, m as isLocalService, D as DEFAULT_HASH_PROPS, n as InvalidImageService, o as ImageMissingAlt, p as isRemoteAllowed } from '../chunks/astro/assets-service_C-cWle8B.mjs';
import { t as typeHandlers, a as types } from '../chunks/index_DfOMS8cV.mjs';
import { c as createComponent, a as createAstro, m as maybeRenderHead, h as addAttribute, s as spreadAttributes, e as renderTemplate } from '../chunks/astro/server_CuXvJhkw.mjs';
import 'clsx';
export { renderers } from '../renderers.mjs';

function isImageMetadata(src) {
  return src.fsPath && !("fsPath" in src);
}

const firstBytes = /* @__PURE__ */ new Map([
  [56, "psd"],
  [66, "bmp"],
  [68, "dds"],
  [71, "gif"],
  [73, "tiff"],
  [77, "tiff"],
  [82, "webp"],
  [105, "icns"],
  [137, "png"],
  [255, "jpg"]
]);
function detector(input) {
  const byte = input[0];
  const type = firstBytes.get(byte);
  if (type && typeHandlers.get(type).validate(input)) {
    return type;
  }
  return types.find((fileType) => typeHandlers.get(fileType).validate(input));
}

const globalOptions = {
  disabledTypes: []
};
function lookup$1(input) {
  const type = detector(input);
  if (typeof type !== "undefined") {
    if (globalOptions.disabledTypes.includes(type)) {
      throw new TypeError("disabled file type: " + type);
    }
    const size = typeHandlers.get(type).calculate(input);
    if (size !== void 0) {
      size.type = size.type ?? type;
      return size;
    }
  }
  throw new TypeError("unsupported file type: " + type);
}

async function imageMetadata(data, src) {
  try {
    const result = lookup$1(data);
    if (!result.height || !result.width || !result.type) {
      throw new AstroError({
        ...NoImageMetadata,
        message: NoImageMetadata.message(src)
      });
    }
    const { width, height, type, orientation } = result;
    const isPortrait = (orientation || 0) >= 5;
    return {
      width: isPortrait ? height : width,
      height: isPortrait ? width : height,
      format: type,
      orientation
    };
  } catch {
    throw new AstroError({
      ...NoImageMetadata,
      message: NoImageMetadata.message(src)
    });
  }
}

async function inferRemoteSize(url) {
  const response = await fetch(url);
  if (!response.body || !response.ok) {
    throw new AstroError({
      ...FailedToFetchRemoteImageDimensions,
      message: FailedToFetchRemoteImageDimensions.message(url)
    });
  }
  const reader = response.body.getReader();
  let done, value;
  let accumulatedChunks = new Uint8Array();
  while (!done) {
    const readResult = await reader.read();
    done = readResult.done;
    if (done) break;
    if (readResult.value) {
      value = readResult.value;
      let tmp = new Uint8Array(accumulatedChunks.length + value.length);
      tmp.set(accumulatedChunks, 0);
      tmp.set(value, accumulatedChunks.length);
      accumulatedChunks = tmp;
      try {
        const dimensions = await imageMetadata(accumulatedChunks, url);
        if (dimensions) {
          await reader.cancel();
          return dimensions;
        }
      } catch {
      }
    }
  }
  throw new AstroError({
    ...NoImageMetadata,
    message: NoImageMetadata.message(url)
  });
}

async function getConfiguredImageService() {
  if (!globalThis?.astroAsset?.imageService) {
    const { default: service } = await import(
      // @ts-expect-error
      '../chunks/astro/assets-service_C-cWle8B.mjs'
    ).then(n => n.Z).catch((e) => {
      const error = new AstroError(InvalidImageService);
      error.cause = e;
      throw error;
    });
    if (!globalThis.astroAsset) globalThis.astroAsset = {};
    globalThis.astroAsset.imageService = service;
    return service;
  }
  return globalThis.astroAsset.imageService;
}
async function getImage$1(options, imageConfig) {
  if (!options || typeof options !== "object") {
    throw new AstroError({
      ...ExpectedImageOptions,
      message: ExpectedImageOptions.message(JSON.stringify(options))
    });
  }
  if (typeof options.src === "undefined") {
    throw new AstroError({
      ...ExpectedImage,
      message: ExpectedImage.message(
        options.src,
        "undefined",
        JSON.stringify(options)
      )
    });
  }
  if (isImageMetadata(options)) {
    throw new AstroError(ExpectedNotESMImage);
  }
  const service = await getConfiguredImageService();
  const resolvedOptions = {
    ...options,
    src: await resolveSrc(options.src)
  };
  if (options.inferSize && isRemoteImage(resolvedOptions.src) && isCoreRemotePath(resolvedOptions.src)) {
    const result = await inferRemoteSize(resolvedOptions.src);
    resolvedOptions.width ??= result.width;
    resolvedOptions.height ??= result.height;
    delete resolvedOptions.inferSize;
  }
  const originalFilePath = isESMImportedImage(resolvedOptions.src) ? resolvedOptions.src.fsPath : void 0;
  const clonedSrc = isESMImportedImage(resolvedOptions.src) ? (
    // @ts-expect-error - clone is a private, hidden prop
    resolvedOptions.src.clone ?? resolvedOptions.src
  ) : resolvedOptions.src;
  resolvedOptions.src = clonedSrc;
  const validatedOptions = service.validateOptions ? await service.validateOptions(resolvedOptions, imageConfig) : resolvedOptions;
  const srcSetTransforms = service.getSrcSet ? await service.getSrcSet(validatedOptions, imageConfig) : [];
  let imageURL = await service.getURL(validatedOptions, imageConfig);
  let srcSets = await Promise.all(
    srcSetTransforms.map(async (srcSet) => ({
      transform: srcSet.transform,
      url: await service.getURL(srcSet.transform, imageConfig),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }))
  );
  if (isLocalService(service) && globalThis.astroAsset.addStaticImage && !(isRemoteImage(validatedOptions.src) && imageURL === validatedOptions.src)) {
    const propsToHash = service.propertiesToHash ?? DEFAULT_HASH_PROPS;
    imageURL = globalThis.astroAsset.addStaticImage(
      validatedOptions,
      propsToHash,
      originalFilePath
    );
    srcSets = srcSetTransforms.map((srcSet) => ({
      transform: srcSet.transform,
      url: globalThis.astroAsset.addStaticImage(srcSet.transform, propsToHash, originalFilePath),
      descriptor: srcSet.descriptor,
      attributes: srcSet.attributes
    }));
  }
  return {
    rawOptions: resolvedOptions,
    options: validatedOptions,
    src: imageURL,
    srcSet: {
      values: srcSets,
      attribute: srcSets.map((srcSet) => `${srcSet.url} ${srcSet.descriptor}`).join(", ")
    },
    attributes: service.getHTMLAttributes !== void 0 ? await service.getHTMLAttributes(validatedOptions, imageConfig) : {}
  };
}

const $$Astro$1 = createAstro();
const $$Image = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro$1, $$props, $$slots);
  Astro2.self = $$Image;
  const props = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  if (typeof props.width === "string") {
    props.width = parseInt(props.width);
  }
  if (typeof props.height === "string") {
    props.height = parseInt(props.height);
  }
  const image = await getImage(props);
  const additionalAttributes = {};
  if (image.srcSet.values.length > 0) {
    additionalAttributes.srcset = image.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<img${addAttribute(image.src, "src")}${spreadAttributes(additionalAttributes)}${spreadAttributes(image.attributes)}>`;
}, "C:/All Projects ,Code/Projects/Codeforces Portal/node_modules/.pnpm/astro@4.16.19_@types+node@20.17.25_lightningcss@1.29.2_rollup@4.36.0_typescript@5.8.2/node_modules/astro/components/Image.astro", void 0);

const mimes = {
  "3g2": "video/3gpp2",
  "3gp": "video/3gpp",
  "3gpp": "video/3gpp",
  "3mf": "model/3mf",
  "aac": "audio/aac",
  "ac": "application/pkix-attr-cert",
  "adp": "audio/adpcm",
  "adts": "audio/aac",
  "ai": "application/postscript",
  "aml": "application/automationml-aml+xml",
  "amlx": "application/automationml-amlx+zip",
  "amr": "audio/amr",
  "apng": "image/apng",
  "appcache": "text/cache-manifest",
  "appinstaller": "application/appinstaller",
  "appx": "application/appx",
  "appxbundle": "application/appxbundle",
  "asc": "application/pgp-keys",
  "atom": "application/atom+xml",
  "atomcat": "application/atomcat+xml",
  "atomdeleted": "application/atomdeleted+xml",
  "atomsvc": "application/atomsvc+xml",
  "au": "audio/basic",
  "avci": "image/avci",
  "avcs": "image/avcs",
  "avif": "image/avif",
  "aw": "application/applixware",
  "bdoc": "application/bdoc",
  "bin": "application/octet-stream",
  "bmp": "image/bmp",
  "bpk": "application/octet-stream",
  "btf": "image/prs.btif",
  "btif": "image/prs.btif",
  "buffer": "application/octet-stream",
  "ccxml": "application/ccxml+xml",
  "cdfx": "application/cdfx+xml",
  "cdmia": "application/cdmi-capability",
  "cdmic": "application/cdmi-container",
  "cdmid": "application/cdmi-domain",
  "cdmio": "application/cdmi-object",
  "cdmiq": "application/cdmi-queue",
  "cer": "application/pkix-cert",
  "cgm": "image/cgm",
  "cjs": "application/node",
  "class": "application/java-vm",
  "coffee": "text/coffeescript",
  "conf": "text/plain",
  "cpl": "application/cpl+xml",
  "cpt": "application/mac-compactpro",
  "crl": "application/pkix-crl",
  "css": "text/css",
  "csv": "text/csv",
  "cu": "application/cu-seeme",
  "cwl": "application/cwl",
  "cww": "application/prs.cww",
  "davmount": "application/davmount+xml",
  "dbk": "application/docbook+xml",
  "deb": "application/octet-stream",
  "def": "text/plain",
  "deploy": "application/octet-stream",
  "dib": "image/bmp",
  "disposition-notification": "message/disposition-notification",
  "dist": "application/octet-stream",
  "distz": "application/octet-stream",
  "dll": "application/octet-stream",
  "dmg": "application/octet-stream",
  "dms": "application/octet-stream",
  "doc": "application/msword",
  "dot": "application/msword",
  "dpx": "image/dpx",
  "drle": "image/dicom-rle",
  "dsc": "text/prs.lines.tag",
  "dssc": "application/dssc+der",
  "dtd": "application/xml-dtd",
  "dump": "application/octet-stream",
  "dwd": "application/atsc-dwd+xml",
  "ear": "application/java-archive",
  "ecma": "application/ecmascript",
  "elc": "application/octet-stream",
  "emf": "image/emf",
  "eml": "message/rfc822",
  "emma": "application/emma+xml",
  "emotionml": "application/emotionml+xml",
  "eps": "application/postscript",
  "epub": "application/epub+zip",
  "exe": "application/octet-stream",
  "exi": "application/exi",
  "exp": "application/express",
  "exr": "image/aces",
  "ez": "application/andrew-inset",
  "fdf": "application/fdf",
  "fdt": "application/fdt+xml",
  "fits": "image/fits",
  "g3": "image/g3fax",
  "gbr": "application/rpki-ghostbusters",
  "geojson": "application/geo+json",
  "gif": "image/gif",
  "glb": "model/gltf-binary",
  "gltf": "model/gltf+json",
  "gml": "application/gml+xml",
  "gpx": "application/gpx+xml",
  "gram": "application/srgs",
  "grxml": "application/srgs+xml",
  "gxf": "application/gxf",
  "gz": "application/gzip",
  "h261": "video/h261",
  "h263": "video/h263",
  "h264": "video/h264",
  "heic": "image/heic",
  "heics": "image/heic-sequence",
  "heif": "image/heif",
  "heifs": "image/heif-sequence",
  "hej2": "image/hej2k",
  "held": "application/atsc-held+xml",
  "hjson": "application/hjson",
  "hlp": "application/winhlp",
  "hqx": "application/mac-binhex40",
  "hsj2": "image/hsj2",
  "htm": "text/html",
  "html": "text/html",
  "ics": "text/calendar",
  "ief": "image/ief",
  "ifb": "text/calendar",
  "iges": "model/iges",
  "igs": "model/iges",
  "img": "application/octet-stream",
  "in": "text/plain",
  "ini": "text/plain",
  "ink": "application/inkml+xml",
  "inkml": "application/inkml+xml",
  "ipfix": "application/ipfix",
  "iso": "application/octet-stream",
  "its": "application/its+xml",
  "jade": "text/jade",
  "jar": "application/java-archive",
  "jhc": "image/jphc",
  "jls": "image/jls",
  "jp2": "image/jp2",
  "jpe": "image/jpeg",
  "jpeg": "image/jpeg",
  "jpf": "image/jpx",
  "jpg": "image/jpeg",
  "jpg2": "image/jp2",
  "jpgm": "image/jpm",
  "jpgv": "video/jpeg",
  "jph": "image/jph",
  "jpm": "image/jpm",
  "jpx": "image/jpx",
  "js": "text/javascript",
  "json": "application/json",
  "json5": "application/json5",
  "jsonld": "application/ld+json",
  "jsonml": "application/jsonml+json",
  "jsx": "text/jsx",
  "jt": "model/jt",
  "jxl": "image/jxl",
  "jxr": "image/jxr",
  "jxra": "image/jxra",
  "jxrs": "image/jxrs",
  "jxs": "image/jxs",
  "jxsc": "image/jxsc",
  "jxsi": "image/jxsi",
  "jxss": "image/jxss",
  "kar": "audio/midi",
  "ktx": "image/ktx",
  "ktx2": "image/ktx2",
  "less": "text/less",
  "lgr": "application/lgr+xml",
  "list": "text/plain",
  "litcoffee": "text/coffeescript",
  "log": "text/plain",
  "lostxml": "application/lost+xml",
  "lrf": "application/octet-stream",
  "m1v": "video/mpeg",
  "m21": "application/mp21",
  "m2a": "audio/mpeg",
  "m2t": "video/mp2t",
  "m2ts": "video/mp2t",
  "m2v": "video/mpeg",
  "m3a": "audio/mpeg",
  "m4a": "audio/mp4",
  "m4p": "application/mp4",
  "m4s": "video/iso.segment",
  "ma": "application/mathematica",
  "mads": "application/mads+xml",
  "maei": "application/mmt-aei+xml",
  "man": "text/troff",
  "manifest": "text/cache-manifest",
  "map": "application/json",
  "mar": "application/octet-stream",
  "markdown": "text/markdown",
  "mathml": "application/mathml+xml",
  "mb": "application/mathematica",
  "mbox": "application/mbox",
  "md": "text/markdown",
  "mdx": "text/mdx",
  "me": "text/troff",
  "mesh": "model/mesh",
  "meta4": "application/metalink4+xml",
  "metalink": "application/metalink+xml",
  "mets": "application/mets+xml",
  "mft": "application/rpki-manifest",
  "mid": "audio/midi",
  "midi": "audio/midi",
  "mime": "message/rfc822",
  "mj2": "video/mj2",
  "mjp2": "video/mj2",
  "mjs": "text/javascript",
  "mml": "text/mathml",
  "mods": "application/mods+xml",
  "mov": "video/quicktime",
  "mp2": "audio/mpeg",
  "mp21": "application/mp21",
  "mp2a": "audio/mpeg",
  "mp3": "audio/mpeg",
  "mp4": "video/mp4",
  "mp4a": "audio/mp4",
  "mp4s": "application/mp4",
  "mp4v": "video/mp4",
  "mpd": "application/dash+xml",
  "mpe": "video/mpeg",
  "mpeg": "video/mpeg",
  "mpf": "application/media-policy-dataset+xml",
  "mpg": "video/mpeg",
  "mpg4": "video/mp4",
  "mpga": "audio/mpeg",
  "mpp": "application/dash-patch+xml",
  "mrc": "application/marc",
  "mrcx": "application/marcxml+xml",
  "ms": "text/troff",
  "mscml": "application/mediaservercontrol+xml",
  "msh": "model/mesh",
  "msi": "application/octet-stream",
  "msix": "application/msix",
  "msixbundle": "application/msixbundle",
  "msm": "application/octet-stream",
  "msp": "application/octet-stream",
  "mtl": "model/mtl",
  "mts": "video/mp2t",
  "musd": "application/mmt-usd+xml",
  "mxf": "application/mxf",
  "mxmf": "audio/mobile-xmf",
  "mxml": "application/xv+xml",
  "n3": "text/n3",
  "nb": "application/mathematica",
  "nq": "application/n-quads",
  "nt": "application/n-triples",
  "obj": "model/obj",
  "oda": "application/oda",
  "oga": "audio/ogg",
  "ogg": "audio/ogg",
  "ogv": "video/ogg",
  "ogx": "application/ogg",
  "omdoc": "application/omdoc+xml",
  "onepkg": "application/onenote",
  "onetmp": "application/onenote",
  "onetoc": "application/onenote",
  "onetoc2": "application/onenote",
  "opf": "application/oebps-package+xml",
  "opus": "audio/ogg",
  "otf": "font/otf",
  "owl": "application/rdf+xml",
  "oxps": "application/oxps",
  "p10": "application/pkcs10",
  "p7c": "application/pkcs7-mime",
  "p7m": "application/pkcs7-mime",
  "p7s": "application/pkcs7-signature",
  "p8": "application/pkcs8",
  "pdf": "application/pdf",
  "pfr": "application/font-tdpfr",
  "pgp": "application/pgp-encrypted",
  "pkg": "application/octet-stream",
  "pki": "application/pkixcmp",
  "pkipath": "application/pkix-pkipath",
  "pls": "application/pls+xml",
  "png": "image/png",
  "prc": "model/prc",
  "prf": "application/pics-rules",
  "provx": "application/provenance+xml",
  "ps": "application/postscript",
  "pskcxml": "application/pskc+xml",
  "pti": "image/prs.pti",
  "qt": "video/quicktime",
  "raml": "application/raml+yaml",
  "rapd": "application/route-apd+xml",
  "rdf": "application/rdf+xml",
  "relo": "application/p2p-overlay+xml",
  "rif": "application/reginfo+xml",
  "rl": "application/resource-lists+xml",
  "rld": "application/resource-lists-diff+xml",
  "rmi": "audio/midi",
  "rnc": "application/relax-ng-compact-syntax",
  "rng": "application/xml",
  "roa": "application/rpki-roa",
  "roff": "text/troff",
  "rq": "application/sparql-query",
  "rs": "application/rls-services+xml",
  "rsat": "application/atsc-rsat+xml",
  "rsd": "application/rsd+xml",
  "rsheet": "application/urc-ressheet+xml",
  "rss": "application/rss+xml",
  "rtf": "text/rtf",
  "rtx": "text/richtext",
  "rusd": "application/route-usd+xml",
  "s3m": "audio/s3m",
  "sbml": "application/sbml+xml",
  "scq": "application/scvp-cv-request",
  "scs": "application/scvp-cv-response",
  "sdp": "application/sdp",
  "senmlx": "application/senml+xml",
  "sensmlx": "application/sensml+xml",
  "ser": "application/java-serialized-object",
  "setpay": "application/set-payment-initiation",
  "setreg": "application/set-registration-initiation",
  "sgi": "image/sgi",
  "sgm": "text/sgml",
  "sgml": "text/sgml",
  "shex": "text/shex",
  "shf": "application/shf+xml",
  "shtml": "text/html",
  "sieve": "application/sieve",
  "sig": "application/pgp-signature",
  "sil": "audio/silk",
  "silo": "model/mesh",
  "siv": "application/sieve",
  "slim": "text/slim",
  "slm": "text/slim",
  "sls": "application/route-s-tsid+xml",
  "smi": "application/smil+xml",
  "smil": "application/smil+xml",
  "snd": "audio/basic",
  "so": "application/octet-stream",
  "spdx": "text/spdx",
  "spp": "application/scvp-vp-response",
  "spq": "application/scvp-vp-request",
  "spx": "audio/ogg",
  "sql": "application/sql",
  "sru": "application/sru+xml",
  "srx": "application/sparql-results+xml",
  "ssdl": "application/ssdl+xml",
  "ssml": "application/ssml+xml",
  "stk": "application/hyperstudio",
  "stl": "model/stl",
  "stpx": "model/step+xml",
  "stpxz": "model/step-xml+zip",
  "stpz": "model/step+zip",
  "styl": "text/stylus",
  "stylus": "text/stylus",
  "svg": "image/svg+xml",
  "svgz": "image/svg+xml",
  "swidtag": "application/swid+xml",
  "t": "text/troff",
  "t38": "image/t38",
  "td": "application/urc-targetdesc+xml",
  "tei": "application/tei+xml",
  "teicorpus": "application/tei+xml",
  "text": "text/plain",
  "tfi": "application/thraud+xml",
  "tfx": "image/tiff-fx",
  "tif": "image/tiff",
  "tiff": "image/tiff",
  "toml": "application/toml",
  "tr": "text/troff",
  "trig": "application/trig",
  "ts": "video/mp2t",
  "tsd": "application/timestamped-data",
  "tsv": "text/tab-separated-values",
  "ttc": "font/collection",
  "ttf": "font/ttf",
  "ttl": "text/turtle",
  "ttml": "application/ttml+xml",
  "txt": "text/plain",
  "u3d": "model/u3d",
  "u8dsn": "message/global-delivery-status",
  "u8hdr": "message/global-headers",
  "u8mdn": "message/global-disposition-notification",
  "u8msg": "message/global",
  "ubj": "application/ubjson",
  "uri": "text/uri-list",
  "uris": "text/uri-list",
  "urls": "text/uri-list",
  "vcard": "text/vcard",
  "vrml": "model/vrml",
  "vtt": "text/vtt",
  "vxml": "application/voicexml+xml",
  "war": "application/java-archive",
  "wasm": "application/wasm",
  "wav": "audio/wav",
  "weba": "audio/webm",
  "webm": "video/webm",
  "webmanifest": "application/manifest+json",
  "webp": "image/webp",
  "wgsl": "text/wgsl",
  "wgt": "application/widget",
  "wif": "application/watcherinfo+xml",
  "wmf": "image/wmf",
  "woff": "font/woff",
  "woff2": "font/woff2",
  "wrl": "model/vrml",
  "wsdl": "application/wsdl+xml",
  "wspolicy": "application/wspolicy+xml",
  "x3d": "model/x3d+xml",
  "x3db": "model/x3d+fastinfoset",
  "x3dbz": "model/x3d+binary",
  "x3dv": "model/x3d-vrml",
  "x3dvz": "model/x3d+vrml",
  "x3dz": "model/x3d+xml",
  "xaml": "application/xaml+xml",
  "xav": "application/xcap-att+xml",
  "xca": "application/xcap-caps+xml",
  "xcs": "application/calendar+xml",
  "xdf": "application/xcap-diff+xml",
  "xdssc": "application/dssc+xml",
  "xel": "application/xcap-el+xml",
  "xenc": "application/xenc+xml",
  "xer": "application/patch-ops-error+xml",
  "xfdf": "application/xfdf",
  "xht": "application/xhtml+xml",
  "xhtml": "application/xhtml+xml",
  "xhvml": "application/xv+xml",
  "xlf": "application/xliff+xml",
  "xm": "audio/xm",
  "xml": "text/xml",
  "xns": "application/xcap-ns+xml",
  "xop": "application/xop+xml",
  "xpl": "application/xproc+xml",
  "xsd": "application/xml",
  "xsf": "application/prs.xsf+xml",
  "xsl": "application/xml",
  "xslt": "application/xml",
  "xspf": "application/xspf+xml",
  "xvm": "application/xv+xml",
  "xvml": "application/xv+xml",
  "yaml": "text/yaml",
  "yang": "application/yang",
  "yin": "application/yin+xml",
  "yml": "text/yaml",
  "zip": "application/zip"
};

function lookup(extn) {
	let tmp = ('' + extn).trim().toLowerCase();
	let idx = tmp.lastIndexOf('.');
	return mimes[!~idx ? tmp : tmp.substring(++idx)];
}

const $$Astro = createAstro();
const $$Picture = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Picture;
  const defaultFormats = ["webp"];
  const defaultFallbackFormat = "png";
  const specialFormatsFallback = ["gif", "svg", "jpg", "jpeg"];
  const { formats = defaultFormats, pictureAttributes = {}, fallbackFormat, ...props } = Astro2.props;
  if (props.alt === void 0 || props.alt === null) {
    throw new AstroError(ImageMissingAlt);
  }
  const scopedStyleClass = props.class?.match(/\bastro-\w{8}\b/)?.[0];
  if (scopedStyleClass) {
    if (pictureAttributes.class) {
      pictureAttributes.class = `${pictureAttributes.class} ${scopedStyleClass}`;
    } else {
      pictureAttributes.class = scopedStyleClass;
    }
  }
  for (const key in props) {
    if (key.startsWith("data-astro-cid")) {
      pictureAttributes[key] = props[key];
    }
  }
  const originalSrc = await resolveSrc(props.src);
  const optimizedImages = await Promise.all(
    formats.map(
      async (format) => await getImage({
        ...props,
        src: originalSrc,
        format,
        widths: props.widths,
        densities: props.densities
      })
    )
  );
  let resultFallbackFormat = fallbackFormat ?? defaultFallbackFormat;
  if (!fallbackFormat && isESMImportedImage(originalSrc) && specialFormatsFallback.includes(originalSrc.format)) {
    resultFallbackFormat = originalSrc.format;
  }
  const fallbackImage = await getImage({
    ...props,
    format: resultFallbackFormat,
    widths: props.widths,
    densities: props.densities
  });
  const imgAdditionalAttributes = {};
  const sourceAdditionalAttributes = {};
  if (props.sizes) {
    sourceAdditionalAttributes.sizes = props.sizes;
  }
  if (fallbackImage.srcSet.values.length > 0) {
    imgAdditionalAttributes.srcset = fallbackImage.srcSet.attribute;
  }
  return renderTemplate`${maybeRenderHead()}<picture${spreadAttributes(pictureAttributes)}> ${Object.entries(optimizedImages).map(([_, image]) => {
    const srcsetAttribute = props.densities || !props.densities && !props.widths ? `${image.src}${image.srcSet.values.length > 0 ? ", " + image.srcSet.attribute : ""}` : image.srcSet.attribute;
    return renderTemplate`<source${addAttribute(srcsetAttribute, "srcset")}${addAttribute(lookup(image.options.format ?? image.src) ?? `image/${image.options.format}`, "type")}${spreadAttributes(sourceAdditionalAttributes)}>`;
  })} <img${addAttribute(fallbackImage.src, "src")}${spreadAttributes(imgAdditionalAttributes)}${spreadAttributes(fallbackImage.attributes)}> </picture>`;
}, "C:/All Projects ,Code/Projects/Codeforces Portal/node_modules/.pnpm/astro@4.16.19_@types+node@20.17.25_lightningcss@1.29.2_rollup@4.36.0_typescript@5.8.2/node_modules/astro/components/Picture.astro", void 0);

const imageConfig = {"service":{"entrypoint":"astro/assets/services/sharp","config":{}},"domains":[],"remotePatterns":[]};
					const getImage = async (options) => await getImage$1(options, imageConfig);

const fnv1a52 = (str) => {
  const len = str.length;
  let i = 0, t0 = 0, v0 = 8997, t1 = 0, v1 = 33826, t2 = 0, v2 = 40164, t3 = 0, v3 = 52210;
  while (i < len) {
    v0 ^= str.charCodeAt(i++);
    t0 = v0 * 435;
    t1 = v1 * 435;
    t2 = v2 * 435;
    t3 = v3 * 435;
    t2 += v0 << 8;
    t3 += v1 << 8;
    t1 += t0 >>> 16;
    v0 = t0 & 65535;
    t2 += t1 >>> 16;
    v1 = t1 & 65535;
    v3 = t3 + (t2 >>> 16) & 65535;
    v2 = t2 & 65535;
  }
  return (v3 & 15) * 281474976710656 + v2 * 4294967296 + v1 * 65536 + (v0 ^ v3 >> 4);
};
const etag = (payload, weak = false) => {
  const prefix = weak ? 'W/"' : '"';
  return prefix + fnv1a52(payload).toString(36) + payload.length.toString(36) + '"';
};

async function loadRemoteImage(src, headers) {
  try {
    const res = await fetch(src, {
      // Forward all headers from the original request
      headers
    });
    if (!res.ok) {
      return void 0;
    }
    return await res.arrayBuffer();
  } catch {
    return void 0;
  }
}
const GET = async ({ request }) => {
  try {
    const imageService = await getConfiguredImageService();
    if (!("transform" in imageService)) {
      throw new Error("Configured image service is not a local service");
    }
    const url = new URL(request.url);
    const transform = await imageService.parseURL(url, imageConfig);
    if (!transform?.src) {
      throw new Error("Incorrect transform returned by `parseURL`");
    }
    let inputBuffer = void 0;
    const isRemoteImage = isCoreRemotePath(transform.src);
    const sourceUrl = isRemoteImage ? new URL(transform.src) : new URL(transform.src, url.origin);
    if (isRemoteImage && isRemoteAllowed(transform.src, imageConfig) === false) {
      return new Response("Forbidden", { status: 403 });
    }
    inputBuffer = await loadRemoteImage(sourceUrl, isRemoteImage ? new Headers() : request.headers);
    if (!inputBuffer) {
      return new Response("Not Found", { status: 404 });
    }
    const { data, format } = await imageService.transform(
      new Uint8Array(inputBuffer),
      transform,
      imageConfig
    );
    return new Response(data, {
      status: 200,
      headers: {
        "Content-Type": lookup(format) ?? `image/${format}`,
        "Cache-Control": "public, max-age=31536000",
        ETag: etag(data.toString()),
        Date: (/* @__PURE__ */ new Date()).toUTCString()
      }
    });
  } catch (err) {
    console.error("Could not process image request:", err);
    return new Response(`Server Error: ${err}`, { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
