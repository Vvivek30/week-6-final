const workerAgents = [
  {
    id: 'writer',
    name: 'Writer',
    emoji: '✍️',
    role: 'Draft Builder',
    instruction: 'Write the first vivid draft in a compelling voice with clear structure.'
  },
  {
    id: 'editor',
    name: 'Editor',
    emoji: '🧹',
    role: 'Style Editor',
    instruction: 'Improve flow, clarity, rhythm, and polish while keeping the original mood.'
  },
  {
    id: 'finisher',
    name: 'Finisher',
    emoji: '🎯',
    role: 'Final Finisher',
    instruction: 'Create the final polished version suitable for the user prompt and audience.'
  }
];

const state = {
  apiBase: 'https://api-inference.huggingface.co/models',
  model: 'google/flan-t5-small',
  theme: 'dark',
  activeAgents: {
    writer: true,
    editor: true,
    finisher: true
  }
};

const promptInput = document.getElementById('promptInput');
const apiBaseInput = document.getElementById('apiBaseInput');
const modelInput = document.getElementById('modelInput');
const runButton = document.getElementById('runAgents');
const traceList = document.getElementById('traceList');
const finalOutput = document.getElementById('finalOutput');
const statusBadge = document.getElementById('statusBadge');
const traceTemplate = document.getElementById('traceTemplate');
const themeToggle = document.getElementById('themeToggle');
const clearTraceButton = document.getElementById('clearTrace');
const agentToggles = document.getElementById('agentToggles');

function loadSavedState() {
  const saved = JSON.parse(localStorage.getItem('promptforge-state') || '{}');
  if (saved.prompt) promptInput.value = saved.prompt;
  if (saved.apiBase) apiBaseInput.value = saved.apiBase;
  if (saved.model) modelInput.value = saved.model;
  if (saved.activeAgents) state.activeAgents = { ...state.activeAgents, ...saved.activeAgents };
  if (saved.theme) {
    state.theme = saved.theme;
    applyTheme(saved.theme);
  }
}

function saveState() {
  localStorage.setItem(
    'promptforge-state',
    JSON.stringify({
      prompt: promptInput.value,
      apiBase: apiBaseInput.value,
      model: modelInput.value,
      activeAgents: state.activeAgents,
      theme: state.theme
    })
  );
}

function applyTheme(theme) {
  document.body.classList.toggle('light-mode', theme === 'light');
}

function buildToggleUI() {
  agentToggles.innerHTML = workerAgents
    .map(
      (agent) => `
        <label class="agent-toggle">
          <span class="agent-toggle-info">
            <span>${agent.emoji}</span>
            <span>${agent.name}</span>
          </span>
          <span class="switch">
            <input type="checkbox" data-agent-id="${agent.id}" ${state.activeAgents[agent.id] ? 'checked' : ''} />
            <span class="slider"></span>
          </span>
        </label>
      `
    )
    .join('');

  agentToggles.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      const id = checkbox.dataset.agentId;
      state.activeAgents[id] = checkbox.checked;
      saveState();
    });
  });
}

function setStatus(label, mode) {
  statusBadge.textContent = label;
  statusBadge.className = `status-badge ${mode}`;
}

function appendTrace(agentName, role, instruction, result) {
  const node = traceTemplate.content.cloneNode(true);
  node.querySelector('.trace-badge').style.background = 'linear-gradient(135deg, #32d2c3, #8b5cf6)';
  node.querySelector('.trace-name').textContent = `${agentName}`;
  node.querySelector('.trace-role').textContent = role;
  node.querySelector('.trace-instruction').textContent = instruction;
  node.querySelector('.trace-result').textContent = result;
  traceList.prepend(node);
}

function clearTrace() {
  traceList.innerHTML = '';
}

function samplePrompts() {
  const presets = {
    story: 'Write a whimsical children\'s story about a tiny robot who learns that kindness makes every machine brighter. Make it warm, imaginative, and magical.',
    blog: 'Write a polished blog post about how creative teams can use AI without losing their human voice. Keep it practical and engaging.',
    email: 'Write a friendly email to customers announcing a new writing assistant feature. Make it upbeat, clear, and marketing-friendly.'
  };

  return presets;
}

function bindPresetButtons() {
  document.querySelectorAll('[data-preset]').forEach((button) => {
    button.addEventListener('click', () => {
      const presets = samplePrompts();
      const key = button.dataset.preset;
      promptInput.value = presets[key];
      saveState();
    });
  });
}

async function callLLM({ system, user }) {
  const apiBase = (apiBaseInput.value || state.apiBase).replace(/\/+$/, '');
  const selectedModel = modelInput.value || state.model;
  const isHuggingFace = apiBase.includes('huggingface.co');

  if (isHuggingFace) {
    const modelUrl = `${apiBase}/${selectedModel}`;
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        inputs: `System: ${system}\n\nUser: ${user}`,
        parameters: {
          max_new_tokens: 300,
          temperature: 0.8,
          do_sample: true
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'The live Hugging Face model request failed.');
    }

    if (Array.isArray(data)) {
      return data[0]?.generated_text?.trim() || 'No content returned.';
    }

    if (typeof data?.generated_text === 'string') {
      return data.generated_text.trim();
    }

    if (data?.error) {
      throw new Error(data.error);
    }

    return 'No content returned.';
  }

  throw new Error('No API key is stored in this app. Use the default Hugging Face endpoint or switch to an authenticated model provider.');
}

function buildAgentPrompt(agent, userPrompt, contextText = '') {
  return `You are ${agent.name}, the ${agent.role}.\n\nUser request: ${userPrompt}\n\nContext from the orchestrator:\n${contextText}\n\nTask:\n${agent.instruction}\n\nReturn only the useful content for this step. Keep it clear, creative, and ready for the next agent.`;
}

async function orchestrateWritingCrew() {
  const userPrompt = promptInput.value.trim();
  if (!userPrompt) {
    finalOutput.textContent = 'Please enter a prompt before running the writing crew.';
    setStatus('No prompt', 'error');
    return;
  }

  finalOutput.textContent = 'The orchestrator is assigning the writing crew...';
  setStatus('Running', 'running');
  clearTrace();
  appendTrace('Orchestrator', 'Boss', 'Review the request and assign the writing workflow.', 'Starting the multi-agent plan.');

  try {
    const orchestratorPlan = await callLLM({
      system: 'You are a calm project orchestrator for a writing team. Decide the workflow, assign a strong creative direction, and summarize the plan in a compact way.',
      user: `Create a short execution plan for this writing task:\n\n${userPrompt}`
    });

    appendTrace('Orchestrator', 'Boss', 'Execution plan', orchestratorPlan);

    const activeAgents = workerAgents.filter((agent) => state.activeAgents[agent.id]);

    if (activeAgents.length === 0) {
      throw new Error('No agents are enabled. Turn on at least one worker before running.');
    }

    let sharedContext = `User goal: ${userPrompt}\n\nOrchestrator plan: ${orchestratorPlan}`;
    let finalDraft = '';

    for (const agent of activeAgents) {
      const promptText = buildAgentPrompt(agent, userPrompt, sharedContext);
      const result = await callLLM({
        system: `You are ${agent.name}, the ${agent.role}. Build useful content and keep tone consistent.`,
        user: promptText
      });

      appendTrace(agent.name, agent.role, agent.instruction, result);
      sharedContext += `\n\n${agent.name} output:\n${result}`;
      finalDraft = result;
    }

    const finalResult = await callLLM({
      system: 'You are the final finisher and editor-in-chief. Merge all agent contributions into a polished final answer that is coherent, complete, and ready to deliver.',
      user: `Create the final polished output based on the full workflow:\n\n${sharedContext}`
    });

    appendTrace('Final Finisher', 'Delivery', 'Merge all agent contributions into one final answer.', finalResult);
    finalOutput.textContent = finalResult;
    setStatus('Complete', 'done');
    saveState();
  } catch (error) {
    const message = error.message || 'Something went wrong during the workflow.';
    finalOutput.textContent = `Workflow error: ${message}`;
    setStatus('Error', 'error');
    appendTrace('System', 'Error', 'Multi-agent workflow interrupted', message);
  }
}

function wireEvents() {
  runButton.addEventListener('click', orchestrateWritingCrew);
  clearTraceButton.addEventListener('click', () => {
    clearTrace();
    finalOutput.textContent = 'The agent log has been cleared. Ready for the next run.';
    setStatus('Idle', 'idle');
  });

  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
    themeToggle.textContent = state.theme === 'dark' ? '🌙 Theme' : '☀️ Theme';
    saveState();
  });

  [promptInput, apiBaseInput, modelInput].forEach((element) => {
    element.addEventListener('input', saveState);
  });
}

function seedDemoPrompt() {
  promptInput.value = 'Write a playful story about a friendly robot who explores a moonlit city and discovers that helping others is the greatest power of all.';
}

function init() {
  loadSavedState();
  buildToggleUI();
  bindPresetButtons();
  wireEvents();
  if (!promptInput.value.trim()) {
    seedDemoPrompt();
  }
  applyTheme(state.theme);
  themeToggle.textContent = state.theme === 'dark' ? '🌙 Theme' : '☀️ Theme';
  saveState();
}

init();
