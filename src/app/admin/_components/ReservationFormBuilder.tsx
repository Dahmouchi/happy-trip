/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useEffect, useState } from 'react';

type FieldType = 'text' | 'checkbox' | 'select';

interface FieldOption {
  label: string;
  value: string;
  price?: number;
}

export interface Field {
  label: string;
  type: FieldType;
  name: string;
  required?: boolean;
  price?: number;
  options?: FieldOption[];
}

export default function ReservationFormBuilder({
  onChange,
  onSubmit,
  initialFields = [],
}: {
  onChange?: (fields: Field[]) => void;
  onSubmit?: (fields: Field[]) => void;
  initialFields?: Field[];
}) {
  const [fields, setFields] = useState<Field[]>(initialFields);
  const [newField, setNewField] = useState<Partial<Field>>({ type: 'text' });

  useEffect(() => {
    setFields(initialFields);
  }, []);

  const addField = () => {
    if (!newField.label || !newField.name || !newField.type) return;
    const updated = [...fields, newField as Field];
    setFields(updated);
    onChange?.(updated);
    setNewField({ type: 'text' });
  };

  const removeField = (index: number) => {
    const updated = fields.filter((_, i) => i !== index);
    setFields(updated);
    onChange?.(updated);
  };

  const updateOption = (
    index: number,
    optionIndex: number,
    field: keyof FieldOption,
    value: string | number
  ) => {
    const updated = [...fields];
    if (!updated[index].options) return;
    updated[index].options![optionIndex][field] = value as never;
    setFields(updated);
    onChange?.(updated);
  };

  return (
    <div className="space-y-4">
      {/* New field input form */}
      <div className="grid grid-cols-2 gap-2">
        <input
          placeholder="Label"
          className="border p-2 rounded"
          value={newField.label || ''}
          onChange={(e) => setNewField({ ...newField, label: e.target.value })}
        />
        <input
          placeholder="Name"
          className="border p-2 rounded"
          value={newField.name || ''}
          onChange={(e) => setNewField({ ...newField, name: e.target.value })}
        />

        <select
          className="border p-2 rounded"
          value={newField.type}
          onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
        >
          <option value="text">Text</option>
          <option value="checkbox">Checkbox (with price)</option>
          <option value="select">Select (with options)</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={newField.required || false}
            onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
          />
          Required
        </label>

        {newField.type === 'checkbox' && (
          <input
            type="number"
            placeholder="Price (optional)"
            className="border p-2 rounded col-span-2"
            onChange={(e) => setNewField({ ...newField, price: Number(e.target.value) })}
          />
        )}

        <div
          onClick={addField}
          className="col-span-2 cursor-pointer text-center bg-lime-600 text-white px-4 py-2 rounded-lg hover:bg-lime-700"
        >
          Add Field
        </div>
      </div>

      {/* List of added fields */}
      {fields.map((field, index) => (
        <div key={index} className="border p-3 rounded space-y-2">
          <div className="flex justify-between items-center">
            <span>
              <strong>{field.label}</strong> ({field.type}) {field.required && <span className="text-red-500">*</span>}
            </span>
            <div
              onClick={() => removeField(index)}
              className="text-red-600 cursor-pointer"
            >
              Remove
            </div>
          </div>

          {field.type === 'select' && (
            <div className="space-y-2">
              <strong>Options:</strong>
              {(field.options || []).map((opt, optIndex) => (
                <div key={optIndex} className="flex gap-2">
                  <input
                    className="border p-1"
                    value={opt.label}
                    onChange={(e) => updateOption(index, optIndex, 'label', e.target.value)}
                    placeholder="Label"
                  />
                  <input
                    className="border p-1"
                    value={opt.value}
                    onChange={(e) => updateOption(index, optIndex, 'value', e.target.value)}
                    placeholder="Value"
                  />
                  <input
                    type="number"
                    className="border p-1"
                    value={opt.price || 0}
                    onChange={(e) => updateOption(index, optIndex, 'price', Number(e.target.value))}
                    placeholder="Price"
                  />
                </div>
              ))}
              <div
                className="text-lime-600 cursor-pointer"
                onClick={() => {
                  const updated = [...fields];
                  if (!updated[index].options) updated[index].options = [];
                  updated[index].options!.push({ label: '', value: '', price: 0 });
                  setFields(updated);
                  onChange?.(updated);
                }}
              >
                + Add Option
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Submit button */}
        <div className="flex justify-end">  {onSubmit && (
        <button
          onClick={() => onSubmit(fields)}
          className="mt-4 bg-lime-600 text-white hover:bg-lime-700 hover:cursor-pointer mr-8 e px-4 py-2 rounded "
        >
          Enregistrer
        </button>
      )}</div>
    
    </div>
  );
}
