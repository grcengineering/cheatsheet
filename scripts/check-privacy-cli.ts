import { resolve } from "node:path";
import { validatePrivacy } from "./check-privacy";

const errors = await validatePrivacy(await Bun.file(resolve(import.meta.dir, "../index.html")).text());
if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else console.log("Privacy checks passed: local resources, no client tracking/network/storage APIs, restrictive CSP and no referrers.");
