import React, { useState, useEffect, useRef } from 'react';

const promptCategories = {
  emotional: [
    { text: "What emotion are you avoiding right now, and why?", credit: "Emotional Awareness", mood: "contemplative" },
    { text: "Describe a feeling you're having without judging it as good or bad.", credit: "Mindful Acceptance", mood: "calm" },
    { text: "What would you say to comfort a friend feeling exactly what you're feeling right now?", credit: "Self-Compassion", mood: "nurturing" },
    { text: "Write about a time when you felt completely safe and at peace.", credit: "Emotional Memory", mood: "peaceful" },
    { text: "What does your inner critic sound like? Now, what would your inner friend say instead?", credit: "Inner Voice Work", mood: "reflective" },
    { text: "If your current emotion had a color, shape, and texture, what would it be?", credit: "Emotion Visualization", mood: "creative" },
    { text: "What boundaries do you need to set to protect your emotional well-being?", credit: "Emotional Boundaries", mood: "empowering" },
    { text: "Describe a moment when you felt truly understood by someone.", credit: "Connection Memory", mood: "warm" }
  ],
  healing: [
    { text: "What part of this still needs more kindness?", credit: "Healing Focus", mood: "gentle" },
    { text: "Write a letter of forgiveness to yourself for something you've been carrying.", credit: "Self-Forgiveness", mood: "releasing" },
    { text: "What would healing look like for you today? Not tomorrow, not next year, but today.", credit: "Present Healing", mood: "hopeful" },
    { text: "Describe a wound that has become a source of wisdom or strength.", credit: "Post-Traumatic Growth", mood: "triumphant" },
    { text: "What permission do you need to give yourself to heal?", credit: "Healing Permission", mood: "liberating" },
    { text: "If your pain could speak, what would it want you to know?", credit: "Pain Dialogue", mood: "deep" },
    { text: "Write about someone who made you feel worthy of love exactly as you are.", credit: "Unconditional Love", mood: "loved" },
    { text: "What small act of healing can you offer yourself right now?", credit: "Micro-Healing", mood: "nurturing" }
  ],
  mindfulness: [
    { text: "Describe what you notice in your body right now, without changing anything.", credit: "Body Awareness", mood: "present" },
    { text: "What are five things you can see, four you can hear, three you can touch, two you can smell, and one you can taste?", credit: "5-4-3-2-1 Grounding", mood: "grounded" },
    { text: "Write about this moment as if you're experiencing it for the very first time.", credit: "Beginner's Mind", mood: "wonder" },
    { text: "What thoughts keep visiting your mind today? Welcome them like guests, then let them go.", credit: "Thought Observer", mood: "flowing" },
    { text: "Describe your breathing right now. Is it shallow or deep? Fast or slow? No judgment, just awareness.", credit: "Breath Awareness", mood: "centered" },
    { text: "What would you notice if you approached this day with gentle curiosity instead of judgment?", credit: "Curious Awareness", mood: "open" },
    { text: "Write about a simple pleasure you experienced today that you almost missed.", credit: "Present Moment Joy", mood: "grateful" },
    { text: "If you could send love to every part of yourself right now, where would you start?", credit: "Loving-Kindness", mood: "compassionate" }
  ],
  gratitude: [
    { text: "What are three things you're grateful for right now?", credit: "Daily Gratitude", mood: "thankful" },
    { text: "Write about someone who showed you unexpected kindness recently.", credit: "Kindness Recognition", mood: "warm" },
    { text: "What challenge are you grateful for because of how it helped you grow?", credit: "Growth Gratitude", mood: "appreciative" },
    { text: "Describe a part of your body you're grateful for and why.", credit: "Body Appreciation", mood: "accepting" },
    { text: "What small comfort brought you peace today?", credit: "Simple Comforts", mood: "content" },
    { text: "Write a thank you note to a part of yourself that's been working hard lately.", credit: "Self-Appreciation", mood: "loving" },
    { text: "What skill or ability do you have that you sometimes take for granted?", credit: "Ability Gratitude", mood: "proud" },
    { text: "Describe a moment today when you felt connected to something larger than yourself.", credit: "Connection Gratitude", mood: "connected" }
  ],
  selfCare: [
    { text: "How did you show kindness to yourself today?", credit: "Self-Kindness", mood: "gentle" },
    { text: "What does your soul need right now that you haven't been giving it?", credit: "Soul Needs", mood: "introspective" },
    { text: "If you treated yourself the way you treat your best friend, what would change?", credit: "Friend Treatment", mood: "compassionate" },
    { text: "What activity makes you lose track of time in the best way?", credit: "Flow State", mood: "joyful" },
    { text: "Write about a way you can nurture yourself that doesn't cost money.", credit: "Free Self-Care", mood: "resourceful" },
    { text: "What would 'good enough' look like today instead of perfect?", credit: "Perfectionism Release", mood: "accepting" },
    { text: "How can you make your environment more supportive of your well-being?", credit: "Environment Care", mood: "nurturing" },
    { text: "What's one habit you'd like to release and one you'd like to embrace?", credit: "Habit Reflection", mood: "intentional" }
  ],
  inspiration: [
    { text: "Hope is a good thing, maybe the best of things. – The Shawshank Redemption", credit: "The Shawshank Redemption", mood: "hopeful" },
    { text: "You are not the darkness you endured. You are the light that refused to surrender.", credit: "Unknown", mood: "triumphant" },
    { text: "There is no secret ingredient. It's just you. – Kung Fu Panda", credit: "Kung Fu Panda", mood: "empowering" },
    { text: "What would you tell your younger self today?", credit: "Wisdom Sharing", mood: "wise" },
    { text: "You have been assigned this mountain to show others it can be moved.", credit: "Purpose", mood: "determined" },
    { text: "What strength have you discovered within yourself that surprised you?", credit: "Hidden Strength", mood: "proud" },
    { text: "If you knew you couldn't fail, what would you try?", credit: "Fearless Exploration", mood: "bold" },
    { text: "How has your story given you wisdom that only you can share?", credit: "Unique Wisdom", mood: "meaningful" }
  ],
  whisper: [
    { text: "What secret does your heart whisper to you in the quiet moments?", credit: "Heart Whispers", mood: "intimate" },
    { text: "If silence could speak, what would it tell you about yourself?", credit: "Silent Wisdom", mood: "profound" },
    { text: "What truth are you afraid to acknowledge?", credit: "Hidden Truth", mood: "vulnerable" },
    { text: "Describe the voice inside you that knows exactly what you need.", credit: "Inner Knowing", mood: "intuitive" },
    { text: "What would you do if no one was watching or judging?", credit: "Authentic Self", mood: "free" },
    { text: "Write about a dream that keeps calling to you.", credit: "Dream Calling", mood: "aspirational" },
    { text: "What does your intuition keep trying to tell you?", credit: "Intuitive Voice", mood: "listening" },
    { text: "If your future self could whisper one thing to you right now, what would it be?", credit: "Future Wisdom", mood: "visionary" }
  ]
};

// Dynamic background system based on mood/tone
const backgroundScenes = {
  // Nordic/Scandinavian scenes
  peaceful: [
    "https://source.unsplash.com/1920x1080/?norwegian,fjord,calm",
    "https://source.unsplash.com/1920x1080/?scandinavian,lake,mirror",
    "https://source.unsplash.com/1920x1080/?finland,forest,misty"
  ],
  contemplative: [
    "https://source.unsplash.com/1920x1080/?nordic,mountains,fog",
    "https://source.unsplash.com/1920x1080/?iceland,landscape,moody",
    "https://source.unsplash.com/1920x1080/?norway,clouds,dramatic"
  ],
  hopeful: [
    "https://source.unsplash.com/1920x1080/?aurora,northern,lights",
    "https://source.unsplash.com/1920x1080/?nordic,sunrise,golden",
    "https://source.unsplash.com/1920x1080/?scandinavia,spring,bright"
  ],
  calm: [
    "https://source.unsplash.com/1920x1080/?scandinavian,beach,serene",
    "https://source.unsplash.com/1920x1080/?nordic,water,still",
    "https://source.unsplash.com/1920x1080/?finland,winter,quiet"
  ],
  empowering: [
    "https://source.unsplash.com/1920x1080/?mountain,peak,triumph",
    "https://source.unsplash.com/1920x1080/?nordic,cliff,strong",
    "https://source.unsplash.com/1920x1080/?scandinavian,glacier,powerful"
  ],
  // Ocean scenes
  flowing: [
    "https://source.unsplash.com/1920x1080/?ocean,waves,gentle",
    "https://source.unsplash.com/1920x1080/?sea,rhythm,peaceful",
    "https://source.unsplash.com/1920x1080/?water,movement,calm"
  ],
  deep: [
    "https://source.unsplash.com/1920x1080/?ocean,deep,blue",
    "https://source.unsplash.com/1920x1080/?sea,mysterious,vast",
    "https://source.unsplash.com/1920x1080/?underwater,serene,blue"
  ],
  // Forest scenes
  nurturing: [
    "https://source.unsplash.com/1920x1080/?forest,green,nurturing",
    "https://source.unsplash.com/1920x1080/?woodland,gentle,light",
    "https://source.unsplash.com/1920x1080/?trees,protective,warm"
  ],
  grounded: [
    "https://source.unsplash.com/1920x1080/?forest,earth,roots",
    "https://source.unsplash.com/1920x1080/?woodland,stable,strong",
    "https://source.unsplash.com/1920x1080/?nature,foundation,solid"
  ],
  // Default and special moods
  default: [
    "https://source.unsplash.com/1920x1080/?nordic,nature,beautiful",
    "https://source.unsplash.com/1920x1080/?scandinavian,landscape,serene",
    "https://source.unsplash.com/1920x1080/?nature,peaceful,healing"
  ],
  triumphant: [
    "https://source.unsplash.com/1920x1080/?summit,victory,achievement",
    "https://source.unsplash.com/1920x1080/?mountain,top,success",
    "https://source.unsplash.com/1920x1080/?peak,triumph,golden"
  ]
};

// Flatten all prompts into a single array for random selection
const allPrompts = Object.values(promptCategories).flat();

function App() {
  const [promptIndex, setPromptIndex] = useState(-1);
  const [currentEntry, setCurrentEntry] = useState('');
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('journal_entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [clock, setClock] = useState(new Date());
  const [lanternMode, setLanternMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCategories, setShowCategories] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [promptCount, setPromptCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const [currentMood, setCurrentMood] = useState('default');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [showPorsche, setShowPorsche] = useState(false);
  
  const videoRef = useRef(null);
  const textareaRef = useRef(null);

  // Google Drive direct download links
  const lanternVideoUrl = "https://drive.google.com/uc?export=download&id=1bnfuQ-FbE7aR058A8FjK8CkaY_fLmaPW";
  const pineIconUrl = "https://drive.google.com/uc?export=download&id=19WFoF3nz4y9P1ezBzOSyQbf-TRsWGHq0";
  const porscheImageUrl = "https://drive.google.com/uc?export=download&id=1UZ29pzNh9f_iQrn_Xfd2nQYG59XtKsfq";

  const getFormattedDate = () =>
    clock.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long', 
      day: 'numeric', 
      year: 'numeric'
    });

  const getFormattedTime = () =>
    clock.toLocaleTimeString('en-US', {
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true
    });

  // Real-time clock
  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize background
  useEffect(() => {
    updateBackgroundForMood('default');
  }, []);

  // Activity tracking for auto-save
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentEntry.trim() && Date.now() - lastActivity > 30000) { // 30 seconds
        autoSave();
      }
    }, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, [currentEntry, lastActivity]);

  // Video setup for lantern mode
  useEffect(() => {
    if (lanternMode && videoRef.current) {
      videoRef.current.play().catch(console.log);
    }
  }, [lanternMode]);

  // Local storage for entries
  useEffect(() => {
    localStorage.setItem('journal_entries', JSON.stringify(entries));
  }, [entries]);

  // Update background based on mood
  const updateBackgroundForMood = (mood) => {
    const scenes = backgroundScenes[mood] || backgroundScenes.default;
    const randomScene = scenes[Math.floor(Math.random() * scenes.length)];
    setBackgroundImage(randomScene);
    setCurrentMood(mood);
  };

  // Typing indicator
  const handleTextChange = (e) => {
    setCurrentEntry(e.target.value);
    setIsTyping(true);
    setLastActivity(Date.now());
    setTimeout(() => setIsTyping(false), 1000);
    
    // Analyze mood from text (basic sentiment analysis)
    const text = e.target.value.toLowerCase();
    let detectedMood = 'default';
    
    if (text.includes('grateful') || text.includes('thankful') || text.includes('blessed')) {
      detectedMood = 'grateful';
    } else if (text.includes('calm') || text.includes('peace') || text.includes('serene')) {
      detectedMood = 'calm';
    } else if (text.includes('hope') || text.includes('better') || text.includes('improve')) {
      detectedMood = 'hopeful';
    } else if (text.includes('deep') || text.includes('profound') || text.includes('soul')) {
      detectedMood = 'deep';
    } else if (text.includes('flow') || text.includes('rhythm') || text.includes('movement')) {
      detectedMood = 'flowing';
    } else if (text.includes('strong') || text.includes('power') || text.includes('triumph')) {
      detectedMood = 'empowering';
    }
    
    if (detectedMood !== currentMood && text.length > 50) {
      updateBackgroundForMood(detectedMood);
    }
  };

  // Auto-focus textarea
  const focusTextarea = () => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  // Enhanced prompt generation with mood-based backgrounds
  const showPrompt = (category = null, isWhisper = false) => {
    let promptsToUse;
    
    if (isWhisper) {
      promptsToUse = promptCategories.whisper;
    } else if (category && category !== 'all') {
      promptsToUse = promptCategories[category];
    } else {
      promptsToUse = allPrompts;
    }
    
    let next;
    do {
      next = Math.floor(Math.random() * promptsToUse.length);
    } while (
      promptsToUse[next] === (promptIndex >= 0 ? allPrompts[promptIndex] : null) && 
      promptsToUse.length > 1
    );
    
    const selectedPrompt = promptsToUse[next];
    const promptInAllPrompts = allPrompts.findIndex(p => p.text === selectedPrompt.text);
    setPromptIndex(promptInAllPrompts);
    setPromptCount(prev => prev + 1);
    
    // Update background based on prompt mood
    if (selectedPrompt.mood) {
      updateBackgroundForMood(selectedPrompt.mood);
    }
    
    // Surprise trigger (every 10th prompt or Porsche reference)
    if (promptCount > 0 && promptCount % 10 === 0) {
      setTimeout(() => triggerSurprise(), 2000);
    }
    
    focusTextarea();
  };

  // Surprise element trigger with Porsche
  const triggerSurprise = () => {
    setShowSurprise(true);
    setShowPorsche(true);
    showNotification("🎉 Surprise! You've been consistent with your journaling - like the precision of a Porsche 911!");
    setTimeout(() => {
      setShowSurprise(false);
      setShowPorsche(false);
    }, 6000);
  };

  // Manual Porsche surprise
  const triggerPorscheSurprise = () => {
    setShowPorsche(true);
    setBackgroundImage(porscheImageUrl);
    showNotification("🏎️ Sometimes beauty appears in unexpected moments... like a perfectly engineered machine.");
    setTimeout(() => setShowPorsche(false), 5000);
  };

  // Enhanced save with metadata
  const saveEntry = () => {
    if (!currentEntry.trim()) {
      showNotification('✍️ Please write something before saving!');
      return;
    }

    const wordCount = currentEntry.trim().split(/\s+/).length;
    const charCount = currentEntry.length;
    const estimatedReadTime = Math.ceil(wordCount / 200);

    const newEntry = {
      id: Date.now(),
      content: currentEntry,
      date: new Date().toISOString(),
      prompt: promptIndex >= 0 ? allPrompts[promptIndex] : null,
      wordCount,
      charCount,
      estimatedReadTime,
      mood: currentMood,
      backgroundUsed: backgroundImage,
      tags: extractTags(currentEntry)
    };

    setEntries(prev => [newEntry, ...prev]);
    setCurrentEntry('');
    setPromptIndex(-1);
    showNotification('✅ Entry saved successfully!');
    
    // Achievement notifications
    if (entries.length + 1 === 5) {
      setTimeout(() => showNotification('🌟 Achievement: 5 entries! You\'re building a beautiful practice.'), 1500);
    } else if (entries.length + 1 === 10) {
      setTimeout(() => showNotification('🏆 Achievement: 10 entries! Your healing journey is taking shape.'), 1500);
    }
  };

  // Auto-save functionality
  const autoSave = () => {
    if (currentEntry.trim() && currentEntry.length > 50) {
      const draft = {
        content: currentEntry,
        timestamp: new Date().toISOString(),
        prompt: promptIndex >= 0 ? allPrompts[promptIndex] : null,
        mood: currentMood
      };
      localStorage.setItem('journal_draft', JSON.stringify(draft));
      showNotification('📝 Draft auto-saved');
    }
  };

  // Extract hashtags and keywords
  const extractTags = (text) => {
    const hashtags = text.match(/#\w+/g) || [];
    const emotions = ['happy', 'sad', 'angry', 'peaceful', 'anxious', 'grateful', 'hopeful', 'frustrated', 'calm', 'excited'];
    const foundEmotions = emotions.filter(emotion => 
      text.toLowerCase().includes(emotion)
    );
    return [...hashtags, ...foundEmotions];
  };

  // Enhanced download with better formatting
  const downloadEntry = () => {
    if (!currentEntry.trim()) {
      showNotification('❌ No content to download!');
      return;
    }

    const timestamp = new Date().toLocaleString();
    const wordCount = currentEntry.trim().split(/\s+/).length;
    const prompt = promptIndex >= 0 ? allPrompts[promptIndex] : null;
    
    const header = `
NORTHERN JOURNAL ENTRY
======================
Date: ${timestamp}
Words: ${wordCount}
Mood: ${currentMood}
${prompt ? `Prompt: ${prompt.text}\nSource: ${prompt.credit}\n` : ''}
======================

`;

    const content = header + currentEntry + '\n\n---\nGenerated by Northern Journal - Veenkoti Studios\n"Healing begins in silence."';
    
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `northern-journal-${new Date().toISOString().split('T')[0]}-${Date.now()}.txt`;
    a.click();
    showNotification('📥 Entry downloaded successfully!');
  };

  // Download all entries with enhanced formatting
  const downloadAllEntries = () => {
    if (entries.length === 0) {
      showNotification('❌ No entries to download!');
      return;
    }

    const totalWords = entries.reduce((sum, entry) => sum + entry.wordCount, 0);
    const header = `
NORTHERN JOURNAL - COMPLETE COLLECTION
=====================================
Total Entries: ${entries.length}
Total Words: ${totalWords}
Export Date: ${new Date().toLocaleString()}
=====================================

`;

    const content = entries.map((entry, index) => {
      const date = new Date(entry.date).toLocaleString();
      const prompt = entry.prompt ? `Prompt: ${entry.prompt.text}\n` : '';
      const metadata = `Words: ${entry.wordCount} | Characters: ${entry.charCount || 'N/A'} | Read Time: ${entry.estimatedReadTime || 'N/A'} min | Mood: ${entry.mood || 'N/A'}`;
      
      return `ENTRY ${entries.length - index}
${'-'.repeat(50)}
Date: ${date}
${prompt}${metadata}

${entry.content}

${'='.repeat(50)}

`;
    }).join('');

    const footer = '\n---\nGenerated by Northern Journal - Veenkoti Studios\n"Healing begins in silence."';
    const fullContent = header + content + footer;

    const blob = new Blob([fullContent], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `northern-journal-complete-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    showNotification('📤 All entries downloaded!');
  };

  // Enhanced copy with formatting
  const copyEntry = () => {
    if (!currentEntry.trim()) {
      showNotification('❌ No content to copy!');
      return;
    }
    
    const prompt = promptIndex >= 0 ? `Prompt: ${allPrompts[promptIndex].text}\n\n` : '';
    const timestamp = `Written on ${new Date().toLocaleString()}\nMood: ${currentMood}\n\n`;
    const fullContent = timestamp + prompt + currentEntry;
    
    navigator.clipboard.writeText(fullContent).then(() => {
      showNotification('📋 Entry copied to clipboard!');
    }).catch(() => {
      showNotification('❌ Failed to copy to clipboard');
    });
  };

  // Delete entry with confirmation
  const deleteEntry = (id) => {
    if (window.confirm('Are you sure you want to delete this entry? This action cannot 