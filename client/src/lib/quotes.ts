// ============================================================
// CallistheniX – Motivational Quotes
// Inspiring messages to keep users energized between exercises
// ============================================================

export const motivationalQuotes = [
  // General motivation
  "Your body can stand almost anything. It's your mind you need to convince.",
  "The pain you feel today will be the strength you feel tomorrow.",
  "Every rep is a choice. Choose to be stronger.",
  "Sweat is just your fat crying.",
  "Don't count the days. Make the days count.",
  "Your only limit is you.",
  "Discipline is choosing between what you want now and what you want most.",
  "The hardest part is showing up. You've already done that.",
  "Progress is progress, no matter how small.",
  "You don't have to be great to start, but you have to start to be great.",

  // Calisthenics specific
  "Bodyweight training: your gym is everywhere, your excuse is nowhere.",
  "Calisthenics builds not just muscles, but mental toughness.",
  "Master your bodyweight, master yourself.",
  "No equipment needed, just determination.",
  "Your bodyweight is your most honest trainer.",
  "Calisthenics: the art of moving your body with purpose.",
  "Every pull-up brings you closer to your goals.",
  "Push-ups don't lie. They show your true strength.",
  "Planks are temporary, abs are forever.",
  "Squats are the foundation of strength.",

  // Between exercises motivation
  "Rest is part of the process. You're getting stronger right now.",
  "Take a breath. You're doing amazing.",
  "This is where champions are made.",
  "One more set. You've got this.",
  "Feel the burn. That's progress.",
  "Your future self will thank you for this effort.",
  "Tired is temporary. Pride is forever.",
  "You're stronger than your excuses.",
  "This workout is an investment in yourself.",
  "Every drop of sweat is worth it.",

  // Mindset
  "Believe in yourself and you're halfway there.",
  "The only bad workout is the one you didn't do.",
  "Success is the sum of small efforts repeated day in and day out.",
  "Your limitations are only in your mind.",
  "Strength doesn't come from what you can do. It comes from overcoming what you thought you couldn't.",
  "Pain is weakness leaving the body.",
  "You are capable of so much more than you think.",
  "Every challenge is an opportunity to grow.",
  "Consistency beats intensity every single time.",
  "You're not just training your body, you're training your mind.",

  // Encouragement
  "Keep pushing. You're almost there.",
  "This is the moment that defines you.",
  "You're tougher than this workout.",
  "Show this exercise who's boss.",
  "Your potential is limitless.",
  "This is what dedication looks like.",
  "You're building a stronger version of yourself.",
  "Don't stop now. You're on fire.",
  "This is your time to shine.",
  "You've got the power within you.",
];

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}

export function getQuoteByIndex(index: number): string {
  return motivationalQuotes[index % motivationalQuotes.length];
}
