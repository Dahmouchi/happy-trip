/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-unused-vars */
// app/dashboard/blogs/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Trash2, Edit, Plus } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/ui/rich-text-editor-image";
import { createBlog, deleteBlog, getBlogs, updateBlog } from "@/actions/blogs";
import { Blog } from "@prisma/client";
import SafeHTML from "@/components/SafeHTML";
import { toast } from "react-toastify";
import Loading from "@/components/Loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  imageUrl: z.any(), // Changed to any to handle File object
  category: z.string().optional(),
  status: z.boolean().default(true),
});

export default function BlogManagementPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentBlog, setCurrentBlog] = useState<Blog | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      title: "",
      description: "",
      imageUrl: null,
      category: "",
      status: true,
    },
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getBlogs();
        setBlogs(response);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.description &&
        blog.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      form.setValue("imageUrl", file);
    }
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description || "");
      formData.append("category", values.category || "");
      formData.append("status", values.status.toString());

      if (selectedFile) {
        formData.append("imageUrl", selectedFile);
      }
      // Use updateBlog for edits, createBlog for new posts
      if (currentBlog) {
        await updateBlog(currentBlog.id, formData);
        toast.success("blog update with success");
        setIsDialogOpen(false);
      } else {
        await createBlog(formData);
        toast.success("blog add with success");
        setIsDialogOpen(false);
      }

      // Refresh blogs list
      const response = await getBlogs();
      setBlogs(response);
      setIsDialogOpen(false);
      form.reset();
      setSelectedFile(null);
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      toast.info("Le blog supprimée avec succéss");
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  };

  const openEditDialog = (blog: Blog) => {
    setCurrentBlog(blog);
    form.reset({
      title: blog.title,
      description: blog.description || "",
      imageUrl: null, // Reset file input when editing
      category: blog.category || "",
      status: blog.status,
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setCurrentBlog(null);
    form.reset({
      title: "",
      description: "",
      imageUrl: null,
      category: "",
      status: true,
    });
    setSelectedFile(null);
    setIsDialogOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-6">
        {/* Header with search and add button */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-3xl font-bold">Gestion des Blogs</h1>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Input
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Ajouter un blog
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-5xl">
                <DialogHeader>
                  <DialogTitle>
                    {currentBlog ? "Edit Blog" : "Create New Blog"}
                  </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-6"
                    encType="multipart/form-data"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Titre</FormLabel>

                                <FormControl>
                                <Input placeholder="Titre du blog" {...field} />
                                </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="imageUrl"
                          render={() => (
                            <FormItem>
                              <FormLabel>Image du blog</FormLabel>
                              <FormDescription>
                              Téléchargez une image pour ce blog
                              </FormDescription>
                              <FormControl>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-md file:border-0
                                file:text-sm file:font-semibold
                                file:bg-blue-50 file:text-blue-700
                                hover:file:bg-blue-100"
                              />
                              </FormControl>
                              {selectedFile && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Fichier sélectionné : {selectedFile.name}
                              </p>
                              )}
                              {currentBlog?.imageUrl && !selectedFile && (
                              <p className="text-sm text-muted-foreground mt-2">
                                Image actuelle : {currentBlog.imageUrl}
                              </p>
                              )}
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Catégorie</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a category" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="technology">
                                    Technologie
                                    </SelectItem>
                                    <SelectItem value="travel">Voyage</SelectItem>
                                    <SelectItem value="food">Cuisine</SelectItem>
                                    <SelectItem value="lifestyle">
                                    Style de vie
                                    </SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel>Statut</FormLabel>
                                <FormDescription>
                                  Publier ou dépublier ce blog
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div>
                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                              <FormControl>
                                <RichTextEditor
                                  value={field.value || ""}
                                  onChange={field.onChange}
                                  className="max-h-60 w-full overflow-auto"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                        >
                        Annuler
                        </Button>
                      <Button type="submit">
                        {currentBlog ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Blog List */}
        {isLoading ? (
          <Loading />
        ) : filteredBlogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              {searchTerm ? "No matching blogs found" : "No blogs available"}
            </p>
            {!searchTerm && (
                <Button onClick={openCreateDialog} className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Créez votre premier blog
                </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <Card
                key={blog.id}
                className="hover:shadow-lg transition-shadow pt-0"
              >
                {blog.imageUrl && (
                  <div className="relative h-48 w-full ">
                    <img
                      src={blog.imageUrl}
                      alt={blog.title}
                      className="absolute h-full w-full object-cover rounded-t-lg"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{blog.title}</CardTitle>
                      <CardDescription className="mt-2 line-clamp-1">
                        <SafeHTML html={`${blog.description}`} />
                      </CardDescription>
                      {blog.category && (
                        <span className="inline-block mt-2 px-2 py-1 text-xs font-medium bg-secondary text-secondary-foreground rounded-full">
                          {blog.category}
                        </span>
                      )}
                    </div>
                    <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon">
      <MoreVertical className="h-4 w-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    {/* Edit Option */}
    <DropdownMenuItem onClick={() => openEditDialog(blog)}>
      <Edit className="mr-2 h-4 w-4" />
      Modifier
    </DropdownMenuItem>

    {/* Delete Option with Confirmation Dialog */}
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <DropdownMenuItem 
          className="text-red-600 focus:text-red-600 focus:bg-red-50"
          onSelect={(e) => e.preventDefault()} // Empêche la fermeture immédiate
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Supprimer
        </DropdownMenuItem>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
            <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
            <AlertDialogDescription>
            Cette action est irréversible. Cela supprimera définitivement ce blog.
            </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-red-600 hover:bg-red-700"
            onClick={() => handleDelete(blog.id)}
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </DropdownMenuContent>
</DropdownMenu>
                  </div>
                </CardHeader>
                <CardFooter className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    {blog.status ? (
                      <span className="text-green-600">Publié</span>
                    ) : (
                      <span className="text-yellow-600">Brouillon</span>
                    )}
                  </span>
                  <span>{new Date(blog.updatedAt).toLocaleDateString()}</span>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
