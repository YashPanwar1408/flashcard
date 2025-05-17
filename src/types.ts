/**
 * Type definitions for the flashcard application
 */

export type Flashcard = {
  id: string;
  question: string;
  answer: string;
  deck: string;
  nextReview: Date;
  interval: number; // days until next review
  easeFactor: number; // multiplier for spacing algorithm
  repetitions: number; // number of successful reviews
}; 