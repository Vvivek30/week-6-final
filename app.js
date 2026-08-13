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
  writer: "Once upon a time, in a quiet corner of the world where mountains kissed the sky and ancient forests whispered secrets to those who dared listen, there was a story waiting to be told. Deep in the heart of the Whispering Woods, a young girl named Elena, barely eighteen years old with curious emerald eyes and a spirit that burned brighter than any star, discovered something that would change her life forever. While walking through the forest one misty morning, searching for rare herbs her grandmother had asked her to collect, Elena stumbled upon an enormous oak tree—so old and gnarled that it seemed to have grown from the very bones of the earth itself. Its massive roots twisted above the ground like serpents frozen mid-dance, creating hidden cavities and shadowed corners. As Elena knelt to examine the strange formations, her hand brushed against something unusual: a leather satchel, weathered by centuries but somehow still intact, tucked deep beneath the oldest roots. With trembling fingers, she pulled it free and opened it carefully. Inside lay an ancient map, its parchment worn thin as tissue paper, covered in faded ink that seemed to shimmer with an otherworldly light. The markings were intricate and mysterious—there were sketches of mountains she didn't recognize, rivers that seemed to flow upward on the page, and symbols that hurt her eyes to look at directly, as if they contained knowledge from another age. She traced her fingers along faded ink marks that appeared to chart a path toward something extraordinary and impossible. Her grandmother had always spoken of lost civilizations buried beneath the earth, of forgotten treasures hidden by ancient peoples, of magical places that existed only in stories told by firelight. Elena had listened to these tales her entire life, but she had always dismissed them as nothing more than the fanciful imaginings of an old woman who spent too much time alone with her memories and her books. She had believed them to be romantic fiction, the kind of stories people told to make their ordinary lives seem more grand and meaningful. But holding this map in her hands, feeling the weight of it, seeing the meticulous detail of every marking, Elena realized that perhaps her grandmother had been trying to tell her something true all along. Perhaps these weren't just stories. Perhaps they were warnings. Perhaps they were invitations. With trembling hands, she rolled up the map and tucked it carefully into her satchel. She found herself running through the forest, her heart pounding with a mixture of fear and exhilaration she had never experienced before. That night, unable to sleep despite her exhaustion, Elena lay in her small bedroom and stared at the ceiling, her mind racing with possibilities. She knew she should tell her grandmother about her discovery, but something made her hesitate. This felt like a secret meant only for her. When dawn finally broke, painting the sky in shades of pink and gold, Elena made a decision that would alter the course of her entire existence. She packed her provisions carefully—a warm cloak, sturdy boots, dried food, a water flask, and her grandmother's old compass. She left a note on the kitchen table, vague enough not to worry anyone but honest enough to keep her conscience clear. Then, map in hand, she set off down the winding forest path, her heart pounding with equal parts fear and excitement as she ventured deeper into the woods, each step taking her further from home and closer to a destiny she couldn't yet comprehend. The adventure was beginning, and Elena, though she didn't know it yet, was about to become someone entirely new.",
  
  editor: "In a secluded corner of the world where verdant mountains rose majestically and primordial forests whispered ancient secrets to those brave enough to listen, a remarkable story awaited its telling. Deep within the heart of the legendary Whispering Woods, a young woman named Elena—possessed of both keen intelligence and an indomitable spirit that burned like starlight—made a discovery that would irrevocably transform her destiny. One misty morning, while gathering medicinal herbs for her grandmother in the forest's shadowed depths, Elena encountered an extraordinary oak tree of incomprehensible age. Its gnarled trunk seemed to embody centuries of growth, its massive roots writhing above the earth like sculptures wrought by nature itself, creating mysterious cavities and deep shadows. Kneeling to investigate more closely, Elena's fingers brushed against leather—a satchel, impossibly preserved through the ages, concealed within the tree's ancient root system. As she withdrew it and carefully opened its contents, Elena discovered a parchment map of extraordinary craftsmanship and enigmatic purpose. The aged paper bore intricate symbols and faded illustrations that seemed to depict locations of unfathomable mystery—towering mountains unknown to her, impossible rivers, and enigmatic markings that suggested knowledge from epochs long forgotten. Throughout her life, Elena's grandmother had recounted tales of sunken civilizations and legendary treasures, narratives that Elena had previously dismissed as romantic folklore. Yet holding this tangible artifact, Elena experienced an profound epiphany: perhaps her grandmother's stories contained essential truths. Perhaps this map represented far more than mere fiction. That night, sleep eluded Elena entirely as possibilities consumed her thoughts. She contemplated confiding in her grandmother, yet intuition whispered that this discovery belonged to her alone. When dawn illuminated the sky with golden light, Elena resolved to embark on an unprecedented journey. She gathered essential supplies—warm garments, sturdy footwear, provisions for travel, a water vessel, and her grandmother's treasured compass. With her heart both trembling and soaring with determination, she placed the map carefully in her satchel and ventured down the forest path. Each footfall carried her forward into territories unmapped, into a future written only in destiny's hand. The morning light broke across the forest canopy as Elena stood at the precipice of transformation, ready to discover truths that would reshape her understanding of the world, ready to become the heroine her grandmother's tales had been preparing her to be.",
  
  finisher: "In a timeless realm where towering mountains rose like the cathedrals of ancient gods and primordial forests breathed with the whispered wisdom of countless ages, there existed a singular moment poised between the ordinary and the extraordinary. It was in this mystical landscape that Elena—a young woman of remarkable courage and intellect, whose eyes held the green of spring forests and whose spirit burned with the intensity of unquenchable starlight—experienced a revelation that would forever illuminate the trajectory of her existence. On a morning wrapped in silver mist, while journeying through the emerald depths of the Whispering Woods in search of medicinal treasures her grandmother required, Elena discovered something that transcended the boundaries between myth and reality. Before her stood an oak tree of such antiquity and grandeur that it seemed to have sprouted from the very primordial essence of creation itself. Its magnificent trunk, scarred by the passage of innumerable seasons, rose toward the heavens like a monument to time itself. Its roots, gnarled and magnificent, twisted above the earth in patterns that resembled ancient hieroglyphics carved by invisible hands. Drawn by an inexplicable intuition, Elena knelt before this natural cathedral and discovered, cradled within the deepest recesses of its root system, a leather satchel—weathered but miraculously preserved, as though protected by forces beyond mortal comprehension. With reverent care, Elena withdrew the satchel and unfastened its clasp. Within lay an artifact of extraordinary significance: a parchment map, its surface bearing the accumulated patina of centuries, inscribed with symbols and illustrations that seemed to encode knowledge from epochs when the world was still young. The markings depicted geographical impossibilities—mountains that defied known cartography, waterways that flowed in directions unknown to conventional geography, and enigmatic symbols that suggested the presence of civilizations whose names had been erased from human memory by the inexorable passage of time. For years, Elena's grandmother had recounted narratives of lost kingdoms and forgotten treasures, tales that Elena had cherished yet never fully credited. Yet in this singular instant, cradling this tangible evidence of secrets preserved through the ages, Elena experienced a profound awakening. Her grandmother's words were not mere folklore; they were historical record transmitted through generations. They were invitations to adventure. They were destinies written in the ancient past, waiting patiently to be discovered by someone worthy. That night, insomnia blessed Elena with clarity. She understood with crystalline certainty what she must do. She assembled her provisions with meticulous care—garments woven to endure hardship, boots crafted for treacherous terrain, provisions to sustain her journey, a vessel to carry water, and her grandmother's beloved compass, an instrument that had guided generations before. As dawn broke across the forest, painting the canopy in aureate light, Elena stood at the threshold of transformation. The map, now secured safely in her satchel, represented not merely an artifact but an acceleration, a catalyst for becoming the person she had always been meant to be. With her grandmother's compass in hand and her heart blazing with purpose, Elena stepped forward onto the forest path. Each deliberate footfall carried her away from the safety of her former existence and toward a magnificent destiny written in the stars themselves. The adventures that awaited her—the perils she would face, the truths she would uncover, the power she would discover within herself—all of this lay ahead, shimmering in possibility like a distant constellation finally within reach. Thus began the legendary journey of Elena, a story that would echo through the ages, a narrative of courage, discovery, and the profound transformation that comes when one chooses to answer the call of destiny."
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
