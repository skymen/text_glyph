<img src="./src/icon.svg" width="100" /><br>
# Text Glyph
<i>Text object drawn from a shared glyph atlas. Real shaping and bidi, BBCode, per-letter effects, typewriter without reflow.</i> <br>
### Version 0.0.0.0

[<img src="https://placehold.co/200x50/4493f8/FFF?text=Download&font=montserrat" width="200"/>](https://github.com/skymen/text_glyph/releases/download/skymen_text_glyph-0.0.0.0.c3addon/skymen_text_glyph-0.0.0.0.c3addon)
<br>
<sub> [See all releases](https://github.com/skymen/text_glyph/releases) </sub> <br>

#### What's New in 0.0.0.0
- **Added:** Initial release.

<sub>[View full changelog](#changelog)</sub>

---
<b><u>Author:</u></b> skymen <br>
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
| text-glyph-vs-builtin | [<img src="https://placehold.co/120x30/4493f8/FFF?text=Download&font=montserrat" width="120"/>](https://github.com/skymen/text_glyph/raw/refs/heads/main/examples/text-glyph-vs-builtin.c3p) |

---
## Properties
| Property Name | Description | Type |
| --- | --- | --- |
| Text | The text to display. Supports BBCode when enabled. | longtext |
| Enable BBCode | Parse BBCode tags like [b], [color=red] and [size=20] in the text. | check |
| Font | Font family. Must match a .ttf or .otf file in the project's Fonts folder. | font |
| Size | Font size in points. | float |
| Line height | Extra pixels added to every line. Can be negative. | float |
| Bold | Use the Bold font file when present, otherwise embolden the regular face. | check |
| Italic | Use the Italic font file when present, otherwise slant the regular face. | check |
| Color | Text color. | color |
| Horizontal alignment | Horizontal alignment of the text inside the object. | combo |
| Vertical alignment | Vertical alignment of the text inside the object. | combo |
| Wrapping | Break lines between words or between characters. | combo |
| Text direction | Base paragraph direction. Auto picks it from the first strong character. | combo |


---
## Actions
| Action | Description | Params
| --- | --- | --- |
| Load font | Load a project font ahead of time so text using it appears without delay. Waits until the font is ready. | Font family             *(string)* <br>Style             *(combo)* <br> |
| Append text | Add some text to the end of the existing text. | Text             *(any)* <br> |
| Set BBCode enabled | Enable or disable BBCode parsing of the text. | Enabled             *(boolean)* <br> |
| Set font color | Set the text color, e.g. with rgb(255, 0, 0) or rgbEx(100, 0, 0). | Color             *(number)* <br> |
| Set font face | Set the font family and style. The family must match a .ttf or .otf project file. | Font family             *(string)* <br>Style             *(combo)* <br> |
| Set font size | Set the font size in points. | Size             *(number)* <br> |
| Set horizontal alignment | Set the horizontal alignment of the text. | Alignment             *(combo)* <br> |
| Set line height | Set the extra pixels added to every line. Can be negative. | Line height             *(number)* <br> |
| Set text | Set the text to display. BBCode tags are parsed when BBCode is enabled. | Text             *(any)* <br> |
| Set text direction | Set the base paragraph direction. | Direction             *(combo)* <br> |
| Set vertical alignment | Set the vertical alignment of the text. | Alignment             *(combo)* <br> |
| Set wrapping | Set whether lines break between words or between characters. | Mode             *(combo)* <br> |
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
| FaceName | The current font family name. | string |  | 
| FaceSize | The current font size in points. | number |  | 
| LineCount | Number of laid out lines. | number |  | 
| LineHeight | The extra pixels added to every line. | number |  | 
| PlainText | The current text with BBCode tags removed. | string |  | 
| Text | The current text, including BBCode tags. | string |  | 
| TextHeight | Height of all laid out lines, in layout pixels. | number |  | 
| TextWidth | Width of the widest line of laid out text, in layout pixels. | number |  | 


---
## Changelog

**0.0.0.0**
- **Added:** Initial release.
