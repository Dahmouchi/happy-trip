/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { fr } from "date-fns/locale"; // French locale
import { DatetimePicker } from "@/components/ui/datetime-picker";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlarmClockCheck, Calendar, CheckIcon, Clock, FileText, FireExtinguisherIcon, Plus, Users, VideoIcon } from "lucide-react";
import { createRDV, getRDV } from "@/actions/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const meetingFormSchema = z.object({
  title: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(50, "Le titre ne peut pas dépasser 50 caractères"),
  description: z
    .string()
    .max(500, "La description ne peut pas dépasser 500 caractères")
    .optional(),
  date: z.coerce.date(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Format horaire invalide (HH:MM)",
  }),
});
export default function MeetingsPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [meetings, setMeetings] = useState<any>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await getRDV();
        setMeetings(response);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, [isDialogOpen]);
  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      startTime: "09:00",
    },
  });

  async function onSubmit(data: z.infer<typeof meetingFormSchema>) {
    try {
      // Combine date and time
      const [hours, minutes] = data.startTime.split(":");
      const meetingDate = new Date(data.date);
      meetingDate.setHours(parseInt(hours, 10));
      meetingDate.setMinutes(parseInt(minutes, 10));
      if (session?.user && meetingDate) {
        const res = await createRDV(
          data.title,
          meetingDate,
          session.user.id,
           data?.description,
        );
        if (res.success) {
          toast.success(
            "Votre demande de rendez-vous a été envoyée avec succès."
          );
          form.reset();
          router.refresh()
          setIsDialogOpen(false)
        }
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi de votre demande.");
    }
  }

  

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Rendez-vous</h1>
            <p className="text-gray-600">Gérez vos rendez-vous et consultations</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-lg transition-all duration-200 hover:shadow-xl">
                <Plus className="w-4 h-4 mr-2" />
                Nouveau rendez-vous
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader className="pb-4">
                <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  Nouveau Rendez-vous
                </DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Sujet du rendez-vous</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Discussion sur mon voyage au Maroc"
                            className="h-11"
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
                      <FormItem>
                        <FormLabel className="text-sm font-medium">Détails (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez le but de ce rendez-vous..."
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Date</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              className="h-11"
                              value={
                                field.value instanceof Date && !isNaN(field.value.getTime())
                                  ? field.value.toISOString().slice(0, 10)
                                  : ""
                              }
                              onChange={(e) => {
                                const value = e.target.value;
                                field.onChange(value ? new Date(value) : undefined);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-medium">Heure de début</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-11">
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-500" />
                                  <SelectValue placeholder="Sélectionnez une heure" />
                                </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 34 }).map((_, i) => {
                                const hour = Math.floor(i / 2) + 8;
                                const minute = i % 2 === 0 ? "00" : "30";
                                const time = `${hour.toString().padStart(2, "0")}:${minute}`;
                                return (
                                  <SelectItem key={time} value={time}>
                                    {time}
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 transition-colors duration-200"
                  >
                    Programmer le rendez-vous
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total</p>
                  <p className="text-2xl font-bold">{meetings.length}</p>
                </div>
                <VideoIcon className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Confirmés</p>
                  <p className="text-2xl font-bold text-emerald-600">
                    {meetings.filter((m: any) => m.status === 'confirmed').length}
                  </p>
                </div>
                <CheckIcon className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En attente</p>
                  <p className="text-2xl font-bold text-amber-600">
                    {meetings.filter((m: any) => m.status === 'pending').length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Terminés</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {meetings.filter((m: any) => m.status === 'finished').length}
                  </p>
                </div>
                <AlarmClockCheck className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Meetings Table */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Liste des rendez-vous</CardTitle>
            <CardDescription>Consultez et gérez tous vos rendez-vous</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-6 space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                ))}
              </div>
            ) : meetings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun rendez-vous</h3>
                <p className="text-gray-500 mb-4">Vous n&apos;avez pas encore de rendez-vous programmé.</p>
                <Button 
                  onClick={() => setIsDialogOpen(true)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Programmer un rendez-vous
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Sujet</TableHead>
                      <TableHead className="font-semibold hidden md:table-cell">Description</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Statut</TableHead>
                      <TableHead className="font-semibold">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {meetings.map((meeting: any) => (
                      <TableRow key={meeting.id} className="hover:bg-gray-50 transition-colors">
                        <TableCell className="font-medium">
                          <div className="max-w-[200px]">
                            <p className="truncate">{meeting.title}</p>
                            <p className="text-sm text-gray-500 md:hidden truncate">
                              {meeting.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          {meeting.description ? (
                            <HoverCard>
                              <HoverCardTrigger className="cursor-pointer">
                                <p className="truncate max-w-[250px] text-gray-600">
                                  {meeting.description}
                                </p>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80">
                                {meeting.description
                                  .split(/(.{1,40})(?:\s|$)/g)
                                  .filter(Boolean)
                                  .map((line: string, idx: number) => (
                                    <p className="text-sm break-words" key={idx}>
                                      {line}
                                    </p>
                                  ))}
                              </HoverCardContent>
                            </HoverCard>
                          ) : (
                            <span className="text-gray-400 italic">Aucune description</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="font-medium">
                              {format(new Date(meeting.date), "dd/MM/yyyy")}
                            </p>
                            <p className="text-gray-500">
                              {format(new Date(meeting.date), "HH:mm")}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                            <Badge
                            className={`${
                              meeting.status === "confirmed"
                              ? "bg-emerald-600 text-white"
                              : meeting.status === "pending"
                                ? "bg-amber-600 text-white"
                                : "bg-blue-600 text-white"
                            }`}
                            variant="default"
                            >
                            {meeting.status === "confirmed"
                              ? "Confirmé"
                              : meeting.status === "pending"
                              ? "En attente"
                              : meeting.status === "finished"
                                ? "Terminé"
                                : meeting.status}
                            </Badge>
                        </TableCell>
                        <TableCell>
                          {meeting.status === "confirmed" && (() => {
                            const now = new Date();
                            const meetingDateObj = new Date(meeting.date);
                            const diffMs = meetingDateObj.getTime() - now.getTime();
                            const diffMin = diffMs / (1000 * 60);
                            const isEnabled = diffMin <= 15 && diffMin >= -1440;

                            return (
                              <div className="flex flex-col gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const jitsiRoom = `meeting-${meeting.id}`;
                                    window.open(`https://meet.jit.si/${jitsiRoom}`, "_blank");
                                  }}
                                  className="bg-blue-600 hover:bg-blue-700 text-xs h-8"
                                  disabled={!isEnabled}
                                  title={
                                    !isEnabled
                                      ? "Le bouton sera activé 15 minutes avant le début du rendez-vous"
                                      : undefined
                                  }
                                >
                                  <VideoIcon className="w-3 h-3 mr-1" />
                                  Rejoindre
                                </Button>
                                
                                {!isEnabled && (
                                  <p className="text-xs text-gray-500">
                                    {diffMin > 15
                                      ? "Disponible 15min avant"
                                      : "Rendez-vous passé"
                                    }
                                  </p>
                                )}

                                {now > meetingDateObj && (
                                  <Badge className="bg-red-600 text-white mt-1" variant="default">
                                    <span className="text-xs">
                                      Ce créneau est déjà passé
                                    </span>
                                  </Badge>
                                )}
                              </div>
                            );
                          })()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
