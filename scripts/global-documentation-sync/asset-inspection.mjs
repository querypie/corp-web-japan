import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";

const LIMIT = 100 * 1024 * 1024;

function signatureMatches(extension, bytes) {
  const ascii = (start, end) => bytes.subarray(start, end).toString("ascii");
  const hex = bytes.toString("hex");
  if (extension === ".pdf") return ascii(0, 5) === "%PDF-";
  if (extension === ".png") return hex.startsWith("89504e470d0a1a0a");
  if ([".jpg", ".jpeg"].includes(extension)) return hex.startsWith("ffd8ff");
  if (extension === ".gif") return ascii(0, 4) === "GIF8";
  if (extension === ".webp") return ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP";
  if (extension === ".mp4") return ascii(4, 8) === "ftyp";
  if (extension === ".webm") return hex.startsWith("1a45dfa3");
  return false;
}

function defaultProbe(file) {
  return new Promise((resolve, reject) => {
    const child = spawn("ffprobe", ["-v", "error", "-show_streams", "-show_format", "-of", "json", file], { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += chunk; });
    child.stderr.on("data", (chunk) => { stderr += chunk; });
    child.on("error", reject);
    child.on("close", (code) => code === 0 ? resolve(JSON.parse(stdout)) : reject(new Error(`ffprobe failed for ${file}: ${stderr}`)));
  });
}

export async function inspectOwnedAsset(asset, { probe = defaultProbe } = {}) {
  if (asset.bytes > LIMIT) throw new Error(`${asset.fileName} exceeds GitHub 100 MiB file limit`);
  const extension = path.extname(asset.fileName).toLowerCase();
  const bytes = await readFile(asset.sourcePath);
  if (!signatureMatches(extension, bytes)) throw new Error(`${asset.fileName} signature does not match extension`);
  if (extension === ".pdf") return { ...asset, kind: "document" };
  const data = await probe(asset.sourcePath);
  const stream = data.streams?.find(({ width, height }) => width !== undefined || height !== undefined) || data.streams?.[0];
  if (!stream || Number(stream.width) <= 0 || Number(stream.height) <= 0) throw new Error(`${asset.fileName} has invalid dimensions`);
  const result = { ...asset, kind: [".mp4", ".webm"].includes(extension) ? "video" : "image", codec: stream.codec_name, width: Number(stream.width), height: Number(stream.height) };
  if (result.kind === "video") {
    const duration = Number(stream.duration || data.format?.duration);
    if (!(duration > 0)) throw new Error(`${asset.fileName} has invalid video duration`);
    result.duration = duration;
    result.hasAudio = Boolean(data.streams?.some(({ codec_type }) => codec_type === "audio"));
  }
  return result;
}
