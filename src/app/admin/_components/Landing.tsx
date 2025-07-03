/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { saveLandingConfig } from "@/actions/saveLandingConfig";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-upload";

export default function PageControl({ initialData }: { initialData: any }) {
  const [sections, setSections] = useState(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [cardImage, setCardImage] = useState<File[] | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(initialData.imageHero);

  const handleToggle = (sectionName: string, enabled: boolean) => {
    setSections((prev: any) => ({ ...prev, [sectionName]: enabled }));
    setHasChanges(true);
  };

  const handleTextChange = (fieldName: string, value: string) => {
    setSections((prev: any) => ({
      ...prev,
      [fieldName]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveLandingConfig(sections, cardImage);
      toast.success("Changes saved successfully!");
      setHasChanges(false);
      // Update the image preview after saving if a new image was uploaded
      if (cardImage && cardImage.length > 0) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(cardImage[0]);
      }
    } catch (error) {
      toast.error("Failed to save changes");
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle image preview when file is selected
  useEffect(() => {
    if (cardImage && cardImage.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(cardImage[0]);
      setHasChanges(true);
    }
  }, [cardImage]);

  const handleReload = () => {
    // Reset to initial data
    setSections(initialData);
    setCardImage(null);
    setImagePreview(initialData.imageHero);
    setHasChanges(false);
    toast.info("Changes reverted to original state");
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Landing Page Configuration</h1>
          <p className="text-muted-foreground">
            Customize your landing page content and sections
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleReload}
            disabled={!hasChanges || isSaving}
          >
            Reload
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className="bg-[#6EC207] hover:bg-[#5BA906] text-white"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Hero Section Configuration */}
      <div className="bg-white p-6 rounded-lg shadow mb-8 border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          Hero Section Configuration
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 col-span-2">
            <Label htmlFor="imageHero">Hero Image</Label>
            <div className="flex items-start gap-2">
              <FileUploader
                value={cardImage}
                onValueChange={setCardImage}
                dropzoneOptions={{
                  maxFiles: 1,
                  maxSize: 10 * 1024 * 1024,
                  accept: {
                    "image/*": [".jpg", ".jpeg", ".png", ".gif"],
                  },
                }}
                className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm w-1/2"
                orientation="vertical"
              >
                <FileInput className="border-2 border-dashed p-6 text-center hover:bg-gray-50">
                  <p className="text-gray-500">
                    Drag and drop your image here or click to browse
                  </p>
                </FileInput>

                <FileUploaderContent className="mt-4">
                  {cardImage?.map((file, index) => (
                    <FileUploaderItem key={index} index={index}>
                      <span className="truncate max-w-[200px]">
                        {file.name}
                      </span>
                    </FileUploaderItem>
                  ))}
                </FileUploaderContent>
              </FileUploader>
              <div className="w-1/2 h-auto rounded overflow-hidden border border-gray-200 shadow-sm mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="titleHero">Main Title</Label>
            <Input
              id="titleHero"
              value={sections?.titleHero || ""}
              onChange={(e) => handleTextChange("titleHero", e.target.value)}
              placeholder="Enter main title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subTitleHero">Subtitle Line 1</Label>
            <Input
              id="subTitleHero"
              value={sections?.subTitleHero || ""}
              onChange={(e) => handleTextChange("subTitleHero", e.target.value)}
              placeholder="Enter first subtitle"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subTitleHero1">Subtitle Line 2</Label>
            <Input
              id="subTitleHero1"
              value={sections?.subTitleHero1 || ""}
              onChange={(e) =>
                handleTextChange("subTitleHero1", e.target.value)
              }
              placeholder="Enter second subtitle"
            />
          </div>
        </div>
      </div>

      {/* Rest of your component remains the same */}
      {/* Section Toggles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <SectionToggle
          name="navbar"
          label="Top Bar"
          enabled={sections?.navbar}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="search"
          label="Search Input"
          enabled={sections?.search}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="hero"
          label="Hero Section"
          enabled={sections?.hero}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="thisMount"
          label="Voyage de ce mois"
          enabled={sections?.thisMount}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="national"
          label="National Section"
          enabled={sections?.national}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="international"
          label="International Section"
          enabled={sections?.international}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="mesure"
          label="Mesure Section"
          enabled={sections?.mesure}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="reviews"
          label="Reviews Section"
          enabled={sections?.reviews}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="meeting"
          label="Meeting Section"
          enabled={sections?.meeting}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="expert"
          label="Expert Section"
          enabled={sections?.expert}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="trust"
          label="Trust Section"
          enabled={sections?.trust}
          onToggle={handleToggle}
        />
        <SectionToggle
          name="footer"
          label="Footer"
          enabled={sections?.footer}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}

function SectionToggle({
  name,
  label,
  enabled,
  onToggle,
}: {
  name: string;
  label: string;
  enabled?: boolean;
  onToggle: (name: string, enabled: boolean) => void;
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow border">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium">{label}</h3>
          <p className="text-sm text-muted-foreground">
            {enabled ? "Visible on page" : "Hidden from page"}
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => onToggle(name, checked)}
          className="data-[state=checked]:bg-[#6EC207]"
        />
      </div>
    </div>
  );
}