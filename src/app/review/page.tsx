'use client';

import React, { useState, useEffect } from 'react';
import { Flashcard } from '../../types';
import FlashcardReview from '../../components/FlashcardReview';
import Link from 'next/link';
import { getDueCards, updateFlashcard, getDecks } from '../../utils/localStorage';
import { getDeckBgColor, getDeckTextColor } from '../../utils/deckColors';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { BadgeCheck } from 'lucide-react';

export default function ReviewPage() {
  const [allDueCards, setAllDueCards] = useState<Flashcard[]>([]);
  const [filteredCards, setFilteredCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [reviewedCards, setReviewedCards] = useState<Flashcard[]>([]);
  const [isReviewComplete, setIsReviewComplete] = useState(false);
  const [selectedDeck, setSelectedDeck] = useState<string | null>(null);
  const [decks, setDecks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Get the deck parameter from URL if available
  const searchParams = useSearchParams();
  const deckParam = searchParams.get('deck');

  // Load cards due today and available decks on component mount
  useEffect(() => {
    // Use setTimeout to ensure this runs on client-side only
    const timeoutId = setTimeout(() => {
      const dueCards = getDueCards();
      const availableDecks = Array.from(new Set(dueCards.map(card => card.deck)));
      
      setAllDueCards(dueCards);
      setDecks(availableDecks);
      
      // If deck parameter exists, set it as selected deck
      if (deckParam && availableDecks.includes(deckParam)) {
        setSelectedDeck(deckParam);
      }
      
      setIsLoading(false);
      
      if (dueCards.length === 0) {
        setIsReviewComplete(true);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [deckParam]);

  // Filter cards when deck selection changes
  useEffect(() => {
    if (selectedDeck) {
      const deckCards = allDueCards.filter(card => card.deck === selectedDeck);
      setFilteredCards(deckCards);
      setCurrentCardIndex(0);
      
      if (deckCards.length === 0) {
        setIsReviewComplete(true);
      } else {
        setIsReviewComplete(false);
      }
    } else {
      setFilteredCards(allDueCards);
      setCurrentCardIndex(0);
      
      if (allDueCards.length === 0) {
        setIsReviewComplete(true);
      } else {
        setIsReviewComplete(false);
      }
    }
  }, [selectedDeck, allDueCards]);

  const handleCardReviewed = (updatedCard: Flashcard) => {
    // Update the card in localStorage
    updateFlashcard(updatedCard);
    
    // Add the updated card to reviewed cards
    setReviewedCards(prev => [...prev, updatedCard]);
    
    // Update the card in the allDueCards array to keep state consistent
    setAllDueCards(prev => 
      prev.map(card => card.id === updatedCard.id ? updatedCard : card)
    );
    
    // Move to the next card
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
    } else {
      setIsReviewComplete(true);
    }
  };

  const handleDeckSelect = (deck: string | null) => {
    setSelectedDeck(deck);
  };

  // Calculate progress percentage
  const progressPercent = filteredCards.length > 0 
    ? Math.round((currentCardIndex / filteredCards.length) * 100)
    : 0;

  // Create tag components for deck filtering
  const DeckTags = () => (
    <div className="flex flex-wrap gap-2 mb-6 justify-center">
      <Button
        variant={selectedDeck === null ? "default" : "outline"}
      className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform"
        onClick={() => handleDeckSelect(null)}
      >
        All Decks
      </Button>
      
      {decks.map(deck => {
        const isSelected = selectedDeck === deck;
        const bgColor = isSelected ? getDeckBgColor(deck) : '';
        const textColor = isSelected ? getDeckTextColor(deck) : '';
        
        return (
          <Button
            key={deck}
            variant={isSelected ? "default" : "outline"}
            className={`rounded-full text-sm shadow-sm ${
              isSelected ? `${bgColor} ${textColor} transform scale-105` : ''
            }`}
            onClick={() => handleDeckSelect(deck)}
          >
            {deck}
          </Button>
        );
      })}
    </div>
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 px-4 min-h-screen flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center p-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
            <h2 className="font-semibold">Loading flashcards...</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isReviewComplete) {
    return (
      <div className="container mx-auto py-10 px-4 min-h-screen flex flex-col items-center justify-center">
        <Card className="w-full max-w-lg overflow-hidden">
          <div className="bg-green-500 h-2 w-full"></div>
          <CardContent className="p-8 text-center">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <BadgeCheck className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-bold mb-6">Review Complete!</h1>
            
            {selectedDeck && (
              <>
                <p className="mb-6 text-lg text-muted-foreground">
                  No more cards due today in the <span className="font-semibold">{selectedDeck}</span> deck.
                </p>
                <DeckTags />
              </>
            )}
            
            {!selectedDeck && (
              <p className="mb-6 text-lg text-muted-foreground">
                You've reviewed {reviewedCards.length} flashcards today.
              </p>
            )}
            
            <div className="mt-8">
              <Button asChild size="lg" className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform">
                <Link href="/">Return to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (filteredCards.length === 0) {
    return (
      <div className="container mx-auto py-10 px-4 min-h-screen flex flex-col items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold mb-6">No Cards to Review</h1>
            <p className="text-muted-foreground mb-6">
              There are no cards due for review at the moment.
            </p>
            <Button asChild className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform">
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 md:py-10 px-4 min-h-screen">
      <div className="max-w-lg mx-auto">
        {/* Progress bar */}
        <div className="w-full bg-muted h-2.5 rounded-full overflow-hidden mb-6">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl md:text-2xl font-bold">
            Review {currentCardIndex + 1} of {filteredCards.length}
          </h1>
          <span className="text-muted-foreground text-sm">
            {progressPercent}% complete
          </span>
        </div>
        
        <DeckTags />
        
        <FlashcardReview
          card={filteredCards[currentCardIndex]}
          onCardReviewed={handleCardReviewed}
        />
        
        <div className="mt-8 text-center">
          <Button variant="link" asChild className="bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform">
            <Link href="/">Return to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 