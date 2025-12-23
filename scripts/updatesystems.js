import fs from "fs";
import { execSync } from "child_process";

const readme = fs.readFileSync("README.md", "utf8");

if (!readme.includes("<!-- SYSTEMS:START -->")) {
  console.error("SYSTEMS markers not found in README.md");
  process.exit(1);
}

const log = execSync(
  `git log --since="30 days ago" --pretty="%s"`,
  { encoding: "utf8" }
).split("\n");

const systems = {};

for (const msg of log) {
  if (!msg.includes(":")) continue;

  const [system, detail] = msg.split(":");
  systems[system] ??= [];
  systems[system].push(detail.trim());
}

let output = "";
for (const [name, items] of Object.entries(systems)) {
  output += `▣ **${name}**\n`;
  items.slice(0, 3).forEach(i => {
    output += `  → ${i}\n`;
  });
  output += "\n";
}

const updated = readme.replace(
  /<!-- SYSTEMS:START -->[\s\S]*<!-- SYSTEMS:END -->/,
  `<!-- SYSTEMS:START -->\n${output}<!-- SYSTEMS:END -->`
);

fs.writeFileSync("README.md", updated);
