import React, {  useState } from 'react';
import { Plus, X, Calendar as CalendarIcon, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';

interface DateEntry {
  id: string;
  dateDebut: Date;
  dateFin: Date;
  description: string;
  visible: boolean;
}

interface DateFormProps {
  dates: DateEntry[];
  onChange: (dates: DateEntry[]) => void;
}

const DateForm: React.FC<DateFormProps> = ({ dates, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDateId, setEditingDateId] = useState<string | null>(null);
  const [newDate, setNewDate] = useState<Omit<DateEntry, 'id'>>({
    dateDebut: undefined as unknown as Date,
    dateFin: undefined as unknown as Date,
    description: '',
    visible : true
  });

  const handleAddDate = () => {
    if (newDate.dateDebut && newDate.dateFin && newDate.description.trim()) {
      const dateEntry: DateEntry = {
        id: Date.now().toString(),
        ...newDate
      };
      onChange([...dates, dateEntry]);
      setNewDate({ dateDebut: undefined as unknown as Date, dateFin: undefined as unknown as Date, description: '', visible: true });
      setShowAddForm(false);
    }
  };

  const handleRemoveDate = (id: string) => {
    onChange(dates.filter(date => date.id !== id));
  };

  const handleEditDate = (dateEntry: DateEntry) => {
    setEditingDateId(dateEntry.id);
    setNewDate({
      dateDebut: dateEntry.dateDebut,
      dateFin: dateEntry.dateFin,
      description: dateEntry.description,
      visible: dateEntry.visible
    });
    setShowAddForm(false);
  };

  const handleUpdateDate = () => {
    if (newDate.dateDebut && newDate.dateFin && newDate.description.trim() && editingDateId) {
      const updatedDates = dates.map(date =>
        date.id === editingDateId
          ? { ...date, dateDebut: newDate.dateDebut, dateFin: newDate.dateFin, description: newDate.description }
          : date
      );
      onChange(updatedDates);
      setEditingDateId(null);
      setNewDate({ dateDebut: undefined as unknown as Date, dateFin: undefined as unknown as Date, description: '', visible: true });
    }
  };

  const handleCancelEdit = () => {
    setEditingDateId(null);
    setNewDate({ dateDebut: undefined as unknown as Date, dateFin: undefined as unknown as Date, description: '', visible : true });
  };


  
const handleDateVisibility = (id: string) => {
  console.log("Toggling visibility for date ID:", id);

  // Toggle the 'visible' state of the corresponding date entry
  const updatedDates = dates.map(date =>
    date.id === id ? { ...date, visible: !date.visible } : date
  );

  console.log("Updated dates array:", updatedDates);  // Check the updated dates array

  // Update the parent component's state with the new dates array
  onChange(updatedDates);

  // Reset date editing state if necessary
  if (editingDateId === id) {
    setEditingDateId(null);
    setNewDate({
      dateDebut: undefined as unknown as Date,
      dateFin: undefined as unknown as Date,
      description: '',
      visible: true,
    });
  }

  // Hide add form if it's visible
  if (showAddForm) {
    setShowAddForm(false);
    setNewDate({
      dateDebut: undefined as unknown as Date,
      dateFin: undefined as unknown as Date,
      description: '',
      visible: true,
    });
  }
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
                <div className="flex items-center gap-1">
                   <label className="flex items-center space-x-2">
      {/* Checkbox to toggle visible state */}
      <input
        type="checkbox"
        checked={dateEntry.visible}
        onChange={() => handleDateVisibility(dateEntry.id)}  // Toggle visible state
        className="form-checkbox h-5 w-5 text-lime-600"
      />
      <span>{dateEntry.visible ? 'Visible' : 'Invisible'}</span>
    </label>


                    <div
                    onClick={() => handleEditDate(dateEntry)}
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 text-primary hover:text-primary/80 hover:bg-primary/10 cursor-pointer rounded p-1.5 border "
                    title="Modifier"
                    role="button"
                    tabIndex={0}
                    onKeyPress={e => {
                      if (e.key === 'Enter' || e.key === ' ') handleEditDate(dateEntry);
                    }}
                    >
                    <Edit className="w-4 h-4" />
                    </div>
                    <div
                    onClick={() => handleRemoveDate(dateEntry.id)}
                    className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer rounded p-1.5 border border-destructive/20"
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add/Edit Date Form */}
      {(showAddForm || editingDateId) && (
        <Card className="border-2 border-dashed border-lime-200">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">
              {editingDateId ? 'Modifier Date' : 'Ajouter Nouvelle Date'}
            </h4>
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
                  onClick={editingDateId ? handleUpdateDate : handleAddDate}
                  disabled={!newDate.dateDebut || !newDate.dateFin || !newDate.description.trim()}
                  className="bg-lime-600 hover:bg-lime-700 text-white"
                >
                  {editingDateId ? 'Modifier Date' : 'Ajouter Date'}
                </Button>
                <Button
                  variant="outline"
                  onClick={editingDateId ? handleCancelEdit : () => {
                    setShowAddForm(false);
                    setNewDate({ dateDebut: undefined as unknown as Date, dateFin: undefined as unknown as Date, description: '', visible: true});
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
      {!showAddForm && !editingDateId && (
        <Button
          onClick={() => setShowAddForm(true)}
          variant="outline"
          className="w-full border-2 border-dashed border-gray-300 hover:border-lime-400 hover:bg-lime-50 transition-all duration-200 py-8"
        >
          <Plus className="w-5 h-5 mr-2 text-gray-500" />
          <span className="text-gray-600">Ajouter une Date</span>
        </Button>
      )}

      {dates.length === 0 && !showAddForm && !editingDateId && (
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