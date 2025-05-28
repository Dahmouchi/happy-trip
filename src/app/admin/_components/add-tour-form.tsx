/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";

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

type AddTourFormState = {
  title: string;
  description?: string;
  type: "NATIONAL" | "INTERNATIONAL";
  location?: string;
  priceOriginal?: number;
  priceDiscounted?: number;
  dateCard?: string;
  startDate?: Date;
  endDate?: Date;
  durationDays?: number;
  durationNights?: number;
  accommodation?: string;
  imageUrl?: string;
  destination?: string;
  activite?: string;
  inclu?: string;
  exclu?: string;
  groupType?: string;
  groupSizeMax?: number;
  showReviews: boolean;
  showDifficulty: boolean;
  showDiscount: boolean;
  difficultyLevel?: number;
  totalReviews?: number;
  averageRating?: number;
  discountPercent?: number;
  weekendsOnly: boolean;
  googleMapsLink?: string;
  accomodationType?: string;
  programs?: Array<{
    title: string;
    description?: string;
    day: number;
    date?: Date;
  }>;
  dates?: Array<{
    description?: string;
    startDate: Date;
    endDate: Date;
  
  }>;
  destinations?: string[]; // array of destination IDs or names
  categories?: string[]; // array of category IDs or names
  natures?: string[]; // array of nature IDs or names
};

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Le titre doit comporter au moins 3 caractères.",
  }),
  description: z.string().optional(),
  type: z.enum(["NATIONAL", "INTERNATIONAL"]),
  location: z.string().optional(),
  activities: z.array(z.string()).optional(),
  priceOriginal: z.coerce.number().int().positive().optional(),
  priceDiscounted: z.coerce.number().int().positive().optional(),
  dateCard: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  durationDays: z.coerce.number().int().positive().optional(),
  durationNights: z.coerce.number().int().positive().optional(),
  accommodation: z.string().optional(),
  imageURLs: z.array(z.string()).max(8).optional(),
  groupType: z.string().optional(),
  groupSizeMax: z.coerce.number().int().positive().optional(),
  showReviews: z.boolean(),
  showDifficulty: z.boolean(),
  showDiscount: z.boolean(),
  difficultyLevel: z.coerce.number().int().min(1).max(5).optional(),
  discountPercent: z.coerce.number().int().min(0).max(100).optional(),
  weekendsOnly: z.boolean(),
  vacationStyles: z.array(z.string()).optional(),
  googleMapsLink: z.string().url().optional(),
  programs: z
    .array(
      z.object({
        title: z.string(),
        description: z.string().optional(),
        day: z.coerce.number().int().positive(),
        date: z.date().optional(),
      })
    )
    .optional(),
  dates: z
    .array(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
      })
    )
    .optional(),
  destinations: z.array(z.string()).optional(),
  categories: z.array(z.string()).optional(),
  natures: z.array(z.string()).optional(),
});


export  function AddTourForm({ nationalDestinations, internationalDestinations, categories, natures}: any) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [files, setFiles] = useState<File[] | null>(null);


  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: "",
      description: "",
      type: "NATIONAL",
      location: "",
      activities: [],
      priceOriginal: undefined,
      priceDiscounted: undefined,
      startDate: undefined,
      endDate: undefined,
      durationDays: undefined,
      durationNights: undefined,
      accommodation: "",
      imageURLs: [],
      groupType: "",
      groupSizeMax: undefined,
      showReviews: false,
      showDifficulty: false,
      showDiscount: false,
      difficultyLevel: undefined,
      discountPercent: undefined,
      weekendsOnly: false,
      vacationStyles: [],
      googleMapsLink: "",
      programs: [],
      dates: [],
      destinations: [],
      categories: [],
      natures: [],
    },
    },
  );

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);

      // Call the server action to add the tour
      const result = await addTour({
        ...values,
        vacationStyles: values.vacationStyles ?? [],
      });

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
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Basic Information */}
              <div className="space-y-4 ">
                <h3 className="text-lime-600 text-lg font-medium">Informations de base</h3>
                <p className="text-lime-800 text-sm  mb-4">Entrez les détails de base du circuit.</p>
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
                              <SelectValue placeholder="selectionnez le type de circuit" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="NATIONAL">National</SelectItem>
                            <SelectItem value="INTERNATIONAL">
                              International
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                    />


                    {/* national and international destinations */}

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => {
                      const selectedType = form.watch("type")
                      const destinations =
                        selectedType === "INTERNATIONAL"
                        ? internationalDestinations
                        : nationalDestinations
  
                      return (
                        <FormItem>
                        <FormLabel>
                          {selectedType === "INTERNATIONAL"
                          ? "Destination internationale"
                          : "Destination nationale"}
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={typeof field.value === "string" ? field.value : ""} >
                          <FormControl>
                          <SelectTrigger>
                            <SelectValue
                            placeholder={
                              selectedType === "INTERNATIONAL"
                              ? "Sélectionnez la destination internationale"
                              : "Sélectionnez la destination nationale"
                            }
                            />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                          {destinations.map((dest: { id: Key | null | undefined; name: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }) => (
                            <SelectItem key={dest.id} value={String(dest.name)}>
                            {dest.name}
                            </SelectItem>
                          ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                      )
                        }}
                      />

                      {/* activities  */}

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




                  {/* image de base du circuit */}

                      <FormField
                        control={form.control}
                        name="imageURLs"
                        render={() => (
                          <FormItem>
                            <FormLabel>Images d circuit</FormLabel>
                            <FormDescription>
                              Ajoutez une image principale pour ce circuit
                            </FormDescription>
                           
                            <FileUploader
                              value={files}
                              onValueChange={setFiles}
                              dropzoneOptions={{
                                maxFiles: 1,
                                maxSize: 1 * 1024 * 1024, // 5MB
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
                                {files?.map((file, index) => (
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

                      
                 

                    {/* difficulty level of the tour */}
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
                    name="description"
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
                  
                {/* programms information */}
                <div>
                <h3 className="text-lime-600 text-lg font-medium">Informations sur le programmes</h3>
                <p className="text-lime-800 text-sm  mb-4">Définissez les détails du programmes pour le circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                    <div >
                    <ProgramForm
                      programs={
                        (form.watch("programs") || []).map((p: any, idx: number) => ({
                          id: p.id ?? idx.toString(),
                          title: p.title,
                          description: p.description,
                          image: p.image ?? "",
                        }))
                      }
                      onChange={(programs: any[]) => {
                        form.setValue(
                          "programs",
                          programs.map(({ id, image, ...rest }) => rest)
                        );
                      }}
                    />
                    </div>
                </div>
              </div>





              {/* Pricing Information */}
              <div>
                <h3 className="text-lime-600 text-lg font-medium">Informations sur les prix</h3>
                <p className="text-lime-800 text-sm  mb-4">Définissez les détails de prix pour le circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="priceOriginal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix original</FormLabel>
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
                          <FormLabel>Prix réduit</FormLabel>
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
                          <FormLabel>Pourcentage de réduction</FormLabel>
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
              <div>
                <h3 className="text-lime-600 text-lg font-medium">Dates et durée</h3>
                <p className="text-lime-800 text-sm  mb-4">Définissez les dates et la durée du circuit.</p>
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
               <div>
                <h3 className="text-lime-600 text-lg font-medium">Inclus & Exclus</h3>
                <p className="text-lime-800 text-sm  mb-4">Définissez les inclus et les exlus du circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <StringLoop
                    title="Inclus"
                    type="inclus"
                    description="Liste des éléments inclus dans le circuit"
                    />
                  <StringLoop
                    title="Exclus"
                    type="exclus"
                    description="Liste des éléments exclus du circuit"
                    />
                </div>
              </div>



              {/* Additional Details */}
              <div>
                <h3 className="text-lime-600 text-lg font-medium">Détails supplémentaires</h3>
                <p className="text-lime-800 text-sm  mb-4">Définissez des détails supplémentaires pour le circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  
                      {/* Image URLs 9 max */}
                      <FormField
                        control={form.control}
                        name="imageURLs"
                        render={() => (
                          <FormItem>
                            <FormLabel>Images du circuit</FormLabel>
                            <FormDescription>
                              Ajoutez les URLs de 8 images pour ce circuit
                            </FormDescription>
                           
                            <FileUploader
                              value={files}
                              onValueChange={setFiles}
                              dropzoneOptions={{
                                maxFiles: 9,
                                maxSize: 9 * 1024 * 1024, // 5MB
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
                                {files?.map((file, index) => (
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
              <div>
                <h3 className="text-lime-600 text-lg font-medium">Options d&apos;affichage</h3>
                <p className="text-lime-800 text-sm  mb-4">Configurez la façon dont le circuit est affiché.</p>
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
            <Button type="submit" size="lg" className="bg-[#6EC207] text-white hover:bg-[#5BA906] hover:cursor-pointer mr-8">
            Créer le circuit
          </Button>
        </div>
      </form>
    </Form>
  );
}
