"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// Mock vacation styles for the demo
// In a real app, you would fetch these from your database
const vacationStyles = [
  { id: "1", name: "Adventure" },
  { id: "2", name: "Beach" },
  { id: "3", name: "City Break" },
  { id: "4", name: "Cultural" },
  { id: "5", name: "Eco-Tourism" },
  { id: "6", name: "Family" },
  { id: "7", name: "Luxury" },
  { id: "8", name: "Romantic" },
  { id: "9", name: "Wildlife" },
]

const formSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters.",
  }),
  description: z.string().optional(),
  type: z.enum(["NATIONAL", "INTERNATIONAL"]),
  location: z.string().optional(),
  priceOriginal: z.coerce.number().int().positive().optional(),
  priceDiscounted: z.coerce.number().int().positive().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  durationDays: z.coerce.number().int().positive().optional(),
  durationNights: z.coerce.number().int().positive().optional(),
  accommodation: z.string().optional(),
  imageUrl: z.string().url().optional(),
  groupType: z.string().optional(),
  groupSizeMax: z.coerce.number().int().positive().optional(),
  showReviews: z.boolean(),
  showDifficulty: z.boolean(),
  showDiscount: z.boolean(),
  difficultyLevel: z.coerce.number().int().min(1).max(5).optional(),
  discountPercent: z.coerce.number().int().min(0).max(100).optional(),
  weekendsOnly: z.boolean(),
  vacationStyles: z.array(z.string()),
})

export function AddTourForm() {
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      type: "NATIONAL",
      location: "",
      showReviews: true,
      showDifficulty: true,
      showDiscount: true,
      weekendsOnly: false,
      vacationStyles: [],
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Dans une vraie application, vous enverriez ces données à votre API
    console.log(values)

    // Simulation d'un appel API
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Circuit créé avec succès",
      description: `Circuit ${values.type.toLowerCase() === "national" ? "national" : "international"} créé : ${values.title}`,
    })

    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}  className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium">Informations de base</h3>
                <p className="text-sm text-muted-foreground mb-4">Entrez les détails de base du circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel >Titre</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez le titre du circuit" required {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Entrez la description du circuit"
                            className="min-h-32"
                            {...field}
                            value={field.value || ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type de circuit</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="selectionnez le type de circuit" />
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

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lieu</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez le lieu du circuit" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de l'image</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez l'URL de l'image" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>URL de l'image principale pour ce circuit</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Pricing Information */}
              <div>
                <h3 className="text-lg font-medium">Informations sur les prix</h3>
                <p className="text-sm text-muted-foreground mb-4">Définissez les détails de prix pour le circuit.</p>
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
                            <Input type="number" placeholder="Entrez le prix original" {...field} />
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
                            <Input type="number" placeholder="Entrez le prix réduit" {...field} />
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
                            <Input type="number" placeholder="Entrez le pourcentage de réduction" {...field} />
                          </FormControl>
                          <FormDescription>Entrez une valeur entre 0 et 100</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Dates and Duration */}
              <div>
                <h3 className="text-lg font-medium">Dates et durée</h3>
                <p className="text-sm text-muted-foreground mb-4">Définissez les dates et la durée du circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="startDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date de début</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="endDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>Date de fin</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground",
                                  )}
                                >
                                  {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="durationDays"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Durée (Jours)</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="Entrez le nombre de jours" {...field} />
                            </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="durationNights"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Durée (Nuits)</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="Entrez le nombre de nuits" {...field} />
                            </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="weekendsOnly"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                            <FormLabel>Week-ends seulement</FormLabel>
                            <FormDescription>Cochez ceci si le circuit est disponible uniquement les week-ends</FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Group Information */}
              <div>
                <h3 className="text-lg font-medium">Informations sur le groupe</h3>
                <p className="text-sm text-muted-foreground mb-4">Définissez les détails du groupe pour le circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="groupType"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Type de groupe</FormLabel>
                            <FormControl>
                            <Input placeholder="ex: Petit groupe, Famille" {...field} value={field.value || ""} />
                            </FormControl>
                            <FormDescription>Décrivez le type de groupe pour lequel ce circuit est conçu</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="groupSizeMax"
                      render={({ field }) => (
                        <FormItem>
                            <FormLabel>Taille maximale du groupe</FormLabel>
                            <FormControl>
                            <Input type="number" placeholder="Entrez la taille maximale du groupe" {...field} />
                            </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div>
                <h3 className="text-lg font-medium">Détails supplémentaires</h3>
                <p className="text-sm text-muted-foreground mb-4">Définissez des détails supplémentaires pour le circuit.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="accommodation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hébergement</FormLabel>
                        <FormControl>
                          <Input placeholder="Entrez les détails de l'hébergement" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormDescription>Décrivez l'hébergement fourni pendant le circuit</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="difficultyLevel"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Niveau de difficulté (1-5)</FormLabel>
                        <Select
                          onValueChange={(value) => field.onChange(Number.parseInt(value))}
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
                          <SelectItem value="5">5 - Très difficile</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Display Options */}
              <div>
                <h3 className="text-lg font-medium">Options d'affichage</h3>
                <p className="text-sm text-muted-foreground mb-4">Configurez la façon dont le circuit est affiché.</p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="showReviews"
                    render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                      <FormLabel>Afficher les avis</FormLabel>
                      <FormDescription>Afficher les avis pour ce circuit</FormDescription>
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
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                            <FormLabel>Afficher la difficulté</FormLabel>
                            <FormDescription>Afficher le niveau de difficulté pour ce circuit</FormDescription>
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
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>Show Discount</FormLabel>
                            <FormDescription>Display discount information for this tour</FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Vacation Styles */}
                <div>
                <h3 className="text-lg font-medium">Styles de vacances</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sélectionnez les styles de vacances qui s'appliquent à ce circuit.
                </p>
                <Separator className="mb-6" />

                <div className="space-y-4">
                  <FormField
                  control={form.control}
                  name="vacationStyles"
                  render={({ field }) => (
                    <FormItem>
                    <FormLabel>Styles de vacances</FormLabel>
                    <FormControl>
                      <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between">
                        {field.value.length > 0
                          ? `${field.value.length} style${field.value.length > 1 ? "s" : ""} sélectionné${field.value.length > 1 ? "s" : ""}`
                          : "Sélectionnez les styles de vacances"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                        <CommandInput placeholder="Rechercher des styles de vacances..." />
                        <CommandList>
                          <CommandEmpty>Aucun style trouvé.</CommandEmpty>
                          <CommandGroup>
                          {vacationStyles.map((style) => (
                            <CommandItem
                            key={style.id}
                            value={style.name}
                            onSelect={() => {
                              const currentValue = [...field.value]
                              const index = currentValue.indexOf(style.id)

                              if (index === -1) {
                              field.onChange([...currentValue, style.id])
                              } else {
                              currentValue.splice(index, 1)
                              field.onChange(currentValue)
                              }
                            }}
                            >
                            <Check
                              className={cn(
                              "mr-2 h-4 w-4",
                              field.value.includes(style.id) ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {style.name}
                            </CommandItem>
                          ))}
                          </CommandGroup>
                        </CommandList>
                        </Command>
                      </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>Sélectionnez tous les styles de vacances qui s'appliquent à ce circuit</FormDescription>
                    <FormMessage />
                    </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
            <Button type="submit" size="lg" className="bg-[#6EC207] text-white hover:bg-[#5BA906] hover:cursor-pointer">
            Créer le circuit
            </Button>
        </div>
      </form>
    </Form>
  )
}
