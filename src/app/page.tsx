'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { loadFlashcards, getDueCards } from '@/utils/localStorage';
import { Flashcard } from '@/types';
import { getDeckBgColor } from '@/utils/deckColors';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ListTodo, PlusCircle, BookOpen, BarChart3, ChevronRight, Layers } from 'lucide-react';

export default function Home() {
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [deckCounts, setDeckCounts] = useState<Record<string, number>>({});

  // Load flashcards from localStorage on component mount
  useEffect(() => {
    // Use setTimeout to ensure this runs on client-side only
    const timeoutId = setTimeout(() => {
      // Get due cards
      const cards = getDueCards();
      setDueCards(cards);
      
      // Calculate deck counts
      const allCards = loadFlashcards();
      const deckStats: Record<string, number> = {};
      
      allCards.forEach(card => {
        deckStats[card.deck] = (deckStats[card.deck] || 0) + 1;
      });
      
      setDeckCounts(deckStats);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);
  
  // Get top decks by card count
  const topDecks = Object.entries(deckCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  return (
    <div className="container py-10 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl text-foreground">Welcome to Flashcard App</h1>
          <p className="text-muted-foreground mt-3">Your personal spaced repetition learning tool</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Due Today Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-blue-500 text-white">
              <div className="flex justify-between items-center">
                <CardTitle>Due Today</CardTitle>
                <ListTodo className="h-5 w-5 text-white" />
              </div>
              <CardDescription className="text-blue-100">Cards to review</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-foreground">{dueCards.length}</p>
                  <p className="text-sm text-muted-foreground">cards to review</p>
                </div>
                {dueCards.length > 0 && (
                  <Link href="/review" >
                    <Button className="flex-1 bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform">Start Review</Button>
                  </Link>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Link href="/dashboard" className="text-blue-500 text-sm flex items-center hover:underline">
                View Statistics <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
          
          {/* Decks Card */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-orange-500 text-white">
              <div className="flex justify-between items-center">
                <CardTitle>Your Decks</CardTitle>
                <Layers className="h-5 w-5 text-white" />
              </div>
              <CardDescription className="text-orange-100">Manage your collections</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              {topDecks.length > 0 ? (
                <div className="space-y-4">
                  {topDecks.map(([deckName, count]) => (
                    <div key={deckName} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span 
                          className={`w-3 h-3 rounded-full mr-2 ${getDeckBgColor(deckName)}`} 
                        />
                        <span className="text-foreground">{deckName}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{count} cards</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">No decks found. Create your first deck!</p>
              )}
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <Link href="/decks" className="text-orange-500 text-sm flex items-center hover:underline">
                View All Decks <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </CardFooter>
          </Card>
          
          {/* Quick Actions Card */}
          <Card>
            <CardHeader className="bg-violet-500 text-white">
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription className="text-violet-100">Shortcuts to common tasks</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <Link href="/create">
                  <Button variant="outline" className="w-full justify-start text-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create New Flashcard
                  </Button>
                </Link>
                <Link href="/review">
                  <Button variant="outline" className="w-full justify-start text-foreground">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Study Now
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button variant="outline" className="w-full justify-start text-foreground">
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View Statistics
                  </Button>
                </Link>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
              <p className="text-sm text-muted-foreground">
                You&apos;ve created {Object.values(deckCounts).reduce((a, b) => a + b, 0)} cards so far
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
