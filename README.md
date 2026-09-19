<img src="./examples/cover.png" width="150" /><br>
# Text Glyph
<i>Text object drawn using pmdrs's glyph engine. Supports more BBCode tags than the default text object and handles kerning better.</i> <br>
### Version 1.0.0.0

[<img src="https://placehold.co/200x50/4493f8/FFF?text=Download&font=montserrat" width="200"/>](https://github.com/skymen/text_glyph/releases/download/skymen_text_glyph-1.0.0.0.c3addon/skymen_text_glyph-1.0.0.0.c3addon)
<br>
<sub> [See all releases](https://github.com/skymen/text_glyph/releases) </sub> <br>

#### What's New in 1.0.0.0
- **Added:** Initial release

<sub>[View full changelog](#changelog)</sub>

---
<b><u>Author:</u></b> skymen <br>
<b>[Construct Addon Page](https://www.construct.net/en/make-games/addons/1708/text-glyph)</b>  <br>
<sub>Made using [CAW](https://marketplace.visualstudio.com/items?itemName=skymen.caw) </sub><br>

## Table of Contents
- [Usage](#usage)
- [Examples Files](#examples-files)
- [Properties](#properties)
- [Actions](#actions)
- [Conditions](#conditions)
- [Expressions](#expressions)
---
## Usage
To build the addon, run the following commands:

```
npm i
npm run build
```

To run the dev server, run

```
npm i
npm run dev
```

## Examples Files
| Description | Download |
| --- | --- |
| text-glyph-feature-tour-modified | [<img src="https://placehold.co/120x30/4493f8/FFF?text=Download&font=montserrat" width="120"/>](https://github.com/skymen/text_glyph/raw/refs/heads/main/examples/text-glyph-feature-tour-modified.c3p) |
| text-glyph-feature-tour | [<img src="https://placehold.co/120x30/4493f8/FFF?text=Download&font=montserrat" width="120"/>](https://github.com/skymen/text_glyph/raw/refs/heads/main/examples/text-glyph-feature-tour.c3p) |
| text-glyph-vs-builtin | [<img src="https://placehold.co/120x30/4493f8/FFF?text=Download&font=montserrat" width="120"/>](https://github.com/skymen/text_glyph/raw/refs/heads/main/examples/text-glyph-vs-builtin.c3p) |

---
## Properties
| Property Name | Description | Type |
| --- | --- | --- |
| Text | The text to display. Supports BBCode when enabled. | longtext |
| Enable BBCode | Parse BBCode tags like [b], [color=red] and [size=20] in the text. | check |
| Font files | Fonts must be .ttf or .otf files in the project's Fonts folder. WOFF and variable fonts are not supported. | info |
| Font | Font family. Must match a .ttf or .otf file in the project's Fonts folder. | font |
| Size | Font size in points. | float |
| Line height | Extra pixels added to every line. Can be negative. | float |
| Bold | Use the Bold font file when present, otherwise embolden the regular face. | check |
| Italic | Use the Italic font file when present, otherwise slant the regular face. | check |
| Color | Text color. | color |
| Horizontal alignment | Where each line sits in the box: 0 is the left edge, 0.5 the center, 1 the right edge. | float |
| Vertical alignment | Where the text block sits in the box: 0 is the top, 0.5 the middle, 1 the bottom. | float |
| Justify | Stretch word spacing so lines fill the box width. The last line of a paragraph follows the horizontal alignment unless every line is justified. | combo |
| Wrapping | Break lines between words, between characters, or only at line breaks in the text. | combo |
| Overflow | Let text extend past the bottom of the box. When off, lines that do not fit inside the box are not drawn. | check |
| Ellipsis | Cut text that does not fit the box and end it with an ellipsis (…). | check |
| Max lines | Highest number of lines to lay out. 0 means no limit. Pairs well with Ellipsis. | integer |
| Text direction | Base paragraph direction. Auto picks it from the first strong character. | combo |
| Origin X | Horizontal origin as a fraction of the width: 0 is the left edge, 1 the right edge. | float |
| Origin Y | Vertical origin as a fraction of the height: 0 is the top edge, 1 the bottom edge. | float |
| Icon set | A Sprite whose animations are used by [icon=animation] tags. The Sprite needs at least one instance in the layout. | object |
| Spacing | Letter, word and paragraph spacing, columns and justify tuning. | group |
| Letter spacing | Extra pixels after every character. Can be negative. | float |
| Word spacing | Extra pixels after every space. Can be negative. | float |
| Paragraph spacing | Extra pixels between paragraphs, meaning after every line break in the text. | float |
| Columns | Flow the text through this many columns inside the box, filling each column to the box height in turn. | integer |
| Column gap | Pixels between columns. | float |
| Justify: min word space | When justifying, a space may shrink to this multiple of its natural width. 1 never shrinks. | float |
| Justify: max word space | When justifying, a space may grow to this multiple of its natural width before letters spread apart. 0 means no limit. | float |
| Justify: letter space | Most extra pixels allowed between letters when justifying once word spaces reach their maximum. | float |


---
## Actions
| Action | Description | Params
| --- | --- | --- |
| Add flow exclusion | Text wraps around the picked instances. Sprites use their collision polygon, anything else its bounding box. The layout follows them as they move. | Object             *(object)* <br>Wrap side             *(combo)* <br>Margin             *(number)* <br> |
| Clear flow exclusions | Stop wrapping around every instance. |  |
| Remove flow exclusion | Stop wrapping around the picked instances. | Object             *(object)* <br> |
| Set icon set | Use a Sprite's animations for [icon=animation] tags. The Sprite needs at least one instance in the layout. | Sprite             *(object)* <br> |
| Load font | Load a project font ahead of time so text using it appears without delay. Waits until the font is ready. | Font family             *(string)* <br>Style             *(combo)* <br> |
| Set columns | Flow the text through several columns inside the box, filling each to the box height in turn. | Columns             *(number)* <br>Gap             *(number)* <br> |
| Set justify tuning | How far spaces may shrink and grow when justifying before letters spread apart. Max 0 means no limit. | Min word space             *(number)* <br>Max word space             *(number)* <br>Letter space             *(number)* <br> |
| Set letter spacing | Extra pixels after every character. Can be negative. | Pixels             *(number)* <br> |
| Set max lines | Highest number of lines to lay out. 0 means no limit. | Lines             *(number)* <br> |
| Set paragraph spacing | Extra pixels between paragraphs, meaning after every line break in the text. | Pixels             *(number)* <br> |
| Set word spacing | Extra pixels after every space. Can be negative. | Pixels             *(number)* <br> |
| Append text | Add some text to the end of the existing text. | Text             *(any)* <br> |
| Set BBCode enabled | Enable or disable BBCode parsing of the text. | Enabled             *(boolean)* <br> |
| Set ellipsis | Cut text that does not fit the box and end it with an ellipsis (…). | Ellipsis             *(boolean)* <br> |
| Set font color | Set the text color, e.g. with rgb(255, 0, 0) or rgbEx(100, 0, 0). | Color             *(number)* <br> |
| Set font face | Set the font family and style. The family must match a .ttf or .otf project file. | Font family             *(string)* <br>Style             *(combo)* <br> |
| Set font size | Set the font size in points. | Size             *(number)* <br> |
| Set horizontal alignment | Set the horizontal alignment of the text. | Alignment             *(combo)* <br> |
| Set horizontal alignment (by percentage) | Set where each line sits in the box: 0 is the left edge, 50 the center, 100 the right edge. Any value in between works. | Percent             *(number)* <br> |
| Set justify | Stretch word spacing so lines fill the box width. | Mode             *(combo)* <br> |
| Set line height | Set the extra pixels added to every line. Can be negative. | Line height             *(number)* <br> |
| Set origin | Set the origin point as fractions of the size. (0, 0) is the top left corner, (0.5, 0.5) the center, (1, 1) the bottom right corner. | Origin X             *(number)* <br>Origin Y             *(number)* <br> |
| Set origin X | Set the horizontal origin as a fraction of the width: 0 is the left edge, 0.5 the center, 1 the right edge. | Origin X             *(number)* <br> |
| Set origin Y | Set the vertical origin as a fraction of the height: 0 is the top edge, 0.5 the center, 1 the bottom edge. | Origin Y             *(number)* <br> |
| Set overflow | Let text extend past the bottom of the box. When off, lines that do not fit inside the box are not drawn. | Overflow             *(boolean)* <br> |
| Set text | Set the text to display. BBCode tags are parsed when BBCode is enabled. | Text             *(any)* <br> |
| Set text direction | Set the base paragraph direction. | Direction             *(combo)* <br> |
| Set vertical alignment | Set the vertical alignment of the text. | Alignment             *(combo)* <br> |
| Set vertical alignment (by percentage) | Set where the text block sits in the box: 0 is the top, 50 the middle, 100 the bottom. Any value in between works. | Percent             *(number)* <br> |
| Set wrapping | Set whether lines break between words, between characters, or only at line breaks in the text. | Mode             *(combo)* <br> |
| Typewriter finish | Reveal the whole text immediately. |  |
| Typewriter text | Set the text and reveal it one character at a time. The layout is computed once, so nothing shifts while typing. | Text             *(any)* <br>Duration             *(number)* <br> |


---
## Conditions
| Condition | Description | Params
| --- | --- | --- |
| Is font loaded | True once a project font has been loaded and is ready to draw with. | Font family *(string)* <br>Style *(combo)* <br> |
| Has tag at position | True if the text under a layout position is inside a [tag=...] span with the given name. | Tag *(string)* <br>X *(number)* <br>Y *(number)* <br> |
| Compare text | Compare the current text with a string. | Text *(string)* <br>Case sensitive *(boolean)* <br> |
| Is running typewriter text | True while text is being revealed by the typewriter action. |  |
| On typewriter text finished | Triggered when the typewriter action has revealed the whole text. |  |


---
## Expressions
| Expression | Description | Return Type | Params
| --- | --- | --- | --- |
| TagAtPosition | The [tag=...] name under a layout position, or an empty string. | string | X *(number)* <br>Y *(number)* <br> | 
| TagCount | How many separate [tag=...] spans with the given name the text contains. | number | Tag *(string)* <br> | 
| TagHeight | The height of the nth [tag=...] span with the given name, in layout coordinates. | number | Tag *(string)* <br>Index *(number)* <br> | 
| TagWidth | The width of the nth [tag=...] span with the given name, in layout coordinates. | number | Tag *(string)* <br>Index *(number)* <br> | 
| TagX | The x of the nth [tag=...] span with the given name, in layout coordinates. | number | Tag *(string)* <br>Index *(number)* <br> | 
| TagY | The y of the nth [tag=...] span with the given name, in layout coordinates. | number | Tag *(string)* <br>Index *(number)* <br> | 
| AlignX | Horizontal alignment in percent, 0 (left) to 100 (right). | number |  | 
| AlignY | Vertical alignment in percent, 0 (top) to 100 (bottom). | number |  | 
| FaceName | The current font family name. | string |  | 
| FaceSize | The current font size in points. | number |  | 
| LineCount | Number of laid out lines. | number |  | 
| LineHeight | The extra pixels added to every line. | number |  | 
| OriginX | Horizontal origin as a fraction of the width, 0 (left) to 1 (right). | number |  | 
| OriginY | Vertical origin as a fraction of the height, 0 (top) to 1 (bottom). | number |  | 
| PlainText | The current text with BBCode tags removed. | string |  | 
| Text | The current text, including BBCode tags. | string |  | 
| TextHeight | Height of all laid out lines, in layout pixels. | number |  | 
| TextWidth | Width of the widest line of laid out text, in layout pixels. | number |  | 


---
## Changelog

**1.0.0.0**
- **Added:** Initial release

**0.0.0.0**
- **Added:** Initial release.
