'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockReviewStats, formatDate } from '../../mockData';
import { loadFlashcards, getDueCards, getDecks } from '../../utils/localStorage';
import { Flashcard } from '../../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getDeckBgColor, getDeckTextColor, getDeckLightBgColor, getDeckDarkTextColor } from '../../utils/deckColors';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRight, Award, CalendarDays, Calendar, BookOpen, BarChart3 } from 'lucide-react';

export default function DashboardPage() {
  const [dueCardsCount, setDueCardsCount] = useState<number>(0);
  const [totalCardsCount, setTotalCardsCount] = useState<number>(0);
  const [deckCounts, setDeckCounts] = useState<Record<string, number>>({});
  const [studyHistory, setStudyHistory] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Load flashcard data from localStorage on component mount
  useEffect(() => {
    // Use setTimeout to ensure this runs on client-side only
    const timeoutId = setTimeout(() => {
      const allCards = loadFlashcards();
      const dueCards = getDueCards();
      
      // Calculate deck statistics
      const deckStats = allCards.reduce<Record<string, number>>((acc, card) => {
        acc[card.deck] = (acc[card.deck] || 0) + 1;
        return acc;
      }, {});
      
      setDueCardsCount(dueCards.length);
      setTotalCardsCount(allCards.length);
      setDeckCounts(deckStats);
      
      // Generate mock study history (in a real app, this would be stored in localStorage)
      const history: Record<string, number> = {};
      const today = new Date();
      
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(today.getDate() - i);
        const dateString = formatDate(date);
        
        // Get the data from mockReviewStats or generate a random number
        const reviewData = mockReviewStats.find(stat => stat.date === dateString);
        history[dateString] = reviewData ? reviewData.count : Math.floor(Math.random() * 10);
      }
      
      setStudyHistory(history);
      setIsLoading(false);
    }, 0);

    return () => clearTimeout(timeoutId);
  }, []);

  // Format chart data to show day names
  const chartData = Object.entries(studyHistory).map(([date, count]) => {
    const dateObj = new Date(date);
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(dateObj);
    return {
      date,
      dayName,
      count,
      // Add month and day for tooltip
      fullDate: new Intl.DateTimeFormat('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }).format(dateObj)
    };
  });

  // Calculate total reviews
  const totalReviews = Object.values(studyHistory).reduce((sum, count) => sum + count, 0);

  // Calculate mastered cards
  const masteredCards = 0; // In a real app, this would count cards with repetitions > 5

  if (isLoading) {
    return (
      <div className="container py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-[200px]" />
              <Skeleton className="h-4 w-[300px]" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
              <Skeleton className="h-[120px] rounded-lg" />
            </div>
            
            <Skeleton className="h-[300px] rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Track your learning progress and review statistics.
          </p>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <Card className="dashboard-stat-card shadow-lg border-0 rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
              <CardTitle className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Cards Due Today</CardTitle>
              <CalendarDays className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-white">{dueCardsCount}</div>
                {dueCardsCount > 0 && (
                  <Link href="/review">
                    <Button size="sm" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform h-8">
                      Review
                    </Button>
                  </Link>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {dueCardsCount > 0 
                  ? `${dueCardsCount} cards need your attention`
                  : 'All caught up for today!'
                }
              </p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-stat-card shadow-lg border-0 rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
              <CardTitle className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">Total Collection</CardTitle>
              <BookOpen className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-white">{totalCardsCount}</div>
              <p className="text-xs text-gray-400 mt-2">
                Across {Object.keys(deckCounts).length} {Object.keys(deckCounts).length === 1 ? 'deck' : 'decks'}
              </p>
            </CardContent>
          </Card>
          
          <Card className="dashboard-stat-card shadow-lg border-0 rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
              <CardTitle className="text-sm font-medium text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">Study Activity</CardTitle>
              <Award className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold text-white">{totalReviews}</div>
              <p className="text-xs text-gray-400 mt-2">
                Reviews in the past 7 days
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Review History Chart */}
          <Card className="lg:col-span-2 dashboard-stat-card shadow-lg border-0 rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 overflow-hidden">
            <CardHeader className="pb-4 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                    Review History
                  </CardTitle>
                  <CardDescription className="text-gray-400 mt-1">
                    Your study activity over time
                  </CardDescription>
                </div>
                <Tabs value={selectedTimeRange} onValueChange={(value) => setSelectedTimeRange(value as any)}>
                  <TabsList className="grid grid-cols-3 w-[240px]">
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent className="px-2 pt-6">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                    <XAxis 
                      dataKey="dayName" 
                      tick={{ fontSize: 12, fill: "var(--foreground)" }}
                      tickMargin={10}
                      stroke="var(--muted-foreground)"
                    />
                    <YAxis 
                      allowDecimals={false}
                      tick={{ fontSize: 12, fill: "var(--foreground)" }}
                      stroke="var(--muted-foreground)"
                    />
                    <Tooltip 
                      formatter={(value) => [`${value} reviews`, 'Reviews']}
                      labelFormatter={(label, payload) => {
                        if (payload && payload.length > 0) {
                          return payload[0].payload.fullDate;
                        }
                        return label;
                      }}
                      contentStyle={{ 
                        borderRadius: '8px', 
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        backgroundColor: 'var(--background)',
                        color: 'var(--foreground)',
                        borderColor: 'var(--border)'
                      }}
                    />
                    <defs>
                      <linearGradient id="colorPurple" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8B5CF6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#6366F1" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="colorPink" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EC4899" stopOpacity={1} />
                        <stop offset="100%" stopColor="#DB2777" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3B82F6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#2563EB" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                        <stop offset="100%" stopColor="#059669" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="colorOrange" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity={1} />
                        <stop offset="100%" stopColor="#D97706" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="colorRed" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#EF4444" stopOpacity={1} />
                        <stop offset="100%" stopColor="#DC2626" stopOpacity={0.8} />
                      </linearGradient>
                      <linearGradient id="colorTeal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#14B8A6" stopOpacity={1} />
                        <stop offset="100%" stopColor="#0D9488" stopOpacity={0.8} />
                      </linearGradient>
                    </defs>
                    <Bar 
                      dataKey="count" 
                      name="Reviews"
                      radius={[8, 8, 0, 0]}
                      barSize={36}
                      animationDuration={800}
                      className="hover:opacity-80 transition-opacity"
                    >
                      {
                        chartData.map((entry, index) => {
                          const colors = ['url(#colorPurple)', 'url(#colorPink)', 'url(#colorBlue)', 
                                         'url(#colorGreen)', 'url(#colorOrange)', 'url(#colorRed)', 'url(#colorTeal)'];
                          return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                        })
                      }
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          {/* Decks Section */}
          <Card className="dashboard-stat-card shadow-lg border-0 rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 overflow-hidden">
            <CardHeader className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-500">
                  Your Decks
                </CardTitle>
                <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                  {Object.keys(deckCounts).length} total
                </Badge>
              </div>
              <CardDescription className="text-gray-400 mt-1">
                Performance by subject
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4 max-h-[240px] overflow-y-auto pr-1">
                {Object.entries(deckCounts).map(([deck, count]) => {
                  const bgColor = getDeckLightBgColor(deck);
                  const textColor = getDeckDarkTextColor(deck);
                  
                  return (
                    <div 
                      key={deck} 
                      className="flex justify-between items-center p-3 rounded-lg border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 hover:scale-105 transform transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center">
                        <span 
                          className={`w-3 h-3 rounded-full mr-3 ${getDeckBgColor(deck)}`}
                        ></span>
                        <span className="font-medium text-white">{deck}</span>
                      </div>
                      <Badge variant="outline" className="bg-gray-800 text-white border-gray-700">{count}</Badge>
                    </div>
                  );
                })}
                
                {Object.keys(deckCounts).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No decks found
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-0 border-t border-gray-800">
              <Link href="/decks">
                <Button variant="ghost" className="w-full bg-blue-500/10 hover:bg-blue-500/20 text-blue-400" size="sm">
                  View All Decks
                  <ArrowUpRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
} 