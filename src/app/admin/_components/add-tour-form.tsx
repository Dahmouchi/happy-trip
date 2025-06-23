/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Banknote,
  BedDouble,
  Calendar,
  CalendarIcon,
  Check,
  CheckSquare,
  ChevronsUpDown,
  ClipboardPenLine,
  EyeIcon,
  Hotel,
  Images,
  ImagesIcon,
  Info,
} from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
  FileInput,
} from "@/components/ui/file-upload";
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
import { addTour, checkTourIdExists } from "@/actions/toursActions";
import {
  JSXElementConstructor,
  Key,
  ReactElement,
  ReactNode,
  ReactPortal,
  useState,
} from "react";
import { toast } from "react-toastify";
import { DatetimePicker } from "@/components/ui/datetime-picker";
import Loading from "@/components/Loading";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { get } from "http";
import { getNatures } from "@/actions/natures";
import {
  getInternationalDestinations,
  getNationalDestinations,
} from "@/actions/destinations";
import { Tour } from "@prisma/client";
import ProgramForm from "@/app/admin/_components/programs-form";
import DateForm from "@/app/admin/_components/dates-form";
import StringLoop from "@/app/admin/_components/inclus-exlus-loop";
import { getFileUrl, uploadFile } from "@/lib/cloudeFlare";
import sharp from "sharp";
import { useEffect } from "react";
import { setgid } from "process";
import { Switch } from "@radix-ui/react-switch";

const tourSchema = z.object({
  id: z.string(),
  active: z.boolean().default(true),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  type: z.enum(["NATIONAL", "INTERNATIONAL"]),
  priceOriginal: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(0, "Le prix doit être positif")
  ),
  priceDiscounted: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(0, "Le prix doit être positif").optional()
  ),
  discountEndDate: z
    .date()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  advancedPrice: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(0, "Le prix doit être positif").optional()
  ),
  dateCard: z.string(),
  durationDays: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(1, "Au moins 1 jour")
  ),
  durationNights: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(0, "Nuits >= 0")
  ),
  videoUrl: z
    .string()
    .url("URL de la vidéo invalide")
    .optional()
    .or(z.literal("")),
  imageURL: z
    .instanceof(File)
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  groupType: z.string(),
  groupSizeMax: z.preprocess(
    (val) =>
      val === "" ? undefined : typeof val === "string" ? Number(val) : val,
    z.number().min(1, "Taille min 1")
  ),
  showReviews: z.boolean().default(true),
  showDifficulty: z.boolean().default(true),
  showDiscount: z.boolean().default(true),
  difficultyLevel: z
    .number()
    .min(1)
    .max(5)
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  discountPercent: z
    .number()
    .min(0)
    .max(100)
    .optional()
    .or(z.literal(""))
    .transform((val) => (val === "" ? undefined : val)),
  accommodationType: z.string(),
  googleMapsUrl: z
    .string()
    .url("Lien Google Maps invalide")
    .optional()
    .or(z.literal("")),
  programs: z
    .array(
      z.object({
        title: z.string().min(1, "Titre requis"),
        orderIndex: z.number().optional(),
        description: z.string(),
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

  dates: z
    .array(
      z.object({
        startDate: z.date(),
        endDate: z.date(),
        description: z.string().optional(),
        visible: z.boolean().default(true),
      })
    )
    .optional(),
  images: z
    .array(
      z.object({
        link: z
          .instanceof(File)
          .or(z.literal(""))
          .transform((val) => (val === "" ? undefined : val)),
      })
    )
    .optional(),

  destinations: z.array(z.string()),
  categories: z.array(z.string()),
  services: z.array(z.string()),
  natures: z.array(z.string()),
  hotels: z.array(z.string()).optional(),
  inclus: z.string(),
  exclus: z.string(),
  arrayInclus: z.array(z.string()),
  arrayExlus: z.array(z.string()),
});

export function AddTourForm({
  nationalDestinations,
  internationalDestinations,
  categories,
  natures,
  services,
  hotels,
}: any) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cardImage, setCardImage] = useState<File[] | null>(null);
  const [gallery, setGallery] = useState<File[] | null>(null);

  const form = useForm<z.infer<typeof tourSchema>>({
    defaultValues: {
      active: true, // Prisma default: true
      title: "",
      description: "",
      type: "NATIONAL",
      priceOriginal: undefined,
      priceDiscounted: undefined,
      discountEndDate: undefined,
      advancedPrice: 0,
      dateCard: "",
      durationDays: undefined,
      durationNights: undefined,
      videoUrl: "",
      imageURL: undefined,
      groupType: "",
      groupSizeMax: undefined,
      showReviews: true, // Prisma default: true
      showDifficulty: true, // Prisma default: true
      showDiscount: true, // Prisma default: true
      difficultyLevel: undefined,
      discountPercent: 0,
      accommodationType: "",
      googleMapsUrl: "",
      inclus: "",
      exclus: "",
      hotels: [],
      services: [],
      programs: [],
      dates: [],
      destinations: [],
      categories: [],
      natures: [],
      images: [],
      arrayInclus: [],
      arrayExlus: [],
    },
  });

  useEffect(() => {
    // Main image (imageURL)
    if (cardImage && cardImage.length > 0) {
      form.setValue("imageURL", cardImage[0]);
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
  }, [cardImage, gallery, form]);

  async function onSubmit(values: z.infer<typeof tourSchema>) {
    try {
      setIsSubmitting(true);

      const { programs, dates, images, ...restValues } = values;
      const formData = {
        ...restValues,
        programs,
        dates: dates
          ? dates.map((d: any) => ({
              ...d,
              visible: d.visible !== undefined ? d.visible : true,
            }))
          : undefined,
        images,
        inclus: Array.isArray(values.arrayInclus)
          ? values.arrayInclus.join(";")
          : values.inclus,
        exclus: Array.isArray(values.arrayExlus)
          ? values.arrayExlus.join(";")
          : values.exclus,
      };

      const result = await addTour(formData);

      if (result.success) {
        toast.success("Circuit créé avec succès");
        setIsSubmitting(false);
        form.reset();
        setCardImage(null);
        setGallery(null);
      } else {
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
          <CardContent className=" ">
            <div className="space-y-8 ">
              {/* Basic Information */}
              <div className="space-y-4 p-6 shadow-lg rounded-lg border border-gray-200">
                <h3 className="text-lime-600 text-l font-medium">
                  <Info className="inline mr-2" />
                  Informations de base
                </h3>
                <p className="text-lime-800 text-md  mb-4">
                  Entrez les détails de base du circuit.
                </p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 align-middle">
                    <FormField
                      control={form.control}
                      name="id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            ID du circuit{" "}
                            <span className="text-red-600">*</span>{" "}
                            <span className="text-red-600 font-semibold italic">
                              (ID non modifiable après la création du circuit.)
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="ID du circuit (doit être unique)"
                              {...field}
                              onBlur={async () => {
                                if (field.value) {
                                  try {
                                    const res = await checkTourIdExists(
                                      field.value
                                    );
                                    if (res.exists) {
                                      form.setError("id", {
                                        type: "manual",
                                        message: "Cet ID est déjà utilisé.",
                                      });
                                    } else {
                                      form.clearErrors("id");
                                    }
                                  } catch (err) {
                                    form.setError("id", {
                                      type: "manual",
                                      message:
                                        "Erreur lors de la vérification de l'ID",
                                    });
                                  }
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            L&apos;identifiant du circuit doit être unique.
                            Veuillez choisir un ID qui n&apos;est pas déjà
                            utilisé.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Titre <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Entrez le titre du circuit"
                              required
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Entrez le titre du circuit.
                          </FormDescription>{" "}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="active"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 mt-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-6 w-6 hover:cursor-pointer"
                            />
                          </FormControl>{" "}
                          <FormLabel>
                            {field.value ? "Actif" : "Inactif"}
                          </FormLabel>
                          <FormDescription>
                            {field.value
                              ? "Décochez pour désactiver ce circuit."
                              : "Cochez pour activer ce circuit."}
                          </FormDescription>{" "}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="flex flex-col items-start w-full">
                        <FormLabel>
                          Description<span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <div className="w-full flex justify-start">
                            <div className="w-full">
                              <RichTextEditor
                                value={field.value || ""}
                                onChange={field.onChange}
                                className="w-full" // Remove max-h and overflow
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
                          <FormLabel>
                            Type de circuit{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
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
                              <SelectItem value="INTERNATIONAL">
                                International
                              </SelectItem>
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
                              <span className="text-red-600">*</span>
                            </FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-fit justify-between"
                                  style={{
                                    maxWidth: "100%",
                                    whiteSpace: "normal",
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {field.value && field.value.length > 0
                                    ? `${field.value.length} destination(s) sélectionnée(s)`
                                    : "Sélectionnez la/les destination(s)"}{" "}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Rechercher une destination..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      Aucune destination trouvée.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {destinations.map((dest: any) => (
                                        <CommandItem
                                          key={dest.id}
                                          value={dest.id}
                                          onSelect={() => {
                                            const currentValue = Array.isArray(
                                              field.value
                                            )
                                              ? [...field.value]
                                              : [];
                                            const index = currentValue.indexOf(
                                              dest.id
                                            );
                                            if (index === -1) {
                                              field.onChange([
                                                ...currentValue,
                                                dest.id,
                                              ]);
                                            } else {
                                              currentValue.splice(index, 1);
                                              field.onChange(currentValue);
                                            }
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value &&
                                                field.value.includes(dest.id)
                                                ? "opacity-100"
                                                : "opacity-0"
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
                            <FormDescription
                              style={{
                                maxWidth: "100%",
                                whiteSpace: "normal",
                                overflowWrap: "break-word",
                                wordBreak: "break-word",
                              }}
                            >
                              Sélectionnez une ou plusieurs destinations
                              associées à ce circuit.
                            </FormDescription>
                            {/* Show selected destinations */}
                            {Array.isArray(field.value) &&
                              field.value.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {destinations
                                    .filter((dest: any) =>
                                      field.value.includes(dest.id)
                                    )
                                    .map((dest: any) => (
                                      <span
                                        key={dest.id}
                                        className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                                      >
                                        {dest.name}
                                      </span>
                                    ))}
                                </div>
                              )}
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>{" "}
                  {/* activities  (natures)*/}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 my-8">
                    {/* Natures */}
                    <FormField
                      control={form.control}
                      name="natures"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Nature(s) <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between whitespace-normal text-left"
                                  style={{
                                    maxWidth: "100%",
                                    whiteSpace: "normal",
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {field.value && field.value.length > 0
                                    ? `${field.value.length} nature(s) sélectionnée(s)`
                                    : "Sélectionnez la/les nature(s)"}{" "}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Rechercher une nature..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      Aucune nature trouvée.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {natures.map((nature: any) => (
                                        <CommandItem
                                          key={nature.id}
                                          value={nature.id}
                                          onSelect={() => {
                                            const currentValue = Array.isArray(
                                              field.value
                                            )
                                              ? [...field.value]
                                              : [];
                                            const index = currentValue.indexOf(
                                              nature.id
                                            );
                                            if (index === -1) {
                                              field.onChange([
                                                ...currentValue,
                                                nature.id,
                                              ]);
                                            } else {
                                              currentValue.splice(index, 1);
                                              field.onChange(currentValue);
                                            }
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value &&
                                                field.value.includes(nature.id)
                                                ? "opacity-100"
                                                : "opacity-0"
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
                          <FormDescription
                            style={{
                              maxWidth: "100%",
                              whiteSpace: "normal",
                              overflowWrap: "break-word",
                              wordBreak: "break-word",
                            }}
                          >
                            Sélectionnez toutes les natures associées à ce
                            circuit
                          </FormDescription>
                          {/* Show selected natures */}
                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {natures
                                  .filter((nature: any) =>
                                    field.value.includes(nature.id)
                                  )
                                  .map((nature: any) => (
                                    <span
                                      key={nature.id}
                                      className="bg-lime-100 text-lime-800 px-2 py-1 rounded text-xs"
                                    >
                                      {nature.name}
                                    </span>
                                  ))}
                              </div>
                            )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Categories */}
                    <FormField
                      control={form.control}
                      name="categories"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Catégorie(s) <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-full justify-between whitespace-normal text-left"
                                  style={{
                                    maxWidth: "100%",
                                    whiteSpace: "normal",
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {field.value && field.value.length > 0
                                    ? `${field.value.length} catégorie(s) sélectionnée(s)`
                                    : "Sélectionnez la/les catégorie(s)"}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Rechercher une catégorie..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      Aucune catégorie trouvée.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {categories.map((cat: any) => (
                                        <CommandItem
                                          key={cat.id}
                                          value={cat.id}
                                          onSelect={() => {
                                            const currentValue = Array.isArray(
                                              field.value
                                            )
                                              ? [...field.value]
                                              : [];
                                            const index = currentValue.indexOf(
                                              cat.id
                                            );
                                            if (index === -1) {
                                              field.onChange([
                                                ...currentValue,
                                                cat.id,
                                              ]);
                                            } else {
                                              currentValue.splice(index, 1);
                                              field.onChange(currentValue);
                                            }
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value &&
                                                field.value.includes(cat.id)
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {cat.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormDescription>
                            Sélectionnez une ou plusieurs catégories associées à
                            ce circuit
                          </FormDescription>
                          {/* Show selected categories */}
                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {categories
                                  .filter((cat: any) =>
                                    field.value.includes(cat.id)
                                  )
                                  .map((cat: any) => (
                                    <span
                                      key={cat.id}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                    >
                                      {cat.name}
                                    </span>
                                  ))}
                              </div>
                            )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Services */}
                    <FormField
                      control={form.control}
                      name="services"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Service(s) <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className="w-fit justify-between"
                                  style={{
                                    maxWidth: "100%",
                                    whiteSpace: "normal",
                                    overflowWrap: "break-word",
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {field.value && field.value.length > 0
                                    ? `${field.value.length} service(s) sélectionné(s)`
                                    : "Sélectionnez la/les service(s)"}{" "}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="p-0">
                                <Command>
                                  <CommandInput placeholder="Rechercher une service..." />
                                  <CommandList>
                                    <CommandEmpty>
                                      Aucune service trouvée.
                                    </CommandEmpty>
                                    <CommandGroup>
                                      {services.map((service: any) => (
                                        <CommandItem
                                          key={service.id}
                                          value={service.id}
                                          onSelect={() => {
                                            const currentValue = Array.isArray(
                                              field.value
                                            )
                                              ? [...field.value]
                                              : [];
                                            const index = currentValue.indexOf(
                                              service.id
                                            );
                                            if (index === -1) {
                                              field.onChange([
                                                ...currentValue,
                                                service.id,
                                              ]);
                                            } else {
                                              currentValue.splice(index, 1);
                                              field.onChange(currentValue);
                                            }
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              field.value &&
                                                field.value.includes(service.id)
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {service.name}
                                        </CommandItem>
                                      ))}
                                    </CommandGroup>
                                  </CommandList>
                                </Command>
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormDescription>
                            Sélectionnez toutes les services associées à ce
                            circuit
                          </FormDescription>
                          {/* Show selected services */}
                          {Array.isArray(field.value) &&
                            field.value.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {services
                                  .filter((service: any) =>
                                    field.value.includes(service.id)
                                  )
                                  .map((service: any) => (
                                    <span
                                      key={service.id}
                                      className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs"
                                    >
                                      {service.name}
                                    </span>
                                  ))}
                              </div>
                            )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {/* Main image for the tour */}
                  <FormField
                    control={form.control}
                    name="imageURL"
                    render={() => (
                      <FormItem>
                        <FormLabel>
                          Images du circuit{" "}
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormDescription>
                          Ajoutez l&apos;URL de l&apos;image pour ce circuit
                        </FormDescription>

                        <FileUploader
                          value={cardImage}
                          onValueChange={setCardImage}
                          dropzoneOptions={{
                            maxFiles: 1,
                            maxSize: 1 * 1024 * 1024,
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
                            <p className="text-gray-500">
                              Glissez-déposez vos fichiers ici ou cliquez pour
                              parcourir.
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
                          <FormLabel>
                            Niveau de difficulté (1-5){" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
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
                          <FormLabel>
                            Type d&apos;hébergement{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
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
                    name="googleMapsUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lien Google Maps</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Entrez le lien Google Maps de l'emplacement"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ajoutez un lien Google Maps pour la localisation du
                          circuit.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Video URL */}
                  <FormField
                    control={form.control}
                    name="videoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lien vidéo YouTube</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Entrez le lien de la vidéo YouTube"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ajoutez un lien vers une vidéo YouTube présentant ce
                          circuit.
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
                          <FormLabel>
                            Type de groupe{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
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
                          <FormLabel>
                            Taille du groupe{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Entrez la taille du groupe"
                              min={1}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Indiquez la taille maximale du groupe pour ce
                            circuit.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Hotels Information */}
              {form.watch("type") === "INTERNATIONAL" && (
                <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                  <h3 className="text-lime-600 text-l font-medium">
                    <BedDouble className="inline mr-2" />
                    Informations sur les hotels
                  </h3>
                  <p className="text-lime-800 text-md  mb-4">
                    Définissez les hôtels associés à ce circuit.
                  </p>{" "}
                  <Separator className="mb-6" />
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4 my-8">
                      <FormField
                        control={form.control}
                        name="hotels"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hôtel(s) </FormLabel>
                            <FormControl>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    role="combobox"
                                    className="w-fit justify-between"
                                  >
                                    {field.value && field.value.length > 0
                                      ? `${field.value.length} hôtel(s) sélectionné(s)`
                                      : "Sélectionnez le(s) hôtel(s)"}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="p-0">
                                  <Command>
                                    <CommandInput placeholder="Rechercher un hôtel..." />
                                    <CommandList>
                                      <CommandEmpty>
                                        Aucun hôtel trouvé.
                                      </CommandEmpty>
                                      <CommandGroup>
                                        {hotels.map((hotel: any) => (
                                          <CommandItem
                                            key={hotel.id}
                                            value={hotel.id}
                                            onSelect={() => {
                                              const currentValue =
                                                Array.isArray(field.value)
                                                  ? [...field.value]
                                                  : [];
                                              const index =
                                                currentValue.indexOf(hotel.id);
                                              if (index === -1) {
                                                field.onChange([
                                                  ...currentValue,
                                                  hotel.id,
                                                ]);
                                              } else {
                                                currentValue.splice(index, 1);
                                                field.onChange(currentValue);
                                              }
                                            }}
                                          >
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4",
                                                field.value &&
                                                  field.value.includes(hotel.id)
                                                  ? "opacity-100"
                                                  : "opacity-0"
                                              )}
                                            />
                                            <span>
                                              {hotel.name}
                                              {hotel.price && (
                                                <span className="ml-1 text-gray-600">
                                                  ({hotel.price} DH)
                                                </span>
                                              )}
                                            </span>
                                          </CommandItem>
                                        ))}
                                      </CommandGroup>
                                    </CommandList>
                                  </Command>
                                </PopoverContent>
                              </Popover>
                            </FormControl>
                            <FormDescription>
                              Sélectionnez tous les hôtels associés à ce circuit
                            </FormDescription>
                            {/* Show selected hotels with their prices */}
                            {Array.isArray(field.value) &&
                              field.value.length > 0 && (
                                <div className="mt-2 flex flex-wrap gap-2">
                                  {hotels
                                    .filter((hotel: any) =>
                                      (field.value ?? []).includes(hotel.id)
                                    )
                                    .map((hotel: any) => (
                                      <span
                                        key={hotel.id}
                                        className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs flex items-center gap-1"
                                      >
                                        {hotel.name}
                                        {hotel.price && (
                                          <span className="ml-1 text-gray-600">
                                            ({hotel.price} DH)
                                          </span>
                                        )}
                                      </span>
                                    ))}
                                </div>
                              )}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>{" "}
                  </div>
                </div>
              )}

              {/* programms information */}
              <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-l font-medium">
                  <ClipboardPenLine className="inline mr-2" />
                  Informations sur le programmes
                </h3>
                <p className="text-lime-800 text-md  mb-4">
                  Définissez les détails du programmes pour le circuit.
                </p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <div>
                    <ProgramForm
                      programs={(form.watch("programs") || []).map(
                        (p: any, idx: number) => ({
                          id: p.id ?? uuidv4(),
                          title: p.title,
                          description: p.description,
                          image: p.image,
                          orderIndex: p.orderIndex ?? idx,
                          imagePreview: p.image, // assuming this is already a URL if it exists
                        })
                      )}
                      onChange={(programs: any[]) => {
                        form.setValue(
                          "programs",
                          programs
                            .sort((a, b) => a.orderIndex - b.orderIndex)
                            .map(({ id, imagePreview, ...rest }) => rest)
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Pricing Information */}
              <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-l font-medium">
                  <Banknote className="inline mr-2" />
                  Informations sur les prix
                </h3>
                <p className="text-lime-800 text-md mb-4">
                  Définissez les détails de prix pour le circuit.
                </p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Original Price */}
                    <FormField
                      control={form.control}
                      name="priceOriginal"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Prix original (DH){" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Entrez le prix original"
                              {...field}
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(value);

                                const discountedPrice =
                                  form.getValues("priceDiscounted") || 0;
                                if (
                                  value > 0 &&
                                  discountedPrice > 0 &&
                                  discountedPrice < value
                                ) {
                                  const discountPercent = Math.round(
                                    ((value - discountedPrice) / value) * 100
                                  );
                                  form.setValue(
                                    "discountPercent",
                                    discountPercent
                                  );
                                } else {
                                  form.setValue("discountPercent", 0);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Discounted Price */}
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
                              onChange={(e) => {
                                const value = parseFloat(e.target.value);
                                field.onChange(value);

                                const originalPrice =
                                  form.getValues("priceOriginal") || 0;
                                if (
                                  originalPrice > 0 &&
                                  value < originalPrice
                                ) {
                                  const discountPercent = Math.round(
                                    ((originalPrice - value) / originalPrice) *
                                      100
                                  );
                                  form.setValue(
                                    "discountPercent",
                                    discountPercent
                                  );
                                } else {
                                  form.setValue("discountPercent", 0);
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Discount Percentage (read-only, integer only) */}
                    <FormField
                      control={form.control}
                      name="discountPercent"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pourcentage de réduction (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              readOnly
                              value={
                                field.value !== 0
                                  ? Math.round(field.value ?? 0)
                                  : Math.round(field.value ?? 0)
                              }
                              placeholder="Calculé automatiquement"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* advance price */}
                    <FormField
                      control={form.control}
                      name="advancedPrice"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prix d&apos;avance (DH)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Entrez le prix d'avance"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* discount end date */}
                    <FormField
                      control={form.control}
                      name="discountEndDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date de fin de la réduction</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              placeholder="Sélectionnez la date de fin de la réduction"
                              value={
                                field.value instanceof Date
                                  ? field.value.toISOString().split("T")[0]
                                  : field.value || ""
                              }
                              onChange={(e) => {
                                const val = e.target.value;
                                field.onChange(val ? new Date(val) : undefined);
                              }}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormDescription>
                            Indiquez la date à laquelle la réduction prend fin.
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
                <h3 className="text-lime-600 text-l font-medium">
                  <Calendar className="inline mr-2" />
                  Dates et durée
                </h3>
                <p className="text-lime-800 text-md  mb-4">
                  Définissez les dates et la durée du circuit.
                </p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="dateCard"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Date du circuit (affichage carte){" "}
                          <span className="text-red-600">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Ex: 12-15 Juin 2024"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Entrez la date du circuit telle qu&apos;elle doit
                          apparaître sur la carte (ex: 12-15 Juin 2024).
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
                          <FormLabel>
                            Nombre de jours{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
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
                          <FormLabel>
                            Nombre de nuits{" "}
                            <span className="text-red-600">*</span>
                          </FormLabel>
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
                        <FormLabel>Dates du circuit </FormLabel>
                        <DateForm
                          dates={(field.value || []).map(
                            (d: any, idx: number) => ({
                              id: d.id ?? idx.toString(),
                              dateDebut:
                                d.startDate ?? d.dateDebut ?? new Date(),
                              dateFin: d.endDate ?? d.dateFin ?? new Date(),
                              description: d.description ?? "",
                              visible: d.visible ?? true,
                            })
                          )}
                          onChange={(dates) =>
                            field.onChange(
                              dates.map((d) => ({
                                startDate:
                                  d.dateDebut &&
                                  Object.prototype.toString.call(
                                    d.dateDebut
                                  ) === "[object Date]"
                                    ? d.dateDebut
                                    : new Date(d.dateDebut),
                                endDate:
                                  d.dateFin instanceof Date
                                    ? d.dateFin
                                    : new Date(d.dateFin),
                                description: d.description,
                                visible: d.visible,
                              }))
                            )
                          }
                        />
                        <FormDescription>
                          Ajoutez une ou plusieurs périodes pour ce circuit.
                          Chaque période doit contenir une date de début, une
                          date de fin et une description optionnelle.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* inclus et exclus */}
              <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-l font-medium">
                  <CheckSquare className="inline mr-2" />
                  Inclus & Exclus
                </h3>
                <p className="text-lime-800 text-md  mb-4">
                  Définissez les inclus et les exlus du circuit.
                </p>
                <Separator className="mb-6" />

                <div className="space-y-4 grid lg:grid-cols-2 grid-cols-1 gap-4 ">
                  <StringLoop
                    title="Inclus"
                    type="inclus"
                    description="Liste des éléments inclus dans le circuit"
                    onChange={(value) => {
                      form.setValue(
                        "arrayInclus",
                        Array.isArray(value) ? value : [value]
                      );
                    }}
                  />
                  <StringLoop
                    title="Exclus"
                    type="exclus"
                    description="Liste des éléments exclus du circuit"
                    onChange={(value) => {
                      form.setValue(
                        "arrayExlus",
                        Array.isArray(value) ? value : [value]
                      );
                    }}
                  />
                </div>
              </div>

              {/* Additional Details */}
              {/*<div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-l font-medium">
                  <ImagesIcon className="inline mr-2" />
                  Détails supplémentaires
                </h3>
                <p className="text-lime-800 text-md  mb-4">
                  Définissez des détails supplémentaires pour le circuit.
                </p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                   Image URLs 9 max
                  <FormField
                    control={form.control}
                    name="images"
                    render={() => (
                      <FormItem>
                        <FormLabel>Images du circuit<span className="text-red-600">*</span></FormLabel>
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
                            <p className="text-gray-500">
                              Glissez-déposez vos fichiers ici ou cliquez pour
                              parcourir.
                            </p>
                          </FileInput>

                          <FileUploaderContent className="mt-4">
                            {gallery?.map((file, index) => (
                              <FileUploaderItem key={index} index={index}>
                                <span className="truncate max-w-[200px]">
                                  {file.name}
                                </span>
                              </FileUploaderItem>
                            ))}
                          </FileUploaderContent>
                        </FileUploader>

                        <FormMessage />
                      </FormItem>
                    )}
                  /> 
                </div>
              </div>*/}

              {/* Display Options */}
              <div className="space-y-4 p-6 rounded-lg shadow-lg border border-gray-200">
                <h3 className="text-lime-600 text-l font-medium">
                  <EyeIcon className="inline mr-2" />
                  Options d&apos;affichage
                </h3>
                <p className="text-lime-800 text-md  mb-4">
                  Configurez la façon dont le circuit est affiché.
                </p>
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
                            <FormLabel>Afficher la réduction</FormLabel>
                            <FormDescription>
                              Afficher les informations de réduction pour ce
                              circuit
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
          <Button
            type="submit"
            size="lg"
            className="bg-lime-600 text-white hover:bg-lime-700 hover:cursor-pointer mr-8"
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              !form.watch("title") ||
              !form.watch("description") ||
              !form.watch("type") ||
              !form.watch("groupType") ||
              !form.watch("groupSizeMax") ||
              !form.watch("priceOriginal") ||
              !form.watch("dateCard") ||
              !form.watch("durationDays") ||
              !form.watch("durationNights") ||
              !form.watch("arrayInclus") ||
              !form.watch("arrayExlus") ||
              !form.watch("showReviews") ||
              !form.watch("showDifficulty") ||
              !form.watch("showDiscount") ||
              (form.watch("type") === "INTERNATIONAL" &&
                form.watch("hotels")?.length === 0)
            }
          >
            Créer le circuit
          </Button>{" "}
        </div>
      </form>
    </Form>
  );
}
