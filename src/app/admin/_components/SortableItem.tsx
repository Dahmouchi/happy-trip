"use client"
import { Trash2, Pencil, GripVertical } from 'lucide-react';

import { CSS } from '@dnd-kit/utilities';
import {
  useSortable,

} from '@dnd-kit/sortable';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
export default function SortableItem({
  id,
  string,
  index,
  editIndex,
  editValue,
  startEdit,
  saveEdit,
  setEditValue,
  removeString,
}: {
  id: string;
  string: string;
  index: number;
  editIndex: number | null;
  editValue: string;
  startEdit: (index: number, value: string) => void;
  saveEdit: (index: number) => void;
  setEditValue: React.Dispatch<React.SetStateAction<string>>;
  removeString: (index: number) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className="flex items-center justify-between p-2 rounded bg-white border gap-2"
    >
      <GripVertical
        {...listeners}
        className="w-4 h-4 text-gray-400 cursor-grab"
      />

      {editIndex === index ? (
        <>
          <Input
            className="flex-1 text-sm"
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
          <Button
            size="sm"
            onClick={() => saveEdit(index)}
            className="bg-lime-600 hover:bg-lime-700 text-white"
          >
            Save
          </Button>
        </>
      ) : (
        <>
          <span className="text-sm flex-1">{string}</span>
          <div className="flex gap-2 items-center">
            <Pencil
              className="w-4 h-4 text-blue-500 cursor-pointer hover:bg-gray-100 rounded p-0.5"
              onClick={() => startEdit(index, string)}
            />
            <Trash2
              className="w-4 h-4 text-red-500 cursor-pointer hover:bg-gray-100 rounded p-0.5"
              onClick={() => removeString(index)}
            />
          </div>
        </>
      )}
    </div>
  );
}
