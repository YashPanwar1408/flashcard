'use client';

import { Flashcard } from '@/types';
import { mockFlashcards } from "../mockData";

const FLASHCARDS_STORAGE_KEY = "flashcards";

/**
 * Load flashcards from localStorage or return mock data if none exists
 */
export const loadFlashcards = (): Flashcard[] => {
  if (typeof window === 'undefined') {
    return mockFlashcards; // Return mock data on server-side
  }

  try {
    const savedData = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
    
    if (!savedData) {
      // Initialize localStorage with mock data on first load
      saveFlashcards(mockFlashcards);
      return mockFlashcards;
    }
    
    const parsedData = JSON.parse(savedData);
    
    // Convert string dates back to Date objects
    return parsedData.map((card: Flashcard) => ({
      ...card,
      nextReview: new Date(card.nextReview)
    }));
  } catch (error) {
    console.error('Failed to load flashcards from localStorage:', error);
    return mockFlashcards;
  }
};

/**
 * Save flashcards to localStorage
 */
export const saveFlashcards = (flashcards: Flashcard[]): void => {
  if (typeof window === 'undefined') {
    return; // Don't attempt to save on server-side
  }

  try {
    localStorage.setItem(FLASHCARDS_STORAGE_KEY, JSON.stringify(flashcards));
  } catch (error) {
    console.error('Failed to save flashcards to localStorage:', error);
  }
};

/**
 * Update a single flashcard in the collection
 */
export const updateFlashcard = (updatedCard: Flashcard): Flashcard[] => {
  const cards = loadFlashcards();
  
  const updatedCards = cards.map(card => 
    card.id === updatedCard.id ? updatedCard : card
  );
  
  saveFlashcards(updatedCards);
  return updatedCards;
};

/**
 * Get cards due for review today
 */
export const getDueCards = (): Flashcard[] => {
  const allCards = loadFlashcards();
  const now = new Date();
  now.setHours(0, 0, 0, 0); // Compare dates by day only
  
  return allCards.filter(card => {
    const nextReview = new Date(card.nextReview);
    nextReview.setHours(0, 0, 0, 0);
    return nextReview <= now;
  });
};

/**
 * Get unique decks from all flashcards
 */
export const getDecks = (): string[] => {
  const cards = loadFlashcards();
  const decks = new Set(cards.map(card => card.deck));
  return Array.from(decks);
}; 