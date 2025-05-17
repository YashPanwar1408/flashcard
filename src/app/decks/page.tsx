'use client';

import React, { useState, useEffect } from 'react';
import { loadFlashcards, saveFlashcards } from '@/utils/localStorage';
import { Flashcard } from '@/types';
import { getDeckBgColor, getDeckTextColor, getDeckLightBgColor } from '@/utils/deckColors';
import { 
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function DecksPage() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [decks, setDecks] = useState<Record<string, Flashcard[]>>({});
  const [stats, setStats] = useState<Record<string, { total: number, due: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to start studying a deck
  const studyDeck = (deckName: string) => {
    router.push(`/review?deck=${encodeURIComponent(deckName)}`);
  };

  // Function to edit deck name (placeholder for future implementation)
  const editDeck = (deckName: string) => {
    // For now, just show a toast notification
    toast.info(`Edit deck functionality will be implemented soon: ${deckName}`);
  };

  // Function to delete a deck
  const deleteDeck = (deckName: string) => {
    try {
      const cards = loadFlashcards();
      const filteredCards = cards.filter(card => card.deck !== deckName);
      saveFlashcards(filteredCards);
      
      // Update the UI
      const updatedDeckMap: Record<string, Flashcard[]> = {};
      const updatedStatsMap: Record<string, { total: number, due: number }> = {};
      
      Object.keys(decks).forEach(deck => {
        if (deck !== deckName) {
          updatedDeckMap[deck] = decks[deck];
          updatedStatsMap[deck] = stats[deck];
        }
      });
      
      setDecks(updatedDeckMap);
      setStats(updatedStatsMap);
      toast.success(`Deck "${deckName}" deleted successfully`);
    } catch (error) {
      console.error("Error deleting deck:", error);
      toast.error("Failed to delete deck");
    }
  };

  // Function to create a new deck
  const createDeck = () => {
    router.push('/create?newDeck=true');
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      try {
        const cards = loadFlashcards();
        setFlashcards(cards);
        
        // Group cards by deck
        const deckMap: Record<string, Flashcard[]> = {};
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const statsMap: Record<string, { total: number, due: number }> = {};
        
        cards.forEach(card => {
          if (!deckMap[card.deck]) {
            deckMap[card.deck] = [];
            statsMap[card.deck] = { total: 0, due: 0 };
          }
          
          deckMap[card.deck].push(card);
          statsMap[card.deck].total += 1;
          
          const cardDate = new Date(card.nextReview);
          cardDate.setHours(0, 0, 0, 0);
          if (cardDate <= today) {
            statsMap[card.deck].due += 1;
          }
        });
        
        setDecks(deckMap);
        setStats(statsMap);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading decks:", error);
        toast.error("Failed to load decks");
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          <p className="text-foreground">Loading decks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 md:py-10 px-4 space-y-10">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Your Decks</h1>
          <p className="text-muted-foreground mt-1">
            Manage your flashcard decks and cards
          </p>
        </div>
        
        <Button className="w-full bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform md:w-auto" onClick={createDeck}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Deck
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(decks).map(deckName => {
          const deckBgColor = getDeckBgColor(deckName);
          const deckTextColor = getDeckTextColor(deckName);
          const deckLightBg = getDeckLightBgColor(deckName);
          
          return (
            <Card key={deckName} className="overflow-hidden border-2 hover:border-primary/50 transition-all">
              <CardHeader className={`${deckBgColor} ${deckTextColor}`}>
                <CardTitle>{deckName}</CardTitle>
                <CardDescription className={deckTextColor}>
                  {stats[deckName].total} cards • {stats[deckName].due} due today
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-6 deck-card-content">
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Cards</span>
                    <span className="font-medium text-foreground">{stats[deckName].total}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Due Today</span>
                    <span className="font-medium text-foreground">{stats[deckName].due}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Mastered</span>
                    <span className="font-medium text-foreground">
                      {decks[deckName].filter(card => card.repetitions >= 5).length}
                    </span>
                  </div>
                </div>
                
                {decks[deckName].length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-medium mb-2 text-foreground">Sample Cards:</h4>
                    <div className="space-y-2">
                      {decks[deckName].slice(0, 2).map(card => (
                        <div key={card.id} className="text-sm p-3 bg-muted/40 rounded-md sample-card">
                          {card.question.length > 60 
                            ? `${card.question.substring(0, 60)}...` 
                            : card.question
                          }
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
              
              <CardFooter className="flex gap-2 pt-0">
                {stats[deckName].due > 0 && (
                  <Button 
                    variant="default" 
                    className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform"
                    onClick={() => studyDeck(deckName)}
                  >
                    Study Now
                  </Button>
                )}
                
                <Button variant="outline" size="icon" onClick={() => editDeck(deckName)}>
                  <Pencil className="h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="text-destructive hover:text-destructive"
                  onClick={() => deleteDeck(deckName)}
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        
        {/* Add Deck Card */}
        <Card 
          className="border-2 border-dashed flex flex-col justify-center items-center h-[400px] cursor-pointer hover:border-primary transition-colors" 
          onClick={createDeck}
        >
          <CardContent className="flex flex-col items-center justify-center h-full">
            <div className="p-4 rounded-full bg-muted">
              <Plus className="h-8 w-8 text-primary opacity-70" />
            </div>
            <h3 className="mt-4 font-medium text-foreground">Create New Deck</h3>
            <p className="text-sm text-muted-foreground text-center mt-1 mb-4">
              Add a new category of flashcards
            </p>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Deck
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 