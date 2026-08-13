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
  apiBase: '/api/chat',
  model: 'gpt-4o',
  theme: 'dark',
  isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1',
  activeAgents: {
    writer: true,
    editor: true,
    finisher: true
  }
};

const promptInput = document.getElementById('promptInput');
const runButton = document.getElementById('runAgents');
const traceList = document.getElementById('traceList');
const finalOutput = document.getElementById('finalOutput');
const chatHistory = document.getElementById('chatHistory');
const statusBadge = document.getElementById('statusBadge');
const traceTemplate = document.getElementById('traceTemplate');
const themeToggle = document.getElementById('themeToggle');
const documentButton = document.getElementById('documentButton');
const clearTraceButton = document.getElementById('clearTrace');
const agentToggles = document.getElementById('agentToggles');

const chatState = {
  messages: []
};

// Demo responses for GitHub Pages
const demoResponses = {
  writer: "Once upon a time, in a quiet corner of the world, there was a story waiting to be told. Deep in the heart of the Whispering Woods, a young girl named Elena discovered an ancient map hidden beneath the roots of an old oak tree. The parchment was worn and tattered, but its secrets gleamed with possibility. She traced her fingers along faded ink marks that seemed to chart a path toward something extraordinary. Her grandmother had always spoken of lost civilizations and forgotten treasures, but Elena had never believed the tales were real—until now. With trembling hands, she rolled up the map and tucked it into her satchel. That night, unable to sleep, Elena decided to follow the map's directions into the unknown. As dawn broke, she packed her provisions and set off down the winding forest path. Her heart pounded with equal parts fear and excitement as she ventured deeper into the woods, each step taking her further from home and closer to destiny.",
  editor: "Once upon a time, in a quiet corner of the world, a story waited to be unveiled. Deep within the Whispering Woods, a young woman named Elena made a startling discovery: an ancient map hidden beneath the gnarled roots of an ancient oak. The parchment, worn and weathered by centuries, held secrets that gleamed with extraordinary possibility. Elena's fingers traced the faded ink, following paths that seemed to chart a journey toward wonder. Her grandmother had long spoken of lost civilizations and hidden treasures, yet Elena had dismissed those tales as folklore—until this profound moment. With reverence and anticipation, she secured the map carefully. That night, sleep eluded her entirely. She resolved to follow the mysterious map's directions, venturing into territories unmapped and unknown. As dawn's light broke across the forest canopy, Elena embarked on her expedition with resolve and courage, her spirit ablaze with possibility.",
  finisher: "In a secluded realm where ancient whispers echoed through the Whispering Woods, a transformative discovery awaited Elena, a young woman of uncommon determination. Beneath the weathered roots of a millennia-old oak, she unearthed an exquisitely crafted parchment—a map steeped in history and mystery. The archaic markings, though faded by time's passage, glowed with tantalizing potential and hidden meaning. Elena's fingers caressed the intricate pathways, each line suggesting a voyage toward legendary civilizations long forgotten and treasures beyond imagination. Her grandmother's chronicles of lost kingdoms and mythical riches suddenly crystallized into undeniable reality. With careful reverence, Elena secured this invaluable artifact. As night descended, she found herself consumed by purpose and anticipation. Dawn would herald her departure into uncharted territories, where destiny and legend converged. The morning light found her standing at the forest's edge, map in hand, ready to write her own legendary tale. Thus began an adventure that would reshape her world forever."
};

function isGitHubPages() {
  return window.location.hostname.includes('github.io');
}

function loadSavedState() {
  const saved = JSON.parse(localStorage.getItem('promptforge-state') || '{}');
  if (saved.prompt) promptInput.value = saved.prompt;
  if (saved.activeAgents) state.activeAgents = { ...state.activeAgents, ...saved.activeAgents };
  if (saved.messages) chatState.messages = saved.messages;
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
      activeAgents: state.activeAgents,
      messages: chatState.messages,
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

function renderChatHistory() {
  chatHistory.innerHTML = '';

  if (chatState.messages.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'message-row assistant';
    empty.innerHTML = '<div class="message-bubble">Hi! Ask me anything and I’ll answer with the live AI crew.</div>';
    chatHistory.appendChild(empty);
    return;
  }

  chatState.messages.forEach((message) => {
    const row = document.createElement('div');
    row.className = `message-row ${message.role}`;
    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = message.content;
    row.appendChild(bubble);
    chatHistory.appendChild(row);
  });

  chatHistory.scrollTop = chatHistory.scrollHeight;
}

function addMessage(role, content) {
  chatState.messages.push({ role, content });
  renderChatHistory();
  saveState();
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

function normalizeGeneratedText(raw) {
  if (Array.isArray(raw)) {
    return normalizeGeneratedText(raw[0]);
  }

  if (typeof raw === 'string') {
    return raw.replace(/^\s*(assistant|ai)\s*:\s*/i, '').trim() || 'No content returned.';
  }

  if (raw && typeof raw === 'object') {
    if (Array.isArray(raw.choices)) {
      const firstChoice = raw.choices[0];
      if (firstChoice?.message?.content) {
        return normalizeGeneratedText(firstChoice.message.content);
      }
    }

    const text = raw.generated_text ?? raw.text ?? raw.output ?? raw.answer ?? raw.message ?? raw.content ?? 'No content returned.';
    return normalizeGeneratedText(text);
  }

  return 'No content returned.';
}

async function callLLM({ system, user }) {
  // For local development, try the real backend first
  if (state.isLocalhost) {
    try {
      const response = await Promise.race([
        fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: state.model,
            messages: [
              { role: 'system', content: system },
              { role: 'user', content: user }
            ],
            temperature: 0.8,
            max_tokens: 2000
          })
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('timeout')), 4000)
        )
      ]);

      if (response.ok) {
        const data = await response.json();
        return normalizeGeneratedText(data.choices?.[0]?.message?.content ?? 'No content returned.');
      }
    } catch (err) {
      // Fall through to demo mode if localhost fails
    }
  }

  // For GitHub Pages or when localhost isn't available, use demo mode
  if (isGitHubPages() || !state.isLocalhost) {
    await new Promise(resolve => setTimeout(resolve, 800)); // Simulate delay
    
    // Select a demo response based on the system prompt
    let demoKey = 'writer';
    if (system.includes('Editor') || system.includes('polish')) {
      demoKey = 'editor';
    } else if (system.includes('Finisher') || system.includes('final')) {
      demoKey = 'finisher';
    }
    
    // Use the full demo response (already complete and polished)
    let response = demoResponses[demoKey];
    
    return response;
  }

  throw new Error('AI service unavailable.');
}

const agentScripts = {
  writer: {
    name: 'Writer',
    role: 'Draft Builder',
    instruction: 'Write a clear, engaging first draft that answers the request directly.',
    script: ({ userPrompt, context }) => ({
      system: 'You are the Writer agent. Create the first strong draft. Keep it readable, vivid, and complete. Answer the user request directly without fluff.',
      user: `Prompt:\n${userPrompt}\n\nContext:\n${context}`
    })
  },
  editor: {
    name: 'Editor',
    role: 'Style Editor',
    instruction: 'Improve clarity, flow, grammar, and polish while keeping the original meaning.',
    script: ({ userPrompt, context }) => ({
      system: 'You are the Editor agent. Improve the draft by correcting grammar, smoothing language, and enhancing clarity while preserving the main idea.',
      user: `Improve this content for the request:\n${userPrompt}\n\nCurrent draft:\n${context}`
    })
  },
  finisher: {
    name: 'Final Finisher',
    role: 'Final Answer',
    instruction: 'Create the final cleaned-up answer for the user, ready to deliver.',
    script: ({ userPrompt, context }) => ({
      system: 'You are the Final Finisher. Combine the earlier agent work into a clean, polished final response that directly answers the user.',
      user: `Final answer request:\n${userPrompt}\n\nCombined agent work:\n${context}`
    })
  }
};

function buildAgentPrompt(agentId, userPrompt, contextText = '') {
  const script = agentScripts[agentId];
  if (!script) {
    return { system: 'You are a helpful assistant.', user: userPrompt };
  }

  return script.script({ userPrompt, context: contextText });
}

async function orchestrateWritingCrew() {
  const userPrompt = promptInput.value.trim();
  if (!userPrompt) {
    finalOutput.textContent = 'Please enter a question or prompt before running the AI crew.';
    setStatus('No prompt', 'error');
    return;
  }

  addMessage('user', userPrompt);
  finalOutput.textContent = 'The orchestrator is assigning the live AI crew...';
  finalOutput.classList.add('visible');
  
  // Show demo mode notice on GitHub Pages
  if (isGitHubPages()) {
    finalOutput.textContent = '🎬 Demo Mode Active\n\nYou\'re viewing a demo on GitHub Pages. For real AI responses using your GitHub Copilot token:\n\n1. Clone the repo\n2. Run: node server.js\n3. Visit: http://localhost:3000\n\n---\n\nShowing sample responses now...';
  }
  
  setStatus('Running', 'running');
  clearTrace();
  appendTrace('Orchestrator', 'Boss', 'Review the request and assign the live writing workflow.', 'Starting the multi-agent plan.');

  try {
    const orchestratorPlan = await callLLM({
      system: 'You are a calm project orchestrator. Decide the best workflow for this question or writing task and summarize the plan clearly.',
      user: `Create a short execution plan for this request:\n\n${userPrompt}`
    });

    appendTrace('Orchestrator', 'Boss', 'Execution plan', orchestratorPlan);

    const agentOrder = ['writer', 'editor', 'finisher'];
    const enabledAgents = agentOrder.filter((agentId) => state.activeAgents[agentId]);

    if (enabledAgents.length === 0) {
      throw new Error('No agents are enabled. Turn on at least one worker before running.');
    }

    let context = `Initial request: ${userPrompt}\n\nOrchestrator plan: ${orchestratorPlan}`;
    let lastResult = '';

    for (const agentId of enabledAgents) {
      if (agentId === 'finisher') {
        const finalStep = buildAgentPrompt('finisher', userPrompt, context);
        const finalResult = await callLLM(finalStep);
        appendTrace('Final Finisher', 'Final Answer', agentScripts.finisher.instruction, finalResult);
        finalOutput.textContent = finalResult;
        break;
      }

      const step = buildAgentPrompt(agentId, userPrompt, context);
      const result = await callLLM(step);
      appendTrace(agentScripts[agentId].name, agentScripts[agentId].role, agentScripts[agentId].instruction, result);
      context += `\n\n${agentScripts[agentId].name} output:\n${result}`;
      lastResult = result;
    }

    if (!state.activeAgents.finisher && enabledAgents.length > 0) {
      finalOutput.textContent = lastResult || 'No content returned by the enabled agents.';
    }

    addMessage('assistant', finalOutput.textContent || 'No answer generated.');
    setStatus('Complete', 'done');
    saveState();
  } catch (error) {
    const message = error.message || 'Something went wrong during the live LLM workflow.';
    finalOutput.textContent = `Error: ${message}\n\nFor real AI responses, run locally: node server.js`;
    addMessage('assistant', `Error: ${message}`);
    setStatus('Error', 'error');
    appendTrace('System', 'Error', 'Live AI workflow interrupted', message);
  }
}

function wireEvents() {
  runButton.addEventListener('click', orchestrateWritingCrew);

  documentButton.addEventListener('click', () => {
    localStorage.setItem('storypaper-draft', promptInput.value || '');
    window.location.href = 'document.html';
  });

  promptInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      orchestrateWritingCrew();
    }
  });

  clearTraceButton.addEventListener('click', () => {
    clearTrace();
    finalOutput.textContent = 'The agent log has been cleared. Ready for the next run.';
    finalOutput.classList.remove('visible');
    chatState.messages = [];
    renderChatHistory();
    setStatus('Idle', 'idle');
    saveState();
  });

  themeToggle.addEventListener('click', () => {
    state.theme = state.theme === 'dark' ? 'light' : 'dark';
    applyTheme(state.theme);
    themeToggle.textContent = state.theme === 'dark' ? '🌙 Theme' : '☀️ Theme';
    saveState();
  });

  [promptInput].forEach((element) => {
    element.addEventListener('input', saveState);
  });
}

function seedDemoPrompt() {
  promptInput.value = 'Answer this question clearly: What is the best way to stay creative every day?';
}

function init() {
  const docDraft = localStorage.getItem('storypaper-auto-run');
  if (docDraft === 'true') {
    const savedStory = localStorage.getItem('storypaper-draft') || '';
    if (savedStory) {
      promptInput.value = savedStory;
      localStorage.removeItem('storypaper-auto-run');
      setTimeout(() => orchestrateWritingCrew(), 200);
    }
  }

  loadSavedState();
  buildToggleUI();
  bindPresetButtons();
  wireEvents();
  renderChatHistory();
  if (!promptInput.value.trim()) {
    seedDemoPrompt();
  }
  applyTheme(state.theme);
  themeToggle.textContent = state.theme === 'dark' ? '🌙 Theme' : '☀️ Theme';
  saveState();
}

init();
