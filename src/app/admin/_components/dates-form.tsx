import React, { useState } from 'react';
import { Plus, X, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface DateEntry {
  id: string;
  dateDebut: Date;
  dateFin: Date;
  description: string;
}

interface DateFormProps {
  dates: DateEntry[];
  onChange: (dates: DateEntry[]) => void;
}

const DateForm: React.FC<DateFormProps> = ({ dates, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDate, setNewDate] = useState<Omit<DateEntry, 'id'>>({
    dateDebut: undefined as unknown as Date,
    dateFin: undefined as unknown as Date,
    description: ''
  });

  const handleAddDate = () => {
    if (newDate.dateDebut && newDate.dateFin && newDate.description.trim()) {
      const dateEntry: DateEntry = {
        id: Date.now().toString(),
        ...newDate
      };
      onChange([...dates, dateEntry]);
      setNewDate({ dateDebut: undefined as unknown as Date, dateFin: undefined as unknown as Date, description: '' });
      setShowAddForm(false);
    }
  };

  const handleRemoveDate = (id: string) => {
    onChange(dates.filter(date => date.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{dates.length} date(s)</span>
      </div>

      {/* Dates List */}
      <div className="space-y-4">
        {dates.map((dateEntry, index) => (
          <Card key={dateEntry.id} className="relative group hover:shadow-md transition-shadow duration-200">
            <CardContent className="px-6 w-full">
              <div className="flex items-start gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-lime-100 text-lime-600 text-sm font-medium rounded-full">
                      {index + 1}
                    </span>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CalendarIcon className="w-4 h-4" />
                      <span>
                        {dateEntry.dateDebut instanceof Date && !isNaN(dateEntry.dateDebut.getTime())
                          ? dateEntry.dateDebut.toLocaleDateString()
                          : ''}
                        {' → '}
                        {dateEntry.dateFin instanceof Date && !isNaN(dateEntry.dateFin.getTime())
                          ? dateEntry.dateFin.toLocaleDateString()
                          : ''}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{dateEntry.description}</p>
                </div>
                <div
                  onClick={() => handleRemoveDate(dateEntry.id)}
                  className="cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1"
                  title="Supprimer"
                  role="button"
                  tabIndex={0}
                  onKeyPress={e => {
                  if (e.key === 'Enter' || e.key === ' ') handleRemoveDate(dateEntry.id);
                  }}
                >
                  <X className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Date Form */}
      {showAddForm && (
        <Card className="border-2 border-dashed border-lime-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Ajouter Nouvelle Date</h4>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Début
                  </label>
                  <Input
                    type="date"
                    value={
                      newDate.dateDebut instanceof Date && !isNaN(newDate.dateDebut.getTime())
                        ? newDate.dateDebut.toISOString().slice(0, 10)
                        : ''
                    }
                    onChange={(e) =>
                      setNewDate(prev => ({
                        ...prev,
                        dateDebut: e.target.value ? new Date(e.target.value) : undefined as unknown as Date
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Fin
                  </label>
                  <Input
                    type="date"
                    value={
                      newDate.dateFin instanceof Date && !isNaN(newDate.dateFin.getTime())
                        ? newDate.dateFin.toISOString().slice(0, 10)
                        : ''
                    }
                    onChange={(e) =>
                      setNewDate(prev => ({
                        ...prev,
                        dateFin: e.target.value ? new Date(e.target.value) : undefined as unknown as Date
                      }))
                    }
                    min={
                      newDate.dateDebut instanceof Date && !isNaN(newDate.dateDebut.getTime())
                        ? newDate.dateDebut.toISOString().slice(0, 10)
                        : undefined
                    }
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <Textarea
                  placeholder="Décrivez cette période..."
                  value={newDate.description}
                  onChange={(e) => setNewDate(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full min-h-[100px] resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleAddDate}
                  disabled={!newDate.dateDebut || !newDate.dateFin || !newDate.description.trim()}
                  className="bg-lime-600 hover:bg-lime-700 text-white"
                >
                  Ajouter Date
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewDate({ dateDebut: undefined as unknown as Date, dateFin: undefined as unknown as Date, description: '' });
                  }}
                >
                  Annuler
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
  )}

      {/* Add Date Button */}
      {!showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          variant="outline"
          className="w-full border-2 border-dashed border-gray-300 hover:border-lime-400 hover:bg-lime-50 transition-all duration-200 py-8"
        >
          <Plus className="w-5 h-5 mr-2 text-gray-500" />
          <span className="text-gray-600">Ajouter une Date</span>
        </Button>
      )}

      {dates.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-gray-500">
          <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-lg font-medium mb-2">Aucune date ajoutée pour le moment</p>
          <p className="text-sm">Cliquez sur &quot;Ajouter une Date&quot; pour créer votre première période de visite</p>
        </div>
      )}
    </div>
  );
};

export default DateForm;
