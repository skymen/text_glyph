#!/usr/bin/env python3
"""Builds examples/text-glyph-vs-builtin.c3p.

Donor project: fonts, icons, timeline and flowchart files come from a project
saved by Construct so every non-generated file is real. All ACE ids below are
taken from Construct's plugins/allAces.json or from projects saved by the
editor; never guess new ones.
"""
import json
import shutil
import sys
import zipfile
from pathlib import Path

HERE = Path(__file__).resolve().parent
DONOR = Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / "Downloads" / "test text glyph.c3p"
OUT_DIR = HERE / "_build"
OUT = HERE / "text-glyph-vs-builtin.c3p"

_sid = [300000000000000]
def sid():
    _sid[0] += 7919
    return _sid[0]

_uid = [10]
def uid():
    _uid[0] += 1
    return _uid[0]

def q(s):
    """Construct expression string literal."""
    return '"' + s.replace('"', '""') + '"'

def lines(*parts):
    return " & newline & ".join(parts)

# ---------------------------------------------------------------- donor files
if OUT_DIR.exists():
    shutil.rmtree(OUT_DIR)
for sub in ("fonts", "icons", "timelines", "flowcharts", "objectTypes", "layouts", "eventSheets"):
    (OUT_DIR / sub).mkdir(parents=True)

donor = zipfile.ZipFile(DONOR)
project = None
for name in donor.namelist():
    norm = name.replace("\\", "/")
    if norm == "project.c3proj":
        project = json.loads(donor.read(name))
    elif norm.startswith(("fonts/", "icons/", "timelines/", "flowcharts/")) and not norm.endswith(".uistate.json"):
        (OUT_DIR / norm).write_bytes(donor.read(name))
assert project, "donor has no project.c3proj"

# ---------------------------------------------------------------- object types
ANIM = "skymen_Skymen_SpritefontDX"
TW_PARAMS = "value offsety -10; duration type 0.03; duration fade 0.15"

def anim_behavior():
    return [{"behaviorId": ANIM, "name": "AnimateText", "sid": sid()}]

def object_type(name, plugin_id, behaviors):
    return {
        "name": name,
        "plugin-id": plugin_id,
        "sid": sid(),
        "isGlobal": False,
        "editorNewInstanceIsReplica": True,
        "instanceVariables": [],
        "behaviorTypes": behaviors,
        "effectTypes": [],
    }

TYPES = {
    "BigText": object_type("BigText", "Text", anim_behavior()),
    "BigGlyph": object_type("BigGlyph", "skymen_text_glyph", anim_behavior()),
    "StressText": object_type("StressText", "Text", anim_behavior()),
    "StressGlyph": object_type("StressGlyph", "skymen_text_glyph", anim_behavior()),
    "Title": object_type("Title", "skymen_text_glyph", []),
    "Hud": object_type("Hud", "skymen_text_glyph", []),
    "Keyboard": {
        "name": "Keyboard",
        "plugin-id": "Keyboard",
        "sid": sid(),
        "singleglobal-inst": {"type": "Keyboard", "properties": {}, "uid": uid(), "sid": sid(), "tags": ""},
    },
}
for name, ot in TYPES.items():
    (OUT_DIR / "objectTypes" / f"{name}.json").write_text(json.dumps(ot, indent="\t"))

# ---------------------------------------------------------------- instances
def anim_props():
    return {"AnimateText": {"properties": {
        "tw-params": TW_PARAMS, "tw-easing": "linear", "tw-custom-easing": "", "enable-default-functions": True,
    }}}

def glyph_inst(type_, text, x, y, w, h, size, color=(1, 1, 1), animated=True, halign="left"):
    return {
        "type": type_,
        "properties": {
            "text": text, "bbcode": True, "font": "Rubik", "size": size, "lineHeight": 0,
            "bold": False, "italic": False, "color": [color[0], color[1], color[2], 1],
            "hAlign": halign, "vAlign": "top", "wrap": "word", "direction": "ltr",
        },
        "uid": uid(), "sid": sid(), "tags": "", "instanceVariables": {},
        "behaviors": anim_props() if animated else {},
        "showing": True, "locked": False,
        "world": {"x": x, "y": y, "width": w, "height": h, "originX": 0, "originY": 0,
                  "color": [1, 1, 1, 1], "z": 0, "angle": 0},
    }

def text_inst(type_, text, x, y, w, h, size, color=(1, 1, 1)):
    return {
        "type": type_,
        "properties": {
            "text": text, "enable-bbcode": True, "font": "Rubik", "size": size, "line-height": 0,
            "bold": False, "italic": False, "color": [color[0], color[1], color[2], 1],
            "horizontal-alignment": "left", "vertical-alignment": "top", "wrapping": "word",
            "text-direction": "ltr", "icon-set": -1, "initially-visible": True, "origin": "top-left",
            "read-aloud": False,
        },
        "uid": uid(), "sid": sid(), "tags": "", "instanceVariables": {},
        "behaviors": anim_props(),
        "materialSurfaceType": "smooth",
        "showing": True, "locked": False,
        "world": {"x": x, "y": y, "width": w, "height": h, "originX": 0, "originY": 0,
                  "color": [1, 1, 1, 1], "z": 0, "angle": 0},
    }

LEFT, RIGHT = 40, 660
COL_W = 580
instances = []
instances.append(glyph_inst("Title", "BUILT-IN TEXT  +  Animate Text", LEFT, 22, COL_W, 24, 12, (1, 0.65, 0.35), animated=False))
instances.append(glyph_inst("Title", "TEXT GLYPH  +  Animate Text", RIGHT, 22, COL_W, 24, 12, (0.49, 0.83, 0.75), animated=False))
instances.append(text_inst("BigText", "loading", LEFT, 56, COL_W, 260, 20))
instances.append(glyph_inst("BigGlyph", "loading", RIGHT, 56, COL_W, 260, 20))
for row in range(4):
    for col in range(5):
        x = col * 116
        y = 326 + row * 52
        instances.append(text_inst("StressText", "loading", LEFT + x, y, 110, 46, 11))
        instances.append(glyph_inst("StressGlyph", "loading", RIGHT + x, y, 110, 46, 11))
instances.append(glyph_inst("Hud", "", LEFT, 548, 1200, 150, 11, (0.85, 0.87, 0.92), animated=False))
HUD_UID = instances[-1]["uid"]

layer = {
    "name": "Layer 0",
    "overriden": 0,
    "subLayers": [],
    "instances": instances,
    "sid": sid(),
    "effectTypes": [],
    "isInitiallyVisible": True,
    "isInitiallyInteractive": True,
    "isHTMLElementsLayer": False,
    "color": [1, 1, 1, 1],
    "backgroundColor": [0.08, 0.09, 0.11, 1],
    "isTransparent": False,
    "sampling": "auto",
    "parallaxX": 1,
    "parallaxY": 1,
    "scaleRate": 1,
    "forceOwnTexture": False,
    "renderingMode": "3d",
    "drawOrder": "z-order",
    "useRenderCells": False,
    "blendMode": "normal",
    "zElevation": 0,
    "global": False,
}
layout = {
    "name": "Layout 1",
    "layers": [layer],
    "sid": sid(),
    "nonworld-instances": [],
    "effectTypes": [],
    "width": 1280,
    "height": 720,
    "unboundedScrolling": False,
    "sampling": "auto",
    "ambientLight": 0.03,
    "vpX": 0.5,
    "vpY": 0.5,
    "projection": "perspective",
    "eventSheet": "Event sheet 1",
}
(OUT_DIR / "layouts" / "Layout 1.json").write_text(json.dumps(layout, indent="\t"))

# ---------------------------------------------------------------- strings
# Animate Text syntax: [sfdx=<prop> <expression>] with t (time) and i (letter index).
# wave/swing(magnitude, frequency, length): sin/cos take degrees, t is in
# seconds, so frequency is degrees per second (360 = one cycle per second) and
# length is the phase offset per letter in degrees.
BIG = lines(
    q("[size=30][b][sfdx=offsety wave(16,420,25)][sfdx=angle swing(28,330,35)][sfdx=scale 0.9+wave(0.35,420,25)]"
      '[sfdx=color lerpHexColor("#ff5c8a","#6ad3ff",0.5+0.5*sin(t*360+i*30))]'
      "TEXT GLYPH[/sfdx][/sfdx][/sfdx][/sfdx][/b][/size]"),
    q("[sfdx=offsety wave(6,540,35)]every letter is a live quad:[/sfdx] "
      "[sfdx=angle t*300+i*40][outline=#000000][linethickness=1.5]spin[/linethickness][/outline][/sfdx] "
      "[sfdx=scalex 1+wave(0.8,300,30)]stretch[/sfdx] "
      "[sfdx=scaley 0.4+abs(wave(1.2,360,25))]squash[/sfdx] "
      "[sfdx=offsetx shake(4)][sfdx=offsety shake(4)]shake[/sfdx][/sfdx] "
      "[sfdx=opacity 30+abs(wave(70,480,40))]blink[/sfdx] "
      "[sfdx=size 14+abs(wave(14,240,30))]breathe[/sfdx]"),
    q("[sfdx=offsety -abs(wave(18,480,20))][sfdx=color lerpHexColor(\"#ffd166\",\"#ff5c8a\",0.5+0.5*sin(t*300+i*20))]bouncing baseline[/sfdx][/sfdx]  "
      "[sfdx=angle swing(45,540,50)][sfdx=scale 0.7+abs(wave(0.8,540,50))]chaos[/sfdx][/sfdx]"),
    q("Kerning survives per-letter tags: [b]AVAWA To Ty Wo[/b]. "
      "The built-in splits every letter into its own fragment and re-rasterizes the whole block every tick."),
)
STRESS = q(
    "[size=11][sfdx=offsety wave(6,540,40)][sfdx=angle swing(30,480,35)][sfdx=scale 0.8+wave(0.4,420,30)]"
    '[sfdx=color lerpHexColor("#ffd166","#7dd3c0",0.5+0.5*sin(t*360+i*35))]'
    "wave & spin[/sfdx][/sfdx][/sfdx][/sfdx][/size]"
)
HUD = lines(
    '"FPS " & fps & "     CPU " & round(cpuutilisation*100) & "%     GPU " & round(gpuutilisation*100) & "%"',
    '"built-in labels: " & StressText.Count & "        glyph labels: " & StressGlyph.Count',
    '""',
    q("1 / 2   hide or show a side        3   add 20 more labels to each side        T   typewriter        R   restart"),
)

# ---------------------------------------------------------------- events
def sys_cond(cid, **params):
    c = {"id": cid, "objectClass": "System", "sid": sid()}
    if params:
        c["parameters"] = params
    return c

def sys_act(aid, **params):
    a = {"id": aid, "objectClass": "System", "sid": sid()}
    if params:
        a["parameters"] = params
    return a

def key_pressed(code):
    return {"id": "on-key-pressed", "objectClass": "Keyboard", "sid": sid(), "parameters": {"key": code}}

def anim_set_text(obj, expr):
    return {"id": "set-text", "objectClass": obj, "sid": sid(), "behaviorType": "AnimateText", "parameters": {"text": expr}}

def anim_typewrite(obj, expr):
    return {"id": "typewrite", "objectClass": obj, "sid": sid(), "behaviorType": "AnimateText", "parameters": {"text": expr}}

def set_visible_toggle(obj):
    return {"id": "set-visible", "objectClass": obj, "sid": sid(), "parameters": {"visibility": "toggle"}}

def hud_set_text(expr):
    return {"id": "SetText", "objectClass": "Hud", "sid": sid(), "parameters": {"text": expr}}

def create(obj, x, y):
    return sys_act("create-object", **{"object-to-create": obj, "layer": "0", "x": x, "y": y,
                                       "create-hierarchy": False, "template-name": '""'})

def block(conditions, actions, children=None):
    b = {"eventType": "block", "conditions": conditions, "actions": actions, "sid": sid()}
    if children:
        b["children"] = children
    return b

def variable(name, value):
    return {"eventType": "variable", "name": name, "type": "string", "initialValue": value,
            "comment": "", "isStatic": False, "isConstant": False, "sid": sid()}

events = [
    variable("BigString", ""),
    variable("StressString", ""),
    block([sys_cond("on-start-of-layout")], [
        sys_act("set-eventvar-value", variable="BigString", value=BIG),
        sys_act("set-eventvar-value", variable="StressString", value=STRESS),
        anim_set_text("BigText", "BigString"),
        anim_set_text("BigGlyph", "BigString"),
        anim_set_text("StressText", "StressString"),
        anim_set_text("StressGlyph", "StressString"),
    ]),
    block([sys_cond("every-tick")], [hud_set_text(HUD)]),
    block([key_pressed(49)], [set_visible_toggle("BigText"), set_visible_toggle("StressText")]),
    block([key_pressed(50)], [set_visible_toggle("BigGlyph"), set_visible_toggle("StressGlyph")]),
    block([key_pressed(51)], [], children=[
        block([sys_cond("repeat", count="20")], [
            create("StressText", "random(40, 530)", "random(326, 500)"),
            anim_set_text("StressText", "StressString"),
            create("StressGlyph", "random(660, 1150)", "random(326, 500)"),
            anim_set_text("StressGlyph", "StressString"),
        ]),
    ]),
    block([key_pressed(84)], [anim_typewrite("BigText", "BigString"), anim_typewrite("BigGlyph", "BigString")]),
    block([key_pressed(82)], [sys_act("restart-layout")]),
]
(OUT_DIR / "eventSheets" / "Event sheet 1.json").write_text(
    json.dumps({"name": "Event sheet 1", "events": events, "sid": sid()}, indent="\t"))

# ---------------------------------------------------------------- project
project["name"] = "Text Glyph vs built-in Text"
project["viewportWidth"] = 1280
project["viewportHeight"] = 720
project["objectTypes"] = {"items": list(TYPES.keys()), "subfolders": []}
project["layouts"] = {"items": ["Layout 1"], "subfolders": []}
project["eventSheets"] = {"items": ["Event sheet 1"], "subfolders": []}
if not any(a["id"] == "Keyboard" for a in project["usedAddons"]):
    project["usedAddons"].append({"type": "plugin", "id": "Keyboard", "name": "Keyboard", "author": "Scirra", "bundled": False})
project["properties"]["description"] = "Same Animate Text BBCode driving the built-in Text object and Text Glyph side by side."
(OUT_DIR / "project.c3proj").write_text(json.dumps(project, indent="\t"))

# ---------------------------------------------------------------- zip
if OUT.exists():
    OUT.unlink()
with zipfile.ZipFile(OUT, "w", zipfile.ZIP_DEFLATED) as z:
    for path in sorted(OUT_DIR.rglob("*")):
        if path.is_file():
            z.write(path, path.relative_to(OUT_DIR).as_posix())
shutil.rmtree(OUT_DIR)
print("wrote", OUT, f"({OUT.stat().st_size // 1024} KB), {len(instances)} instances, {len(events)} top-level events")
