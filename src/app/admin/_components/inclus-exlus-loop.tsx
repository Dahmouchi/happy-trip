/* eslint-disable react-hooks/exhaustive-deps */


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface StringLoopProps {
  title: string;
  type: 'inclus' | 'exclus' | 'extracts';
  description?: string;
  value?: string[];
  onChange: (value: string[]) => void;
}

const StringLoop: React.FC<StringLoopProps> = ({ title, type, description, value, onChange }) => {
const [strings, setStrings] = useState<string[]>(value ?? []);
  const [inputValue, setInputValue] = useState<string>('');
    

  useEffect(() => {
    onChange(strings);
    console.log(value)
  }, [strings]);

  
  const addString = (newString: string) => {
    setStrings(prev => [...prev, newString]);
  };

  const removeString = (index: number) => {
    setStrings(prev => prev.filter((_, i) => i !== index));
  };

  const badgeVariant = type === 'inclus' ? 'default' : 'destructive';
  const badgeClassName =
    type === 'inclus'
      ? 'bg-lime-600 text-white'
      : type === 'extracts'
      ? 'bg-blue-600 text-white'
      : '';


  return (
    <Card className="bg-gray-50 h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {title} 
          <Badge variant={badgeVariant} className={badgeClassName}>{type}</Badge>
            {type !== 'extracts' && <span className="text-red-600">*</span>}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <Input
            className="w-full sm:col-span-2 border-gray-300 focus:border-lime-500 focus:ring-lime-500"
            type="text"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={`Ajouter ${type} ...`}
          />
          <Button
            type="button"
            onClick={() => {
              if (inputValue.trim()) {
                addString(inputValue.trim());
                setInputValue('');
              }
            }}
            className=" w-full sm:w-auto bg-lime-600 hover:bg-lime-700 text-white"
          >
            Ajouter
          </Button>
        </div>

        {strings.length > 0 ? (
          <div className="space-y-2">
            <h4 className="font-semibold text-sm my-2">
              {type} ({strings.length}):
            </h4>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {strings.map((string, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 rounded bg-white border"
                >
                  <span className="text-sm flex-1 mr-2">{string}</span>
                    <div
                    onClick={() => removeString(index)}
                    className="h-6 w-6 flex items-center justify-center cursor-pointer text-red-500 hover:bg-gray-100 rounded"
                    title="Supprimer"
                    >
                    <Trash2 className="w-3 h-3" />
                    </div>
                </div>
              ))}
            </div>
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
