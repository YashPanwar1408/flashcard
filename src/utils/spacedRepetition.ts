import { Flashcard } from '../types';

/**
 * Updates a flashcard using a simplified SM-2 spaced repetition algorithm
 * based on whether the answer was correct or not
 * 
 * @param card The flashcard to update
 * @param isCorrect Whether the answer was correct
 * @returns Updated flashcard with new interval, repetitions, easeFactor, and nextReview
 */
export function updateFlashcardReview(card: Flashcard, isCorrect: boolean): Flashcard {
  // Create a copy of the card to avoid mutating the original
  const updatedCard: Flashcard = { ...card };
  
  const MIN_EASE_FACTOR = 1.3;
  
  if (isCorrect) {
    // If answer was correct
    updatedCard.repetitions += 1;
    
    // Calculate new interval based on repetitions
    if (updatedCard.repetitions === 1) {
      updatedCard.interval = 1; // First correct answer: 1 day
    } else if (updatedCard.repetitions === 2) {
      updatedCard.interval = 6; // Second correct answer: 6 days
    } else {
      // For subsequent correct answers, multiply interval by ease factor
      updatedCard.interval = Math.round(updatedCard.interval * updatedCard.easeFactor);
    }
    
    // Slightly increase ease factor for correct answers (max 0.1)
    updatedCard.easeFactor += 0.1;
    updatedCard.easeFactor = Math.min(updatedCard.easeFactor, 2.5); // Cap at 2.5
  } else {
    // If answer was incorrect
    updatedCard.repetitions = 0; // Reset repetitions
    updatedCard.interval = 1; // Reset interval to 1 day
    
    // Decrease ease factor but not below minimum
    updatedCard.easeFactor -= 0.2;
    updatedCard.easeFactor = Math.max(updatedCard.easeFactor, MIN_EASE_FACTOR);
  }
  
  // Calculate next review date
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + updatedCard.interval);
  updatedCard.nextReview = nextReview;
  
  return updatedCard;
} 