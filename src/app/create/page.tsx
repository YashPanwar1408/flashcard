'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Flashcard } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { loadFlashcards, saveFlashcards, getDecks } from '@/utils/localStorage';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Plus, Save } from 'lucide-react';

export default function CreateCardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const newDeckParam = searchParams.get('newDeck');
  
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [deck, setDeck] = useState('');
  const [newDeck, setNewDeck] = useState('');
  const [decks, setDecks] = useState<string[]>([]);
  const [isNewDeck, setIsNewDeck] = useState(newDeckParam === 'true');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing decks
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const existingDecks = getDecks();
        setDecks(existingDecks);
        if (existingDecks.length > 0 && !isNewDeck) {
          setDeck(existingDecks[0]);
        }
      } catch (error) {
        console.error("Error loading decks:", error);
        toast.error("Couldn't load existing decks");
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [isNewDeck]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const currentDeck = isNewDeck ? newDeck : deck;

    if (!question.trim() || !answer.trim() || !currentDeck) {
      toast.error('Please fill in all fields');
      setIsSubmitting(false);
      return;
    }

    try {
      // Create new card
      const newCard: Flashcard = {
        id: uuidv4(),
        question: question.trim(),
        answer: answer.trim(),
        deck: currentDeck,
        nextReview: new Date(),
        interval: 1,
        easeFactor: 2.5,
        repetitions: 0
      };

      // Get existing cards and add the new one
      const cards = loadFlashcards();
      const updatedCards = [...cards, newCard];
      
      // Save to localStorage
      saveFlashcards(updatedCards);
      
      // Show success toast
      toast.success('Card created successfully');
      
      // Reset form
      setQuestion('');
      setAnswer('');
      setNewDeck('');
      
      // Add the new deck to the list if it doesn't exist
      if (isNewDeck && !decks.includes(newDeck)) {
        setDecks(prev => [...prev, newDeck]);
        setIsNewDeck(false);
        setDeck(newDeck);
      }
      
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error creating card:', error);
      toast.error('Failed to create card');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container py-6 md:py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Create New Flashcard</h1>
        
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle className="text-foreground">Card Details</CardTitle>
              <CardDescription>
                Create a new flashcard for your study sessions.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6 text-foreground">
              <div className="space-y-2">
                <Label htmlFor="question">Question</Label>
                <Textarea 
                  id="question"
                  placeholder="Enter the question or front side of the card"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="answer">Answer</Label>
                <Textarea 
                  id="answer"
                  placeholder="Enter the answer or back side of the card"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-[100px]"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label>Deck</Label>
                <div className="flex items-center gap-4">
                  {isNewDeck ? (
                    <>
                      <Input 
                        placeholder="Enter new deck name"
                        value={newDeck}
                        onChange={(e) => setNewDeck(e.target.value)}
                        className="flex-1"
                        required
                      />
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsNewDeck(false)}
                      >
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Select 
                        value={deck} 
                        onValueChange={setDeck}
                        required
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Select a deck" />
                        </SelectTrigger>
                        <SelectContent>
                          {decks.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsNewDeck(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Deck
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex items-center justify-between gap-4 pt-6 border-t">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
                className="bg-gray-800 text-white hover:bg-gray-700 border-0"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform"
              >
                <Save className="h-4 w-4 mr-2" />
                Create Card
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
} 