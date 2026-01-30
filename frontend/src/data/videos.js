// YouTube Video IDs for Emergency/SOS Section
// Categories: Meditation, Motivation, Self-Improvement, Discipline

export const videos = [
  // Meditation & Calm
  { id: "inpok4MKVLM", title: "5-Minute Meditation" },
  { id: "z6X5oEIg6Ak", title: "Relaxing Music for Stress Relief" },
  { id: "ZToicYcHIOU", title: "10 Minute Guided Meditation" },

  // David Goggins - Discipline & Mental Toughness
  { id: "5tSTk1083VY", title: "David Goggins - Stay Hard" },
  { id: "TLKxdTmk-zc", title: "David Goggins - Motivation" },
  { id: "78I9dTB9vqM", title: "Goggins on Suffering" },

  // Self-Improvement & Motivation
  { id: "g-jwWYX7Jlo", title: "Best Motivational Speech" },
  { id: "IdTMDpizis8", title: "Why You Need Discipline" },
  { id: "7Oxz060iedY", title: "The Power of Habit" },
  { id: "mgmVOuLgFB0", title: "Jordan Peterson - Clean Your Room" },

  // NoFap Specific / Self-Control
  { id: "Vtp31feyTfM", title: "Your Brain on Porn" },
  { id: "wSF82AwSDiU", title: "Dopamine Detox" },
  { id: "DkS1pkKpILY", title: "The Science of Self-Control" },

  // Stoicism & Philosophy
  { id: "Hu0xDtK3g3Q", title: "Marcus Aurelius - How To Think" },
  { id: "2bGuU4krojo", title: "Stoic Philosophy Explained" },

  // Fitness & Energy
  { id: "wnHW6o8WMas", title: "Morning Workout Motivation" },
  { id: "xvFZjo5PgG0", title: "The Rock - Morning Routine" },
];

// Get a random video
export const getRandomVideo = () => {
  const index = Math.floor(Math.random() * videos.length);
  return videos[index];
};

// Shuffle videos array
export const getShuffledVideos = () => {
  const shuffled = [...videos];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
