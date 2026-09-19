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
  "Text object drawn using pmdrs's glyph engine. Supports more BBCode tags than the default text object and handles kerning better.";
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
  spacing: "Spacing",
  flow: "Icons and flow",
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
    type: PROPERTY_TYPE.INFO,
    id: "fontInfo",
    name: "Font files",
    desc: "Fonts must be .ttf or .otf files in the project's Fonts folder. WOFF and variable fonts are not supported.",
    options: { infoCallback: () => "Only .ttf and .otf" },
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
    type: PROPERTY_TYPE.FLOAT,
    id: "alignX",
    name: "Horizontal alignment",
    desc: "Where each line sits in the box: 0 is the left edge, 0.5 the center, 1 the right edge.",
    options: {
      initialValue: 0,
      minValue: 0,
      maxValue: 1,
      dragSpeedMultiplier: 0.01,
    },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "alignY",
    name: "Vertical alignment",
    desc: "Where the text block sits in the box: 0 is the top, 0.5 the middle, 1 the bottom.",
    options: {
      initialValue: 0,
      minValue: 0,
      maxValue: 1,
      dragSpeedMultiplier: 0.01,
    },
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "justify",
    name: "Justify",
    desc: "Stretch word spacing so lines fill the box width. The last line of a paragraph follows the horizontal alignment unless every line is justified.",
    options: {
      initialValue: "none",
      items: [
        { none: "Off" },
        { lines: "All but last line" },
        { all: "Every line" },
      ],
    },
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "wrap",
    name: "Wrapping",
    desc: "Break lines between words, between characters, or only at line breaks in the text.",
    options: {
      initialValue: "word",
      items: [{ word: "Word" }, { character: "Character" }, { none: "None" }],
    },
  },
  {
    type: PROPERTY_TYPE.CHECK,
    id: "overflow",
    name: "Overflow",
    desc: "Let text extend past the bottom of the box. When off, lines that do not fit inside the box are not drawn.",
    options: { initialValue: false },
  },
  {
    type: PROPERTY_TYPE.CHECK,
    id: "ellipsis",
    name: "Ellipsis",
    desc: "Cut text that does not fit the box and end it with an ellipsis (…).",
    options: { initialValue: false },
  },
  {
    type: PROPERTY_TYPE.INTEGER,
    id: "maxLines",
    name: "Max lines",
    desc: "Highest number of lines to lay out. 0 means no limit. Pairs well with Ellipsis.",
    options: { initialValue: 0, minValue: 0 },
  },
  {
    type: PROPERTY_TYPE.COMBO,
    id: "direction",
    name: "Text direction",
    desc: "Base paragraph direction. Auto picks it from the first strong character.",
    options: {
      initialValue: "auto",
      items: [
        { ltr: "Left to right" },
        { rtl: "Right to left" },
        { auto: "Auto" },
      ],
    },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "originX",
    name: "Origin X",
    desc: "Horizontal origin as a fraction of the width: 0 is the left edge, 1 the right edge.",
    options: { initialValue: 0, dragSpeedMultiplier: 0.01 },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "originY",
    name: "Origin Y",
    desc: "Vertical origin as a fraction of the height: 0 is the top edge, 1 the bottom edge.",
    options: { initialValue: 0, dragSpeedMultiplier: 0.01 },
  },
  {
    type: PROPERTY_TYPE.OBJECT,
    id: "iconSet",
    name: "Icon set",
    desc: "A Sprite whose animations are used by [icon=animation] tags. The Sprite needs at least one instance in the layout.",
    options: { allowedPluginIds: ["Sprite"] },
  },
  {
    type: PROPERTY_TYPE.GROUP,
    id: "spacingGroup",
    name: "Spacing",
    desc: "Letter, word and paragraph spacing, columns and justify tuning.",
    options: {},
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "letterSpacing",
    name: "Letter spacing",
    desc: "Extra pixels after every character. Can be negative.",
    options: { initialValue: 0 },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "wordSpacing",
    name: "Word spacing",
    desc: "Extra pixels after every space. Can be negative.",
    options: { initialValue: 0 },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "paragraphSpacing",
    name: "Paragraph spacing",
    desc: "Extra pixels between paragraphs, meaning after every line break in the text.",
    options: { initialValue: 0 },
  },
  {
    type: PROPERTY_TYPE.INTEGER,
    id: "columns",
    name: "Columns",
    desc: "Flow the text through this many columns inside the box, filling each column to the box height in turn.",
    options: { initialValue: 1, minValue: 1 },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "columnGap",
    name: "Column gap",
    desc: "Pixels between columns.",
    options: { initialValue: 0, minValue: 0 },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "justifyMinWordSpace",
    name: "Justify: min word space",
    desc: "When justifying, a space may shrink to this multiple of its natural width. 1 never shrinks.",
    options: {
      initialValue: 1,
      minValue: 0.01,
      maxValue: 1,
      dragSpeedMultiplier: 0.01,
    },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "justifyMaxWordSpace",
    name: "Justify: max word space",
    desc: "When justifying, a space may grow to this multiple of its natural width before letters spread apart. 0 means no limit.",
    options: { initialValue: 0, minValue: 0, dragSpeedMultiplier: 0.05 },
  },
  {
    type: PROPERTY_TYPE.FLOAT,
    id: "justifyLetterSpace",
    name: "Justify: letter space",
    desc: "Most extra pixels allowed between letters when justifying once word spaces reach their maximum.",
    options: { initialValue: 0, minValue: 0 },
  },
];
