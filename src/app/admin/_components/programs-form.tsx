/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from "react";
import {
  Plus,
  X,
  Upload,
  Image as ImageIcon,
  Edit,
  ClipboardPenLine,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import RichTextEditor from "@/components/ui/rich-text-editor";
import SafeHTML from "@/components/SafeHTML";
import { v4 as uuidv4 } from "uuid";

interface Program {
  id: string;
  title: string;
  description: string;
  image?: File | string | null;
  imagePreview?: string;
  orderIndex: number;
}

interface ProgramFormProps {
  programs: Program[];
  onChange: (programs: Program[]) => void;
}

const ProgramForm: React.FC<ProgramFormProps> = ({ programs, onChange }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [newProgram, setNewProgram] = useState<
    Omit<Program, "id" | "orderIndex" | "createdAt">
  >({
    title: "",
    description: "",
    image: null,
    imagePreview: undefined,
  });

  // Generate image previews for programs loaded from parent
  useEffect(() => {
    const hasPreview = programs.some(
      (p) => !p.imagePreview && typeof p.image === "string"
    );
    if (!hasPreview) return;

    const updated = programs.map((p) => {
      if (typeof p.image === "string" && !p.imagePreview) {
        return { ...p, imagePreview: p.image };
      }
      return p;
    });

    onChange(updated);
  }, [onChange, programs]);

  const generateUniqueId = () => {
    return uuidv4();
  };

  const handleAddProgram = () => {
    if (newProgram.title.trim() && newProgram.description.trim()) {
      const program: Program = {
        id: uuidv4(),
        ...newProgram,
        orderIndex:
          programs.length > 0
            ? Math.max(...programs.map((p) => p.orderIndex)) + 1
            : 0,
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

  const handleRemoveProgram = (id: string) => {
    const updatedPrograms = programs
      .filter((program) => program.id !== id)
      .map((program, index) => ({
        ...program,
        orderIndex: index,
      }));

    onChange(updatedPrograms);
  };

  const moveProgram = (id: string, direction: "up" | "down") => {
    const currentIndex = programs.findIndex((p) => p.id === id);
    if (currentIndex === -1) return;

    const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= programs.length) return;

    const updatedPrograms = [...programs];
    // Swap the programs
    [updatedPrograms[currentIndex], updatedPrograms[newIndex]] = [
      updatedPrograms[newIndex],
      updatedPrograms[currentIndex],
    ];

    // Update orderIndex to match new positions
    updatedPrograms.forEach((program, index) => {
      program.orderIndex = index;
    });

    onChange(updatedPrograms);
  };

  const handleEditProgram = (id: string) => {
    const programToEdit = programs.find((p) => p.id === id);
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
    if (
      editingProgramId &&
      newProgram.title.trim() &&
      newProgram.description.trim()
    ) {
      const updatedPrograms = programs.map((program) =>
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

  // Sort programs by orderIndex before rendering
  const sortedPrograms = [...programs].sort(
    (a, b) => a.orderIndex - b.orderIndex
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {programs.length} programme(s)
        </span>
      </div>

      {/* Programs List */}
      <div className="space-y-4">
        {sortedPrograms.map((program, index) => (
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
                      {program.orderIndex + 1}
                    </span>
                    <h4 className="font-semibold text-lime-700">
                      {program.title}
                    </h4>
                  </div>
                  <SafeHTML
                    html={program.description}
                    className="safe-html text-muted-foreground text-sm"
                  />
                </div>
                <div className="flex gap-1">
                  <div className="flex flex-col gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div
                    onClick={() => moveProgram(program.id, "up")}
                    className={`p-1 rounded border select-none ${
                    index === 0
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "hover:bg-gray-100 cursor-pointer"
                    }`}
                    title="Move up"
                    role="button"
                    tabIndex={index === 0 ? -1 : 0}
                    onKeyPress={(e) => {
                    if ((e.key === "Enter" || e.key === " ") && index !== 0) {
                      moveProgram(program.id, "up");
                    }
                    }}
                    aria-disabled={index === 0}
                  >
                    ↑
                  </div>
                  <div
                    onClick={() => moveProgram(program.id, "down")}
                    className={`p-1 rounded border select-none ${
                    index === programs.length - 1
                      ? "opacity-50 cursor-not-allowed pointer-events-none"
                      : "hover:bg-gray-100 cursor-pointer"
                    }`}
                    title="Move down"
                    role="button"
                    tabIndex={index === programs.length - 1 ? -1 : 0}
                    onKeyPress={(e) => {
                    if (
                      (e.key === "Enter" || e.key === " ") &&
                      index !== programs.length - 1
                    ) {
                      moveProgram(program.id, "down");
                    }
                    }}
                    aria-disabled={index === programs.length - 1}
                  >
                    ↓
                  </div>
                  </div>

                  <div
                    onClick={() => {
                      handleEditProgram(program.id);
                      const el = document.getElementById("editForm");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-primary hover:text-primary/80 hover:bg-primary/10 cursor-pointer rounded p-1.5 border "
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
                    className="opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-destructive hover:text-destructive/80 hover:bg-destructive/10 cursor-pointer rounded p-1.5 border border-destructive/20"
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
        <Card className="border-2 border-dashed border-accent" id="editForm">
          <CardContent className="p-6">
            <h4 className="font-semibold text-foreground mb-4">
              {editingProgramId
                ? "Modifier le Programme"
                : "Ajouter Nouveau Programme"}
            </h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Titre du Programme <span className="text-red-600">*</span>
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
                  Description <span className="text-red-600">*</span>
                </label>
                <RichTextEditor
                  value={newProgram.description}
                  onChange={(value) =>
                    setNewProgram((prev) => ({ ...prev, description: value }))
                  }
                  className="w-full "
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
                      required
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
                  onClick={
                    editingProgramId ? handleUpdateProgram : handleAddProgram
                  }
                  disabled={
                    !newProgram.title.trim() || !newProgram.description.trim()
                  }
                  className="bg-lime-600 hover:bg-lime-700 text-white"
                >
                  {editingProgramId
                    ? "Mettre à jour le Programme"
                    : "Ajouter une Programme"}
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
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
          <ClipboardPenLine className="w-12 h-12 mx-auto mb-4 text-muted-foreground/60" />
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
