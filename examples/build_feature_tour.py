#!/usr/bin/env python3
"""Builds examples/text-glyph-feature-tour.c3p: one tab per feature group.

Donor project: the Animate Text "variables-and-functions" example supplies the
fonts (Fredoka), the card, button, pattern, slime and confetti art and the
Sprite, Nine-patch, Tiled Background and Mouse object types. Every ACE id
below comes from that project, from Construct's plugins/allAces.json or from
Text Glyph's own aces.json; none are guessed.
"""
import json
import shutil
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
DONOR = Path(sys.argv[1]) if len(sys.argv) > 1 else HERE.parent.parent / "animate_text" / "examples" / "variables-and-functions.c3p"
OUT_DIR = HERE / "_tour_build"
OUT = HERE / "text-glyph-feature-tour.c3p"

_sid = [500000000000000]
def sid():
    _sid[0] += 7919
    return _sid[0]

_uid = [10]
def uid():
    _uid[0] += 1
    return _uid[0]

def q(s):
    return '"' + s.replace('"', '""') + '"'

def nl(*parts):
    return " & newline & ".join(parts)

# Palette from the donor.
INK = [0.2314, 0.2275, 0.2902, 1]
MUTED = [0.6039, 0.5922, 0.6588, 1]
CORAL = [1, 0.4196, 0.4196, 1]
TEAL = [0.1843, 0.6941, 0.6431, 1]
PURPLE = [0.6078, 0.5216, 0.9412, 1]
GOLD = [0.9608, 0.7255, 0.2588, 1]
WHITE = [1, 1, 1, 1]
REGULAR = "Fredoka-Regular"
SEMIBOLD = "Fredoka-SemiBold"

# ---------------------------------------------------------------- donor files
if OUT_DIR.exists():
    shutil.rmtree(OUT_DIR)
for sub in ("fonts", "icons", "images", "files", "objectTypes", "layouts", "eventSheets"):
    (OUT_DIR / sub).mkdir(parents=True)

donor = zipfile.ZipFile(DONOR)
project = None
donor_types = {}
donor_layout = None
for name in donor.namelist():
    norm = name.replace("\\", "/")
    if norm == "project.c3proj":
        project = json.loads(donor.read(name))
    elif norm.startswith("objectTypes/") and norm.endswith(".json"):
        donor_types[Path(norm).stem] = json.loads(donor.read(name))
    elif norm == "layouts/Playground.json":
        donor_layout = json.loads(donor.read(name))
    elif norm.startswith(("fonts/", "icons/", "images/", "files/")) and not norm.endswith(".uistate.json"):
        (OUT_DIR / norm).write_bytes(donor.read(name))
assert project and donor_layout, "donor is missing project.c3proj or layouts/Playground.json"

def donor_instance(type_name):
    for layer in donor_layout["layers"]:
        for inst in layer["instances"]:
            if inst["type"] == type_name:
                return json.loads(json.dumps(inst))
    raise KeyError(type_name)

# ---------------------------------------------------------------- object types
ANIM = "skymen_Skymen_SpritefontDX"

def glyph_type(name, animated=False):
    return {
        "name": name, "plugin-id": "skymen_text_glyph", "sid": sid(), "isGlobal": False,
        "editorNewInstanceIsReplica": True, "instanceVariables": [],
        "behaviorTypes": [{"behaviorId": ANIM, "name": "AnimateText", "sid": sid()}] if animated else [],
        "effectTypes": [],
    }

TYPES = {}
for name in ("Pattern", "Card", "Button", "Slime", "Confetti", "Mouse"):
    TYPES[name] = donor_types[name]
TYPES["PlainText"] = {**donor_types["Caption"], "name": "PlainText", "sid": sid()}
for name, animated in (("Title", True), ("Label", False), ("Heading", False), ("Caption", False), ("Demo", False), ("Anim", True), ("Cap", False)):
    TYPES[name] = glyph_type(name, animated)
for name, ot in TYPES.items():
    (OUT_DIR / "objectTypes" / f"{name}.json").write_text(json.dumps(ot, indent="\t"))
CONFETTI_SID = TYPES["Confetti"]["sid"]

# ---------------------------------------------------------------- instances
def glyph(type_, text, x, y, w, h, size, color=INK, font=REGULAR, align=(0, 0), line_height=0, **over):
    props = {
        "text": text, "bbcode": True, "font": font, "size": size, "lineHeight": line_height,
        "bold": False, "italic": False, "color": list(color),
        "alignX": align[0], "alignY": align[1], "justify": "none",
        "wrap": "word", "overflow": True, "ellipsis": False, "maxLines": 0, "direction": "auto",
        "originX": 0, "originY": 0, "iconSet": -1,
        "letterSpacing": 0, "wordSpacing": 0, "paragraphSpacing": 0, "columns": 1, "columnGap": 0,
        "justifyMinWordSpace": 1, "justifyMaxWordSpace": 0, "justifyLetterSpace": 0,
    }
    props.update(over)
    behaviors = {}
    if TYPES[type_]["behaviorTypes"]:
        behaviors = {"AnimateText": {"properties": {
            "tw-params": "value offsety -10; duration type 0.1; duration fade 0.1", "tw-easing": "linear",
            "tw-custom-easing": "", "enable-default-functions": True}}}
    return {
        "type": type_, "properties": props, "uid": uid(), "sid": sid(), "tags": "", "instanceVariables": {},
        "behaviors": behaviors, "showing": True, "locked": False,
        "world": {"x": x, "y": y, "width": w, "height": h, "originX": 0, "originY": 0, "color": [1, 1, 1, 1], "z": 0, "angle": 0},
    }

def plain_text(text, x, y, w, h, size, color=INK, font=REGULAR):
    inst = donor_instance("Label")
    inst["type"] = "PlainText"
    inst["uid"] = uid(); inst["sid"] = sid()
    inst["properties"].update({"text": text, "enable-bbcode": True, "font": font, "size": size, "color": list(color),
                               "horizontal-alignment": "left", "vertical-alignment": "top"})
    inst["world"].update({"x": x, "y": y, "width": w, "height": h})
    return inst

def sprite(name, x, y, w=None, h=None, color=None, ivars=None):
    inst = donor_instance(name)
    inst["uid"] = uid(); inst["sid"] = sid()
    inst["world"]["x"] = x; inst["world"]["y"] = y
    if w: inst["world"]["width"] = w
    if h: inst["world"]["height"] = h
    if color: inst["world"]["color"] = list(color)
    if ivars: inst["instanceVariables"].update(ivars)
    return inst

def card(x, y, w, h):
    inst = donor_instance("Card")
    inst["uid"] = uid(); inst["sid"] = sid()
    inst["world"].update({"x": x, "y": y, "width": w, "height": h})
    return inst

def pattern():
    inst = donor_instance("Pattern")
    inst["uid"] = uid(); inst["sid"] = sid()
    return inst


# Arabic needs a font with Arabic glyphs. Tajawal (OFL) ships next to this script.
ARABIC = "Tajawal-Regular"
shutil.copy(HERE / "fonts" / "Tajawal-Regular.ttf", OUT_DIR / "fonts" / "Tajawal-Regular.ttf")
shutil.copy(HERE / "fonts" / "OFL-Tajawal.txt", OUT_DIR / "files" / "OFL-Tajawal.txt")

TABS = [
    ("tags", "Tags", "Tags", "Styling tags: the ones the built-in Text has, and what you type to get them."),
    ("deco", "Decorations", "Decorations", "Outlines, strokes, shadows, and underline styles with their own color, thickness and offset."),
    ("transform", "Transforms", "Transforms", "Per glyph rotation, scale and offset, plus tags that report what is under the cursor."),
    ("align", "Alignment", "Alignment", "Alignment as a percentage on both axes, and three ways to justify."),
    ("wrap", "Wrapping", "Wrapping", "Word, character and no wrapping, ellipsis, max lines and overflow."),
    ("spacing", "Spacing", "Spacing", "Letter, word and paragraph spacing, and columns."),
    ("flow", "Flow", "Flow", "Text flows around instances: drag the slime through the paragraph."),
    ("icons", "Icons", "Icons", "Sprite frames as inline icons, and blank space of any width."),
    ("scripts", "Scripts", "Scripts", "Bidirectional Arabic text, and kerning that survives per letter tags."),
    ("animate", "Animate", "Animate", "Animate Text driving every letter each tick, and the built-in typewriter."),
]
CARD_TOP = 140

def chrome(active):
    """Title and description top left, two rows of tabs top right."""
    desc = next(t[3] for t in TABS if t[0] == active)
    out = [glyph("Title", "Text Glyph", 40, 8, 560, 70, 40, INK, SEMIBOLD, (0, 0.5))]
    out.append(glyph("Caption", desc, 40, 80, 580, 56, 16, MUTED, REGULAR, (0, 0), bbcode=False))
    for i, (tid, layout_name, label, _) in enumerate(TABS):
        row, col = divmod(i, 5)
        cx = 1240 - 56 - (4 - col) * 124
        cy = 46 + row * 56
        color = INK if tid == active else MUTED
        out.append(sprite("Button", cx, cy, color=color, ivars={"id": tid, "pop": 0}))
        out.append(glyph("Label", label, cx - 56, cy - 24, 112, 48, 15, WHITE, SEMIBOLD, (0.5, 0.5)))
    return out

def heading(text, x, y, w, color):
    return glyph("Heading", text, x, y, w, 46, 28, color, SEMIBOLD)

def caption(text, x, y, w, h=44):
    return glyph("Caption", text, x, y, w, h, 12, MUTED, REGULAR, line_height=2, bbcode=False)

def layer(name, instances, transparent, bg=None):
    return {
        "name": name, "overriden": 0, "subLayers": [], "instances": instances, "sid": sid(), "effectTypes": [],
        "isInitiallyVisible": True, "isInitiallyInteractive": True, "isHTMLElementsLayer": False,
        "color": [1, 1, 1, 1], "backgroundColor": bg or [1, 1, 1, 1], "isTransparent": transparent,
        "sampling": "auto", "parallaxX": 1, "parallaxY": 1, "scaleRate": 1, "forceOwnTexture": False,
        "renderingMode": "3d", "drawOrder": "z-order", "useRenderCells": False, "blendMode": "normal",
        "zElevation": 0, "global": False,
    }

def write_layout(name, instances, events):
    lay = {
        "name": name,
        "layers": [layer("Background", [pattern()], False, [0.9922, 0.9725, 0.9451, 1]), layer("Main", instances, True)],
        "sid": sid(), "nonworld-instances": [], "effectTypes": [], "width": 1280, "height": 720,
        "unboundedScrolling": False, "sampling": "auto", "vpX": 0.5, "vpY": 0.5, "projection": "perspective",
        "eventSheet": name,
    }
    (OUT_DIR / "layouts" / f"{name}.json").write_text(json.dumps(lay, indent="\t"))
    (OUT_DIR / "eventSheets" / f"{name}.json").write_text(json.dumps({"name": name, "events": events, "sid": sid()}, indent="\t"))

# ---------------------------------------------------------------- events
def cond(obj, cid, **params):
    c = {"id": cid, "objectClass": obj, "sid": sid()}
    if params:
        c["parameters"] = params
    return c

def act(obj, aid, **params):
    a = {"id": aid, "objectClass": obj, "sid": sid()}
    if params:
        a["parameters"] = params
    return a

def beh_act(obj, aid, beh, **params):
    a = act(obj, aid, **params)
    a["behaviorType"] = beh
    return a

def block(conditions, actions, children=None):
    b = {"eventType": "block", "conditions": conditions, "actions": actions, "sid": sid()}
    if children:
        b["children"] = children
    return b

def group(title, children):
    return {"eventType": "group", "disabled": False, "title": title, "description": "", "isActiveOnStart": True, "sid": sid(), "children": children}

def comment(text):
    return {"eventType": "comment", "text": text}

def variable(name, value, type_="string"):
    return {"eventType": "variable", "name": name, "type": type_, "initialValue": value, "comment": "", "isStatic": False, "isConstant": False, "sid": sid()}

def button_clicked(button_id):
    return [cond("Mouse", "on-object-clicked", **{"mouse-button": "left", "click-type": "clicked", "object-clicked": "Button"}),
            cond("Button", "compare-instance-variable", **{"instance-variable": "id", "comparison": 0, "value": q(button_id)})]

def demo_is(demo_id):
    return cond("Demo", "compare-instance-variable", **{"instance-variable": "id", "comparison": 0, "value": q(demo_id)})

def tg(obj, aid, **params):
    return act(obj, aid, **params)

def shared_events():
    tabs = [block(button_clicked(tid), [act("System", "go-to-layout", layout=layout_name)]) for tid, layout_name, _, _ in TABS]
    return [
        group("Tabs", [comment("Each tab is its own layout. The buttons carry their target in an instance variable.")] + tabs),
        group("Polish", [
            comment("The tiled pattern drifts, buttons pop when hovered. Same tricks as the Animate Text example."),
            block([cond("System", "on-start-of-layout")], [
                beh_act("Title", "set-text", "AnimateText", text=q("[sfdx=offsety wave(3, 180, 30)]Text Glyph[/sfdx]")),
            ]),
            block([cond("System", "every-tick")], [
                act("Pattern", "set-image-offset-x", **{"offset-x": "Pattern.ImageOffsetX + 14 * dt"}),
                act("Pattern", "set-image-offset-y", **{"offset-y": "Pattern.ImageOffsetY + 10 * dt"}),
                act("Button", "set-scale", scale="1 + 0.14 * abs(sin(Self.pop * 720)) * Self.pop"),
                act("Button", "set-instvar-value", **{"instance-variable": "pop", "value": "max(0, Self.pop - dt)"}),
            ]),
            block([cond("Mouse", "cursor-is-over-object", object="Button")], [
                act("Button", "set-scale", scale="1.06 + 0.14 * abs(sin(Self.pop * 720)) * Self.pop"),
            ]),
        ]),
    ]

def two_cards():
    return [card(40, CARD_TOP, 600, 500), card(640, CARD_TOP, 600, 500)]

L, R = 100, 700        # text x inside the left and right cards
HY, CY, BY = CARD_TOP + 26, CARD_TOP + 76, CARD_TOP + 130   # heading, caption, body y

LOREM = "The quick brown fox jumps over the lazy dog while the five boxing wizards jump quickly and the sphinx of black quartz judges my vow."

# ================================================================ 1 Tags
TAGS_TEXT = (
    "[b]bold[/b]  [i]italic[/i]  [u]underline[/u]  [s]strike[/s]\n"
    "[size=32]big[/size]  [size=14]small[/size]  [font=Fredoka-SemiBold]semibold face[/font]\n"
    "[color=#FF6B6B]color[/color]  [opacity=40]faded[/opacity]  [background=#FFE6A6]highlight[/background]\n"
    "secret[hide]hidden[/hide]word  [tag=link]tagged, no visual[/tag]\n"
    "\\[b]escaped brackets\\[/b] stay as typed"
)

def tags_layout():
    inst = chrome("tags") + two_cards()
    inst.append(heading("Styling tags", L, HY, 480, CORAL))
    inst.append(caption("The same tags as the built-in Text object, with the same syntax, so existing strings keep working.", L, CY, 480))
    inst.append(glyph("Demo", TAGS_TEXT, L, BY, 480, 320, 20, INK, REGULAR, line_height=10, paragraphSpacing=14))
    inst.append(heading("What you type", R, HY, 480, TEAL))
    inst.append(caption("The same string with BBCode parsing turned off. A backslash before a bracket keeps it literal.", R, CY, 480))
    inst.append(glyph("Demo", TAGS_TEXT, R, BY, 480, 320, 13, INK, REGULAR, bbcode=False, line_height=6, paragraphSpacing=12))
    return inst, [comment("Tags tab. Everything here is set in the instance properties.")] + shared_events()

# ================================================================ 2 Decorations
OUTLINE_TEXT = (
    "[outline=#3B3A4A][linethickness=1]thin outline[/linethickness][/outline]   [outline=#3B3A4A][linethickness=3]thick outline[/linethickness][/outline]\n"
    "[outlineback=#F5B942][linethickness=5]outline back[/linethickness][/outlineback]   [stroke][linethickness=1.5]stroke only[/linethickness][/stroke]\n"
    "[shadow=#B8B4C4 3 3]shadow 3 px[/shadow]   [shadow=#FF6B6B 10% 10%]shadow 10%[/shadow]\n"
    "[color=#FFFFFF][outline=#2FB1A4][linethickness=2][shadow=#3B3A4A 2 2]all together[/shadow][/linethickness][/outline][/color]"
)
UNDERLINE_TEXT = (
    "[u]underline[/u]  [s]strikethrough[/s]  [o]overline[/o]\n"
    "[decorationstyle=double][u]double[/u][/decorationstyle]  [decorationstyle=dotted][u]dotted[/u][/decorationstyle]  "
    "[decorationstyle=dashed][u]dashed[/u][/decorationstyle]  [decorationstyle=wavy][u]wavy[/u][/decorationstyle]\n"
    "[decorationcolor=#2FB1A4][u]teal line[/u][/decorationcolor]  [decorationcolor=#FF6B6B][s]coral strike[/s][/decorationcolor]\n"
    "[decorationthickness=3][u]thick[/u][/decorationthickness]  [decorationoffset=6][u]lowered[/u][/decorationoffset]  "
    "[decorationoffset=-4][u]raised[/u][/decorationoffset]\n"
    "[linethickness=2][u]linethickness[/u][/linethickness] applies when decorationthickness is not set"
)

def deco_layout():
    inst = chrome("deco") + two_cards()
    inst.append(heading("Outline, stroke, shadow", L, HY, 480, CORAL))
    inst.append(caption("Outline draws over the fill, outline back behind it, stroke draws only the outline. Shadow takes a color and an offset.", L, CY, 480))
    inst.append(glyph("Demo", OUTLINE_TEXT, L, BY, 480, 320, 22, INK, SEMIBOLD, line_height=14, paragraphSpacing=16))
    inst.append(heading("Underline styles", R, HY, 480, TEAL))
    inst.append(caption("Underline, strikethrough and overline share a style, color, thickness and offset. Thickness falls back to linethickness.", R, CY, 480))
    inst.append(glyph("Demo", UNDERLINE_TEXT, R, BY, 480, 320, 19, INK, REGULAR, line_height=12, paragraphSpacing=14))
    return inst, [comment("Decorations tab. Everything here is set in the instance properties.")] + shared_events()

# ================================================================ 3 Transforms
TRANSFORM_TEXT = (
    "[angle=15]tilted[/angle]   [angle=-15]tilted back[/angle]   [space=10][scale=1.4]bigger[/scale][space=14]\n"
    "[space=10][scalex=1.6]wide[/scalex][space=16]   [scaley=0.6]flat[/scaley]   [scaley=1.4]tall[/scaley]\n"
    "[offsety=-30%]raised[/offsety]   [offsety=30%]lowered[/offsety]   [offsetx=12]pushed right[/offsetx]\n"
    "[space=8][angle=8][scale=1.2][color=#9B85F0]combine them[/color][/scale][/angle]"
)
HOVER_TEXT = (
    "Hover a fruit. Each one is a [tag=...] span and the events ask the object what sits under the cursor.\n"
    "[tag=apple][color=#FF6B6B][b]apple[/b][/color][/tag]     [tag=lime][color=#2FB1A4][b]lime[/b][/color][/tag]     "
    "[tag=plum][color=#9B85F0][b]plum[/b][/color][/tag]     [tag=lemon][color=#F5B942][b]lemon[/b][/color][/tag]\n"
    "The dot below sits at TagX and TagY of the lime span, so a sprite can follow a word wherever the text wraps it."
)

def transform_layout():
    inst = chrome("transform") + two_cards()
    inst.append(heading("Rotate, scale, offset", L, HY, 480, CORAL))
    inst.append(caption("Each glyph turns and scales around its own center. Scaling does not change the advance, so space tags make room.", L, CY, 480))
    inst.append(glyph("Demo", TRANSFORM_TEXT, L, BY, 480, 320, 22, INK, REGULAR, line_height=16, paragraphSpacing=18))
    inst.append(heading("Tags under the cursor", R, HY, 480, TEAL))
    inst.append(caption("TagAtPosition(x, y) returns the name under a point. TagX, TagY, TagWidth and TagHeight locate the spans.", R, CY, 480))
    hover = glyph("Demo", HOVER_TEXT, R, BY, 480, 290, 17, INK, REGULAR, line_height=8, paragraphSpacing=18)
    hover["instanceVariables"]["id"] = "hover"
    inst.append(hover)
    readout = glyph("Demo", "", R, BY + 300, 480, 30, 20, PURPLE, SEMIBOLD, (0.5, 0.5))
    readout["instanceVariables"]["id"] = "hoverout"
    inst.append(readout)
    inst.append(sprite("Confetti", -200, -200, w=14, h=14))
    events = [
        variable("HoverName", ""),
        comment("Transforms tab. The readout and the dot are updated every tick from the tag expressions."),
        block([cond("System", "every-tick")], [], children=[
            block([demo_is("hover")], [
                act("System", "set-eventvar-value", variable="HoverName", value="Demo.TagAtPosition(Mouse.X, Mouse.Y)"),
                act("Confetti", "set-position", x='Demo.TagX("lime", 0) + Demo.TagWidth("lime", 0) / 2', y='Demo.TagY("lime", 0) + Demo.TagHeight("lime", 0) + 6'),
                act("Confetti", "set-animation-frame", **{"frame-number": "2"}),
            ]),
            block([demo_is("hoverout")], [
                tg("Demo", "SetText", text='HoverName = "" ? "nothing under the cursor" : "you are on: " & HoverName'),
            ]),
        ]),
    ]
    return inst, events + shared_events()

# ================================================================ 4 Alignment
def align_layout():
    inst = chrome("align") + two_cards()
    inst.append(heading("Alignment by percentage", L, HY, 480, CORAL))
    inst.append(caption("Both axes are numbers from 0 to 100, so a line can sit anywhere in the box. The dropdown actions map to 0, 50 and 100.", L, CY, 480))
    demo = glyph("Demo", "any point between the edges,\nnot just left, center and right", L, BY, 480, 280, 19, INK, REGULAR, line_height=6)
    demo["instanceVariables"]["id"] = "align"
    inst.append(demo)
    cap = glyph("Demo", "", L, BY + 300, 480, 24, 13, MUTED, REGULAR, (1, 0))
    cap["instanceVariables"]["id"] = "aligncap"
    inst.append(cap)
    inst.append(heading("Justify", R, HY, 480, TEAL))
    inst.append(caption("Word spaces stretch so lines fill the box. Justify tuning limits how far they stretch before letters spread.", R, CY, 480))
    y = BY
    for mode, label in (("none", "off"), ("lines", "all but the last line"), ("all", "every line")):
        inst.append(glyph("Demo", LOREM, R, y, 480, 72, 13, INK, REGULAR, line_height=2, justify=mode))
        inst.append(caption("justify: " + label, R, y + 76, 480, 24))
        y += 110
    events = [
        variable("AlignInfo", ""),
        comment("Alignment tab. The left demo sweeps both axes every tick."),
        block([cond("System", "every-tick")], [], children=[
            block([demo_is("align")], [
                tg("Demo", "SetHorizontalAlignmentPercent", percent="50 + 50 * sin(time * 90)"),
                tg("Demo", "SetVerticalAlignmentPercent", percent="50 + 50 * cos(time * 60)"),
                act("System", "set-eventvar-value", variable="AlignInfo", value='"horizontal " & round(Demo.AlignX) & "%   vertical " & round(Demo.AlignY) & "%"'),
            ]),
            block([demo_is("aligncap")], [tg("Demo", "SetText", text="AlignInfo")]),
        ]),
    ]
    return inst, events + shared_events()

# ================================================================ 5 Wrapping
def wrap_layout():
    inst = chrome("wrap") + two_cards()
    inst.append(heading("Wrap modes", L, HY, 480, CORAL))
    inst.append(caption("Word wraps between words, character wraps anywhere, none only breaks at line breaks in the text.", L, CY, 480))
    y = BY
    for mode, label in (("word", "wrap: word"), ("character", "wrap: character"), ("none", "wrap: none, the line runs past the box")):
        inst.append(glyph("Demo", "Wrapping " + LOREM, L, y, 480, 78, 14, INK, REGULAR, line_height=2, wrap=mode))
        inst.append(caption(label, L, y + 82, 480, 24))
        y += 110
    inst.append(heading("Overflow", R, HY, 480, TEAL))
    inst.append(caption("Ellipsis cuts text that does not fit and ends it with an ellipsis. Max lines caps the count. Overflow off hides whole lines that do not fit.", R, CY, 480))
    y = BY
    for label, over in (("ellipsis on", {"ellipsis": True}), ("max lines 2, ellipsis on", {"maxLines": 2, "ellipsis": True}), ("overflow off", {"overflow": False})):
        inst.append(glyph("Demo", LOREM + " " + LOREM, R, y, 480, 78, 14, INK, REGULAR, line_height=2, **over))
        inst.append(caption(label, R, y + 82, 480, 24))
        y += 110
    return inst, [comment("Wrapping tab. Every box is 66 px tall; the difference is one property each.")] + shared_events()

# ================================================================ 6 Spacing
def spacing_layout():
    inst = chrome("spacing") + two_cards()
    inst.append(heading("Letter, word, paragraph", L, HY, 480, PURPLE))
    inst.append(caption("Letter and word spacing are set every tick here. Paragraph spacing adds room after every line break. All three are also tags.", L, CY, 480))
    demo = glyph("Demo", "letter spacing breathes\nword spacing sways along\nparagraphs sit 14 px apart", L, BY, 480, 200, 19, INK, REGULAR, line_height=6, paragraphSpacing=14)
    demo["instanceVariables"]["id"] = "spacing"
    inst.append(demo)
    inst.append(glyph("Demo", "[letterspacing=6]as a tag[/letterspacing] and [wordspacing=20]words apart[/wordspacing]", L, BY + 220, 480, 40, 19, INK, REGULAR))
    inst.append(heading("Columns", R, HY, 480, GOLD))
    inst.append(caption("The text fills each column to the box height before moving to the next. Two columns above, three below, both with a 24 px gap.", R, CY, 480))
    inst.append(glyph("Demo", LOREM + " " + LOREM, R, BY, 480, 130, 12, INK, REGULAR, line_height=2, columns=2, columnGap=24, overflow=False, justify="lines"))
    inst.append(glyph("Demo", LOREM + " " + LOREM + " " + LOREM, R, BY + 150, 480, 150, 12, INK, REGULAR, line_height=2, columns=3, columnGap=24, overflow=False, justify="lines"))
    events = [
        comment("Spacing tab. Two actions every tick; the rest is properties."),
        block([cond("System", "every-tick")], [], children=[
            block([demo_is("spacing")], [
                tg("Demo", "SetLetterSpacing", px="2 + 2 * sin(time * 120)"),
                tg("Demo", "SetWordSpacing", px="6 + 6 * sin(time * 70)"),
            ]),
        ]),
    ]
    return inst, events + shared_events()

# ================================================================ 7 Flow
FLOW_TEXT = ("he slime is a flow exclusion: the paragraph wraps around its collision polygon and follows it wherever it goes. "
             "Catch it with the cursor and drag it through the text. The big T is a second Text Glyph object added as an "
             "exclusion on its end side, which is how you build a drop cap. Sprites use their collision polygon, "
             "everything else its bounding box, so a card, a button or another text can shape the flow just as well. "
             "The exclusions are added once on start; the text relays out by itself when they move.")

def flow_layout():
    inst = chrome("flow") + [card(40, CARD_TOP, 1200, 500)]
    inst.append(heading("Flow around objects", L, HY, 1080, CORAL))
    inst.append(caption("Add flow exclusion takes picked instances. The wrap side picks where text may flow: both sides, start, end, or only the larger side.", L, CY, 1080))
    inst.append(glyph("Cap", "T", L, BY, 62, 92, 56, CORAL, SEMIBOLD, (0.5, 0.5)))
    demo = glyph("Demo", FLOW_TEXT, L, BY, 1080, 330, 19, INK, REGULAR, line_height=8)
    demo["instanceVariables"]["id"] = "flow"
    inst.append(demo)
    inst.append(sprite("Slime", 700, 420))
    events = [
        comment("Flow tab. Exclusions are added once; the text relays out on its own when the slime moves."),
        block([cond("System", "on-start-of-layout")], [
            tg("Demo", "AddFlowExclusion", object="Slime", side="largest", margin="12"),
            tg("Demo", "AddFlowExclusion", object="Cap", side="end", margin="10"),
        ]),
        comment("The slime sticks to the cursor while the cursor is over it, so you can drag it through the paragraph."),
        block([cond("Mouse", "cursor-is-over-object", object="Slime")], [act("Slime", "set-position", x="Mouse.X", y="Mouse.Y")]),
    ]
    return inst, events + shared_events()

# ================================================================ 8 Icons
ICON_TEXT = ("Icons come from a Sprite's animation frames: [icon=Default,1,0] [icon=Default,1,1] [icon=Default,1,2] "
             "[icon=Default,1,3] [icon=Default,1,4] [icon=Default,1,5] sit on the line like letters and wrap with the text.\n"
             "The second number scales them: [icon=Default,0.6,2] small, [icon=Default,1,2] normal, [icon=Default,1.8,2] big. "
             "The third picks a frame by index or by tag.\n"
             "A space tag reserves a blank of any width: [space=60]like this indent, or [space=25%]a quarter of the font size.\n"
             "Collect [icon=Default,1.2,3] 3 coins and [icon=Default,1.2,1] 1 gem to open the door.")

def icons_layout():
    inst = chrome("icons") + [card(40, CARD_TOP, 1200, 500)]
    inst.append(heading("Inline icons", L, HY, 1080, TEAL))
    inst.append(caption("[icon=animation,scale,frame] draws a frame of the icon set Sprite at the font's height. The Sprite needs an instance in the layout, this one is parked off screen.", L, CY, 1080))
    inst.append(glyph("Demo", ICON_TEXT, L, BY, 1080, 330, 19, INK, REGULAR, line_height=8, paragraphSpacing=18, iconSet=CONFETTI_SID))
    inst.append(sprite("Confetti", -200, -200))
    return inst, [comment("Icons tab. The icon set is a property of the text; Set icon set does the same at runtime.")] + shared_events()

# ================================================================ 9 Scripts
RTL_TEXT = ("مرحبا بالعالم! This paragraph starts with an Arabic letter, so it reads right to left, and 2024 stays 2024.\n"
            "This one starts with a Latin letter, so it reads left to right, with نص عربي in the middle.\n"
            "Direction is set to Auto: the first letter of each paragraph decides, and the Unicode bidi algorithm reorders mixed runs on every line. Letters join as they should: بسم الله الرحمن الرحيم")
KERN_TAGS = ("[color=#FF6B6B]A[/color][color=#F5B942]V[/color][color=#2FB1A4]A[/color][color=#9B85F0]W[/color]"
             "[color=#FF6B6B]A[/color][color=#F5B942]Y[/color] [color=#2FB1A4]T[/color][color=#9B85F0]o[/color] "
             "[color=#FF6B6B]T[/color][color=#F5B942]y[/color] [color=#2FB1A4]W[/color][color=#9B85F0]a[/color]\n"
             "[color=#FF6B6B]L[/color][color=#F5B942]T[/color][color=#2FB1A4]A[/color] [color=#9B85F0]P[/color][color=#FF6B6B]A[/color] "
             "[color=#F5B942]f[/color][color=#2FB1A4]f[/color][color=#9B85F0]i[/color]")

def scripts_layout():
    inst = chrome("scripts") + two_cards()
    inst.append(heading("Right to left and bidi", L, HY, 480, CORAL))
    inst.append(caption("Tajawal font. Mixed runs are reordered per line by the Unicode bidi algorithm, and Arabic letters take their joined forms.", L, CY, 480))
    inst.append(glyph("Demo", RTL_TEXT, L, BY, 480, 330, 16, INK, ARABIC, line_height=5, paragraphSpacing=12))
    inst.append(heading("Kerning survives tags", R, HY, 480, TEAL))
    inst.append(caption("Every letter has its own color tag. Both texts sit at the same spot: click Swap to flip between Text Glyph and the built-in Text and watch the gaps after A, V, W and T move.", R, CY, 480, 64))
    kern = glyph("Demo", KERN_TAGS, R, BY + 30, 480, 130, 34, INK, SEMIBOLD, line_height=8)
    kern["instanceVariables"]["id"] = "kern"
    inst.append(kern)
    plain = plain_text(KERN_TAGS, R, BY + 30, 480, 130, 34, INK, SEMIBOLD)
    plain["properties"]["initially-visible"] = False
    plain["properties"]["line-height"] = 8
    inst.append(plain)
    readout = glyph("Demo", "Showing: Text Glyph", R, BY + 170, 300, 48, 18, PURPLE, SEMIBOLD, (0, 0.5))
    readout["instanceVariables"]["id"] = "kernout"
    inst.append(readout)
    inst.append(sprite("Button", R + 424, BY + 194, color=PURPLE, ivars={"id": "swap", "pop": 0}))
    inst.append(glyph("Label", "Swap", R + 368, BY + 170, 112, 48, 16, WHITE, SEMIBOLD, (0.5, 0.5)))
    events = [
        variable("Kern", "0", "number"),
        comment("Scripts tab. Swap toggles the visibility of both kerning texts, which share a position and a string."),
        block(button_clicked("swap"), [
            act("System", "set-eventvar-value", variable="Kern", value="1 - Kern"),
            act("PlainText", "set-visible", visibility="toggle"),
        ], children=[
            block([demo_is("kern")], [act("Demo", "set-visible", visibility="toggle")]),
            block([demo_is("kernout")], [tg("Demo", "SetText", text='Kern = 0 ? "Showing: Text Glyph" : "Showing: built-in Text"')]),
        ]),
    ]
    return inst, events + shared_events()

# ================================================================ 10 Animate
ANIM_TEXT = nl(
    q("[size=30][font=Fredoka-SemiBold][sfdx=offsety wave(12,420,25)][sfdx=angle swing(22,330,35)][sfdx=scale 0.9+wave(0.3,420,25)]"
      '[sfdx=color lerpHexColor("#FF6B6B","#9B85F0",0.5+0.5*sin(t*360+i*30))]'
      "Animate Text on Text Glyph[/sfdx][/sfdx][/sfdx][/sfdx][/font][/size]"),
    q("[sfdx=offsety wave(6,540,35)]every letter is a live quad:[/sfdx] "
      "[sfdx=angle t*300+i*40][outline=#3B3A4A][linethickness=1.5]spin[/linethickness][/outline][/sfdx] "
      "[sfdx=scalex 1+wave(0.8,300,30)]stretch[/sfdx] "
      "[sfdx=scaley 0.4+abs(wave(1.2,360,25))]squash[/sfdx] "
      "[sfdx=offsetx shake(4)][sfdx=offsety shake(4)]shake[/sfdx][/sfdx] "
      "[sfdx=opacity 30+abs(wave(70,480,40))]blink[/sfdx] "
      "[sfdx=size 14+abs(wave(12,240,30))]breathe[/sfdx]"),
    q("[sfdx=offsety -abs(wave(18,480,20))][sfdx=color lerpHexColor(\"#F5B942\",\"#2FB1A4\",0.5+0.5*sin(t*300+i*20))]bouncing baseline[/sfdx][/sfdx]  "
      "[sfdx=angle swing(45,540,50)][sfdx=scale 0.7+abs(wave(0.8,540,50))]chaos[/sfdx][/sfdx]  "
      "[sfdx=shadow '#B8B4C4 ' + (2+2*sin(t*360+i*40)) + ' ' + (2+2*cos(t*360+i*40))]moving shadow[/sfdx]"),
    q("[b]AVAWA To Ty[/b] kerning survives per-letter tags, and the layout is only rebuilt when a size or font changes."),
)

def animate_layout():
    inst = chrome("animate") + [card(40, CARD_TOP, 780, 500), card(840, CARD_TOP, 400, 500)]
    inst.append(heading("Animate Text", L, HY, 660, PURPLE))
    inst.append(caption("Offsets, angles, scale, color, opacity and shadow change every tick without a relayout. Size and font changes do relayout, that is the breathing word.", L, CY, 660))
    inst.append(glyph("Anim", "", L, BY, 660, 330, 18, INK, REGULAR, line_height=10, paragraphSpacing=26))
    RX = 900
    inst.append(heading("Typewriter", RX, HY, 280, TEAL))
    inst.append(caption("Reveals one grapheme at a time over a duration. Layout stays put and a trigger fires at the end.", RX, CY, 280, 64))
    tw = glyph("Demo", "", RX, BY + 24, 280, 200, 16, INK, REGULAR, line_height=6)
    tw["instanceVariables"]["id"] = "tw"
    inst.append(tw)
    inst.append(sprite("Button", RX + 140, BY + 268, color=PURPLE, ivars={"id": "replay", "pop": 0}))
    inst.append(glyph("Label", "Replay", RX + 84, BY + 244, 112, 48, 16, WHITE, SEMIBOLD, (0.5, 0.5)))
    inst.append(sprite("Confetti", -200, -200))
    tw_text = q("Typewriter text reveals one grapheme at a time over a set duration. The layout stays put while it types, and a trigger fires at the end. [color=#9B85F0][b]Like this.[/b][/color]")
    events = [
        comment("Animate tab. One Set text from the behavior, then it runs on its own. Typewriter text takes a duration in seconds."),
        block([cond("System", "on-start-of-layout")], [beh_act("Anim", "set-text", "AnimateText", text=ANIM_TEXT)], children=[
            block([demo_is("tw")], [tg("Demo", "TypewriterText", text=tw_text, duration="4")]),
        ]),
        block(button_clicked("replay"), [], children=[
            block([demo_is("tw")], [tg("Demo", "TypewriterText", text=tw_text, duration="4")]),
        ]),
        block([cond("Demo", "OnTypewriterTextFinished")], [], children=[
            block([cond("System", "repeat", count="40")], [
                act("System", "create-object", **{"object-to-create": "Confetti", "layer": q("Main"), "x": "Demo.X + random(Demo.Width)", "y": "Demo.Y + Demo.Height", "create-hierarchy": False, "template-name": '""'}),
                act("Confetti", "set-animation-frame", **{"frame-number": "floor(random(6))"}),
                beh_act("Confetti", "set-angle-of-motion", "Bullet", angle="random(235, 305)"),
                beh_act("Confetti", "set-speed", "Bullet", speed="random(300, 560)"),
            ]),
        ]),
    ]
    return inst, events + shared_events()

# ---------------------------------------------------------------- write
TYPES["Demo"]["instanceVariables"] = [{"name": "id", "type": "string", "desc": "Which demo this is, for the events.", "show": True, "sid": sid()}]
(OUT_DIR / "objectTypes" / "Demo.json").write_text(json.dumps(TYPES["Demo"], indent="\t"))

built = [("Tags", tags_layout), ("Decorations", deco_layout), ("Transforms", transform_layout), ("Alignment", align_layout),
         ("Wrapping", wrap_layout), ("Spacing", spacing_layout), ("Flow", flow_layout), ("Icons", icons_layout),
         ("Scripts", scripts_layout), ("Animate", animate_layout)]
counts = []
for name, fn in built:
    instances, events = fn()
    for i in instances:
        if i["type"] == "Demo" and "id" not in i["instanceVariables"]:
            i["instanceVariables"]["id"] = ""
    write_layout(name, instances, events)
    counts.append(len(instances))

project["name"] = "Text Glyph - Feature Tour"
project["objectTypes"] = {"items": list(TYPES.keys()), "subfolders": []}
project["layouts"] = {"items": [n for n, _ in built], "subfolders": []}
project["eventSheets"] = {"items": [n for n, _ in built], "subfolders": []}
project["firstLayout"] = "Tags"
project["usedAddons"] = [a for a in project["usedAddons"] if a["id"] != "Dictionary"]
project["usedAddons"].append({"type": "plugin", "id": "skymen_text_glyph", "name": "Text Glyph", "author": "skymen", "bundled": False})
project["rootFileFolders"]["font"]["items"].append({"name": "Tajawal-Regular.ttf", "type": "application/font-sfnt", "sid": sid(), "file-info": {"purpose": "none"}})
project["rootFileFolders"]["general"]["items"].append({"name": "OFL-Tajawal.txt", "type": "text/plain", "sid": sid(), "file-info": {"purpose": "none"}})
project["properties"]["description"] = "A tabbed tour of every Text Glyph feature: tags, decorations, transforms, alignment, wrapping, spacing, flow, icons, scripts and animation."
(OUT_DIR / "project.c3proj").write_text(json.dumps(project, indent="\t"))

if OUT.exists():
    OUT.unlink()
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for path in sorted(OUT_DIR.rglob("*")):
        if path.is_file():
            z.write(path, path.relative_to(OUT_DIR).as_posix())
shutil.rmtree(OUT_DIR)
print("wrote", OUT, f"({OUT.stat().st_size // 1024} KB), instances per tab {counts}")
