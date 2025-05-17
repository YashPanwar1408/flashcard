/**
 * Provides consistent colors for decks across the application
 */

// Fixed color mapping for specific deck names
const DECK_COLORS: Record<string, string> = {
  'JavaScript': 'bg-yellow-500',
  'Math': 'bg-blue-500',
  'English': 'bg-green-500',
  'Science': 'bg-indigo-500',
  'History': 'bg-red-500',
  'Geography': 'bg-purple-500'
};

// Array of tailwind background colors for random assignment
const FALLBACK_COLORS = [
  'bg-pink-500',
  'bg-orange-500',
  'bg-teal-500',
  'bg-cyan-500',
  'bg-lime-500',
  'bg-amber-500',
  'bg-emerald-500',
  'bg-violet-500',
  'bg-rose-500',
];

// Keep track of assigned colors for consistency
const assignedColors: Record<string, string> = {};
let colorIndex = 0;

/**
 * Gets a consistent background color for a deck
 */
export const getDeckBgColor = (deckName: string): string => {
  // Return pre-defined color if available
  if (DECK_COLORS[deckName]) {
    return DECK_COLORS[deckName];
  }
  
  // Return previously assigned color if exists
  if (assignedColors[deckName]) {
    return assignedColors[deckName];
  }
  
  // Assign a new color
  const newColor = FALLBACK_COLORS[colorIndex % FALLBACK_COLORS.length];
  assignedColors[deckName] = newColor;
  colorIndex++;
  
  return newColor;
};

/**
 * Gets a consistent text color for a deck
 */
export const getDeckTextColor = (deckName: string): string => {
  return 'text-white'; // All background colors are dark enough for white text
};

/**
 * Gets a lighter background color for hover states
 */
export const getDeckHoverBgColor = (deckName: string): string => {
  const bgColor = getDeckBgColor(deckName);
  return bgColor.replace('-500', '-600');
};

/**
 * Gets a lighter background color for UI elements
 */
export const getDeckLightBgColor = (deckName: string): string => {
  const bgColor = getDeckBgColor(deckName);
  return bgColor.replace('-500', '-100');
};

/**
 * Gets a consistent text color for light backgrounds
 */
export const getDeckDarkTextColor = (deckName: string): string => {
  const bgColor = getDeckBgColor(deckName);
  return bgColor.replace('bg-', 'text-').replace('-500', '-700');
}; 