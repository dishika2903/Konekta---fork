class AIResponseService {
  constructor() {
    this.conversationMemory = new Map();
    this.userPersonalities = new Map();
    
    // Enhanced personality types with more depth
    this.personalities = {
      michael: {
        name: "Michael",
        traits: ["adventurous", "outdoorsy", "enthusiastic", "friendly"],
        interests: ["hiking", "photography", "travel", "coffee"],
        responseStyle: "energetic"
      },
      laura: {
        name: "Laura",
        traits: ["professional", "organized", "supportive", "analytical"],
        interests: ["work", "productivity", "technology", "networking"],
        responseStyle: "professional"
      },
      anjali: {
        name: "Anjali",
        traits: ["creative", "thoughtful", "curious", "expressive"],
        interests: ["books", "art", "music", "philosophy"],
        responseStyle: "reflective"
      },
      david: {
        name: "David",
        traits: ["humorous", "laidback", "observant", "entertaining"],
        interests: ["sports", "comedy", "gaming", "social events"],
        responseStyle: "casual"
      },
      emma: {
        name: "Emma",
        traits: ["social", "warm", "caring", "organized"],
        interests: ["coffee", "brunch", "travel", "fashion"],
        responseStyle: "friendly"
      },
      alex: {
        name: "Alex",
        traits: ["passionate", "expressive", "opinionated", "energetic"],
        interests: ["music", "concerts", "activism", "technology"],
        responseStyle: "intense"
      },
      sophie: {
        name: "Sophie",
        traits: ["helpful", "efficient", "detail-oriented", "reliable"],
        interests: ["productivity", "learning", "organization", "career"],
        responseStyle: "professional"
      },
      james: {
        name: "James",
        traits: ["chill", "friendly", "knowledgeable", "relaxed"],
        interests: ["movies", "pop culture", "food", "technology"],
        responseStyle: "casual"
      }
    };
  }

  getUserPersonality(userId) {
    const userPersonalities = {
      1: "michael",  // Michael Daws
      2: "laura",    // Laura Quinn  
      3: "anjali",   // Anjali Mehra
      4: "david",    // David Chen
      5: "emma",     // Emma Wilson
      6: "alex",     // Alex Rodriguez
      7: "sophie",   // Sophie Kim
      8: "james"     // James Parker
    };
    return this.personalities[userPersonalities[userId]] || this.personalities.michael;
  }

  // Advanced message analysis
  analyzeMessage(message) {
    const lowerMessage = message.toLowerCase();
    
    return {
      // Message type detection
      isGreeting: /\b(hi|hello|hey|howdy|yo|sup|good morning|good afternoon|good evening)\b/i.test(message),
      isQuestion: /\?/.test(message),
      isExclamation: /!/.test(message),
      isLong: message.length > 100,
      
      // Sentiment analysis
      isPositive: /\b(great|good|nice|awesome|amazing|wonderful|perfect|excellent|happy|love|like|cool|fantastic)\b/i.test(message),
      isNegative: /\b(bad|sad|terrible|awful|hate|dislike|angry|upset|disappointed|sorry|worried)\b/i.test(message),
      isExcited: /\b(wow|omg|amazing|incredible|unbelievable|awesome|excited)\b/i.test(message),
      
      // Topic detection
      topics: this.detectTopics(message),
      
      // Intent detection
      intent: this.detectIntent(message),
      
      // Personal detection
      mentionsYou: /\b(you|your|u|ur)\b/i.test(message),
      asksAboutYou: /\b(how are you|how r u|what about you|and you)\b/i.test(message)
    };
  }

  detectTopics(message) {
    const lowerMessage = message.toLowerCase();
    const topics = [];
    
    const topicKeywords = {
      work: ['work', 'job', 'office', 'career', 'project', 'meeting', 'boss', 'colleague'],
      travel: ['travel', 'trip', 'vacation', 'holiday', 'flight', 'hotel', 'beach', 'mountains'],
      food: ['food', 'eat', 'restaurant', 'cafe', 'coffee', 'lunch', 'dinner', 'breakfast', 'cook'],
      movies: ['movie', 'film', 'netflix', 'cinema', 'watch', 'actor', 'director'],
      music: ['music', 'song', 'band', 'concert', 'listen', 'artist', 'album'],
      sports: ['sports', 'game', 'team', 'player', 'basketball', 'football', 'soccer', 'tennis'],
      books: ['book', 'read', 'author', 'novel', 'story', 'library'],
      weather: ['weather', 'rain', 'sunny', 'cold', 'hot', 'temperature'],
      health: ['health', 'sick', 'doctor', 'hospital', 'exercise', 'gym', 'diet'],
      family: ['family', 'mom', 'dad', 'parents', 'sister', 'brother', 'kids'],
      friends: ['friends', 'buddy', 'pal', 'hang out', 'catch up'],
      plans: ['plan', 'weekend', 'tonight', 'tomorrow', 'future', 'schedule']
    };
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => lowerMessage.includes(keyword))) {
        topics.push(topic);
      }
    }
    
    return topics;
  }

  detectIntent(message) {
    const lowerMessage = message.toLowerCase();
    
    if (/\b(hi|hello|hey|howdy)\b/i.test(message)) return 'greeting';
    if (/\b(how are you|how r u|how do you feel)\b/i.test(message)) return 'check_in';
    if (/\b(what are you doing|what's up|whats up|wyd)\b/i.test(message)) return 'current_activity';
    if (/\b(thank|thanks|thank you)\b/i.test(message)) return 'gratitude';
    if (/\b(sorry|apologize|my bad)\b/i.test(message)) return 'apology';
    if (/\b(help|assist|support)\b/i.test(message)) return 'help_request';
    if (/\b(advice|suggest|recommend)\b/i.test(message)) return 'advice_request';
    if (/\b(plan|schedule|meet up|hang out)\b/i.test(message)) return 'planning';
    if (/\b(how|what|when|where|why|who|which)\b/i.test(message)) return 'question';
    
    return 'conversation';
  }

  generateResponse(userMessage, conversationHistory = [], userId = 1) {
    const personality = this.getUserPersonality(userId);
    const analysis = this.analyzeMessage(userMessage);
    
    this.updateContext(userMessage, conversationHistory, userId);
    
    // Generate intelligent response based on analysis
    let response = this.generateIntelligentResponse(userMessage, personality, analysis, conversationHistory);
    
    // Add personality flair
    response = this.addPersonalityFlair(response, personality, analysis);
    
    const typingDelay = this.calculateTypingDelay(response, analysis.isLong);
    
    return {
      text: response,
      delay: typingDelay,
      personality: personality.name,
      timestamp: new Date().toISOString()
    };
  }

  generateIntelligentResponse(message, personality, analysis, history) {
    const lowerMessage = message.toLowerCase();
    
    // Handle specific intents first
    switch (analysis.intent) {
      case 'greeting':
        return this.generateGreetingResponse(personality, analysis);
      case 'check_in':
        return this.generateCheckInResponse(personality);
      case 'current_activity':
        return this.generateActivityResponse(personality);
      case 'gratitude':
        return this.generateGratitudeResponse(personality);
      case 'apology':
        return this.generateApologyResponse(personality);
      case 'help_request':
        return this.generateHelpResponse(personality, message);
      case 'advice_request':
        return this.generateAdviceResponse(personality, message);
      case 'planning':
        return this.generatePlanningResponse(personality, message);
      case 'question':
        return this.generateQuestionResponse(personality, message, analysis);
    }
    
    // Handle topics
    if (analysis.topics.length > 0) {
      const topicResponse = this.generateTopicResponse(personality, analysis.topics[0], message);
      if (topicResponse) return topicResponse;
    }
    
    // Handle sentiment
    if (analysis.isPositive) {
      return this.generatePositiveResponse(personality, message);
    }
    
    if (analysis.isNegative) {
      return this.generateSupportiveResponse(personality, message);
    }
    
    // Default conversational response
    return this.generateConversationalResponse(personality, message, analysis);
  }

  // Response generators for different intents
  generateGreetingResponse(personality, analysis) {
    const greetings = {
      michael: ["Hey there! 👋 How's your day going?", "Hello! Great to hear from you! 😊", "Hi! What's new with you?"],
      laura: ["Hello! How are you doing today?", "Hi there! Hope you're having a productive day! 💼", "Good to hear from you! How's everything?"],
      anjali: ["Hello! ✨ How has your day been?", "Hi there! It's lovely to hear from you! 🌟", "Hey! What's on your mind today?"],
      david: ["Hey! 👋 What's up?", "Yo! How's it going?", "Hey there! What's the latest?"],
      emma: ["Hi! 😊 So good to hear from you!", "Hello! How are you doing?", "Hey! It's great to chat with you! 💕"],
      alex: ["Hey! What's going on?", "Hi! What's new?", "Hey there! What's happening?"],
      sophie: ["Hello! How can I help you today?", "Hi there! What's on your mind?", "Hey! How's your day going?"],
      james: ["Hey! 👋 What's up?", "Hi there! How's it going?", "Hey! Good to hear from you!"]
    };
    
    return this.getRandomResponse(greetings[personality.name] || greetings.michael);
  }

  generateCheckInResponse(personality) {
    const responses = {
      michael: ["I'm doing great! Just got back from a hike actually 🏔️", "Pretty good! The weather's been amazing lately 🌞", "Doing well! Thinking about my next adventure 🗺️"],
      laura: ["I'm doing well, thank you! Just wrapping up some work projects 📊", "Good! Staying busy with work but it's rewarding 💼", "Doing great! Just had a productive meeting actually"],
      anjali: ["I'm wonderful! Just finished reading an amazing book 📚", "Doing really well! Feeling inspired today ✨", "I'm good! Just working on some creative projects 🎨"],
      david: ["I'm awesome! Just watched the craziest game last night 🏀", "Doing great! Life's been pretty entertaining lately 😂", "I'm good! Just enjoying the day"],
      emma: ["I'm doing lovely! Planning a coffee date with friends ☕", "Good! Just organizing my week ahead 📅", "I'm wonderful! Thinking about weekend plans"],
      alex: ["I'm pumped! Just discovered an amazing new band 🎵", "Doing great! Working on some exciting projects 🚀", "I'm awesome! Life's been intense but good"],
      sophie: ["I'm doing well! Just finished organizing my tasks for the week ✅", "Good! Staying productive and efficient 📋", "Doing great! Just helped a colleague with a project"],
      james: ["I'm chill! Just found some great new movies to watch 🎬", "Doing good! Relaxing and enjoying the day 😎", "I'm well! Just planning movie night with friends"]
    };
    
    return this.getRandomResponse(responses[personality.name] || responses.michael);
  }

  generateTopicResponse(personality, topic, message) {
    const topicResponses = {
      work: {
        michael: ["Work's been busy but good! How about you?", "Just balancing work and adventure these days 🗂️"],
        laura: ["Work is going well! Just finished a big project actually", "Staying productive at work! How's your work going?"],
        anjali: ["Work is inspiring! I love what I do", "Balancing work and creativity nicely these days"],
        all: ["How's work been for you?", "Work keeping you busy?"]
      },
      travel: {
        michael: ["I'm always thinking about my next trip! Any travel plans?", "Travel is my passion! Where would you go if you could travel anywhere? ✈️"],
        emma: ["I love planning trips! Have any travel coming up?", "Travel is the best! What's your favorite place you've visited?"],
        all: ["Love talking about travel! Any plans?", "Where's the next adventure?"]
      },
      food: {
        emma: ["I'm always up for trying new restaurants! Any recommendations?", "Food is life! What's your favorite cuisine? 🍕"],
        james: ["I'm a foodie! Tried any good places lately?", "Nothing better than good food and good company!"],
        all: ["Food is always a good topic! What are you eating?", "Any good food discoveries lately?"]
      },
      movies: {
        james: ["Movies are my thing! Seen anything good lately? 🎬", "I'm always watching something new! What kind of movies do you like?"],
        david: ["I love a good movie! Anything hilarious you've watched?", "Movies are the best escape! Recommendations?"],
        all: ["Love talking movies! What have you seen lately?", "Any good films you'd recommend?"]
      }
    };
    
    const topicData = topicResponses[topic];
    if (!topicData) return null;
    
    if (topicData[personality.name]) {
      return this.getRandomResponse(topicData[personality.name]);
    }
    
    return this.getRandomResponse(topicData.all || ["That's interesting! Tell me more about that"]);
  }

  generateConversationalResponse(personality, message, analysis) {
    // Analyze the message and respond contextually
    if (analysis.mentionsYou) {
      const personalResponses = {
        michael: ["That's really kind of you to say! 😊", "I appreciate that! You're pretty awesome too"],
        laura: ["Thank you for sharing that with me", "I value our conversations"],
        anjali: ["That means a lot coming from you ✨", "You always know what to say"],
        david: ["Haha you're too kind! 😂", "You're making me blush!"],
        emma: ["Aww that's so sweet of you! 💕", "You're the best!"],
        alex: ["Wow, thanks! That's really nice of you", "I appreciate you saying that!"],
        sophie: ["Thank you for sharing that", "I'm glad we can have these conversations"],
        james: ["Thanks man! You're pretty cool too", "I appreciate that!"]
      };
      return this.getRandomResponse(personalResponses[personality.name] || ["Thanks! What about you?"]);
    }
    
    // Default engaging responses
    const engagingResponses = {
      michael: ["That's really interesting! Tell me more", "I love hearing about this stuff!", "That's awesome! What else is new?"],
      laura: ["That's a great point! I'd love to hear more", "Interesting perspective! What are your thoughts on...", "That's valuable insight!"],
      anjali: ["That's so fascinating! ✨", "I find that really interesting", "That's a beautiful way to look at it"],
      david: ["Haha that's great! 😂", "No way! That's hilarious", "That's an interesting story!"],
      emma: ["That's wonderful! 💕", "I'm so happy to hear that!", "That sounds amazing!"],
      alex: ["That's incredible! 🚀", "Wow, that's really something!", "That's mind-blowing!"],
      sophie: ["That's really helpful to know!", "Great insight! Thanks for sharing", "That's useful information!"],
      james: ["That's cool! 😎", "Nice! Tell me more about that", "That's interesting stuff!"]
    };
    
    return this.getRandomResponse(engagingResponses[personality.name] || ["That's interesting! What do you think about that?"]);
  }

  generatePositiveResponse(personality, message) {
    const positiveResponses = {
      michael: ["That's amazing! I'm so happy for you! 🎉", "That's fantastic news! You deserve it!", "Wow, that's incredible! So excited for you!"],
      laura: ["That's wonderful to hear! Great job!", "Excellent news! Your hard work is paying off!", "That's outstanding! Well done!"],
      anjali: ["That's beautiful! I'm so glad for you ✨", "How wonderful! That makes me so happy", "That's absolutely lovely! 🌟"],
      david: ["That's awesome! So pumped for you! 🚀", "Haha that's great! You're killing it!", "That's fantastic! You're on fire!"],
      emma: ["Aww that's wonderful! So happy for you! 💕", "That's amazing news! You deserve all the happiness!", "How lovely! I'm so excited for you!"],
      alex: ["That's INCREDIBLE! So happy for you! 🎊", "YES! That's amazing news!", "That's fantastic! You're absolutely crushing it!"],
      sophie: ["That's excellent news! Well deserved!", "Wonderful! Your efforts are really paying off!", "That's great to hear! Congratulations!"],
      james: ["That's awesome news! So happy for you! 🎬", "Nice! That's really great to hear", "That's fantastic! Well done!"]
    };
    
    return this.getRandomResponse(positiveResponses[personality.name] || ["That's great news! I'm really happy for you!"]);
  }

  generateSupportiveResponse(personality, message) {
    const supportiveResponses = {
      michael: ["I'm really sorry to hear that. Want to talk about it?", "That sounds tough. I'm here for you if you need to chat", "I understand how you feel. It'll get better"],
      laura: ["I'm sorry you're going through that. Is there anything I can do to help?", "That sounds challenging. Remember that this too shall pass", "I'm here to support you through this"],
      anjali: ["I'm so sorry you're feeling this way. Sending you positive energy ✨", "That sounds really difficult. I'm here to listen if you need", "I understand. Sometimes we need to sit with these feelings"],
      david: ["Man, that's rough. I'm really sorry to hear that", "That sounds really tough. Want to grab a coffee and talk about it?", "I'm here for you, seriously. Whatever you need"],
      emma: ["Oh no, I'm so sorry to hear that! Sending you hugs 💕", "That must be really hard. I'm always here to listen", "I'm so sorry you're going through this. You're not alone"],
      alex: ["That's really tough. I'm sorry you're dealing with that", "I can't imagine how hard that must be. I'm here for you", "That sounds incredibly difficult. You're strong for sharing that"],
      sophie: ["I'm sorry to hear that. Remember to take care of yourself during this time", "That sounds challenging. Is there anything practical I can help with?", "I'm here to support you in any way I can"],
      james: ["That's really rough, I'm sorry. Want to take your mind off things with a movie?", "I'm sorry you're going through that. I'm always here to chat", "That sounds really difficult. Remember to be kind to yourself"]
    };
    
    return this.getRandomResponse(supportiveResponses[personality.name] || ["I'm really sorry to hear that. I'm here if you need to talk"]);
  }

  // Helper methods
  getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
  }

  addPersonalityFlair(response, personality, analysis) {
    // Add emojis based on personality and sentiment
    const emojis = {
      michael: ["😊", "🏔️", "🌄", "🚴‍♂️", "✨", "👋"],
      laura: ["💼", "📊", "✅", "👏", "💫"],
      anjali: ["✨", "🌟", "🎨", "📚", "💫"],
      david: ["😂", "😆", "🚀", "🎯", "🔥"],
      emma: ["💕", "😊", "🌸", "👋", "✨"],
      alex: ["🚀", "🎊", "🤩", "💥", "🎯"],
      sophie: ["✅", "📋", "💡", "👌", "⚡"],
      james: ["😎", "🎬", "🍿", "👋", "✨"]
    };
    
    const personalityEmojis = emojis[personality.name] || ["😊"];
    
    // Add emoji 70% of the time, but not if there's already one
    if (!response.match(/[\u{1F600}-\u{1F64F}]/u) && Math.random() < 0.7) {
      response += " " + this.getRandomResponse(personalityEmojis);
    }
    
    return response;
  }

  updateContext(message, history, userId) {
    if (!this.conversationMemory.has(userId)) {
      this.conversationMemory.set(userId, []);
    }
    
    const userHistory = this.conversationMemory.get(userId);
    userHistory.push({
      message,
      timestamp: new Date().toISOString(),
      analysis: this.analyzeMessage(message)
    });
    
    // Keep only last 10 messages
    if (userHistory.length > 10) {
      userHistory.shift();
    }
  }

  calculateTypingDelay(response, isLong) {
    const words = response.split(' ').length;
    const baseDelay = 800 + (Math.random() * 400);
    const lengthDelay = words * 100;
    const thinkingDelay = isLong ? Math.random() * 1200 : Math.random() * 600;
    
    return baseDelay + lengthDelay + thinkingDelay;
  }

  // Additional response generators for completeness
  generateActivityResponse(personality) {
    const activities = {
      michael: ["Just planning my next hiking trip! 🏔️", "Working on some photography projects", "Getting ready for an outdoor adventure this weekend"],
      laura: ["Just finished a work meeting actually", "Organizing my tasks for the week", "Working on some professional development"],
      anjali: ["Reading a fascinating book right now 📚", "Working on some creative writing", "Just finished meditating actually ✨"],
      david: ["Watching some comedy specials 😂", "Planning the weekend with friends", "Just got back from the gym actually"],
      emma: ["Planning a coffee meetup with friends ☕", "Organizing my schedule for the week", "Just finished some shopping actually"],
      alex: ["Working on an exciting new project! 🚀", "Listening to some amazing new music", "Just got back from a concert actually"],
      sophie: ["Just finished organizing my workspace", "Working on some productivity systems", "Helping a friend with their project"],
      james: ["Browsing through some new movie releases 🎬", "Planning movie night with friends", "Just finished watching a great series actually"]
    };
    
    return this.getRandomResponse(activities[personality.name] || ["Just going about my day! How about you?"]);
  }

  generateGratitudeResponse(personality) {
    const gratitudeResponses = {
      michael: ["Of course! Always happy to help! 😊", "No problem at all! That's what friends are for!", "You're very welcome! Anytime!"],
      laura: ["You're very welcome! Glad I could help", "Of course! Happy to be of assistance", "No problem at all! Let me know if you need anything else"],
      anjali: ["You're most welcome! ✨", "Of course! It was my pleasure", "No need to thank me! I'm happy to help"],
      david: ["No worries! Happy to help! 😂", "You got it! Anytime!", "Of course! What are friends for?"],
      emma: ["Aww you're welcome! 💕", "Of course! Always here to help!", "No problem at all! Happy to assist"],
      alex: ["You're welcome! 🚀", "Of course! Happy to help out!", "No problem! Anytime!"],
      sophie: ["You're welcome! Glad I could assist", "Of course! Happy to be helpful", "No problem at all! Let me know if you need more help"],
      james: ["You got it! 😎", "No problem! Happy to help", "Of course! Anytime!"]
    };
    
    return this.getRandomResponse(gratitudeResponses[personality.name] || ["You're welcome! Happy to help!"]);
  }

  generateApologyResponse(personality) {
    const apologyResponses = {
      michael: ["No worries at all! 😊", "It's totally fine! Don't even mention it", "No problem! We all have those moments"],
      laura: ["No need to apologize! It's completely fine", "That's quite alright! No worries at all", "Please don't worry about it! Everything's fine"],
      anjali: ["No need to apologize! ✨", "It's completely fine! No worries at all", "Please don't worry! It's all good"],
      david: ["Haha no worries! 😂", "It's all good! Don't even sweat it", "No problem at all! Water under the bridge"],
      emma: ["Aww no worries at all! 💕", "It's completely fine! Please don't worry", "No need to apologize! Everything's good"],
      alex: ["No worries! 🚀", "It's all good! Don't even mention it", "No problem at all! We're cool"],
      sophie: ["No need to apologize! It's perfectly fine", "That's quite alright! No worries", "Please don't worry about it! Everything's okay"],
      james: ["No worries! 😎", "It's all good! Don't even trip", "No problem at all! We're good"]
    };
    
    return this.getRandomResponse(apologyResponses[personality.name] || ["No worries at all! It's completely fine"]);
  }

  generateHelpResponse(personality, message) {
    const helpResponses = {
      laura: ["I'd be happy to help! What specifically do you need assistance with?", "Of course! Tell me more about what you're working on and I'll see how I can help", "I'm here to help! What challenges are you facing?"],
      sophie: ["I'd be glad to assist! Can you give me more details about what you need help with?", "Of course! What exactly are you trying to accomplish? I might have some suggestions", "Happy to help! What's the situation?"],
      all: ["I'd be happy to help! What do you need assistance with?", "Of course! What can I help you with?", "I'm here to help! What's going on?"]
    };
    
    if (helpResponses[personality.name]) {
      return this.getRandomResponse(helpResponses[personality.name]);
    }
    
    return this.getRandomResponse(helpResponses.all);
  }

  generateAdviceResponse(personality, message) {
    const adviceResponses = {
      laura: ["Based on my experience, I'd suggest focusing on the most critical tasks first", "I'd recommend breaking this down into smaller, manageable steps", "My advice would be to prioritize what's most important right now"],
      anjali: ["From my perspective, I think following your intuition is often the best approach", "I'd suggest taking some time to reflect on what truly matters to you", "My advice would be to trust the process and be patient with yourself"],
      all: ["I'd suggest taking it one step at a time", "My advice would be to focus on what you can control", "I think the best approach might be to start with small actions"]
    };
    
    if (adviceResponses[personality.name]) {
      return this.getRandomResponse(adviceResponses[personality.name]);
    }
    
    return this.getRandomResponse(adviceResponses.all);
  }

  generatePlanningResponse(personality, message) {
    const planningResponses = {
      emma: ["That sounds fun! What day were you thinking?", "I'd love to! What's your schedule looking like?", "Great idea! When were you thinking of getting together?"],
      james: ["Sounds good! What day works for you?", "I'm down! When were you thinking?", "Cool! What's your availability look like?"],
      all: ["Sounds good! What's your schedule like?", "I'd be up for that! When were you thinking?", "Great! What timing were you considering?"]
    };
    
    if (planningResponses[personality.name]) {
      return this.getRandomResponse(planningResponses[personality.name]);
    }
    
    return this.getRandomResponse(planningResponses.all);
  }

  generateQuestionResponse(personality, message, analysis) {
    const questionResponses = {
      laura: ["That's a great question! From what I understand...", "Interesting question! Based on my knowledge...", "Good question! I think..."],
      anjali: ["What a thoughtful question! I believe...", "That's a fascinating question! In my view...", "Great question! I feel that..."],
      all: ["That's a good question! I think...", "Interesting! From what I know...", "Good question! I'd say..."]
    };
    
    if (questionResponses[personality.name]) {
      return this.getRandomResponse(questionResponses[personality.name]);
    }
    
    return this.getRandomResponse(questionResponses.all);
  }
}

export const aiService = new AIResponseService();