/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client"

import type React from "react"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Upload, MapPin, Tag, Leaf, Edit, Trash2, Plus, Save, X, BedDouble } from "lucide-react"

// Server Actions
import { createDestination, updateDestination, deleteDestination, getDestinations } from "@/actions/destinations"
import { createCategory, updateCategory, deleteCategory, getCategories } from "@/actions/categories"
import { createNature, updateNature, deleteNature, getNatures } from "@/actions/natures"
import { toast } from "react-toastify"
import type { DestinaionType } from "@prisma/client"
import { createService, updateService, deleteService} from "@/actions/services"
import RichTextEditor from "@/components/ui/rich-text-editor"
import SafeHTML from "@/components/SafeHTML"
import { createHotel, deleteHotel, updateHotel } from "@/actions/hotelsActions"

// Enum for destination types
const DESTINATION_TYPES = [
  { value: "NATIONAL", label: "National" },
  { value: "INTERNATIONAL", label: "International" },
]
// Types
interface Destination {
  id: string
  name: string
  type: DestinaionType
  imageUrl?: File | null
}

interface Category {
  id: string
  name: string
  description?: string 
  imageUrl?: File | null
}

interface Nature {
  id: string
  name: string
  description?: string 
  imageUrl?: File | null
}

interface Service {
  id: string
  name: string
  description?: string 
}

interface Hotel {
  id: string
  name: string
  description?: string 
  price?: number
}

export default function VoyagesComponent({ initialDestinations, initialCategories, initialNatures, initialServices, initialHotels }: any) {
  const [isPending, startTransition] = useTransition()

  // Data states
  const [destinations, setDestinations] = useState<Destination[]>(initialDestinations)
  const [categories, setCategories] = useState<Category[]>(initialCategories)
  const [natures, setNatures] = useState<Nature[]>(initialNatures)
  const [services, setServices] = useState<Service[]>(initialServices)
  const [hotels, setHotels] = useState<Hotel[]>(initialHotels)
  
 


  // Form states
  const [destinationForm, setDestinationForm] = useState<Destination>({
    id: "",
    name: "",
    type: "NATIONAL" as DestinaionType,
    imageUrl: null,
  })

  const [categoryForm, setCategoryForm] = useState<Category>({
    id: "",
    name: "",
    description: "",
    imageUrl: null,
  })

  const [natureForm, setNatureForm] = useState<Nature>({
    id: "",
    name: "",
    description: "",
    imageUrl: null,
  })

  const [serviceForm, setServiceForm] = useState<Service>({
    id: "",
    name: "",
    description: "",
  })

  const [hotelForm, setHotelForm] = useState<Hotel>({
    id: "",
    name: "",
    description: "",
    price: 0,
  })

  // Modal states
  const [showDestinationModal, setShowDestinationModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showNatureModal, setShowNatureModal] = useState(false)
  const [showServiceModal, setShowServiceModal] = useState(false)
  const [showHotelModal, setShowHotelModal] = useState(false)

  // Form mode states
  const [isEditMode, setIsEditMode] = useState({
    destination: false,
    category: false,
    nature: false,
    service: false,
    hotel: false,
  })

  // Destination functions
  const handleDestinationSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", destinationForm.name)
    formData.append("type", destinationForm.type)
    if (destinationForm.imageUrl) {
      formData.append("imageUrl", destinationForm.imageUrl)
    } else {
      toast.error("L'image est requise");
      return
    }

    startTransition(async () => {
      try {
        let result: { success: boolean; data?: any; error?: string }
        if (isEditMode.destination) {
          result = await updateDestination(destinationForm.id, formData)
          if (result.success) {
            setDestinations((prev) => prev.map((dest) => (dest.id === destinationForm.id ? result.data : dest)))
            toast.success("Destination mise à jour avec succès")
          }
        } else {
          result = await createDestination(formData)
          if (result.success) {
            setDestinations((prev) => [...prev, result.data])
            toast.success("Destination créée avec succès")
          }
        }

        if (result.success) {
          setDestinationForm({ id: "", name: "", type: "NATIONAL", imageUrl: null })
          setIsEditMode((prev) => ({ ...prev, destination: false }))
          setShowDestinationModal(false)
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch (error) {
        toast.error("Une erreur est survenue")
      }
    })
  }

  const openAddDestinationModal = () => {
    setDestinationForm({ id: "", name: "", type: "NATIONAL", imageUrl: null })
    setIsEditMode((prev) => ({ ...prev, destination: false }))
    setShowDestinationModal(true)
  }

  const editDestination = (destination: Destination) => {
    setDestinationForm({
      id: destination.id,
      name: destination.name,
      type: destination.type,
      imageUrl: destination.imageUrl || null,
    })
    setIsEditMode((prev) => ({ ...prev, destination: true }))
    setShowDestinationModal(true)
  }

  const handleDeleteDestination = async (id: string) => {
    startTransition(async () => {
      const result = await deleteDestination(id)
      if (result.success) {
        setDestinations((prev) => prev.filter((dest) => dest.id !== id))
        toast.success("Destination supprimée avec succès")
      } else {
        toast.error(result.error || "Erreur lors de la suppression")
      }
    })
  }

  const cancelDestinationEdit = () => {
    setDestinationForm({ id: "", name: "", type: "NATIONAL", imageUrl: null })
    setIsEditMode((prev) => ({ ...prev, destination: false }))
    setShowDestinationModal(false)
  }

  // Category functions
  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", categoryForm.name)
    formData.append("description", categoryForm.description ?? "")
    if (categoryForm.imageUrl) {
      formData.append("imageUrl", categoryForm.imageUrl)
    } else {
      toast.error("L'image est requise")
      return
    }

    startTransition(async () => {
      try {
        let result: { success: boolean; data?: any; error?: string }
        if (isEditMode.category) {
          result = await updateCategory(categoryForm.id, formData)
          if (result.success) {
            setCategories((prev) => prev.map((cat) => (cat.id === categoryForm.id ? result.data : cat)))
            toast.success("Catégorie mise à jour avec succès")
          }
        } else {
          result = await createCategory(formData)
          if (result.success) {
            setCategories((prev) => [...prev, result.data])
            toast.success("Catégorie créée avec succès")
          }
        }

        if (result.success) {
          setCategoryForm({ id: "", name: "", description: "", imageUrl: null })
          setIsEditMode((prev) => ({ ...prev, category: false }))
          setShowCategoryModal(false)
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch (error) {
        toast.error("Une erreur est survenue")
      }
    })
  }

  const openAddCategoryModal = () => {
    setCategoryForm({ id: "", name: "", description: "", imageUrl: null })
    setIsEditMode((prev) => ({ ...prev, category: false }))
    setShowCategoryModal(true)
  }

  const editCategory = (category: Category) => {
    setCategoryForm({
      id: category.id,
      name: category.name,
      description: category.description || "",
      imageUrl: category.imageUrl || null,
    })
    setIsEditMode((prev) => ({ ...prev, category: true }))
    setShowCategoryModal(true)
  }

  const handleDeleteCategory = async (id: string) => {
    startTransition(async () => {
      const result = await deleteCategory(id)
      if (result.success) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id))
        toast.success("Catégorie supprimée avec succès")
      } else {
        toast.error(result.error || "Erreur lors de la suppression")
      }
    })
  }

  const cancelCategoryEdit = () => {
    setCategoryForm({ id: "", name: "", description: "", imageUrl: null })
    setIsEditMode((prev) => ({ ...prev, category: false }))
    setShowCategoryModal(false)
  }

  // Nature functions
  const handleNatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("name", natureForm.name)
    formData.append("description", natureForm.description || "")
    if (natureForm.imageUrl) {
      formData.append("imageUrl", natureForm.imageUrl)
    }
    else 
    {
      toast.error("L'image est requise");
      return
    }

    startTransition(async () => {
      try {
        let result: { success: boolean; data?: any; error?: string }
        if (isEditMode.nature) {
          result = await updateNature(natureForm.id, formData)
          if (result.success) {
            setNatures((prev) => prev.map((nat) => (nat.id === natureForm.id ? result.data : nat)))
            toast.success("Type de nature mis à jour avec succès")
          }
        } else {
          result = await createNature(formData)
          if (result.success) {
            setNatures((prev) => [...prev, result.data])
            toast.success("Type de nature créé avec succès")
          }
        }

        if (result.success) {
          setNatureForm({ id: "", name: "", description: "", imageUrl: null })
          setIsEditMode((prev) => ({ ...prev, nature: false }))
          setShowNatureModal(false)
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch (error) {
        toast.error("Une erreur est survenue")
      }
    })
  }

  const openAddNatureModal = () => {
    setNatureForm({ id: "", name: "", description: "", imageUrl: null })
    setIsEditMode((prev) => ({ ...prev, nature: false }))
    setShowNatureModal(true)
  }

  const editNature = (nature: Nature) => {
    setNatureForm({
      id: nature.id,
      name: nature.name,
      description: nature.description || "",
      imageUrl: nature.imageUrl || null,
    })
    setIsEditMode((prev) => ({ ...prev, nature: true }))
    setShowNatureModal(true)
  }

  const handleDeleteNature = async (id: string) => {
    startTransition(async () => {
      const result = await deleteNature(id)
      if (result.success) {
        setNatures((prev) => prev.filter((nat) => nat.id !== id))
        toast.success("Type de nature supprimé avec succès")
      } else {
        toast.error(result.error || "Erreur lors de la suppression")
      }
    })
  }

  const cancelNatureEdit = () => {
    setNatureForm({ id: "", name: "", description: "", imageUrl: null })
    setIsEditMode((prev) => ({ ...prev, nature: false }))
    setShowNatureModal(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, formType: string) => {
    const file = e.target.files?.[0]
    if (file) {
      // const imageUrl = URL.createObjectURL(file)

      if (formType === "destination") {
        setDestinationForm((prev) => ({ ...prev, imageUrl: file }))
      } else if (formType === "category") {
        setCategoryForm((prev) => ({ ...prev, imageUrl: file }))
      } else if (formType === "nature") {
        setNatureForm((prev) => ({ ...prev, imageUrl: file }))
      }
    }
  }

  // Service functions
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

   const formData = new FormData()
    formData.append("name", serviceForm.name)
    formData.append("description", serviceForm.description || "")

    startTransition(async () => {
      try {
        let result: { success: boolean; data?: any; error?: string }
        if (isEditMode.service) {
          const updated = await updateService(serviceForm.id, formData)
          result = { success: !!updated, data: updated, error: updated ? undefined : "Erreur lors de la mise à jour" }
          if (result.success) {
            setServices((prev) => prev.map((serv) => (serv.id === serviceForm.id ? result.data : serv)))
            toast.success("Type de Service mis à jour avec succès")
          }
        } else {
          const created = await createService(formData)
          result = { success: !!created, data: created, error: created ? undefined : "Erreur lors de la création" }
          if (result.success) {
            setServices((prev) => [...prev, result.data])
            toast.success("Type de Service créé avec succès")
          }
        }

        if (result.success) {
          setServiceForm({ id: "", name: "", description: "" })
          setIsEditMode((prev) => ({ ...prev, service: false }))
          setShowServiceModal(false)
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch (error) {
        toast.error("Une erreur est survenue")
      }
    })
  }

  const openAddServiceModal = () => {
    setServiceForm({ id: "", name: "", description: ""})
    setIsEditMode((prev) => ({ ...prev, service: false }))
    setShowServiceModal(true)  }


  const editService = (service: Service) => {
    setServiceForm({
          id: service.id,
          name: service.name,
          description: service.description || ""
        })
        setIsEditMode((prev) => ({ ...prev, service: true }))
        setShowServiceModal(true) 
   }


  const handleDeleteService = async (id: string) => {
    startTransition(async () => {
          const result = await deleteService(id)
          if (result.success) {
            setServices((prev) => prev.filter((nat) => nat.id !== id))
            toast.success("Type de service supprimé avec succès")
          } else {
            toast.error(result.error || "Erreur lors de la suppression")
          }
        }) 
   }

  const cancelServiceEdit = () => {
    setServiceForm({ id: "", name: "", description: ""})
    setIsEditMode((prev) => ({ ...prev, service: false }))
    setShowServiceModal(false)
  }



  // hotels functions
  const handlehotelSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

   const formData = new FormData()
    formData.append("name", hotelForm.name)
    formData.append("description", hotelForm.description || "")
    formData.append("price", (hotelForm.price ?? 0).toString())

    startTransition(async () => {
      try {
        let result: { success: boolean; data?: any; error?: string }
        if (isEditMode.hotel) {
          const updated = await updateHotel(hotelForm.id, formData)
          result = { success: !!updated, data: updated, error: updated ? undefined : "Erreur lors de la mise à jour" }
          if (result.success) {
            setHotels((prev) => prev.map((serv) => (serv.id === hotelForm.id ? result.data : serv)))
            toast.success("Type de hotel mis à jour avec succès")
          }
        } else {
          const created = await createHotel(formData)
          result = { success: !!created, data: created, error: created ? undefined : "Erreur lors de la création" }
          if (result.success) {
            setHotels((prev) => [...prev, result.data])
            toast.success("Type de hotel créé avec succès")
          }
        }

        if (result.success) {
          setHotelForm({ id: "", name: "", description: "", price: 0 })
          setIsEditMode((prev) => ({ ...prev, hotel: false }))
          setShowHotelModal(false)
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch (error) {
        toast.error("Une erreur est survenue")
      }
    })
  }

  const openAddhotelModal = () => {
    setHotelForm({ id: "", name: "", description: "", price: 0 })
    setIsEditMode((prev) => ({ ...prev, hotel: false }))
    setShowHotelModal(true)  }


  const editHotel = (hotel: Hotel) => {
    setHotelForm({
          id: hotel.id,
          name: hotel.name,
          description: hotel.description || "",
          price: hotel.price || 0,
        })
        setIsEditMode((prev) => ({ ...prev, hotel: true }))
        setShowHotelModal(true) 
   }

  const handleDeleteHotel = async (id: string) => {
    startTransition(async () => {
          const result = await deleteHotel(id)
          if (result.success) {
            setHotels((prev) => prev.filter((nat) => nat.id !== id))
            toast.success("Type de hotel supprimé avec succès")
          } else {
            toast.error("Erreur lors de la suppression")
          }
        }) 
   }

  const cancelHotelEdit = () => {
    setHotelForm({ id: "", name: "", description: "", price: 0 })
    setIsEditMode((prev) => ({ ...prev, hotel: false }))
    setShowHotelModal(false)
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        {/* <h1 className="text-3xl font-bold"></h1> */}
        <p className="text-muted-foreground">Gérer les destinations, catégories, natures et services</p>
      </div>

      <Tabs defaultValue="destinations" className="w-full">
        <TabsList className="grid w-full h-fit lg:grid-cols-5 gap-4 mb-6 ">
          <TabsTrigger
            value="destinations"
            className={`flex items-center gap-2 ${typeof destinations === "undefined" ? " opacity-50 pointer-events-none" : ""}`}
            disabled={typeof destinations === "undefined"}
          >
            <MapPin className="h-4 w-4" />
            Destinations ({Array.isArray(destinations) ? destinations.length : 0})
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Catégories ({Array.isArray(categories) ? categories.length : 0})
          </TabsTrigger>
          <TabsTrigger
            value="natures"
            className={`flex items-center gap-2${typeof natures === "undefined" ? " opacity-50 pointer-events-none" : ""}`}
            disabled={typeof natures === "undefined"}
          >
            <Leaf className="h-4 w-4" />
            Natures ({Array.isArray(natures) ? natures.length : 0})
          </TabsTrigger>


          <TabsTrigger
            value="services"
            className={`flex items-center gap-2 ${typeof services === "undefined" ? " opacity-50 pointer-events-none" : ""}`}
            disabled={typeof services === "undefined"}
          >
            <Tag className="h-4 w-4" />
            Services ({Array.isArray(services) ? services.length : 0})
          </TabsTrigger>
          <TabsTrigger
            value="hotels"
            className={`flex items-center gap-2 ${typeof hotels === "undefined" ? " opacity-50 pointer-events-none" : ""}`}
            disabled={typeof hotels === "undefined"}
          >
            <BedDouble className="h-4 w-4" />
            Hotels ({Array.isArray(hotels) ? hotels.length : 0})
          </TabsTrigger>
         
        </TabsList>

        <TabsContent value="destinations" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div>
                <CardTitle>Destinations Existantes</CardTitle>
                <CardDescription>Gérer vos enregistrements de destinations</CardDescription>
              </div>
              <div>

              <Button onClick={openAddDestinationModal} className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white">
                <Plus className="h-4 w-4" />
                Ajouter une Destination
              </Button>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {destinations.map((destination) => (
                    <TableRow key={destination.id}>
                      <TableCell>
                        {destination.imageUrl && (
                          <img
                            src={destination.imageUrl || "/placeholder.svg"}
                            alt={destination.name}
                            className="h-10 w-10 object-cover rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{destination.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{destination.type}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editDestination(destination)}
                            disabled={isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteDestination(destination.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div>
                <CardTitle>Catégories Existantes</CardTitle>
                <CardDescription>Gérer vos enregistrements de catégories</CardDescription>
              </div>
              <Button onClick={openAddCategoryModal} className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white">
                <Plus className="h-4 w-4" />
                Ajouter une Catégorie
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        {category.imageUrl && (
                          <img
                            src={category.imageUrl || "/placeholder.svg"}
                            alt={category.name}
                            className="h-10 w-10 object-cover rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{category.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editCategory(category)}
                            disabled={isPending}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteCategory(category.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="natures" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div>
                <CardTitle>Types de Nature Existants</CardTitle>
                <CardDescription>Gérer vos enregistrements de types de nature</CardDescription>
              </div>
              <Button onClick={openAddNatureModal} className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white">
                <Plus className="h-4 w-4" />
                Ajouter un Type de Nature
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Image</TableHead>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {natures.map((nature) => (
                    <TableRow key={nature.id}>
                      <TableCell>
                        {nature.imageUrl && (
                          <img
                            src={nature.imageUrl || "/placeholder.svg"}
                            alt={nature.name}
                            className="h-10 w-10 object-cover rounded-md"
                          />
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{nature.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{nature.description}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => editNature(nature)} disabled={isPending}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteNature(nature.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Services table  */}
        <TabsContent value="services" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div>
                <CardTitle>Types de Service Existants</CardTitle>
                <CardDescription>Gérer vos enregistrements de types de service</CardDescription>
              </div>
              <Button onClick={openAddServiceModal} className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white">
                <Plus className="h-4 w-4" />
                Ajouter un Type de Service
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <SafeHTML
                          html={service.description ?? ""}
                          className="safe-html text-gray-600 text-sm"
                        />
                       </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => editService(service)} disabled={isPending}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteService(service.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>


      {/* Hotel Modal */}
       <TabsContent value="hotels" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-2">
              <div>
                <CardTitle>hotel Existants</CardTitle>
                <CardDescription>Gérer vos enregistrements de hotel</CardDescription>
              </div>
              <Button onClick={openAddhotelModal} className="flex items-center gap-2 bg-lime-600 hover:bg-lime-700 text-white">
                <Plus className="h-4 w-4" />
                Ajouter un hotel
              </Button>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Prix</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {hotels.map((hotel) => (
                    <TableRow key={hotel.id}>
                      <TableCell className="font-medium">{hotel.name}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        <SafeHTML
                          html={hotel.description ?? ""}
                          className="safe-html text-gray-600 text-sm"
                        />
                       </TableCell>
                      <TableCell className="text-right">
                        {hotel.price ? `${hotel.price.toFixed(2)} MAD` : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" onClick={() => editHotel(hotel)} disabled={isPending}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteHotel(hotel.id)}
                            disabled={isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>


      {/* Destination Modal */}
      {showDestinationModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEditMode.destination ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {isEditMode.destination ? "Modifier la Destination" : "Ajouter une Nouvelle Destination"}
              </CardTitle>
              <CardDescription>
                {isEditMode.destination
                  ? "Mettre à jour les détails de la destination"
                  : "Créer une nouvelle destination pour les circuits"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDestinationSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="dest-name">Nom *</Label>
                  <Input
                    id="dest-name"
                    value={destinationForm.name}
                    onChange={(e) => setDestinationForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Entrer le nom de la destination"
                    disabled={isPending}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dest-type">Type *</Label>
                  <Select
                    value={destinationForm.type}
                    onValueChange={(value: DestinaionType) => setDestinationForm((prev) => ({ ...prev, type: value }))}
                    disabled={isPending}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner le type de destination" />
                    </SelectTrigger>
                    <SelectContent>
                      {DESTINATION_TYPES.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dest-image">Image *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="dest-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "destination")}
                      className="flex-1"
                      disabled={isPending}
                      
                    />
                    <Button type="button" variant="outline" size="icon" disabled={isPending}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {destinationForm.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={destinationForm.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-lime-600 hover:bg-lime-700 text-white" disabled={isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {isPending ? "En cours..." : isEditMode.destination ? "Mettre à Jour" : "Créer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelDestinationEdit} disabled={isPending}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEditMode.category ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {isEditMode.category ? "Modifier la Catégorie" : "Ajouter une Nouvelle Catégorie"}
              </CardTitle>
              <CardDescription>
                {isEditMode.category
                  ? "Mettre à jour les détails de la catégorie"
                  : "Créer une nouvelle catégorie pour organiser les circuits"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCategorySubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="cat-name">Nom *</Label>
                  <Input
                    id="cat-name"
                    value={categoryForm.name}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Entrer le nom de la catégorie"
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-description">Description *</Label>
                  <Textarea
                    id="cat-description"
                    value={categoryForm.description ?? ""}
                    onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Entrer la description de la catégorie"
                    rows={3}
                    disabled={isPending}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cat-image">Image *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="cat-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "category")}
                      className="flex-1"
                      disabled={isPending}
                    />
                    <Button type="button" variant="outline" size="icon" disabled={isPending}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {categoryForm.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={categoryForm.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-lime-600 hover:bg-lime-700 text-white" disabled={isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {isPending ? "En cours..." : isEditMode.category ? "Mettre à Jour" : "Créer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelCategoryEdit} disabled={isPending}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Nature Modal */}
      {showNatureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEditMode.nature ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {isEditMode.nature ? "Modifier le Type de Nature" : "Ajouter un Nouveau Type de Nature"}
              </CardTitle>
              <CardDescription>
                {isEditMode.nature
                  ? "Mettre à jour les détails du type de nature"
                  : "Créer un nouveau type de nature pour catégoriser les circuits"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleNatureSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nature-name">Nom *</Label>
                  <Input
                    id="nature-name"
                    value={natureForm.name}
                    onChange={(e) => setNatureForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Entrer le nom du type de nature"
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nature-description">Description *</Label>
                  <Textarea
                    id="nature-description"
                    value={natureForm.description ?? ""}
                    onChange={(e) => setNatureForm((prev) => ({ ...prev, description: e.target.value }))}
                    placeholder="Entrer la description du type de nature"
                    rows={3}
                    disabled={isPending}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nature-image">Image *</Label>
                  <div className="flex items-center gap-4">
                    <Input
                      id="nature-image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, "nature")}
                      className="flex-1"
                      disabled={isPending}

                    />
                    <Button type="button" variant="outline" size="icon" disabled={isPending}>
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {natureForm.imageUrl && (
                    <div className="mt-2">
                      <img
                        src={natureForm.imageUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="h-20 w-20 object-cover rounded-md border"
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-lime-600 hover:bg-lime-700 text-white" disabled={isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {isPending ? "En cours..." : isEditMode.nature ? "Mettre à Jour" : "Créer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelNatureEdit} disabled={isPending}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
  )}
            {/*    services modal */}
        {showServiceModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEditMode.service ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {isEditMode.service ? "Modifier le Type de Service" : "Ajouter un Nouveau Type de Service"}
              </CardTitle>
              <CardDescription>
                {isEditMode.service
                  ? "Mettre à jour les détails du type de service"
                  : "Créer un nouveau type de service pour catégoriser les circuits"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleServiceSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="service-name">Nom *</Label>
                  <Input
                    id="service-name"
                    value={serviceForm.name}
                    onChange={(e) => setServiceForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Entrer le nom du type de service"
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service-description">Description </Label>
                  <RichTextEditor
                    value={serviceForm.description || ""}
                    onChange={(value) => setServiceForm((prev) => ({ ...prev, description: value }))}
                    className="max-h-60 w-full overflow-auto"
                    
                  />
                </div>

                
                 

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-lime-600 hover:bg-lime-700 text-white" disabled={isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {isPending ? "En cours..." : isEditMode.service ? "Mettre à Jour" : "Créer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelServiceEdit} disabled={isPending}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        )}



           {/*    hotel modal */}
        {showHotelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isEditMode.hotel ? <Edit className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {isEditMode.hotel ? "Modifier le hotel" : "Ajouter un Nouveau Type de hotel"}
              </CardTitle>
              <CardDescription>
                {isEditMode.hotel
                  ? "Mettre à jour les détails du hotel"
                  : "Créer un nouveau hotel pour catégoriser les circuits"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlehotelSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hotel-name">Nom *</Label>
                  <Input
                    id="hotel-name"
                    value={hotelForm.name}
                    onChange={(e) => setHotelForm((prev) => ({ ...prev, name: e.target.value }))}
                    placeholder="Entrer le nom du type de hotel"
                    required
                    disabled={isPending}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hotel-description">Description </Label>
                  <RichTextEditor
                    value={hotelForm.description || ""}
                    onChange={(value) => setHotelForm((prev) => ({ ...prev, description: value }))}
                    className="max-h-60 w-full overflow-auto"
                    
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hotel-price">Prix (MAD)</Label>
                  <Input
                    id="hotel-price"
                    type="number"
                    value={hotelForm.price || ""}
                    onChange={(e) => setHotelForm((prev) => ({ ...prev, price: parseFloat(e.target.value) }))}
                    placeholder="Entrer le prix du type de hotel"
                    disabled={isPending}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1 bg-lime-600 hover:bg-lime-700 text-white" disabled={isPending}>
                    <Save className="h-4 w-4 mr-2" />
                    {isPending ? "En cours..." : isEditMode.hotel ? "Mettre à Jour" : "Créer"}
                  </Button>
                  <Button type="button" variant="outline" onClick={cancelHotelEdit} disabled={isPending}>
                    <X className="h-4 w-4 mr-2" />
                    Annuler
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
        )}
    </div>



  )
}
