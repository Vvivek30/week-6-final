# PromptForge Studio

A playful multi-agent writing app that uses a live LLM via an OpenAI-compatible API. It coordinates a writing team of agents and shows the full execution trace in real time.

## Features

- Orchestrator + 3 worker agents: Writer, Editor, and Final Finisher
- Real-time visual trace of agent execution order, instructions, and responses
- Live LLM integration using a public no-key Hugging Face model by default
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

1. Use the default live LLM settings or switch to another public model endpoint.
2. Type a writing task or choose a preset.
3. Click “Run Writing Crew”.
4. Watch the orchestrator and agent results appear in the right-side trace panel.

## GitHub Pages

This repo is ready to publish as a GitHub Pages static site from the main branch.

Expected site URL:

https://Vvivek30.github.io/week-6-final/

## Notes

- No API key is required for the default live model setup.
- The app defaults to the public Hugging Face inference endpoint: `https://api-inference.huggingface.co/models`
- You can swap to another public or authenticated model provider if needed.
