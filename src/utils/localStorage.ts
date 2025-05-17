import { Flashcard } from "../types";
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
    const storedData = localStorage.getItem(FLASHCARDS_STORAGE_KEY);
    
    if (!storedData) {
      // Initialize localStorage with mock data on first load
      saveFlashcards(mockFlashcards);
      return mockFlashcards;
    }

    // Parse stored flashcards and convert string dates back to Date objects
    const parsedData: Flashcard[] = JSON.parse(storedData).map((card: any) => ({
      ...card,
      nextReview: new Date(card.nextReview)
    }));
    
    return parsedData;
  } catch (error) {
    console.error("Error loading flashcards from localStorage:", error);
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
    console.error("Error saving flashcards to localStorage:", error);
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
  const cards = loadFlashcards();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return cards.filter(card => {
    const cardDate = new Date(card.nextReview);
    cardDate.setHours(0, 0, 0, 0);
    return cardDate <= today;
  });
};

/**
 * Get unique decks from all flashcards
 */
export const getDecks = (): string[] => {
  const cards = loadFlashcards();
  return Array.from(new Set(cards.map(card => card.deck)));
}; 