'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, RefreshCw, Download, Upload, Sparkles } from 'lucide-react';
import { loadFlashcards, saveFlashcards } from '@/utils/localStorage';
import { mockFlashcards } from '@/mockData';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Flashcard } from '@/types';

export default function SettingsPage() {
  const [isResetting, setIsResetting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  
  // Reset all flashcards to initial demo data
  const handleResetData = () => {
    setIsResetting(true);
    
    setTimeout(() => {
      try {
        saveFlashcards(mockFlashcards);
        toast.success('Flashcards reset to demo data successfully');
      } catch (error) {
        toast.error('Failed to reset flashcards');
        console.error(error);
      } finally {
        setIsResetting(false);
      }
    }, 800);
  };
  
  // Export flashcards as JSON file
  const handleExportData = () => {
    setIsExporting(true);
    
    setTimeout(() => {
      try {
        const flashcards = loadFlashcards();
        const dataStr = JSON.stringify(flashcards, null, 2);
        const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
        
        const exportFileDefaultName = `flashcards_backup_${new Date().toISOString().slice(0, 10)}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        toast.success('Flashcards exported successfully');
      } catch (error) {
        toast.error('Failed to export flashcards');
        console.error(error);
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };
  
  // Import flashcards from JSON file
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;
    
    setIsImporting(true);
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        if (!Array.isArray(importedData)) {
          throw new Error('Invalid data format');
        }
        
        // Validate the imported data has the right structure
        const isValid = importedData.every((card: Flashcard) => 
          card.id && card.question && card.answer && card.deck && 
          card.nextReview && typeof card.interval === 'number'
        );
        
        if (!isValid) {
          throw new Error('Invalid flashcard data structure');
        }
        
        // Convert string dates to Date objects
        const processedData = importedData.map((card: Flashcard) => ({
          ...card,
          nextReview: new Date(card.nextReview)
        }));
        
        saveFlashcards(processedData);
        toast.success(`Imported ${processedData.length} flashcards successfully`);
      } catch (error) {
        toast.error('Failed to import flashcards: Invalid data format');
        console.error(error);
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.readAsText(file);
  };
  
  return (
    <div className="container py-8 md:py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Sparkles className="h-8 w-8 text-purple-400" />
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">Settings</h1>
        </div>
        
        <div className="space-y-8">
          <Card className="settings-card border-0 shadow-lg overflow-hidden rounded-xl bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800">
            <CardHeader className="border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-800 pb-6">
              <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                Data Management
              </CardTitle>
              <CardDescription className="text-gray-400 mt-1">
                Export, import or reset your flashcard data
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="flex justify-between items-center py-3 border-b border-gray-800 pb-6 hover:bg-gray-900/40 px-4 -mx-4 rounded-lg transition-colors">
                <div>
                  <h3 className="font-medium text-lg text-white">Export Data</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Download a backup of your flashcards
                  </p>
                </div>
                <Button 
                  onClick={handleExportData} 
                  disabled={isExporting}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform"
                >
                  {isExporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Export
                    </>
                  )}
                </Button>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-gray-800 pb-6 hover:bg-gray-900/40 px-4 -mx-4 rounded-lg transition-colors">
                <div>
                  <h3 className="font-medium text-lg text-white">Import Data</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Restore from a previous backup
                  </p>
                </div>
                <div className="flex items-center">
                  {isImporting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  <label htmlFor="import-file">
                    <Button
                      className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform"
                      disabled={isImporting}
                      asChild
                    >
                      <div>
                        <Upload className="mr-2 h-4 w-4" />
                        Import
                      </div>
                    </Button>
                  </label>
                  <input
                    id="import-file"
                    type="file"
                    accept=".json"
                    onChange={handleImportData}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div className="flex justify-between items-center py-3 hover:bg-gray-900/40 px-4 -mx-4 rounded-lg transition-colors">
                <div>
                  <h3 className="font-medium text-lg text-red-400">Reset Data</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Clear all flashcards and restore demo data
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="destructive" 
                      disabled={isResetting}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 transition-all duration-200 hover:shadow-md hover:scale-105 transform"
                    >
                      {isResetting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Reset
                        </>
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-gray-900 border border-gray-800">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-400">
                        This will reset all your flashcards to the initial demo data.
                        This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-gray-800 text-white hover:bg-gray-700 border-0">Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleResetData}
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0"
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 