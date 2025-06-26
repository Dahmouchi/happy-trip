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
import { Clock } from "lucide-react";
import { createRDV, getRDV } from "@/actions/client";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";

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
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Rendez-vous</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#8EBD22] hover:bg-green-700">
              Organiser un rendez-vous
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Nouveau Rendez-vous</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Title Field */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sujet du rendez-vous</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Discussion sur mon voyage au Maroc"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Détails (optionnel)</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Décrivez le but de ce rendez-vous..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Date and Time Fields */}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date Picker */}
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Date <span className="text-red-600">*</span>
                          </label>
                          <Input
                            type="date"
                            value={
                              field.value instanceof Date &&
                              !isNaN(field.value.getTime())
                                ? field.value.toISOString().slice(0, 10)
                                : ""
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              field.onChange(
                                value ? new Date(value) : undefined
                              );
                            }}
                            className="w-full"
                          />
                        </div>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Heure de début</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  <SelectValue placeholder="Sélectionnez une heure" />
                                </div>
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Array.from({ length: 34 }).map((_, i) => {
                                const hour = Math.floor(i / 2) + 8; // Starts at 8:00
                                const minute = i % 2 === 0 ? "00" : "30";
                                const time = `${hour
                                  .toString()
                                  .padStart(2, "0")}:${minute}`;
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
                    className="w-full bg-[#8EBD22] hover:bg-green-700"
                  >
                    Programmer le rendez-vous
                  </Button>
                </form>
              </Form>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? <Loading /> : 
       <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sujet</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody> 
          {meetings.map((meeting: any) => (
            <TableRow key={meeting.id}>
              <TableCell>{meeting.title}</TableCell>
              <TableCell>
                <HoverCard>
                  <HoverCardTrigger className="line-clamp-1">
                    {meeting.description}
                  </HoverCardTrigger>
                  <HoverCardContent> {meeting.description}</HoverCardContent>
                </HoverCard>
              </TableCell>
              <TableCell>
                {format(meeting.date, "PPPp")}
              </TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    meeting.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : meeting.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : meeting.status === "finished"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {meeting.status === "confirmed"
                    ? "Confirmé"
                    : meeting.status === "pending"
                    ? "En attente"
                    :meeting.status === "finished"
                    ? "Terminé"
                    : "Annulé"}
                </span>
              </TableCell>
                <TableCell>
                {meeting.status === "confirmed" && (() => {
                  const now = new Date();
                  const meetingDate = new Date(meeting.date);
                  const diffMs = meetingDate.getTime() - now.getTime();
                  const diffMin = diffMs / 60000;
                  const meetingEnd = new Date(meetingDate.getTime() + meeting.duration * 60000);

                  if (now > meetingEnd) {
                    return (
                        <span className="text-red-400 italic text-sm">
                        Le rendez-vous est passé
                        </span>
                    );
                  }

                  const canJoin = diffMin <= 15 && diffMin >= -meeting.duration;
                  return canJoin ? (
                    <Button
                      className="bg-[#8EBD22] hover:bg-green-700 text-white font-semibold px-4 py-2 rounded shadow"
                      onClick={() =>
                        window.open(
                          `https://meet.jit.si/${meeting.jitsiRoom || `meeting-${meeting.id}`}`,
                          "_blank"
                        )
                      }
                    >
                      Rejoindre
                    </Button>
                  ) : (
                    <span className="text-gray-500 italic text-sm">
                      Disponible 15 min avant
                    </span>
                  );
                })()}
                </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>}
    </div>
  );
}
