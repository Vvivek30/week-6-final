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

// Demo responses for GitHub Pages - organized by prompt type
const demoResponses = {
  story: {
    writer: "Once upon a time, in a quiet corner of the world where mountains kissed the sky and ancient forests whispered secrets to those who dared listen, there was a story waiting to be told. Deep in the heart of the Whispering Woods, a young girl named Elena, barely eighteen years old with curious emerald eyes and a spirit that burned brighter than any star, discovered something that would change her life forever. While walking through the forest one misty morning, searching for rare herbs her grandmother had asked her to collect, Elena stumbled upon an enormous oak tree—so old and gnarled that it seemed to have grown from the very bones of the earth itself. Its massive roots twisted above the ground like serpents frozen mid-dance, creating hidden cavities and shadowed corners. As Elena knelt to examine the strange formations, her hand brushed against something unusual: a leather satchel, weathered by centuries but somehow still intact, tucked deep beneath the oldest roots. With trembling fingers, she pulled it free and opened it carefully. Inside lay an ancient map, its parchment worn thin as tissue paper, covered in faded ink that seemed to shimmer with an otherworldly light. The markings were intricate and mysterious—there were sketches of mountains she didn't recognize, rivers that seemed to flow upward on the page, and symbols that hurt her eyes to look at directly, as if they contained knowledge from another age. She traced her fingers along faded ink marks that appeared to chart a path toward something extraordinary and impossible. Her grandmother had always spoken of lost civilizations buried beneath the earth, of forgotten treasures hidden by ancient peoples, of magical places that existed only in stories told by firelight. Elena had listened to these tales her entire life, but she had always dismissed them as nothing more than the fanciful imaginings of an old woman who spent too much time alone with her memories and her books. But holding this map in her hands, Elena realized that perhaps her grandmother had been telling her something true all along.",
    editor: "In a secluded corner of the world where verdant mountains rose majestically and primordial forests whispered ancient secrets to those brave enough to listen, a remarkable story awaited its telling. Deep within the heart of the legendary Whispering Woods, a young woman named Elena—possessed of both keen intelligence and an indomitable spirit that burned like starlight—made a discovery that would irrevocably transform her destiny. One misty morning, while gathering medicinal herbs for her grandmother in the forest's shadowed depths, Elena encountered an extraordinary oak tree of incomprehensible age. Its gnarled trunk seemed to embody centuries of growth, its massive roots writhing above the earth like sculptures wrought by nature itself, creating mysterious cavities and deep shadows. Kneeling to investigate more closely, Elena's fingers brushed against leather—a satchel, impossibly preserved through the ages, concealed within the tree's ancient root system. As she withdrew it and carefully opened its contents, Elena discovered a parchment map of extraordinary craftsmanship and enigmatic purpose. The aged paper bore intricate symbols and faded illustrations that seemed to depict locations of unfathomable mystery—towering mountains unknown to her, impossible rivers, and enigmatic markings that suggested knowledge from epochs long forgotten. Throughout her life, Elena's grandmother had recounted tales of sunken civilizations and legendary treasures, narratives that Elena had previously dismissed as romantic folklore. Yet holding this tangible artifact, Elena experienced a profound epiphany: perhaps her grandmother's stories contained essential truths.",
    finisher: "In a timeless realm where towering mountains rose like the cathedrals of ancient gods and primordial forests breathed with the whispered wisdom of countless ages, there existed a singular moment poised between the ordinary and the extraordinary. It was in this mystical landscape that Elena—a young woman of remarkable courage and intellect, whose eyes held the green of spring forests and whose spirit burned with the intensity of unquenchable starlight—experienced a revelation that would forever illuminate the trajectory of her existence. On a morning wrapped in silver mist, while journeying through the emerald depths of the Whispering Woods in search of medicinal treasures her grandmother required, Elena discovered something that transcended the boundaries between myth and reality. Before her stood an oak tree of such antiquity and grandeur that it seemed to have sprouted from the very primordial essence of creation itself. Its magnificent trunk, scarred by the passage of innumerable seasons, rose toward the heavens like a monument to time itself. Its roots, gnarled and magnificent, twisted above the earth in patterns that resembled ancient hieroglyphics carved by invisible hands. Within its depths, Elena found a map—a treasure steeped in history and mystery, its archaic markings suggesting knowledge from epochs long forgotten. Thus began an adventure that would reshape her world forever."
  },
  
  blog: {
    writer: "How to Stay Creative Every Day: A Practical Guide. In our fast-paced, digitally-driven world, maintaining a consistent creative practice can feel like an impossible task. Between work obligations, social media demands, and the constant noise of modern life, finding time and mental space for genuine creative work becomes increasingly challenging. Yet creativity isn't a luxury reserved for artists alone—it's a fundamental human need that enhances our problem-solving abilities, emotional well-being, and sense of purpose. The key to sustaining creativity isn't finding more time; it's creating the right environment and habits. Start your day with intention. Before checking emails or scrolling social media, spend fifteen minutes on something creative. This could be writing, sketching, composing music, or even thinking through a problem in a new way. The important thing is that your mind engages with creation before it becomes saturated with external input. Set boundaries around your creative time. Protect it like you would protect a client meeting or important appointment. Your creative practice deserves the same respect and prioritization as any other important commitment in your life. Build variety into your routine. If you only paint when you feel inspired, inspiration will remain elusive. Instead, practice multiple forms of creative expression.",
    editor: "How to Maintain a Consistent Creative Practice: Essential Strategies for Modern Creators. In our increasingly digital and time-constrained world, sustaining meaningful creative work represents both a significant challenge and an essential component of personal fulfillment. Beyond serving professional pursuits, creative practice fundamentally enhances cognitive flexibility, emotional resilience, and overall life satisfaction. Rather than searching for additional time, effective creators strategically establish environmental conditions and deliberate habits that nurture consistent output. Begin each day with purposeful creative engagement. Allocate fifteen minutes to your chosen creative medium before attending to emails or digital distractions. This intentional prioritization ensures your mind remains fresh and unrestricted before external demands fragment your focus. Establish firm boundaries protecting your creative time. Treat these sessions with the same professional respect you would afford important meetings. Your creative growth warrants this level of commitment and intentionality. Embrace creative diversity. Rather than awaiting inspiration to strike, diversify your creative outlets. Rotate between different mediums and approaches to maintain engagement and prevent creative stagnation.",
    finisher: "Sustaining Meaningful Creativity: A Comprehensive Framework for Artistic and Professional Growth. In contemporary society, where temporal constraints and digital demands perpetually encroach upon contemplative space, the cultivation of consistent creative practice emerges as an essential endeavor for personal and professional flourishing. Creativity transcends artistic domains, functioning as a fundamental human capacity that elevates problem-solving sophistication, emotional resilience, and existential meaning. The distinction between aspiring creators and accomplished practitioners lies not in discovering additional temporal resources but in establishing deliberate systems, environmental architectures, and habitual disciplines that systematically nurture creative expression. Commence each day with intentional creative engagement, dedicating the first precious moments of consciousness to your chosen medium before external stimuli fragment cognitive focus. This deliberate prioritization ensures your mind operates with maximal freshness and receptivity. Establish inviolable boundaries demarcating your creative periods as sacred commitments, warranting equivalent professional reverence as significant business obligations. Embrace creative multiplicity rather than monolithic specialization. Diversify across mediums and methodologies, maintaining perpetual engagement while preventing ossification and creative fatigue."
  },
  
  email: {
    writer: "Hi there! I wanted to reach out and share something exciting that I've been working on. Over the past few months, our team has developed a tool that genuinely makes writing easier, more creative, and surprisingly enjoyable. I know how challenging it can be to find the time and energy to write something meaningful, especially when you're juggling multiple projects and responsibilities. That's exactly why we built this. We wanted to create something that doesn't replace your voice or your creativity—instead, it amplifies it. Imagine having a writing partner who understands your unique style, helps you brainstorm ideas, polishes your drafts, and gets out of your way when you need to work alone. That's what our new writing studio offers. Whether you're working on a creative project, professional correspondence, or just trying to find the right words to express an idea, this tool is designed to support your process. I'd love to get your thoughts on it. If you're interested in trying it out, I'm happy to give you access.",
    editor: "Hello! I wanted to personally reach out and share an exciting development that our team has been cultivating. Throughout recent months, we've developed an innovative tool that meaningfully enhances the writing process, transforming it into something both more creative and genuinely enjoyable. Understanding the considerable challenges of balancing writing aspirations with life's competing demands, we've created a solution that honors your authentic voice while amplifying your creative capabilities. Rather than replacing your judgment, our tool functions as an intelligent writing partner—one that comprehends your distinctive style, facilitates brainstorming, refines your work, and gracefully recedes when you require autonomy. Whether you're developing creative projects, professional communications, or seeking to articulate complex ideas with precision, this platform provides meaningful support throughout your writing journey. I would genuinely appreciate your perspective and feedback. Should you wish to explore this tool firsthand, I would be delighted to arrange access.",
    finisher: "Greetings! I hope this message finds you well. I'm reaching out personally to introduce an extraordinary development that our team has thoughtfully cultivated over recent months. We have engineered an innovative writing platform that substantially elevates the entire creative composition process, transforming what many experience as arduous labor into an engaging and intellectually rewarding endeavor. Acknowledging the multifaceted challenges inherent in contemporary professional and creative life—where time scarcity and cognitive demands perpetually encroach—we conceptualized a sophisticated solution that preserves and celebrates your distinctive voice while simultaneously magnifying your creative potential and linguistic power. This remarkable tool functions as an intellectually sophisticated writing companion, one that intuitively understands your particular stylistic preferences, facilitates generative ideation, provides meticulous editorial refinement, and judiciously withdraws when your autonomous creative judgment should predominate. Whether you're developing ambitious creative literature, composing professional correspondence with precision, or striving to articulate profound ideas with eloquence and clarity, this comprehensive platform delivers sophisticated support calibrated to your unique needs. I would deeply value your discerning perspective and constructive feedback regarding this innovative offering."
  },
  
  poem: {
    writer: "Beneath the stars that pierce the endless night, Where dreams take flight on wings of pure delight, There lives a truth that echoes through the soul, A deeper meaning, making broken spirits whole. In gardens where the moonlight gently falls, And silver shadows dance on weathered walls, The heart discovers what the mind cannot explain, That joy and sorrow intertwine like sun and rain. Each moment holds a thousand hidden threads, Connecting all the living and the deads, A tapestry of beauty, wonder, pain, A symphony of laughter mixed with rain. The world spins slowly, turning day to night, Yet in this darkness shines an inner light, For those who seek with open heart and mind, The greatest treasures wait for those who find.",
    editor: "Beneath the vault of stars that pierce eternal night, Where aspirations soar on wings of pure and bright light, There dwells a truth that resonates throughout the soul, A deeper significance that renders fractured spirits whole. In sacred gardens where the moonbeams gently descend, And luminescent shadows elegantly dance and blend, The heart unveils what rational thought cannot discern, That joy and sorrow gracefully interweave and turn. Each moment holds infinities of hidden, precious thread, Connecting all the living with the honored dead, A magnificent tapestry of splendor, wonder, pain, A harmonious symphony where laughter mingles with rain. The cosmos slowly pirouettes from dawn to dusky night, Yet through this darkness radiates a transcendent light, For seekers who venture with receptive heart and mind, The universe's greatest treasures wait, prepared to find.",
    finisher: "Beneath the transcendent vault of stars that pierce infinity's endless night, Where human aspirations soar upon wings of incandescent, purest light, There dwells an eternal truth that resonates throughout the deepest soul, A profound and ineffable significance rendering fragmented spirits wholly whole. In hallowed gardens where Apollo's moonbeams descend with gentle grace, And luminescent shadows waltz in ethereal, delicate embrace, The human heart unveils what analytical reason cannot comprehend, That boundless joy and sorrow perpetually interweave, dance, and blend. Each singular moment encompasses infinities of gossamer-thin, precious thread, Uniting all the living with the venerated honored dead, Creating magnificent tapestries of splendor, wonder, tears, and pain, Where harmonious symphonies compose as laughter mingles with celestial rain."
  }
};

function getPromptType(userPrompt) {
  const prompt = userPrompt.toLowerCase();
  if (prompt.includes('story') || prompt.includes('tale') || prompt.includes('narrative')) return 'story';
  if (prompt.includes('blog') || prompt.includes('article') || prompt.includes('post')) return 'blog';
  if (prompt.includes('email') || prompt.includes('message') || prompt.includes('letter')) return 'email';
  if (prompt.includes('poem') || prompt.includes('poetry') || prompt.includes('verse')) return 'poem';
  return 'story'; // Default
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
    
    // Determine prompt type from user's request
    const promptType = getPromptType(user);
    
    // Select a demo response based on the agent and prompt type
    let demoKey = 'writer';
    if (system.includes('Editor') || system.includes('polish')) {
      demoKey = 'editor';
    } else if (system.includes('Finisher') || system.includes('final')) {
      demoKey = 'finisher';
    }
    
    // Get the appropriate response for this prompt type and agent
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
