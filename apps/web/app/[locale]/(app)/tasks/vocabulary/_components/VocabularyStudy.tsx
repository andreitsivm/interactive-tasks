"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { VocabularyWordWithId } from "@/lib/tasks/vocabulary.schema";

interface VocabularyStudyProps {
  words: VocabularyWordWithId[];
  onStartTest: () => void;
}

export function VocabularyStudy({ words, onStartTest }: VocabularyStudyProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const word = words[currentIndex]!;

  function goTo(index: number) {
    setCurrentIndex(index);
    setIsFlipped(false);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {words.length}
        </span>
        <Button size="sm" onClick={onStartTest}>
          Start Test
        </Button>
      </div>

      <button
        type="button"
        onClick={() => setIsFlipped((f) => !f)}
        aria-label="Flip card"
        className="w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      >
        <Card
          className={cn(
            "min-h-[200px] flex items-center justify-center transition-colors",
            isFlipped ? "bg-muted/40" : "bg-background",
          )}
        >
          <CardContent className="text-center p-8">
            {isFlipped ? (
              <div className="space-y-3 animate-in fade-in duration-200">
                <p className="text-2xl font-bold">{word.translation}</p>
                <p className="text-sm text-muted-foreground italic">
                  {word.exampleSentence}
                </p>
              </div>
            ) : (
              <p className="text-3xl font-bold animate-in fade-in duration-200">
                {word.word}
              </p>
            )}
          </CardContent>
        </Card>
      </button>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={() => goTo(currentIndex - 1)}
          disabled={currentIndex === 0}
          aria-label="Previous card"
        >
          <ChevronLeft className="size-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => goTo(currentIndex + 1)}
          disabled={currentIndex === words.length - 1}
          aria-label="Next card"
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
