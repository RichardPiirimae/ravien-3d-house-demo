/**
 * Converts hoone.fbx → hoone.glb with Draco compression.
 * Run: node scripts/fbx-to-glb.mjs
 *
 * Node v24 has Blob, TextDecoder, URL natively.
 * We polyfill only what three.js's FBXLoader needs in Node.
 */

import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import gltfPipeline from "gltf-pipeline";
const { processGlb } = gltfPipeline;

// ── Minimal browser globals three.js needs ─────────────────────────────────
globalThis.self = globalThis;
globalThis.window = globalThis;
globalThis.document = {
  createElement: (tag) => {
    if (tag === "canvas") {
      // Return a stub — we don't need real canvas for FBX mesh export
      return {
        getContext: () => ({
          drawImage: () => {},
          getImageData: () => ({ data: new Uint8ClampedArray(4) }),
        }),
        width: 1,
        height: 1,
        toDataURL: () => "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      };
    }
    return {};
  },
  createElementNS: () => ({}),
};

// FileReader polyfill — GLTFExporter uses it to read Blobs
globalThis.FileReader = class FileReader {
  _fire() {
    this.onload?.({ target: this });
    this.onloadend?.({ target: this });
  }
  readAsArrayBuffer(blob) {
    blob.arrayBuffer().then(buf => { this.result = buf; this._fire(); })
      .catch(err => this.onerror?.(err));
  }
  readAsDataURL(blob) {
    blob.arrayBuffer().then(buf => {
      const b64  = Buffer.from(buf).toString("base64");
      const mime = blob.type || "application/octet-stream";
      this.result = `data:${mime};base64,${b64}`;
      this._fire();
    }).catch(err => this.onerror?.(err));
  }
};

// DOMParser stub for XML-format FBX (binary FBX doesn't need it)
globalThis.DOMParser = class {
  parseFromString(str) {
    return { querySelector: () => null, querySelectorAll: () => [] };
  }
};

// ── Load three.js ────────────────────────────────────────────────────────────
const __dir = dirname(fileURLToPath(import.meta.url));
const root  = join(__dir, "..");

// three.js ESM
const THREE = await import("three");

// FBXLoader & GLTFExporter from three/examples
const { FBXLoader }    = await import("three/examples/jsm/loaders/FBXLoader.js");
const { GLTFExporter } = await import("three/examples/jsm/exporters/GLTFExporter.js");

// ── Parse the FBX ────────────────────────────────────────────────────────────
console.log("Reading FBX…");
const fbxPath  = join(root, "public", "hoone.fbx");
const fbxBuf   = readFileSync(fbxPath);
const arrayBuf = fbxBuf.buffer.slice(fbxBuf.byteOffset, fbxBuf.byteOffset + fbxBuf.byteLength);

const loader = new FBXLoader();
const scene  = loader.parse(arrayBuf, "/");
console.log(`Parsed FBX — ${countMeshes(scene)} meshes`);

// Replace all materials with plain MeshStandardMaterial.
// HouseModel.tsx remaps materials at runtime anyway, so we only need geometry.
const stdMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.8, metalness: 0 });
scene.traverse(obj => {
  if (obj.isMesh) {
    obj.material = stdMat;
    obj.castShadow = false;
    obj.receiveShadow = false;
  }
});

function countMeshes(obj) {
  let n = 0;
  obj.traverse(c => { if (c.isMesh) n++; });
  return n;
}

// ── Export to GLB ─────────────────────────────────────────────────────────────
console.log("Exporting to GLB…");
const exporter = new GLTFExporter();
const glbBuffer = await exporter.parseAsync(scene, { binary: true, embedImages: false });

const rawGlbPath = join(root, "public", "hoone_raw.glb");
writeFileSync(rawGlbPath, Buffer.from(glbBuffer));
console.log(`Raw GLB written (${(glbBuffer.byteLength / 1024 / 1024).toFixed(1)} MB)`);

// ── Apply Draco compression via gltf-pipeline ─────────────────────────────────
console.log("Applying Draco compression…");
const rawGlb = readFileSync(rawGlbPath);
const { glb: compressed } = await processGlb(rawGlb, {
  dracoOptions: { compressionLevel: 7 },
});

const outPath = join(root, "public", "hoone.glb");
writeFileSync(outPath, compressed);
console.log(`Compressed GLB written → public/hoone.glb (${(compressed.length / 1024 / 1024).toFixed(1)} MB)`);

// Clean up raw intermediate
import { unlinkSync } from "fs";
unlinkSync(rawGlbPath);
console.log("Done.");
