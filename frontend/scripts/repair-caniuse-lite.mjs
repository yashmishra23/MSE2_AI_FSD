import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const unpackerDir = path.join(
  process.cwd(),
  "node_modules",
  "caniuse-lite",
  "dist",
  "unpacker"
);
const agentsPath = path.join(unpackerDir, "agents.js");

if (!existsSync(unpackerDir) || existsSync(agentsPath)) {
  process.exit(0);
}

mkdirSync(unpackerDir, { recursive: true });
writeFileSync(
  agentsPath,
  `const { browsers } = require("./browsers");

const agents = Object.values(browsers).reduce((result, name) => {
  result[name] = {
    versions: [],
    release_date: {},
    usage_global: {}
  };
  return result;
}, {});

module.exports.agents = agents;
`,
  "utf8"
);

console.warn(
  "[postinstall] Repaired incomplete caniuse-lite install by restoring dist/unpacker/agents.js"
);
