"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
} from '@dnd-kit/core';
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import dynamic from 'next/dynamic';

const SortableItem = dynamic(() => import('./SortableItem'), { ssr: false });
interface StringLoopProps {
  title: string;
  type: 'inclus' | 'exclus' | 'extracts';
  description?: string;
  value?: string[];
  onChange: (value: string[]) => void;
}

const StringLoop: React.FC<StringLoopProps> = ({
  title,
  type,
  description,
  value,
  onChange,
}) => {
  const [strings, setStrings] = useState<string[]>(value ?? []);
  const [inputValue, setInputValue] = useState<string>('');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');

  useEffect(() => {
    onChange(strings);
  }, [strings]);

  const addString = (newString: string) => {
    setStrings((prev) => [...prev, newString]);
  };

  const removeString = (index: number) => {
    setStrings((prev) => prev.filter((_, i) => i !== index));
    if (editIndex === index) {
      setEditIndex(null);
      setEditValue('');
    }
  };

  const startEdit = (index: number, currentValue: string) => {
    setEditIndex(index);
    setEditValue(currentValue);
  };

  const saveEdit = (index: number) => {
    if (editValue.trim()) {
      setStrings((prev) =>
        prev.map((item, i) => (i === index ? editValue.trim() : item))
      );
      setEditIndex(null);
      setEditValue('');
    }
  };

  const badgeVariant = type === 'inclus' ? 'default' : 'destructive';
  const badgeClassName =
    type === 'inclus'
      ? 'bg-lime-600 text-white'
      : type === 'extracts'
      ? 'bg-blue-600 text-white'
      : '';

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = strings.findIndex((_, i) => i === Number(active.id));
      const newIndex = strings.findIndex((_, i) => i === Number(over?.id));
      setStrings((items) => arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <Card className="bg-gray-50 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title}
          <Badge variant={badgeVariant} className={badgeClassName}>
            {type}
          </Badge>
          {type !== 'extracts' && <span className="text-red-600">*</span>}
        </CardTitle>
        {description && <p className="text-sm text-gray-600">{description}</p>}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Input
            className="w-full sm:col-span-2 border-gray-300 focus:border-lime-500 focus:ring-lime-500"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={`Ajouter ${type} ...`}
          />
          <Button
            type="button"
            onClick={() => {
              if (inputValue.trim()) {
                const newItems = inputValue
                  .split(';')
                  .map((s) => s.trim())
                  .filter((s) => s);
                setStrings((prev) => [...prev, ...newItems]);
                setInputValue('');
              }
            }}
            className=" w-full sm:w-auto bg-lime-600 hover:bg-lime-700 text-white"
          >
            Ajouter
          </Button>
        </div>

        {(strings.length > 1 || (strings.length === 1 && strings[0].trim() !== '')) ? (
          
          <div className="space-y-2">
            <h4 className="font-semibold text-sm my-2">
              {type} ({strings.length}):
            </h4>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={strings.map((_, index) => index.toString())}
                strategy={verticalListSortingStrategy}
              >
                <div className="max-h-60 overflow-y-auto space-y-1">
                    {strings.map((string, index) =>
                    string.trim() !== '' ? (
                      <SortableItem
                      key={index}
                      id={index.toString()}
                      string={string}
                      index={index}
                      editIndex={editIndex}
                      editValue={editValue}
                      startEdit={startEdit}
                      saveEdit={saveEdit}
                      setEditValue={setEditValue}
                      removeString={removeString}
                      />
                    ) : null
                    )}
                </div>
              </SortableContext>
            </DndContext>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>Aucune chaîne ajoutée pour le moment.</p>
            <p className="text-sm">
              Ajoutez votre première chaîne {type} ci-dessus&nbsp;!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StringLoop;
