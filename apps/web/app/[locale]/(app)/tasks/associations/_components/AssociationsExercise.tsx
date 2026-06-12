"use client";

import { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { shuffleArray } from "@/lib/tasks/vocabulary.utils";

interface DraggableWordProps {
  id: string;
  word: string;
}

function DraggableWord({ id, word }: DraggableWordProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id });
  const style = { transform: CSS.Translate.toString(transform) };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={cn(
        "cursor-grab touch-none select-none rounded-md border bg-background px-3 py-1.5 text-sm font-medium transition-colors",
        "hover:border-primary hover:bg-accent",
        isDragging && "cursor-grabbing opacity-50",
      )}
    >
      {word}
    </div>
  );
}

interface DroppableZoneProps {
  id: string;
  label: string;
  words: string[];
  emptyText?: string;
}

function DroppableZone({ id, label, words, emptyText }: DroppableZoneProps) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div className="min-w-0 flex-1">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <div
        ref={setNodeRef}
        className={cn(
          "flex min-h-32 flex-wrap gap-2 rounded-lg border-2 border-dashed p-3 transition-colors",
          isOver ? "border-primary bg-primary/5" : "border-muted-foreground/20",
        )}
      >
        {words.length === 0 && emptyText && (
          <p className="w-full self-center text-center text-xs text-muted-foreground">
            {emptyText}
          </p>
        )}
        {words.map((word) => (
          <DraggableWord key={word} id={word} word={word} />
        ))}
      </div>
    </div>
  );
}

interface AssociationsExerciseProps {
  centralConcept: string;
  associatedWords: string[];
  distractors: string[];
  onCheck: (poolWords: string[], associationWords: string[]) => void;
}

export function AssociationsExercise({
  centralConcept,
  associatedWords,
  distractors,
  onCheck,
}: AssociationsExerciseProps) {
  const [poolWords, setPoolWords] = useState<string[]>(() =>
    shuffleArray([...associatedWords, ...distractors]),
  );
  const [associationWords, setAssociationWords] = useState<string[]>([]);

  const sensors = useSensors(useSensor(PointerSensor), useSensor(TouchSensor));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const word = active.id as string;
    const targetZone = over.id as "pool" | "associations";
    const sourceZone = poolWords.includes(word) ? "pool" : "associations";

    if (sourceZone === targetZone) return;

    if (targetZone === "associations") {
      setPoolWords((prev) => prev.filter((w) => w !== word));
      setAssociationWords((prev) => [...prev, word]);
    } else {
      setAssociationWords((prev) => prev.filter((w) => w !== word));
      setPoolWords((prev) => [...prev, word]);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Central concept
        </p>
        <p className="mt-0.5 text-xl font-bold">{centralConcept}</p>
      </div>

      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-4 sm:flex-row">
          <DroppableZone id="pool" label="Word Pool" words={poolWords} />
          <DroppableZone
            id="associations"
            label="Your Associations"
            words={associationWords}
            emptyText="Drag words here"
          />
        </div>
      </DndContext>

      <div className="flex justify-end">
        <Button
          onClick={() => onCheck(poolWords, associationWords)}
          disabled={associationWords.length === 0}
        >
          Check Answers
        </Button>
      </div>
    </div>
  );
}
