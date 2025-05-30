/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Check, ChevronsUpDown, Images } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {FileUploader, FileUploaderContent, FileUploaderItem, FileInput} from "@/components/ui/file-upload";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { addTour } from "@/actions/toursActions";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useState } from "react";
import { toast } from "react-toastify";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import Loading from "@/components/Loading";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { get } from "http";
import { getNatures } from "@/actions/natures";
import { getInternationalDestinations, getNationalDestinations } from "@/actions/destinations";
import { Tour } from "@prisma/client";
import ProgramForm from "@/app/admin/_components/programs-form";
import DateForm from "@/app/admin/_components/dates-form";
import StringLoop from "@/app/admin/_components/inclus-exlus-loop";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import sharp from "sharp";
import { useEffect } from "react";
import { setgid } from "process";



const tourSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise").optional(),
  type: z.enum(["NATIONAL", "INTERNATIONAL"]),
  priceOriginal: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Le prix doit être positif").optional()),
  priceDiscounted: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Le prix doit être positif").optional()),
  dateCard: z.string().optional(),
  durationDays: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(1, "Au moins 1 jour").optional()),
  durationNights: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(0, "Nuits >= 0").optional()),
  imageURL: z.instanceof(File).optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  groupType: z.string().optional(),
  groupSizeMax: z.preprocess((val) => val === "" ? undefined : typeof val === "string" ? Number(val) : val, z.number().min(1, "Taille min 1").optional()),
  showReviews: z.boolean().default(true),
  showDifficulty: z.boolean().default(true),
  showDiscount: z.boolean().default(true),
  difficultyLevel: z.number().min(1).max(5).optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  discountPercent: z.number().min(0).max(100).optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
  weekendsOnly: z.boolean().default(false),
  accommodationType: z.string().optional(),
  googleMapsLink: z.string().url("Lien Google Maps invalide").optional().or(z.literal("")),
  programs: z
  .array(
    z.object({
      title: z.string().min(1, "Titre requis"),
      description: z.string().optional(),
      image: z
        .union([z.instanceof(File), z.string()])
        .optional()
        .transform((val) => {
          if (val === "" || val === undefined) return undefined;
          return val;
        }),
    })
  )
  .optional(),

  dates: z.array(
    z.object({
      startDate: z.date(),
      endDate: z.date(),
      description: z.string().optional(),
    })
  ).optional(),
  images: z.array(
    z.object({
      link: z.instanceof(File).optional().or(z.literal("")).transform(val => val === "" ? undefined : val),
    })
  ),
  destinations: z.array(z.string()),
  categories: z.array(z.string()),
  natures: z.array(z.string()),
  inclus: z.string(),
  exclus: z.string(),
  arrayInclus: z.array(z.string()),
  arrayExlus: z.array(z.string()),
});


export  function AddTourForm({ nationalDestinations, internationalDestinations, categories, natures}: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cardImage, setCardImage] = useState<File | null>(null);
  const [gallery, setGallery] = useState<File[] | null>(null);
  const [programsFiles, setProgramsFiles] = useState<File[]>([]);


  const form = useForm<z.infer<typeof tourSchema>>({
    defaultValues: {
      title: "",
      description: "",
      type: "NATIONAL", 
      priceOriginal: undefined,
      priceDiscounted: undefined,
      dateCard: "",
      durationDays: undefined,
      durationNights: undefined,
      imageURL: undefined,
      groupType: "",
      groupSizeMax: undefined,
      showReviews: true,         // Prisma default: true
      showDifficulty: true,      // Prisma default: true
      showDiscount: true,        // Prisma default: true
      difficultyLevel: undefined,
      discountPercent: undefined,
      weekendsOnly: false,       // Prisma default: false
      accommodationType: "",
      googleMapsLink: "",
      inclus: "",
      exclus :"",
      programs: [],
      dates: [],
      destinations: [],
      categories: [],
      natures: [],
      images: [],
      arrayInclus:[],
      arrayExlus: [], 
    },
  });



    useEffect(() => {
    // Main image (imageURL)
      if (cardImage) {
        form.setValue("imageURL", cardImage);
      } else {
         form.setValue("imageURL", undefined);
      }

    // Gallery images
      if (gallery && gallery.length > 0) {
        const imageObjects = gallery.map((file) => ({ link: file }));
        form.setValue("images", imageObjects);
      } else {
        form.setValue("images", []);
      }
      console.log("gallery", gallery);

    // // Programs images

  }, [cardImage, gallery, programsFiles, form]);

  async function onSubmit(values: z.infer<typeof tourSchema>) {


    try {
      setIsSubmitting(true);

      // Call the server action to add the tour
      const { programs, dates, images,  ...restValues } = values;
      const formData = { 
        ...restValues, 
        programs, 
        dates, 
        images,
        inclus: Array.isArray(values.arrayInclus) ? values.arrayInclus.join(';') : values.inclus,
        exclus: Array.isArray(values.arrayExlus) ? values.arrayExlus.join(';') : values.exclus,

      };
      console.log(values.arrayInclus);

      const result = await addTour(formData);

      if (result.success) {
        toast.success("Circuit créé avec succès");
        setIsSubmitting(false);
        // Reset the form after successful submission
        form.reset();
      } else {
        // Show error message
        toast.error("Erreur lors de la création du circuit");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Erreur lors de la création du circuit");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return <Loading />;
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card className="border border-none">
          <CardContent className="pt-6 ">
            <div className="space-y-8 ">
              {/* Basic Information */}
              <div className="space-y-4 p-6 shadow-lg rounded-lg border border-gray-200">
                <h3 className="text-lime-600 text-xl font-medium">Informations de base</h3>
                <p className="text-lime-800 text-md  mb-4">Entrez les détails de base du circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Entrez le titre du circuit"
                            required
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start w-full">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <div className="w-full flex justify-start">
                        <div className="w-full md:w-[50%]">
                          <RichTextEditor
                          value={field.value || ""}
                          onChange={field.onChange}
                          className="max-h-60 w-full overflow-auto"
                          />
                        </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                    )}
                    />

                


                    {/* Tour type (national or international) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-8">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de circuit</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le type de circuit" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="NATIONAL">National</SelectItem>
                              <SelectItem value="INTERNATIONAL">International</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* national and international destinations (multi-select) */}
                    <FormField
                      control={form.control}
                      name="destinations"
                      render={({ field }) => {
                        const selectedType = form.watch("type");
                        const destinations =
                          selectedType === "INTERNATIONAL"
                            ? internationalDestinations
                            : nationalDestinations;

                        return (
                          <FormItem>
                            <FormLabel>
                              {selectedType === "INTERNATIONAL"
                                ? "Destinations internationales"
                                : "Destinations nationales"}
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="outline" role="combobox" className="w-fit justify-between">
                                  {field.value && field.value.length > 0
                                    ? destinations
                                        .filter((dest: any) => Array.isArray(field.value) && field.value.includes(dest.id))
                                        .map((dest: any) => dest.name)
                                        .join(", ")
                                    : "Sélectionnez la/les destination(s)"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Rechercher une destination..." />
                                  <CommandList>
                                    <CommandEmpty>Aucune destination trouvée.</CommandEmpty>
                                    <CommandGroup>
                                      {destinations.map((dest: any) => (
                                        <CommandItem
                                          key={dest.id}
                                          value={dest.id}
                                          onSelect={() => {
                                            const currentValue = Array.isArray(field.value) ? [...field.value] : [];
                                            const index = currentValue.indexOf(dest.id);
                                            if (index === -1) {
                                              field.onChange([...currentValue, dest.id]);
                                            } else {
                                              currentValue.splice(index, 1);
                                              field.onChange(currentValue);
                                            }
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value && field.value.includes(dest.id) ? "opacity-100" : "opacity-0"
                                            )}
                                          />
                                          {dest.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Sélectionnez une ou plusieurs destinations associées à ce circuit.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                      {/* activities  (natures)*/}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-8">
                      <FormField
                        control={form.control}
                        name="natures"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nature(s)</FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button variant="outline" role="combobox" className="w-fit justify-between">
                                    {field.value && field.value.length > 0
                                      ? natures
                                          .filter((nature: any) => (Array.isArray(field.value) ? field.value.includes(nature.id) : false))
                                          .map((nature: any) => nature.name)
                                          .join(", ")
                                      : "Sélectionnez la/les nature(s)"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                  <Command>
                                    <CommandInput placeholder="Rechercher une nature..." />
                                    <CommandList>
                                      <CommandEmpty>Aucune nature trouvée.</CommandEmpty>
                                      <CommandGroup>
                                        {natures.map((nature: any) => (
                                          <CommandItem
                                            key={nature.id}
                                            value={nature.id}
                                            onSelect={() => {
                                              const currentValue = Array.isArray(field.value) ? [...field.value] : [];
                                              const index = currentValue.indexOf(nature.id);
                                              if (index === -1) {
                                                field.onChange([...currentValue, nature.id]);
                                              } else {
                                                currentValue.splice(index, 1);
                                                field.onChange(currentValue);
                                              }
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value && field.value.includes(nature.id) ? "opacity-100" : "opacity-0"
                                              )}
                                            />
                                            {nature.name}
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormDescription>Sélectionnez toutes les natures associées à ce circuit</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                             {/* groupe type or category */}
                  <FormField
                    control={form.control}
                    name="categories"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catégorie</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange([value])}
                            value={Array.isArray(field.value) && field.value.length > 0 ? field.value[0] : ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez la catégorie" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((cat: any) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                  {cat.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormDescription>Sélectionnez la catégorie associée à ce circuit</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>




                    <FormField
                      control={form.control}
                      name="imageURL"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image du circuit</FormLabel>
                          <FormDescription>
                            Ajoutez une image principale pour ce circuit
                          </FormDescription>

                          <FileUploader
                            value={cardImage ? [cardImage] : null}
                            onValueChange={(files) => setCardImage(files && files.length > 0 ? files[0] : null)}
                            dropzoneOptions={{
                              maxFiles: 1,
                              maxSize: 1 * 1024 * 1024, // 1MB
                              accept: {
                                "image/*": [".jpg", ".jpeg", ".png", ".gif"],
                              },
                              multiple: false,
                            }}
                            className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                            orientation="vertical"
                          >
                            <FileInput className="border-2 border-dashed p-6 text-center hover:bg-gray-50">
                              <p className="text-gray-500">
                                Glissez-déposez une image ici ou cliquez pour parcourir.
                              </p>
                            </FileInput>

                            <FileUploaderContent className="mt-4">
                             
                                <FileUploaderItem index={0} >
                                  <span className="truncate max-w-[200px]">{cardImage ? cardImage.name : ""}</span>
                                </FileUploaderItem>
                            </FileUploaderContent>
                          </FileUploader>

                          {field.value && (
                            <div className="mt-4">
                              <p className="text-sm text-gray-500">Image actuelle :</p>
                              <img
                                src={field.value}
                                alt="uploaded"
                                className="w-32 h-32 object-cover rounded"
                              />
                            </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                      
                 

                    {/* difficulty level of the tour */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-8">
                     <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Niveau de difficulté (1-5)</FormLabel>
                        <Select
                          onValueChange={(value: any) =>
                            field.onChange(Number.parseInt(value))
                          }
                          defaultValue={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionnez le niveau de difficulté" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1">1 - Très facile</SelectItem>
                            <SelectItem value="2">2 - Facile</SelectItem>
                            <SelectItem value="3">3 - Modéré</SelectItem>
                            <SelectItem value="4">4 - Difficile</SelectItem>
                            <SelectItem value="5">
                              5 - Très difficile
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* accommodation type */}

                  <FormField
                    control={form.control}
                    name="accommodationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type d&apos;hébergement</FormLabel>
                        <FormControl>
                         <Input
                            placeholder="Entrez le type d'hébergement"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  </div>

                  {/* google maps  link */}

                  <FormField
                    control={form.control}
                    name="googleMapsLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lien Google Maps</FormLabel>
                        <FormControl>
                          <Input
                            type="url"
                            placeholder="Entrez le lien Google Maps de l'emplacement"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ajoutez un lien Google Maps pour la localisation du circuit.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />




                    {/* Groupe type  */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-8">
                    <FormField
                      control={form.control}
                      name="groupType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type de groupe</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez le type de groupe" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="small">Petit</SelectItem>
                                <SelectItem value="medium">Moyen</SelectItem>
                                <SelectItem value="large">Grand</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormDescription>
                            Choisissez la taille du groupe pour ce circuit.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />



                    {/* group size  */}
                    <FormField
                      control={form.control}
                      name="groupSizeMax"
                      render={({ field }) => (
                        <FormItem className="w-fit">
                          <FormLabel>Taille du groupe</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Entrez la taille du groupe"
                              min={1}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Indiquez la taille maximale du groupe pour ce circuit.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
               </div>
                </div>
              </div>
                  
                {/* programms information */}
                <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-lg font-medium">Informations sur le programmes</h3>
                <p className="text-lime-800 text-md  mb-4">Définissez les détails du programmes pour le circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                    <div >
                   <ProgramForm
                    programs={
                      (form.watch("programs") || []).map((p: any, idx: number) => ({
                        id: p.id ?? idx.toString(),
                        title: p.title,
                        description: p.description,
                        image: p.image,
                      }))
                    }
                    onChange={(programs: any[]) => {
                      form.setValue(
                        "programs",
                        programs.map(({ id, ...rest }) => rest) 
                      );
                    }}
                  />
                    </div>
                </div>
              </div>





              {/* Pricing Information */}
              <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-lg font-medium">Informations sur les prix</h3>
                <p className="text-lime-800 text-md  mb-4">Définissez les détails de prix pour le circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="priceOriginal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix original (DH)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Entrez le prix original"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priceDiscounted"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix réduit (DH)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Entrez le prix réduit"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="discountPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pourcentage de réduction (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Entrez le pourcentage de réduction"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Entrez une valeur entre 0 et 100
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Dates and Duration */}
              <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-lg font-medium">Dates et durée</h3>
                <p className="text-lime-800 text-md  mb-4">Définissez les dates et la durée du circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">

                    <FormField
                      control={form.control}
                      name="dateCard"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date du circuit (affichage carte)</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Ex: 12-15 Juin 2024"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Entrez la date du circuit telle qu&apos;elle doit apparaître sur la carte (ex: 12-15 Juin 2024).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="durationDays"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de jours</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Entrez le nombre de jours"
                              min={1}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Indiquez le nombre total de jours du circuit.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="durationNights"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre de nuits</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Entrez le nombre de nuits"
                              min={0}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Indiquez le nombre total de nuits du circuit.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="dates"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dates du circuit</FormLabel>
                        <DateForm
                          dates={
                            (field.value || []).map((d: any, idx: number) => ({
                              id: d.id ?? idx.toString(),
                              dateDebut: d.startDate ?? d.dateDebut ?? new Date(),
                              dateFin: d.endDate ?? d.dateFin ?? new Date(),
                              description: d.description ?? "",
                            }))
                          }
                          onChange={(dates) =>
                            field.onChange(
                              dates.map((d) => ({
                                startDate: (d.dateDebut && Object.prototype.toString.call(d.dateDebut) === "[object Date]") ? d.dateDebut : new Date(d.dateDebut),
                                endDate: (d.dateFin instanceof Date) ? d.dateFin : new Date(d.dateFin),
                                description: d.description,
                              }))
                            )
                          }
                        />
                        <FormDescription>
                          Ajoutez une ou plusieurs périodes pour ce circuit. Chaque période doit contenir une date de début, une date de fin et une description optionnelle.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>



              {/* inclus et exclus */}
               <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-lg font-medium">Inclus & Exclus</h3>
                <p className="text-lime-800 text-md  mb-4">Définissez les inclus et les exlus du circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4 grid lg:grid-cols-2 grid-cols-1 gap-4 ">
                  <StringLoop
                  title="Inclus"
                  type="inclus"
                  description="Liste des éléments inclus dans le circuit"
                  onChange={(value) => {
                    form.setValue("arrayInclus", Array.isArray(value) ? value : [value]);
                  }}
                  />
                  <StringLoop
                  title="Exclus"
                  type="exclus"
                  description="Liste des éléments exclus du circuit"
                  onChange={(value) => {
                    form.setValue("arrayExlus", Array.isArray(value) ? value : [value]);
                  }}
                  />
                </div>
              </div>



              {/* Additional Details */}
              <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-lg font-medium">Détails supplémentaires</h3>
                <p className="text-lime-800 text-md  mb-4">Définissez des détails supplémentaires pour le circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  
                      {/* Image URLs 9 max */}
                      <FormField
                        control={form.control}
                        name="images"
                        render={() => (
                          <FormItem>
                            <FormLabel>Images du circuit</FormLabel>
                            <FormDescription>
                              Ajoutez les URLs de 9 images pour ce circuit
                            </FormDescription>
                           
                            <FileUploader
                              value={gallery}
                              onValueChange={setGallery}
                              dropzoneOptions={{
                                maxFiles: 9,
                                maxSize: 9 * 1024 * 1024,
                                accept: {
                                  "image/*": [".jpg", ".jpeg", ".png", ".gif"],
                                  "application/pdf": [".pdf"],
                                },
                                multiple: true,
                              }}
                              className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
                              orientation="vertical"
                            >
                              <FileInput className="border-2 border-dashed p-6 text-center hover:bg-gray-50">
                                <p className="text-gray-500">Glissez-déposez vos fichiers ici ou cliquez pour parcourir.</p>
                              </FileInput>

                              <FileUploaderContent className="mt-4">
                                {gallery?.map((file, index) => (
                                  <FileUploaderItem key={index} index={index}>
                                    <span className="truncate max-w-[200px]">{file.name}</span>
                                  </FileUploaderItem>
                                ))}
                              </FileUploaderContent>
                            </FileUploader>
                                                
                                                  
                                  <FormMessage />
                              </FormItem>
                                  )}
                              />

                 
                </div>
              </div>

              {/* Display Options */}
              <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-lg font-medium">Options d&apos;affichage</h3>
                <p className="text-lime-800 text-md  mb-4">Configurez la façon dont le circuit est affiché.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="showReviews"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Afficher les avis</FormLabel>
                            <FormDescription>
                              Afficher les avis pour ce circuit
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showDifficulty"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Afficher la difficulté</FormLabel>
                            <FormDescription>
                              Afficher le niveau de difficulté pour ce circuit
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="showDiscount"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Show Discount</FormLabel>
                            <FormDescription>
                              Display discount information for this tour
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

               
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button type="submit" size="lg" className="bg-lime-600 text-white hover:bg-lime-700 hover:cursor-pointer mr-8">
            Créer le circuit
          </Button>
        </div>
      </form>
    </Form>
  );
}
