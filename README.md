# PromptForge Studio

A playful multi-agent writing app that uses a live LLM via an OpenAI-compatible API. It coordinates a writing team of agents and shows the full execution trace in real time.

## Features

- Orchestrator + 3 worker agents: Writer, Editor, and Final Finisher
- Real-time visual trace of agent execution order, instructions, and responses
- Live LLM integration using an API key entered in the browser
- Interactive prompt presets and theme toggle
- Local storage for prompt settings and agent toggles
- GitHub Pages friendly static site

## Run locally

```bash
cd /workspaces/week-6-final
python3 -m http.server 8000
```

Then open http://localhost:8000

## Use the app

1. Enter your LLM API key in the settings panel.
2. Optionally change the API base URL and model.
3. Type a writing task or choose a preset.
4. Click “Run Writing Crew”.
5. Watch the orchestrator and agent results appear in the right-side trace panel.

## GitHub Pages

This repo is ready to publish as a GitHub Pages static site from the main branch.

Expected site URL:

https://Vvivek30.github.io/week-6-final/

## Notes

- No API keys are stored in the repository.
- The app expects an OpenAI-compatible endpoint such as `https://api.openai.com/v1`.
- It works with models like `gpt-4o-mini` or similar supported deployments.
