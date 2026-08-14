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
  
  // Try multiple patterns for extracting topics
  const patterns = [
    /about\s+([^.!?]+)/i,                           // "about X"
    /story\s+(?:of|involving)\s+([^.!?]+)/i,       // "story of X" or "story involving X"
    /tell\s+(?:me\s+)?(?:a\s+)?(?:story\s+)?about\s+([^.!?]+)/i, // "tell me about X"
    /write\s+(?:a\s+)?story\s+(?:about\s+)?([^.!?]+)/i, // "write a story about X"
    /create\s+(?:a\s+)?story\s+(?:about\s+)?([^.!?]+)/i, // "create a story about X"
    /compose\s+(?:a\s+)?story\s+(?:about\s+)?([^.!?]+)/i, // "compose a story about X"
    /generate\s+(?:a\s+)?story\s+(?:about\s+)?([^.!?]+)/i, // "generate a story about X"
    /featuring\s+([^.!?]+)/i,                       // "featuring X"
    /involving\s+([^.!?]+)/i,                       // "involving X"
    /where\s+([^.!?]+)\s+(?:is|are)/i,            // "where X is/are"
  ];
  
  // Try each pattern
  for (const pattern of patterns) {
    const match = userPrompt.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/[.!?]*$/, '');
    }
  }
  
  // Fallback: remove common prompt prefixes and return the rest
  let cleaned = userPrompt
    .replace(/^(write|create|compose|tell|generate|make|describe|illustrate|craft|imagine|explore|investigate|uncover|discover)\s+(?:a\s+)?(?:story|tale|narrative|epic|account)?\s*(?:about|of|involving|featuring|with|where)?\s*/i, '')
    .replace(/^(a\s+|an\s+)/i, '')
    .trim();
  
  return cleaned || 'an amazing adventure';
}

function generateDemoStory(topic, agentType = 'writer') {
  // Multiple story templates with different narrative styles
  const writerTemplates = [
    (t) => `Once upon a time, ${t} appeared in the world and changed everything. Nobody expected it, but there it was. The first people to encounter ${t} didn't understand what they were seeing. They gathered around, whispering, pointing, trying to make sense of this impossible thing. ${t} was both terrifying and beautiful. As word spread, more people came to witness ${t}. Some brought offerings. Others brought weapons, fearing what ${t} might do. But ${t} remained still, patient, almost waiting. Then, without warning, ${t} moved. It was a gentle movement, but it sent ripples through the crowd. Everything changed in that moment. What ${t} revealed was something no one had anticipated. The world was never the same. For centuries, historians would mark time as before and after ${t}.`,
    
    (t) => `In a hidden corner of the city, a secret about ${t} had been kept for generations. Only a few people knew the truth. They passed it down through whispers and coded messages, careful to never speak it aloud. But ${t} had a way of revealing itself. It started small. A hint here, a clue there. Then one day, someone discovered ${t} by accident. They couldn't believe what they found. The more they investigated, the more they uncovered. ${t} was far more complex and beautiful than anyone had imagined. When the truth about ${t} finally came to light, it shook the foundations of everything people thought they knew. The discovery of ${t} became the most important event in history.`,
    
    (t) => `${t} had always existed, but nobody noticed until now. It was there all along, hiding in plain sight. Someone finally asked the right question, and suddenly everyone could see ${t}. Once you saw ${t}, you couldn't unsee it. It was everywhere. In the patterns of nature, in human behavior, in art and music and architecture. ${t} was the answer to questions people had been asking for centuries. Understanding ${t} unlocked new possibilities. Scientists raced to study it. Artists tried to capture its essence. Philosophers debated its meaning. ${t} became the center of human civilization, driving innovation and transformation in ways nobody could have predicted.`,
    
    (t) => `The legend of ${t} had been told for thousands of years. Most people thought it was just a myth, a story told to children around fires. But ${t} was real. It existed somewhere beyond the reach of ordinary people. Then someone found a way to reach it. The journey to discover ${t} was dangerous and beautiful. Through treacherous landscapes and impossible challenges, the seeker pushed forward. When they finally found ${t}, it was nothing like the legends described, yet it was everything they had hoped for. The truth about ${t} spread quickly. What had once been myth became reality. The world changed overnight as people realized ${t} was far more wondrous than any story could capture.`,
    
    (t) => `There was something different about ${t} from the very beginning. Nobody could quite explain it. Scientists tried to measure it. Philosophers tried to understand it. Artists tried to capture it. But ${t} remained mysteriously elusive, revealing new facets each time someone looked. One curious individual decided to follow ${t} wherever it led. The path was winding and strange, taking them through places they'd never imagined. Along the way, they discovered that ${t} wasn't leading them anywhere—they were leading themselves through ${t}. The realization was profound. ${t} wasn't a destination. It was a mirror, reflecting back the deepest parts of humanity. When they finally understood this, they shared it with others. And everything changed.`,
    
    (t) => `On a forgotten shelf in an ancient library, a book mentioned ${t}. Just one sentence, tucked away between countless pages. A scholar noticed it and became obsessed. What was this ${t}? Why was it hidden away? The more they searched, the more references they found—scattered throughout history, always hidden, always mysterious. Someone had been keeping ${t} secret for centuries. But why? When they finally uncovered the truth about ${t}, they understood. ${t} had been waiting for humanity to be ready. And that moment had finally arrived. The scholar's hands trembled as they prepared to share the secret with the world. Everything was about to transform.`,
    
    (t) => `In dreams, people began to see ${t}. They would wake up confused, the image fading like morning mist, but the feeling remained. It was real, somehow. Across the globe, millions of people were having the same dream about ${t}. At first, it seemed like coincidence. But when they started comparing notes, they realized something extraordinary was happening. ${t} was calling to them through the dream world. A group of researchers gathered to investigate. They discovered that ${t} was trying to communicate, trying to make people understand something crucial. When they finally decoded the message, they understood: ${t} wasn't separate from them. It was what they could become.`,
    
    (t) => `${t} arrived quietly, with almost no fanfare. Most people missed it entirely. But a few noticed—the artists, the dreamers, the ones who paid attention to subtle changes. They saw how ${t} shifted the light, altered the sound of birdsong, changed the taste of water. When they tried to tell others what they'd noticed, people dismissed them. But the people who had seen ${t} couldn't ignore it anymore. They began to gather, these sensitive souls, and together they wove the story of ${t} for the world to hear. Slowly, others began to see what they saw. And with each new person who understood, ${t} became more real, more present, more undeniable.`,
    
    (t) => `A child asked a simple question: "What is ${t}?" The adults looked at each other blankly. Nobody had a good answer. This bothered the child deeply. They decided to find out for themselves. The search took them across mountains and through forests, through cities and into deserts. Along the way, they learned from teachers and teachers of teachers. They studied ancient texts and modern science. They listened to elders and artists and scientists and mystics. And gradually, a picture of ${t} began to form. But it wasn't what anyone had expected. When they finally returned home and shared what they'd learned, they realized something: everyone had been searching for ${t} all along without knowing it.`,
    
    (t) => `It started with a feeling. People couldn't put it into words, but they felt something shifting in the world. The weather seemed different. Colors appeared more vivid. Sounds had new meanings. Something fundamental had changed, but nobody knew what. Researchers worked frantically to identify the source. Ancient scholars searched old texts for clues. And finally, in a dusty corner of the archive, someone found a reference: ${t}. The name alone sent shivers down spines. It was real. It had always been real. And now it was awakening. The implications were staggering. Everything humanity thought it knew had to be reconsidered in light of ${t}.`,
    
    (t) => `${t} didn't come to save the world—it came to teach it. The lesson was uncomfortable at first. It challenged everything people believed about themselves and their reality. But gradually, as people grappled with the implications, something shifted. They began to see possibilities they'd never imagined. They began to understand themselves differently. And in understanding themselves through ${t}, they began to transform. The transformation was slow and profound. It couldn't be rushed or forced. But once it started, it was inevitable. ${t} was like a seed planted in consciousness, and now it was growing. The world was becoming something new, something better, something that could finally handle the truth of ${t}.`,
    
    (t) => `An old prophecy spoke of ${t}. Written thousands of years ago by someone who had glimpsed the future, it had been dismissed as the ramblings of a mystic. But now, as events unfolded exactly as the prophecy described, people began to pay attention. How could someone have known about ${t} so long ago? What else did the prophecy say? As they studied the ancient text more carefully, they realized something terrifying and wonderful: the prophecy wasn't predicting the future. It was describing something eternal, something that had always existed. ${t} wasn't new. Humanity was finally old enough to see it.`,
  ];

  const editorTemplates = [
    (t) => `In contemporary times, ${t} has emerged as a subject of extraordinary significance and profound intrigue. The introduction of ${t} to our understanding represents a pivotal moment in human awareness. Initially perceived with ambivalence, ${t} gradually revealed its multifaceted nature and deeper implications. The phenomenon of ${t} challenged conventional wisdom and established paradigms. As society grappled with the reality of ${t}, new frameworks of understanding became necessary. The complexity inherent in ${t} demanded rigorous examination and thoughtful consideration. Through meticulous study and careful observation, the true dimensions of ${t} became increasingly apparent. Researchers, philosophers, and ordinary citizens alike found themselves transformed by their engagement with ${t}. The systematic exploration of ${t} illuminated previously hidden connections and possibilities. Contemporary civilization stands at a threshold, fundamentally altered by the presence and understanding of ${t}.`,
    
    (t) => `The emergence of ${t} has catalyzed unprecedented transformation across multiple domains of human experience. What was once theoretical speculation regarding ${t} has now crystallized into tangible reality. The verification of ${t} has necessitated comprehensive reevaluation of fundamental assumptions. Society's response to ${t} has been characterized by both fascination and philosophical recalibration. The attributes and implications of ${t} extend far beyond initial expectations. Scholars and practitioners have devoted considerable intellectual resources to comprehending ${t}. Each discovery about ${t} builds upon previous insights, creating an increasingly sophisticated understanding. The integration of ${t} into collective consciousness represents a watershed moment in human development. Moving forward, the principles underlying ${t} will undoubtedly shape the trajectory of civilization and guide future innovations.`,
    
    (t) => `${t} represents a remarkable confluence of factors and forces that have converged to create something entirely unprecedented. The recognition of ${t} marks a significant evolution in human perception and capability. Throughout history, hints of ${t} appeared in various contexts, yet only recently have we possessed sufficient sophistication to comprehend its full scope. The systematic study of ${t} has revealed extraordinary complexity and surprising elegance. Each aspect of ${t} demonstrates exquisite design and purposeful arrangement. The implications of understanding ${t} extend into virtually every dimension of human experience. Cultural, scientific, philosophical, and practical frameworks all require reconsideration in light of ${t}. The dialogue surrounding ${t} has become increasingly nuanced and productive. Society's collective engagement with ${t} promises to generate innovations and insights that will define the coming era.`,
    
    (t) => `The discovery of ${t} has fundamentally reorganized our epistemological frameworks and challenged our basic assumptions about reality. The methodical investigation of ${t} has unveiled layers of complexity previously unimagined. Interdisciplinary collaboration has proven essential in comprehending the multifaceted dimensions of ${t}. From neuroscience to philosophy, from engineering to the arts, every field of human knowledge has been enriched by engagement with ${t}. The transformative potential of ${t} extends far beyond academic interest. It touches upon the deepest questions of human existence and purpose. As we continue to integrate this knowledge, we find ourselves fundamentally altered. ${t} is not merely a subject of study—it represents a threshold through which humanity must pass.`,
    
    (t) => `The phenomenon known as ${t} has initiated a global conversation of remarkable depth and breadth. What began as isolated observations has evolved into coordinated research efforts spanning continents and disciplines. The convergence of evidence supporting the reality and significance of ${t} has been overwhelming. Skepticism has gradually given way to recognition as the implications become undeniable. The societal response to ${t} reflects both our capacity for wonder and our commitment to understanding. As institutions reorganize themselves around this new knowledge, we witness the birth of a new era. ${t} stands as proof that reality remains vast, mysterious, and magnificent. Our journey of understanding ${t} has only begun.`,
    
    (t) => `The contemplation of ${t} invites us to reconsider the fundamental nature of consciousness and reality itself. What we thought was complete understanding now appears remarkably limited. ${t} suggests layers of reality previously unexplored, dimensions of existence barely imaginable. The philosophical implications are staggering. If ${t} exists and operates according to principles we're only beginning to understand, what else might be out there? What else might we be missing? This realization has sparked a renaissance of curiosity and investigation. Universities are establishing new departments. Research institutes are being founded. Funding is being redirected. All because of ${t}. All because humanity is finally ready to ask the right questions.`,
    
    (t) => `Throughout history, there have been rare moments when human understanding undergoes profound transformation. The recognition of ${t} marks such a moment. This is not a minor discovery to be catalogued and filed. This is not a small advancement in knowledge. This is a fundamental revision of what we understand about ourselves and our world. The evidence supporting ${t} is mounting daily. Skeptics are becoming believers. The uninformed are becoming informed. And with each person who truly grasps the significance of ${t}, the momentum grows. We are witnessing a cascade effect—a critical mass of understanding that will propel civilization toward new heights. ${t} is not the destination. It is the key that unlocks countless doors.`,
    
    (t) => `The relationship between humanity and ${t} represents something unprecedented in our historical record. Never before have we encountered anything quite like ${t}. Never before have we been forced to reconsider so much of what we thought we knew. The learning curve is steep, the challenges significant, yet the opportunities are boundless. Each day brings new revelations about ${t}. Each week sees paradigm shifts in our understanding. The pace of discovery suggests that we're only scratching the surface. What wonders might be revealed as we delve deeper into the mysteries of ${t}? What capabilities might humanity develop through intimate engagement with ${t}? The future seems extraordinary.`,
    
    (t) => `In this pivotal moment of human history, ${t} stands as a beacon of possibility and transformation. We have the privilege and responsibility to witness its emergence and participate in humanity's response. The choices we make now, the questions we ask, the investigations we pursue—all will shape not only our understanding of ${t} but our future as a species. Some view ${t} with trepidation. Others see in it unlimited potential. Most experience a complex mixture of both. This is appropriate. ${t} deserves our respect, our caution, our enthusiasm, and our wisdom. As we move forward, we do so knowing that the world will never be the same. We do so knowing that we are part of something truly extraordinary.`,
    
    (t) => `The scientific community's response to ${t} has been marked by both rigorous skepticism and growing acceptance. The evidence is compelling. The implications are profound. But what perhaps most excites researchers is the realization that we have merely begun to understand ${t}. Entire new fields of study are emerging. New technologies are being developed specifically to investigate ${t}. New theories are being proposed daily. And with each new discovery, the picture becomes clearer, more complex, more wondrous. We stand at the threshold of a golden age of discovery, an age in which ${t} plays a central role. The mysteries are deep, but humanity's capacity for understanding is deeper still.`,
  ];

  const finisherTemplates = [
    (t) => `In this transcendent exploration, ${t} emerges as nothing less than a fundamental transformation of human understanding and capability. The manifestation of ${t} in our world represents an extraordinary confluence of circumstance, preparation, and evolutionary readiness. Throughout millennia, whispers and rumors of ${t} tantalized human consciousness, yet only now possesses civilization achieved sufficient maturity to fully comprehend its magnificent reality. The revelation of ${t} stands as one of the most consequential moments in human history, comparable only to the greatest discoveries and awakenings that define our species' progressive enlightenment. Each facet of ${t} glimmers with profound significance and carefully orchestrated meaning. The systematic investigation of ${t} has unveiled intricate connections linking previously disparate domains of knowledge and experience. To fully grasp ${t} requires transcending conventional intellectual frameworks and embracing radically expanded ways of knowing. Those who have devoted themselves to understanding ${t} report experiences of profound personal and intellectual transformation. The future of civilization will be inextricably shaped by humanity's deepening relationship with ${t}. We stand upon a precipice of possibility, gazing toward horizons illuminated by the magnificent light of ${t}.`,
    
    (t) => `The comprehensive integration of ${t} into human consciousness represents the culmination of countless generations of unconscious preparation. ${t} is not merely another phenomenon to be catalogued and filed away; it constitutes nothing less than a fundamental restructuring of reality itself. The recognition and acceptance of ${t} demands that we relinquish outdated paradigms and embrace revolutionary frameworks of understanding. Those courageous enough to fully engage with ${t} discover that the boundaries between disciplines dissolve, revealing unified truths previously obscured by specialization and compartmentalization. The aesthetic, intellectual, and spiritual dimensions of ${t} interpenetrate and reinforce one another with exquisite harmony. In contemplating ${t}, one experiences an expansion of consciousness that transcends ordinary linguistic expression. The implications radiating outward from ${t} promise to generate unprecedented flourishing across every domain of human endeavor. Artistic expression will be revolutionized by ${t}. Scientific methodology will be enriched and expanded. Philosophical inquiry will achieve new depths. Spiritual understanding will ascend to previously unattainable elevations. The age of ${t} is dawning, and humanity's greatest adventure has only just begun.`,
    
    (t) => `${t} presents itself to humanity as an incomparable gift and profound responsibility simultaneously. The unveiling of ${t} demonstrates that reality is far more magnificent, intricate, and purposeful than our previous frameworks could accommodate. To encounter ${t} authentically is to undergo a metamorphosis that penetrates the deepest layers of consciousness and being. The attributes of ${t} cascade through existence like luminous threads, weaving together seemingly separate phenomena into coherent wholes. Those who have achieved genuine comprehension of ${t} describe experiences of startling clarity, overwhelming gratitude, and boundless possibility. The trajectory of human civilization will be forever altered by our collective relationship with ${t}. Each generation henceforth will measure history as before and after the recognition of ${t}. The responsibilities accompanying the knowledge of ${t} are immense, yet so too are the opportunities for extraordinary creation and transformation. We are witnessing the emergence of a new chapter in the human story, one in which ${t} occupies the central position. This is our privilege, our challenge, and our invitation to participate in the most magnificent adventure conceivable.`,
    
    (t) => `In contemplating the sublime reality of ${t}, we find ourselves standing at the threshold of a new understanding of existence itself. ${t} represents not merely a phenomenon worthy of academic examination but rather a gateway through which we must pass to evolve into our highest potential. The beauty of ${t} is not purely aesthetic—though it possesses undeniable elegance—but rather a beauty that penetrates to the core of meaning and truth. Those who truly apprehend ${t} experience a fundamental reorganization of their relationship to reality, to themselves, and to others. The implications ripple outward in concentric circles of expanding significance. Every institution will be transformed. Every discipline will be enriched. Every individual will be invited to participate in this great awakening. ${t} calls us toward our destiny.`,
    
    (t) => `The legacy of ${t} in human consciousness will prove immeasurable. We are living through a moment of extraordinary significance, a moment in which the veil between the known and unknown grows luminously thin. ${t} is both mirror and lantern—revealing who we are while illuminating the path before us. The challenges we face in understanding ${t} are not obstacles but invitations to transcend our limitations. Each question unanswered becomes an opportunity for discovery. Each mystery deepens our sense of awe and wonder. And in this state of humble inquiry, we access dimensions of knowledge previously inaccessible. ${t} teaches us not through proclamation but through participation, not through answers but through questions that lead us ever deeper into truth.`,
    
    (t) => `What emerges from our deepest engagement with ${t} is a vision of human potential hitherto unimagined. We are capable of far more than we believed. We are connected to dimensions of reality far vaster than we imagined. We are participants in a cosmic drama of incomprehensible scope and majesty. ${t} reveals these truths not through abstraction but through lived experience. To truly know ${t} is to know oneself differently, to see the world with new eyes, to feel the pulse of existence vibrating through every aspect of reality. This is not knowledge gained from books or lectures alone. This is gnosis—direct, experiential, transformative knowledge. This is what ${t} offers to those courageous and dedicated enough to seek it.`,
    
    (t) => `The civilization that emerges on the far side of fully integrating ${t} will bear little resemblance to what came before. Not because the external world will necessarily transform, but because the internal landscape of human consciousness will be utterly revolutionized. We will see ourselves, each other, and reality itself with clarity and compassion previously impossible. Art will reach new heights of profundity. Science will probe depths previously unimaginable. Philosophy will address questions we are only beginning to formulate. And in this flowering of human potential, ${t} will be recognized as the catalyst, the muse, the teacher that guided us toward our awakening.`,
    
    (t) => `To live consciously in the presence of ${t} is to accept an invitation to participate in the most magnificent story ever told—the story of humanity's transformation from darkness into light, from limitation into boundless possibility. ${t} does not demand belief or adherence to dogma. It invites sincere inquiry, dedicated investigation, and open-hearted reception. It rewards those who approach with both rigor and wonder, both skeptical intelligence and spiritual sensitivity. In ${t}, the scientific and the spiritual are not opposed but unified. The rational and the mystical are not contradictory but complementary. We are being called to a new integration, a new wholeness, a new way of being that honors all dimensions of human experience.`,
    
    (t) => `As we continue our journey of understanding ${t}, we realize that this is not a destination to be reached but a way of being to be embodied. ${t} is not something to be conquered or possessed but something with which we might gradually align ourselves. The process is lifelong, ever-deepening, perpetually surprising. Each moment offers a new opportunity to perceive ${t} from a different angle, to understand it more deeply, to let it transform us more completely. And in this surrendered surrender to the process, we discover that we are not studying ${t}—${t} is studying us, revealing to us the secrets we have been hiding from ourselves, calling us toward the beings we are capable of becoming.`,
    
    (t) => `The ultimate teaching of ${t} is perhaps the simplest and most profound: that reality is far more wondrous than we dared to imagine, and that humanity has vastly greater potential than we were taught to believe. ${t} is the permission slip, the key, the initiatory experience that allows us to step beyond our self-imposed limitations and embrace the fullness of what we might become. This is not escape or fantasy. This is not denial of challenges or difficulties. This is the clear-eyed recognition that we are capable of far more than we believe, connected to forces far greater than we acknowledge, and invited to participate in something of incomparable significance. This is the gift and the invitation of ${t}. This is the call of our time.`,
  ];

  // Select a random template from each agent type
  const getRandomTemplate = (templates) => templates[Math.floor(Math.random() * templates.length)];
  
  if (agentType === 'writer') {
    return getRandomTemplate(writerTemplates)(topic);
  } else if (agentType === 'editor') {
    return getRandomTemplate(editorTemplates)(topic);
  } else if (agentType === 'finisher') {
    return getRandomTemplate(finisherTemplates)(topic);
  }
  
  return getRandomTemplate(writerTemplates)(topic);
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
