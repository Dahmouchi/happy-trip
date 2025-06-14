import React, { useState, useEffect } from "react";
import { Plus, X, Upload, Image as ImageIcon, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import RichTextEditor from "@/components/ui/rich-text-editor";
import SafeHTML from "@/components/SafeHTML";

interface Program {
  id: string;
  title: string;
  description: string;
  image: File | string | null;
  imagePreview?: string;
}

interface ProgramFormProps {
  programs: Program[];
  onChange: (programs: Program[]) => void;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ programs, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState<Omit<Program, "id">>({
    title: "",
    description: "",
    image: null,
    imagePreview: undefined,
  });

  // Generate image previews for programs loaded from parent
  useEffect(() => {
    const updated = programs.map((p) => {
      if (typeof p.image === "string") {
        return { ...p, imagePreview: p.image };
      }
      return p;
    });
    onChange(updated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddProgram = () => {
    if (newProgram.title.trim() && newProgram.description.trim()) {
      const program: Program = {
        id: Date.now().toString(),
        ...newProgram,
      };
      onChange([...programs, program]);
      setNewProgram({
        title: "",
        description: "",
        image: null,
        imagePreview: undefined,
      });
      setShowAddForm(false);
    }
  };

  const handleEditProgram = (id: string) => {
    const programToEdit = programs.find(p => p.id === id);
    if (programToEdit) {
      setNewProgram({
        title: programToEdit.title,
        description: programToEdit.description,
        image: programToEdit.image,
        imagePreview: programToEdit.imagePreview,
      });
      setEditingProgramId(id);
      setShowAddForm(true);
    }
  };

  const handleUpdateProgram = () => {
    if (editingProgramId && newProgram.title.trim() && newProgram.description.trim()) {
      const updatedPrograms = programs.map(program => 
        program.id === editingProgramId 
          ? { ...program, ...newProgram }
          : program
      );
      onChange(updatedPrograms);
      setNewProgram({
        title: "",
        description: "",
        image: null,
        imagePreview: undefined,
      });
      setEditingProgramId(null);
      setShowAddForm(false);
    }
  };

  const handleRemoveProgram = (id: string) => {
    onChange(programs.filter((program) => program.id !== id));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setNewProgram((prev) => ({
          ...prev,
          image: file,
          imagePreview: e.target?.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancelEdit = () => {
    setShowAddForm(false);
    setEditingProgramId(null);
    setNewProgram({
      title: "",
      description: "",
      image: null,
      imagePreview: undefined,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {programs.length} programme(s)
        </span>
      </div>

      {/* Programs List */}
      <div className="space-y-4">
        {programs.map((program, index) => (
          <Card
            key={program.id}
            className="relative group hover:shadow-md transition-shadow duration-200"
          >
            <CardContent className="px-6 w-full">
              <div className="flex items-start gap-4">
                {program.imagePreview && (
                  <div className="flex-shrink-0">
                    <img
                      src={program.imagePreview}
                      alt={program.title}
                      className="w-20 h-20 object-cover rounded-lg border-2 border-border"
                    />
                  </div>
                )}
                <div className="flex-grow">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center justify-center w-6 h-6 bg-lime-100 text-lime-600 text-sm font-medium rounded-full">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold text-foreground text-lime-700">
                      {program.title}
                    </h4>
                  </div>
                  <SafeHTML
                    html={program.description}
                    className="safe-html text-muted-foreground text-sm"
                  />
                </div>
                
                <div className="flex gap-1">
                  <div
                    onClick={() => handleEditProgram(program.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary hover:text-primary/80 hover:bg-primary/10 cursor-pointer rounded p-1.5 border "
                    title="Modifier le programme"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleEditProgram(program.id);
                      }
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </div>
                
                  <div
                    onClick={() => handleRemoveProgram(program.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer rounded p-1.5 border border-destructive/20"
                    title="Supprimer le programme"
                    role="button"
                    tabIndex={0}
                    onKeyPress={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleRemoveProgram(program.id);
                      }
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

      {/* Add/Edit Program Form */}
      {showAddForm && (
        <Card className="border-2 border-dashed border-accent">
          <CardContent className="p-6">
            <h4 className="font-semibold text-foreground mb-4">
              {editingProgramId ? "Modifier le Programme" : "Ajouter Nouveau Programme"}
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Titre du Programme
                </label>
                <Input
                  placeholder="Enter program title..."
                  value={newProgram.title}
                  onChange={(e) =>
                    setNewProgram((prev) => ({
                      ...prev,
                      title: e.target.value,
                    }))
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Description
                </label>
                <RichTextEditor
                  value={newProgram.description}
                  onChange={(value) =>
                    setNewProgram((prev) => ({ ...prev, description: value }))
                  }
                  className="max-h-60 w-full overflow-auto"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Image du Programme
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-foreground">
                        Choisir une Image
                      </span>
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
                      <span className="text-sm text-primary">
                        Image sélectionnée
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={editingProgramId ? handleUpdateProgram : handleAddProgram}
                  disabled={
                    !newProgram.title.trim() ||
                    !newProgram.description.trim()
                  }
                  className="bg-lime-600 hover:bg-lime-700 text-white"
                >
                  {editingProgramId ? "Mettre à jour le Programme" : "Ajouter une Programme"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelEdit}
                >
                  Annuler
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
          className="w-full border-2 border-dashed border-gray-300 hover:border-lime-400 hover:bg-lime-50 transition-all duration-200 py-8"
        >
          <Plus className="w-5 h-5 mr-2 text-muted-foreground" />
          <span className="text-muted-foreground">Ajouter un Programme</span>
        </Button>
      )}

      {programs.length === 0 && !showAddForm && (
        <div className="text-center py-12 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
          <p className="text-lg font-medium mb-2">
            Aucun programme ajouté pour le moment
          </p>
          <p className="text-sm">
            Cliquez sur &quot;Ajouter un Programme&quot; pour créer votre
            premier programme de visite
          </p>
        </div>
      )}
    </div>
  );
};

export default ProgramForm;