import {
  ADDON_CATEGORY,
  ADDON_TYPE,
  PLUGIN_TYPE,
  PROPERTY_TYPE,
} from "./template/enums.js";
import _version from "./version.js";
export const addonType = ADDON_TYPE.PLUGIN;
export const type = PLUGIN_TYPE.WORLD;
export const id = "skymen_text_glyph";
export const name = "Text Glyph";
export const version = _version;
export const minConstructVersion = undefined;
export const author = "skymen";
export const website = "https://www.construct.net";
export const documentation = "https://www.construct.net";
export const description =
  "Text object drawn from a shared glyph atlas. Real shaping and bidi, BBCode, per-letter effects, typewriter without reflow.";
export const category = ADDON_CATEGORY.GENERAL;

export const hasDomside = false;
export const files = {
  extensionScript: {
    enabled: false,
    watch: false,
    targets: ["x86", "x64"],
    name: "MyExtension",
  },
  fileDependencies: [
    {
      filename: "text-shaper.wasm",
      type: "copy-to-output",
      fileType: "application/wasm",
    },
    {
      filename: "font-baker.wasm",
      type: "copy-to-output",
      fileType: "application/wasm",
    },
    {
      filename: "bitmap-baker.wasm",
      type: "copy-to-output",
      fileType: "application/wasm",
    },
  ],
  remoteFileDependencies: [],
  cordovaPluginReferences: [],
  cordovaResourceFiles: [],
};

export const aceCategories = {
  text: "Text",
  typewriter: "Typewriter",
  tags: "Tags",
  fonts: "Fonts",
};

export const info = {
  icon: "icon.svg",
  Set: {
    CanBeBundled: true,
    IsDeprecated: false,
    GooglePlayServicesEnabled: false,

    IsOnlyOneAllowed: false,

    IsResizable: true,
    IsRotatable: true,
    Is3D: false,
    HasImage: false,
    IsTiled: false,
    SupportsZElevation: true,
    SupportsColor: true,
    SupportsEffects: true,
    MustPreDraw: false,

    IsSingleGlobal: false,
  },
  AddCommonACEs: {
    Position: true,
    SceneGraph: true,
    Size: true,
    Angle: true,
    Appearance: true,
    ZOrder: true,
  },
};

// Property order is frozen once released: append only.
export const properties = [
  {
    type: PROPERTY_TYPE.LONGTEXT,
    id: "text",
    name: "Text",
    desc: "The text to display. Supports BBCode when enabled.",
    options: { initialValue: "Text" },
  },
  {
    type: PROPERTY_TYPE.CHECK,
    id: "bbcode",
    name: "Enable BBCode",
    desc: "Parse BBCode tags like [b], [color=red] and [size=20] in the text.",
    options: { initialValue: true },
  },
  {
    type: PROPERTY_TYPE.FONT,
    id: "font",
    name: "Font",
    desc: "Font family. Must match a .ttf or .otf file in the project's Fonts folder.",
    options: { initialValue: "Arial" },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "size",
    name: "Size",
    desc: "Font size in points.",
    options: { initialValue: 12, minValue: 0.1 },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "lineHeight",
    name: "Line height",
    desc: "Extra pixels added to every line. Can be negative.",
    options: { initialValue: 0 },
  },
  {
    type: PROPERTY_TYPE.CHECK,
    id: "bold",
    name: "Bold",
    desc: "Use the Bold font file when present, otherwise embolden the regular face.",
    options: { initialValue: false },
  },
  {
    type: PROPERTY_TYPE.CHECK,
    id: "italic",
    name: "Italic",
    desc: "Use the Italic font file when present, otherwise slant the regular face.",
    options: { initialValue: false },
  },
  {
    type: PROPERTY_TYPE.COLOR,
    id: "color",
    name: "Color",
    desc: "Text color.",
    options: { initialValue: [0, 0, 0] },
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "hAlign",
    name: "Horizontal alignment",
    desc: "Horizontal alignment of the text inside the object.",
    options: {
      initialValue: "left",
      items: [{ left: "Left" }, { center: "Center" }, { right: "Right" }],
    },
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "vAlign",
    name: "Vertical alignment",
    desc: "Vertical alignment of the text inside the object.",
    options: {
      initialValue: "top",
      items: [{ top: "Top" }, { center: "Center" }, { bottom: "Bottom" }],
    },
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "wrap",
    name: "Wrapping",
    desc: "Break lines between words or between characters.",
    options: {
      initialValue: "word",
      items: [{ word: "Word" }, { character: "Character" }],
    },
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "direction",
    name: "Text direction",
    desc: "Base paragraph direction. Auto picks it from the first strong character.",
    options: {
      initialValue: "ltr",
      items: [
        { ltr: "Left to right" },
        { rtl: "Right to left" },
        { auto: "Auto" },
      ],
    },
  },
];
