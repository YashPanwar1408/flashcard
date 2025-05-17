'use client';

import React, { useState } from 'react';
import { Flashcard } from '../types';
import { updateFlashcardReview } from '../utils/spacedRepetition';
import { getDeckBgColor } from '../utils/deckColors';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle } from 'lucide-react';

interface FlashcardReviewProps {
  card: Flashcard;
  onCardReviewed: (updatedCard: Flashcard) => void;
}

export default function FlashcardReview({ 
  card, 
  onCardReviewed
}: FlashcardReviewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleFlip = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsFlipped(!isFlipped);
    
    // Reset animating state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 700);
  };

  const handleResponse = (isCorrect: boolean) => {
    const updatedCard = updateFlashcardReview(card, isCorrect);
    onCardReviewed(updatedCard);
    setIsFlipped(false);
  };

  // Get consistent colors for the deck
  const deckBgColor = getDeckBgColor(card.deck);

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="mb-6">
        <Badge variant="outline" className="mb-2">
          {card.deck}
        </Badge>
        <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all ${deckBgColor}`}
            style={{ width: `${(card.repetitions / 5) * 100}%` }}
          ></div>
        </div>
      </div>

      <div className="perspective-1000 relative h-[450px] w-full mb-6">
        <div 
          className={`relative w-full h-full transform-style-3d transition-transform duration-700 ${
            isFlipped ? 'rotate-y-180' : ''
          }`}
        >
          {/* Front of card */}
          <Card className="absolute w-full h-full backface-hidden shadow-lg overflow-hidden border-2 flashcard-front">
            <CardHeader className={`${deckBgColor} text-center`}>
              <h3 className="text-xl font-semibold text-white">Question</h3>
            </CardHeader>
            
            <CardContent className="flex items-center justify-center p-8 md:p-12">
              <div className="text-center max-w-full">
                <p className="flashcard-question text-lg md:text-xl">{card.question}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-center p-6">
              <Button
                onClick={handleFlip}
                size="lg"
                className={`${deckBgColor} text-white hover:opacity-90 transition-all transform hover:scale-105 active:scale-95`}
              >
                Show Answer
              </Button>
            </CardFooter>
          </Card>
          
          {/* Back of card */}
          <Card className="absolute w-full h-full backface-hidden shadow-lg overflow-hidden border-2 rotate-y-180 flashcard-back">
            <CardHeader className={`${deckBgColor} text-center`}>
              <h3 className="text-xl font-semibold text-white">Answer</h3>
            </CardHeader>
            
            <CardContent className="flex items-center justify-center p-8 md:p-12">
              <div className="text-center max-w-full">
                <p className="flashcard-answer text-lg md:text-xl">{card.answer}</p>
              </div>
            </CardContent>
            
            <CardFooter className="flex justify-between p-6">
              <Button
                onClick={() => handleResponse(false)}
                variant="outline"
                className="flex-1 mr-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                size="lg"
              >
                <XCircle className="mr-1 h-5 w-5" />
                Don&apos;t Know
              </Button>
              <Button
                onClick={() => handleResponse(true)}
                variant="outline"
                className="flex-1 ml-2 border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                size="lg"
              >
                <CheckCircle className="mr-1 h-5 w-5" />
                Know
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
      
      <Card className="mb-4">
        <CardContent className="p-4 flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Interval:</span>
            <Badge variant="outline" className="font-mono">
              {card.interval} day{card.interval !== 1 ? 's' : ''}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Repetitions:</span>
            <Badge variant="outline" className="font-mono">
              {card.repetitions}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Add necessary custom CSS for 3D transforms */}
      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
} 