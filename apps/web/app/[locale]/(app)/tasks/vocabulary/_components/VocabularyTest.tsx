"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { shuffleArray } from "@/lib/tasks/vocabulary.utils";
import { cn } from "@/lib/utils";
import type { VocabularyWordWithId } from "@/lib/tasks/vocabulary.schema";

interface VocabularyTestProps {
  words: VocabularyWordWithId[];
  onStudyAgain: () => void;
  onNewTask: () => void;
}

export function VocabularyTest({
  words,
  onStudyAgain,
  onNewTask,
}: VocabularyTestProps) {
  const [leftItems] = useState(() => shuffleArray(words));
  const [rightItems] = useState(() => shuffleArray(words));
  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [flashPair, setFlashPair] = useState<{
    leftId: string;
    rightId: string;
  } | null>(null);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (flashTimeoutRef.current !== null) {
        clearTimeout(flashTimeoutRef.current);
      }
    };
  }, []);

  const isDone = matched.size === words.length;

  function handleLeftClick(id: string) {
    if (matched.has(id) || flashPair !== null) return;
    setSelectedLeftId((prev) => (prev === id ? null : id));
  }

  function handleRightClick(id: string) {
    if (!selectedLeftId || matched.has(id) || flashPair !== null) return;
    if (selectedLeftId === id) {
      setMatched((prev) => new Set([...prev, id]));
      setSelectedLeftId(null);
    } else {
      const leftId = selectedLeftId;
      setSelectedLeftId(null);
      setFlashPair({ leftId, rightId: id });
      flashTimeoutRef.current = setTimeout(() => {
        setFlashPair(null);
        flashTimeoutRef.current = null;
      }, 600);
    }
  }

  function getLeftItemClass(id: string) {
    if (matched.has(id))
      return "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300";
    if (flashPair?.leftId === id)
      return "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300";
    if (selectedLeftId === id)
      return "bg-primary text-primary-foreground border-primary";
    return "bg-background border-input hover:bg-accent";
  }

  function getRightItemClass(id: string) {
    if (matched.has(id))
      return "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300";
    if (flashPair?.rightId === id)
      return "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300";
    return "bg-background border-input hover:bg-accent";
  }

  if (isDone) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg border bg-muted/20 p-8 text-center">
        <p className="text-lg font-semibold">
          All matched — {words.length} / {words.length}
        </p>
        <p className="text-sm text-muted-foreground">Great work!</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onStudyAgain}>
            Study again
          </Button>
          <Button onClick={onNewTask}>New task</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        {matched.size} / {words.length} matched
      </p>

      <div className="grid grid-cols-2 gap-3">
        {/* Left column — words */}
        <div className="space-y-2">
          {leftItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleLeftClick(item.id)}
              disabled={matched.has(item.id)}
              aria-pressed={selectedLeftId === item.id}
              className={cn(
                "w-full rounded-md border px-3 py-2 text-sm font-medium text-left transition-colors",
                getLeftItemClass(item.id),
                matched.has(item.id) && "cursor-default",
              )}
            >
              {item.word}
            </button>
          ))}
        </div>

        {/* Right column — translations */}
        <div className="space-y-2">
          {rightItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleRightClick(item.id)}
              disabled={matched.has(item.id)}
              className={cn(
                "w-full rounded-md border px-3 py-2 text-sm font-medium text-left transition-colors",
                getRightItemClass(item.id),
                matched.has(item.id) && "cursor-default",
              )}
            >
              {item.translation}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
