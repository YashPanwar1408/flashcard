/**
 * Provides consistent colors for decks across the application
 */

export function getDeckBgColor(deckName: string): string {
  const colorMap: Record<string, string> = {
    'JavaScript': 'bg-yellow-500',
    'TypeScript': 'bg-blue-500',
    'React': 'bg-cyan-500',
    'Node.js': 'bg-green-500',
    'HTML': 'bg-orange-500',
    'CSS': 'bg-pink-500',
    'Python': 'bg-indigo-500',
    'Java': 'bg-red-500',
    'Math': 'bg-blue-600',
    'English': 'bg-green-600'
  };
  
  return colorMap[deckName] || `bg-gray-500`;
}

export function getDeckTextColor(deckName: string): string {
  const colorMap: Record<string, string> = {
    'JavaScript': 'text-yellow-100',
    'TypeScript': 'text-blue-100',
    'React': 'text-cyan-100',
    'Node.js': 'text-green-100',
    'HTML': 'text-orange-100',
    'CSS': 'text-pink-100',
    'Python': 'text-indigo-100',
    'Java': 'text-red-100',
    'Math': 'text-blue-100',
    'English': 'text-green-100'
  };
  
  return colorMap[deckName] || `text-gray-100`;
}

export function getDeckLightBgColor(deckName: string): string {
  const colorMap: Record<string, string> = {
    'JavaScript': 'bg-yellow-100',
    'TypeScript': 'bg-blue-100',
    'React': 'bg-cyan-100',
    'Node.js': 'bg-green-100',
    'HTML': 'bg-orange-100',
    'CSS': 'bg-pink-100',
    'Python': 'bg-indigo-100',
    'Java': 'bg-red-100',
    'Math': 'bg-blue-100',
    'English': 'bg-green-100'
  };
  
  return colorMap[deckName] || `bg-gray-100`;
}

export function getDeckDarkTextColor(deckName: string): string {
  const colorMap: Record<string, string> = {
    'JavaScript': 'text-yellow-800',
    'TypeScript': 'text-blue-800',
    'React': 'text-cyan-800',
    'Node.js': 'text-green-800',
    'HTML': 'text-orange-800',
    'CSS': 'text-pink-800',
    'Python': 'text-indigo-800',
    'Java': 'text-red-800',
    'Math': 'text-blue-800',
    'English': 'text-green-800'
  };
  
  return colorMap[deckName] || `text-gray-800`;
}

export function getRandomDeckColor(): string {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-red-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-cyan-500',
  ];
  
  const randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
} 