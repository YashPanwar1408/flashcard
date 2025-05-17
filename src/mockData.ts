import { Flashcard } from './types';

// Get today's date
const today = new Date();

// Helper function to add days to a date
const addDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() + days);
  return newDate;
};

// Helper function to subtract days from a date
const subtractDays = (date: Date, days: number): Date => {
  const newDate = new Date(date);
  newDate.setDate(date.getDate() - days);
  return newDate;
};

// Format date as YYYY-MM-DD
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    question: 'What is a closure in JavaScript?',
    answer: 'A closure is a function that has access to its own scope, the outer function\'s variables, and global variables.',
    deck: 'JavaScript',
    nextReview: today, // Due today
    interval: 1,
    easeFactor: 2.5,
    repetitions: 3
  },
  {
    id: '2',
    question: 'What is hoisting in JavaScript?',
    answer: 'Hoisting is JavaScript\'s default behavior of moving declarations to the top of their containing scope during compilation.',
    deck: 'JavaScript',
    nextReview: addDays(today, 2), // Due in 2 days
    interval: 2,
    easeFactor: 2.2,
    repetitions: 1
  },
  {
    id: '3',
    question: 'What is the value of π (pi) to 5 decimal places?',
    answer: '3.14159',
    deck: 'Math',
    nextReview: today, // Due today
    interval: 1,
    easeFactor: 2.3,
    repetitions: 2
  },
  {
    id: '4',
    question: 'What is the derivative of x²?',
    answer: '2x',
    deck: 'Math',
    nextReview: addDays(today, 3), // Due in 3 days
    interval: 3,
    easeFactor: 2.5,
    repetitions: 4
  },
  {
    id: '5',
    question: 'What is the past tense of "go"?',
    answer: 'Went',
    deck: 'English',
    nextReview: today, // Due today
    interval: 1,
    easeFactor: 2.1,
    repetitions: 1
  },
  {
    id: '6',
    question: 'What is the difference between "affect" and "effect"?',
    answer: '"Affect" is usually a verb meaning to influence something, while "effect" is usually a noun meaning the result of something.',
    deck: 'English',
    nextReview: addDays(today, 1), // Due tomorrow
    interval: 1,
    easeFactor: 2.0,
    repetitions: 2
  },
  {
    id: '7',
    question: 'What does the "this" keyword refer to in JavaScript?',
    answer: 'The "this" keyword refers to the object it belongs to, but its value depends on where it is used.',
    deck: 'JavaScript',
    nextReview: addDays(today, 5), // Due in 5 days
    interval: 5,
    easeFactor: 2.7,
    repetitions: 5
  },
  {
    id: '8',
    question: 'What is the Pythagorean theorem?',
    answer: 'In a right-angled triangle, the square of the hypotenuse equals the sum of the squares of the other two sides (a² + b² = c²).',
    deck: 'Math',
    nextReview: today, // Due today
    interval: 1,
    easeFactor: 2.4,
    repetitions: 2
  }
];

// Generate mock review statistics for the past 7 days
export const mockReviewStats = Array.from({ length: 7 }, (_, i) => {
  const date = subtractDays(today, 6 - i);
  // Generate a random number of reviews between 0 and 15
  const count = Math.floor(Math.random() * 16);
  
  return {
    date: formatDate(date),
    count,
  };
}); 