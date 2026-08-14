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

// Smart demo response generator for GitHub Pages
function extractTopicFromPrompt(userPrompt) {
  // Extract the main topic from prompts like "Write a story about X"
  const aboutMatch = userPrompt.match(/about\s+([^.!?]+)/i);
  if (aboutMatch) return aboutMatch[1].trim();
  
  // Or just return a clean version of the prompt
  return userPrompt.replace(/^(write|create|compose|tell me|generate|make)\s+(a\s+)?(story|tale|narrative)?\s*about\s+/i, '').trim();
}

function generateDemoStory(topic, agentType = 'writer') {
  // Generate story versions based on the topic and which agent is writing
  const storyTemplates = {
    writer: (topic) => `Once upon a time, there was ${topic}. In a world where imagination became reality, ${topic} held mysteries yet untold. The journey began with a single moment, a pivotal realization that would set everything in motion. As the story unfolds, we discover the depths of this extraordinary subject matter. ${topic} revealed itself through countless layers of complexity and wonder. Each detail built upon the last, creating a rich tapestry of narrative and meaning. The protagonist found themselves drawn deeper into the heart of ${topic}, compelled by forces both internal and external. Through trials and triumphs, through moments of doubt and clarity, the true nature of ${topic} began to emerge. The adventure that followed transformed not just the characters, but the very essence of how ${topic} would be understood forever. What began as curiosity evolved into obsession, and obsession into purpose. The world would never be the same.`,
    
    editor: (topic) => `In a realm where the extraordinary became ordinary, ${topic} emerged as a subject of profound significance and captivating mystery. Throughout this refined narrative, the intricate nature of ${topic} unfolds with elegant sophistication and compelling depth. The protagonist's journey illuminates the multifaceted dimensions of ${topic}, revealing truths previously obscured by conventional understanding. Every element contributes meaningfully to the overarching exploration of ${topic} and its implications. The narrative weaves together seemingly disparate threads into a coherent and compelling whole. As the story progresses, ${topic} transforms from mere subject matter into a living, breathing force that shapes destiny itself. The prose elevates the narrative, transforming raw experience into polished insight. Through masterfully crafted sequences and carefully calibrated emotional beats, the true significance of ${topic} crystallizes with unmistakable clarity. The reader emerges from this journey with renewed understanding and profound appreciation for the complexity inherent in ${topic}. What unfolds is not merely storytelling but a profound meditation on meaning and transformation.`,
    
    finisher: (topic) => `In a transcendent realm where the mundane dissolves into the magnificent, ${topic} emerges as a magnificent subject of inexhaustible profundity and sublime mystery. This exquisitely refined narrative presents ${topic} not merely as subject matter but as a metaphorical catalyst for existential transformation and enlightenment. The protagonist's odyssey illuminates the labyrinthine dimensions of ${topic}, unveiling truths previously veiled by conventional epistemology and limited perception. Each meticulously crafted element contributes substantially to the comprehensive exploration of ${topic} and its far-reaching philosophical implications. The narrative architecture ingeniously weaves seemingly disparate thematic threads into a cohesive, resonant whole of startling eloquence. As the narrative arc progresses majestically, ${topic} transcends its initial characterization, evolving into a transformative force that fundamentally reshapes destiny itself. The prose achieves an elevated register of sophistication, transmuting raw experience into crystalline insight and wisdom. Through superbly constructed sequences and precisely calibrated emotional crescendos, the profound significance of ${topic} achieves undeniable clarity and power. The reader emerges from this magnificent journey fundamentally transformed, possessing renewed understanding and profound reverence for the exquisite complexity intrinsic to ${topic}. What unfolds is not merely narrative but a transcendent meditation on the eternal themes of meaning, transformation, and the boundless potential of human understanding.`
  };
  
  return storyTemplates[agentType] ? storyTemplates[agentType](topic) : storyTemplates.writer(topic);
}

// Fallback responses for non-story content
const demoResponses = {
  blog: {
    writer: "How to Succeed: A Practical Guide. In today's world, success feels elusive. Yet the path to achievement is simpler than most believe. Start with clarity. Define what success means to you personally. Is it wealth? Fulfillment? Impact? Once you know your target, create a plan. Break large goals into manageable steps. Consistency matters more than intensity. Small daily actions compound into remarkable results. Embrace failure as feedback, not defeat. Every setback contains lessons that propel you forward. Build meaningful relationships. Success rarely happens in isolation. Surround yourself with people who inspire and challenge you. Finally, take action. All the planning in the world means nothing without execution. Start today, start small, but start now.",
    editor: "Achieving Success: Essential Principles for Sustainable Growth. In contemporary society, success appears elusive to many. Yet the pathway to meaningful achievement rests upon timeless principles accessible to all. Begin with profound clarity regarding your personal definition of success. Determine whether your aspirations center on financial security, existential fulfillment, or meaningful contribution. Upon establishing this foundational understanding, construct a deliberate strategy. Decompose ambitious objectives into discrete, manageable components. Consistent daily effort proves considerably more powerful than sporadic intensity. Reconceptualize failure as invaluable feedback rather than defeat. Each setback contains instructive lessons accelerating your progression. Cultivate meaningful interpersonal connections. Exceptional achievement rarely emerges from isolation. Surround yourself with individuals who inspire growth and constructive challenge. Ultimately, initiate action. Comprehensive planning divorced from execution remains theoretical. Commence your journey immediately.",
    finisher: "The Comprehensive Architecture of Sustainable Success: Principles for Transformative Achievement. In the contemporary landscape, the pursuit of success represents one of humanity's most profound endeavors. The pathway to extraordinary achievement rests upon timelessly validated principles accessible to those possessing sufficient clarity and determination. Commence your journey through profound introspection regarding your authentic definition of success. Determine whether your aspirations encompass financial security, existential fulfillment, meaningful societal contribution, or some exquisite synthesis thereof. Upon establishing this foundational comprehension of purpose, construct a deliberate architectural framework. Decompose grand ambitions into discrete, systematically sequenced components. Daily consistency and incremental progress accumulate into transformative results. Reconceptualize apparent failures as indispensable feedback mechanisms rather than definitive defeats. Each setback contains profound lessons that accelerate forward momentum. Cultivate meaningful interpersonal connections with individuals of distinction and integrity. Exceptional achievement emerges through collaborative synergy rather than isolated effort. Finally, transcend planning paralysis through decisive action. Initiate your journey with intention and commitment."
  },
  email: {
    writer: "Hi there! I wanted to reach out and share something exciting with you. We've been working on a project that could genuinely make a difference in your life. The idea came from recognizing a common challenge we all face: finding the right solution at the right time. After months of development and testing, we're proud to present something we think you'll find valuable. We focused on simplicity and effectiveness, making sure it works seamlessly with your existing workflow. What makes this different is that we listened to feedback from people like you. Your input shaped every decision we made. I'd love to get your thoughts and hear how this might fit into your life. Let me know if you'd like more details or want to try it out.",
    editor: "Hello! I wanted to personally share an exciting development with you. Our team has been dedicating considerable effort to a project we believe holds genuine value for you. This initiative emerged from recognizing a widespread challenge that affects many individuals: discovering appropriate solutions at pivotal moments. Following extensive development and comprehensive testing, we're delighted to introduce something we're confident you'll appreciate. We prioritized both simplicity and effectiveness, ensuring seamless integration with your existing systems and workflows. What distinguishes this offering is our commitment to incorporating feedback from valued individuals like yourself. Your perspectives directly influenced every strategic decision. I would genuinely appreciate your thoughts and perspective. Please feel free to reach out if you'd like additional information or wish to explore this opportunity.",
    finisher: "Greetings! I'm reaching out to personally share an extraordinary development that our dedicated team has been cultivating. This initiative emerged from our profound recognition of a universal challenge that impacts countless individuals: identifying optimal solutions at critical junctures in their lives. Following rigorous development processes and exhaustive testing protocols, we're genuinely delighted to introduce an offering we confidently believe will provide substantial value. We prioritized both operational simplicity and effectiveness, meticulously ensuring seamless integration with your established systems. What profoundly distinguishes this offering is our unwavering commitment to incorporating candid feedback from valued individuals such as yourself. Your perspectives have directly influenced every consequential strategic decision. I would deeply value your thoughtful perspective and response. Please don't hesitate to reach out should you desire additional information or wish to explore this exceptional opportunity."
  }
};

function getPromptType(userPrompt) {
  const prompt = userPrompt.toLowerCase();
  if (prompt.includes('blog') || prompt.includes('article') || prompt.includes('post')) return 'blog';
  if (prompt.includes('email') || prompt.includes('message') || prompt.includes('letter')) return 'email';
  return 'blog';
}

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
    
    // For story prompts, generate a custom story about the topic they asked for
    if (user.toLowerCase().includes('story') || user.toLowerCase().includes('tale') || user.toLowerCase().includes('narrative')) {
      const topic = extractTopicFromPrompt(user);
      
      // Determine which agent version to use
      let agentType = 'writer';
      if (system.includes('Editor') || system.includes('polish')) {
        agentType = 'editor';
      } else if (system.includes('Finisher') || system.includes('final')) {
        agentType = 'finisher';
      }
      
      // Generate a story about the user's topic
      return generateDemoStory(topic, agentType);
    }
    
    // For other content types (blog, email, poem), use the pre-written responses
    const promptType = getPromptType(user);
    
    let demoKey = 'writer';
    if (system.includes('Editor') || system.includes('polish')) {
      demoKey = 'editor';
    } else if (system.includes('Finisher') || system.includes('final')) {
      demoKey = 'finisher';
    }
    
    const typeResponses = demoResponses[promptType] || demoResponses.story;
    const response = typeResponses[demoKey];
    
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
