# Floorplan in Qoder

Floorplan works in [Qoder](https://docs.qoder.com/cli/overview) the same way it works in Claude Code: the same skill, scripts and map, on your own Qoder sign-in. There are no API keys to set up.

## What you need

- Qoder: the desktop app or the [Qoder CLI](https://docs.qoder.com/cli/overview), signed in.
- [Node.js](https://nodejs.org) 18 or newer for Floorplan itself. The Qoder CLI needs Node 20 or newer.

## Install

Floorplan runs as a personal skill. Copy the skill folder into Qoder's skills folder:

```bash
git clone https://github.com/haydenschmitty/floorplan
mkdir -p ~/.qoder/skills
cp -R floorplan/skills/floorplan ~/.qoder/skills/
```

On Windows, that folder is `%USERPROFILE%\.qoder\skills\`. Start a new session afterwards.

## Make your first map

Open your project in Qoder and ask in plain words:

> Draw a floorplan of this codebase

Everything after that is the same as in Claude Code ([Getting started](getting-started.md#make-your-first-map)): Qoder scans the code, describes every part, file and web request, builds the map and opens it. Later, "update the floorplan" re-reads only what changed.

The map's server has to keep running after the command ends, and the Ask bar needs to reach Qoder, so Qoder may ask to run it with wider permissions. If you'd rather not allow that, run the server yourself from the project folder:

```bash
node floorplan/serve.mjs
```

## Asking questions on the map

The map's Ask bar runs your own Qoder CLI on your computer: `qodercli -p` in your project folder, on your Qoder sign-in. It can read the map and your source, and it can't change any files: the CLI is given only Read, Grep, Glob and a Bash command limited to `floorplan/query.mjs`, and anything that would ask for permission is denied. Your own MCP servers stay out of these runs.

The server uses whichever agent built the map, and falls back to another one if that one isn't installed. To choose:

```bash
node floorplan/serve.mjs --engine qoder
```

It finds `qodercli` (or `qoder`) on your PATH, in `~/.local/bin`, or in `~/.qoder/bin/qodercli`. If yours is somewhere else, pass `--qoder /path/to/qodercli`. `--model <name>` picks the model; otherwise your Qoder settings decide.

If asking says you aren't signed in, run `qodercli` in a terminal and sign in with `/login`, then ask again.

## What's different from Claude Code

- **No notes file.** In Claude Code, Floorplan can keep a short note in `CLAUDE.local.md` (personal and never committed, and only if you say yes) that points future sessions at the map. Qoder has no personal, uncommitted equivalent (`AGENTS.md` is shared with your team), so in Qoder Floorplan leaves your project's notes alone.
- **No Change on a blueprint.** The Qoder CLI has no way to hold an answer to a schema, so on a [blueprint](getting-started.md#plan-something-you-havent-built-yet) the map's Ask bar stays on **Ask**: it answers questions about the plan, but doesn't redraw it. To change the plan, ask Qoder in your session, or edit `floorplan/plan.json` and `floorplan/architecture.json` yourself and rebuild.
- **No Claude app.** Publishing the map to the Claude app is a Claude feature. In Qoder the map opens in your browser, served from your computer.
- **"Fix with Qoder".** The Health panel's ready-made fix prompts are for pasting into Qoder, and a blueprint's **Build this with Qoder** likewise.

## Update or remove it

Copy the skill folder again from a fresh clone to update, or delete `~/.qoder/skills/floorplan` to remove it. Your maps stay in each project's `floorplan/` folder until you delete them.