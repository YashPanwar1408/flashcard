'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Flashcard } from '@/types';
import { loadFlashcards, saveFlashcards } from '@/utils/localStorage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, MessageSquare } from 'lucide-react';
import FlashcardReview from '@/components/FlashcardReview';

function ReviewContent() {
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [reviewComplete, setReviewComplete] = useState<boolean>(false);
  const [reviewedCount, setReviewedCount] = useState<number>(0);
  const searchParams = useSearchParams();
  const deckParam = searchParams.get('deck');

  // Load due cards from localStorage on component mount
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const allCards = loadFlashcards();
        
        // Filter for due cards (and optionally by deck)
        let filtered = allCards.filter(card => {
          const cardDueDate = new Date(card.nextReview);
          const now = new Date();
          
          cardDueDate.setHours(0, 0, 0, 0);
          now.setHours(0, 0, 0, 0);
          
          return cardDueDate <= now;
        });
        
        // Filter by deck if specified
        if (deckParam) {
          filtered = filtered.filter(card => card.deck === deckParam);
        }
        
        // Sort by oldest due date first
        filtered.sort((a, b) => 
          new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
        );
        
        setDueCards(filtered);
        setIsLoading(false);
      } catch (error) {
        console.error('Error loading due cards:', error);
        setIsLoading(false);
      }
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [deckParam]);

  const handleCardReviewed = (updatedCard: Flashcard) => {
    // Save the updated card
    const allCards = loadFlashcards();
    const updatedCards = allCards.map(c => 
      c.id === updatedCard.id ? updatedCard : c
    );
    saveFlashcards(updatedCards);
    
    // Move to the next card
    setReviewedCount(prev => prev + 1);
    
    if (currentCardIndex < dueCards.length - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // Review session complete
      setReviewComplete(true);
    }
  };
  
  const restartReview = () => {
    // Refresh due cards
    const allCards = loadFlashcards();
    
    let filtered = allCards.filter(card => {
      const cardDueDate = new Date(card.nextReview);
      const now = new Date();
      
      cardDueDate.setHours(0, 0, 0, 0);
      now.setHours(0, 0, 0, 0);
      
      return cardDueDate <= now;
    });
    
    if (deckParam) {
      filtered = filtered.filter(card => card.deck === deckParam);
    }
    
    filtered.sort((a, b) => 
      new Date(a.nextReview).getTime() - new Date(b.nextReview).getTime()
    );
    
    setDueCards(filtered);
    setCurrentCardIndex(0);
    setReviewComplete(false);
    setReviewedCount(0);
  };
  
  if (isLoading) {
    return (
      <div className="container py-10 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-foreground">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="container py-10 px-4">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <Calculator className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">No Cards Due</h2>
            <p className="text-muted-foreground mb-6">
              {deckParam 
                ? `There are no cards due for review in the &quot;${deckParam}&quot; deck.`
                : "You're all caught up! There are no cards due for review."}
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (reviewComplete) {
    return (
      <div className="container py-10 px-4">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center">
            <MessageSquare className="h-12 w-12 mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2 text-foreground">Review Complete!</h2>
            <p className="text-muted-foreground mb-6">
              You&apos;ve successfully reviewed {reviewedCount} cards.
            </p>
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
              
              {dueCards.length > 0 && (
                <Button 
                  onClick={restartReview}
                >
                  Review More Cards
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6 text-foreground">
          {deckParam ? `Studying: ${deckParam}` : 'Review Cards'}
        </h1>
        
        <div className="text-sm text-muted-foreground mb-6 flex justify-between">
          <span>Card {currentCardIndex + 1} of {dueCards.length}</span>
          <span>{reviewedCount} reviewed</span>
        </div>
        
        <FlashcardReview 
          card={dueCards[currentCardIndex]} 
          onCardReviewed={handleCardReviewed}
        />
      </div>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="container py-10 px-4 flex items-center justify-center min-h-[80vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
} 