// Entry for the editor's font parser bundle (src/vendor/opentype.js). The
// editor cannot run wasm (Construct's content security policy), so it lays
// text out in JavaScript from opentype.js data alone.
export { parse as parseOpenType } from "opentype.js";
