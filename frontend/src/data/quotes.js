// 50 Stoic Quotes for Daily Motivation
export const quotes = [
  {
    text: "The happiness of your life depends upon the quality of your thoughts.",
    author: "Marcus Aurelius",
  },
  {
    text: "We suffer more often in imagination than in reality.",
    author: "Seneca",
  },
  {
    text: "Man conquers the world by conquering himself.",
    author: "Zeno of Citium",
  },
  { text: "No man is free who is not master of himself.", author: "Epictetus" },
  {
    text: "The soul becomes dyed with the color of its thoughts.",
    author: "Marcus Aurelius",
  },
  {
    text: "It is not the man who has too little, but the man who craves more, that is poor.",
    author: "Seneca",
  },
  {
    text: "First say to yourself what you would be; and then do what you have to do.",
    author: "Epictetus",
  },
  {
    text: "He who fears death will never do anything worth of a man who is alive.",
    author: "Seneca",
  },
  {
    text: "The key is to keep company only with people who uplift you.",
    author: "Epictetus",
  },
  {
    text: "Waste no more time arguing about what a good man should be. Be one.",
    author: "Marcus Aurelius",
  },
  {
    text: "Difficulties strengthen the mind, as labor does the body.",
    author: "Seneca",
  },
  {
    text: "You have power over your mind - not outside events. Realize this, and you will find strength.",
    author: "Marcus Aurelius",
  },
  {
    text: "True happiness is to enjoy the present, without anxious dependence upon the future.",
    author: "Seneca",
  },
  {
    text: "If a man knows not to which port he sails, no wind is favorable.",
    author: "Seneca",
  },
  {
    text: "Begin at once to live, and count each separate day as a separate life.",
    author: "Seneca",
  },
  { text: "Never let the future disturb you.", author: "Marcus Aurelius" },
  {
    text: "How long are you going to wait before you demand the best for yourself?",
    author: "Epictetus",
  },
  {
    text: "The impediment to action advances action. What stands in the way becomes the way.",
    author: "Marcus Aurelius",
  },
  {
    text: "Luck is what happens when preparation meets opportunity.",
    author: "Seneca",
  },
  { text: "He who is brave is free.", author: "Seneca" },
  {
    text: "Be tolerant with others and strict with yourself.",
    author: "Marcus Aurelius",
  },
  {
    text: "It is not that we have a short time to live, but that we waste a lot of it.",
    author: "Seneca",
  },
  {
    text: "Make the best use of what is in your power, and take the rest as it happens.",
    author: "Epictetus",
  },
  {
    text: "The best revenge is not to be like your enemy.",
    author: "Marcus Aurelius",
  },
  { text: "What we do now echoes in eternity.", author: "Marcus Aurelius" },
  {
    text: "If you want to improve, be content to be thought foolish and stupid.",
    author: "Epictetus",
  },
  {
    text: "The greater the difficulty, the more glory in surmounting it.",
    author: "Epictetus",
  },
  {
    text: "People are not disturbed by things, but by the views they take of them.",
    author: "Epictetus",
  },
  {
    text: "Wealth consists not in having great possessions, but in having few wants.",
    author: "Epictetus",
  },
  {
    text: "Accept the things to which fate binds you.",
    author: "Marcus Aurelius",
  },
  {
    text: "Life is very short and anxious for those who forget the past.",
    author: "Seneca",
  },
  {
    text: "He suffers more than necessary, who suffers before it is necessary.",
    author: "Seneca",
  },
  {
    text: "Hang on to your youthful enthusiasms - you'll be able to use them better when you're older.",
    author: "Seneca",
  },
  {
    text: "The whole future lies in uncertainty: live immediately.",
    author: "Seneca",
  },
  {
    text: "It is the power of the mind to be unconquerable.",
    author: "Seneca",
  },
  {
    text: "A gem cannot be polished without friction, nor a man perfected without trials.",
    author: "Seneca",
  },
  {
    text: "Dwell on the beauty of life. Watch the stars, and see yourself running with them.",
    author: "Marcus Aurelius",
  },
  {
    text: "The only way to escape the personal corruption of praise is to go on working.",
    author: "Marcus Aurelius",
  },
  { text: "Don't explain your philosophy. Embody it.", author: "Epictetus" },
  { text: "Only the educated are free.", author: "Epictetus" },
  {
    text: "Associate with people who are likely to improve you.",
    author: "Seneca",
  },
  {
    text: "Very little is needed to make a happy life; it is all within yourself.",
    author: "Marcus Aurelius",
  },
  { text: "Sometimes even to live is an act of courage.", author: "Seneca" },
  { text: "No great thing is created suddenly.", author: "Epictetus" },
  {
    text: "When you arise in the morning, think of what a precious privilege it is to be alive.",
    author: "Marcus Aurelius",
  },
  { text: "The obstacle is the way.", author: "Marcus Aurelius" },
  {
    text: "Curb your desire - don't set your heart on so many things and you will get what you need.",
    author: "Epictetus",
  },
  {
    text: "We are more often frightened than hurt; and we suffer more from imagination than from reality.",
    author: "Seneca",
  },
  {
    text: "Remember that very little is needed to make a happy life.",
    author: "Marcus Aurelius",
  },
  {
    text: "Freedom is the only worthy goal in life. It is won by disregarding things that lie beyond our control.",
    author: "Epictetus",
  },
];

// Get a random quote
export const getRandomQuote = () => {
  const index = Math.floor(Math.random() * quotes.length);
  return quotes[index];
};
