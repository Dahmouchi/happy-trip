/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import { Plus, X, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import RichTextEditor from "@/components/ui/rich-text-editor";


interface Program {
  id: string;
  title: string;
  description: string;
  image: File | null;
  imagePreview?: string;
}

interface ProgramFormProps {
  programs: Program[];
  onChange: (programs: Program[]) => void;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ programs, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newProgram, setNewProgram] = useState<Omit<Program, 'id'>>({
    title: '',
    description: '',
    image: null,
    imagePreview: undefined
  });

  const handleAddProgram = () => {
    if (newProgram.title.trim() && newProgram.description.trim()) {
      const program: Program = {
        id: Date.now().toString(),
        ...newProgram
      };
      onChange([...programs, program]);
      setNewProgram({ title: '', description: '', image: null, imagePreview: undefined });
      setShowAddForm(false);
    }
  };

  const handleRemoveProgram = (id: string) => {
    onChange(programs.filter(program => program.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProgram(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{programs.length} programme(s)</span>
      </div>

      {/* Programs List */}
      <div className="space-y-4 ">
        {programs.map((program, index) => (
          <Card key={program.id} className="relative group hover:shadow-md transition-shadow duration-200">
            <CardContent className="px-6 w-full">
              <div className="flex items-start gap-4">
                {program.imagePreview && (
                  <div className="flex-shrink-0">
                    <img
                      src={program.imagePreview}
                      alt={program.title}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-lime-100 text-lime-600 text-sm font-medium rounded-full">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold text-gray-900">{program.title}</h4>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{program.description}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveProgram(program.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add Program Form */}
      {showAddForm && (
        <Card className="border-2 border-dashed border-lime-200 ">
          <CardContent className="p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Ajouter Nouveau Programme</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Titre du Programme
                </label>
                <Input
                  placeholder="Enter program title..."
                  value={newProgram.title}
                  onChange={(e) => setNewProgram(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <RichTextEditor
                  value={newProgram.description}
                  onChange={(value) => setNewProgram(prev => ({ ...prev, description: value }))}
                  className="max-h-60 w-full overflow-auto"
                />
               
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image du Programme
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <Upload className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">Choisie une Image</span>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  {newProgram.imagePreview && (
                    <div className="flex items-center gap-2">
                      <img
                        src={newProgram.imagePreview}
                        alt="Preview"
                        className="w-12 h-12 object-cover rounded-lg border"
                      />
                      <span className="text-sm text-green-600">Image selectionnee</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={handleAddProgram}
                  disabled={!newProgram.title.trim() || !newProgram.description.trim()}
                  className="bg-lime-600 hover:bg-lime-700 text-white"
                >
                  Ajouter une Programme
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewProgram({ title: '', description: '', image: null, imagePreview: undefined });
                  }}
                >
                  Annuller
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add Program Button */}
      {!showAddForm && (
        <Button
          onClick={() => setShowAddForm(true)}
          variant="outline"
          className="w-full border-2 border-dashed border-gray-300 hover:lime-blue-400 hover:bg-lime-50 transition-all duration-200 py-8"
        >
          <Plus className="w-5 h-5 mr-2 text-gray-500" />
          <span className="text-gray-600">Ajouter un Programme</span>
        </Button>
      )}

      {programs.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-gray-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium mb-2">Aucun programme ajouté pour le moment</p>
            <p className="text-sm">Cliquez sur &quot;Ajouter un Programme&quot; pour créer votre premier programme de visite</p>
        </div>
      )}
    </div>
  );
};

export default ProgramForm;