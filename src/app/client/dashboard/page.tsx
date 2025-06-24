/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
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

export const meetingFormSchema = z.object({
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
  duration: z
    .number()
    .min(15, "La durée minimale est de 15 minutes")
    .max(120, "La durée maximale est de 120 minutes"),
});
export default function MeetingsPage() {
  const { data: session } = useSession();

  const [meetings, setMeetings] = useState([
    // Sample data - replace with real data fetching
    {
      id: "1",
      title: "Discussion voyage Maroc",
      date: new Date("2023-12-15T14:00:00"),
      duration: 45,
      status: "confirmed",
    },
    {
      id: "2",
      title: "Question sur réservation",
      date: new Date("2023-12-18T10:30:00"),
      duration: 30,
      status: "pending",
    },
  ]);
  const form = useForm<z.infer<typeof meetingFormSchema>>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: {
      title: "",
      description: "",
      date: new Date(),
      duration: 15,
      startTime: "09:00",
    },
  });

  async function onSubmit(data: z.infer<typeof meetingFormSchema>) {
    try {
      // Combine date and time
     console.log(data)

      toast.success("Votre demande de rendez-vous a été envoyée avec succès.");
      form.reset();
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi de votre demande.");
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Mes Rendez-vous</h1>
        <Dialog>
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
                          <FormItem className="flex flex-col">
                            <FormLabel>
                              Date{" "}
                              <span className="text-sm text-slate-500 font-light dark:text-slate-300">
                                (facultative)
                              </span>
                            </FormLabel>
                            <DatetimePicker
                              {...field}
                              format={[
                                ["days", "months", "years"],
                                ["hours", "minutes", "am/pm"],
                              ]}
                            />

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Duration Field */}
                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Durée (minutes)</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            defaultValue={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionnez une durée" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="15">15 minutes</SelectItem>
                              <SelectItem value="30">30 minutes</SelectItem>
                              <SelectItem value="45">45 minutes</SelectItem>
                              <SelectItem value="60">1 heure</SelectItem>
                              <SelectItem value="90">1 heure 30</SelectItem>
                              <SelectItem value="120">2 heures</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sujet</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Durée</TableHead>
            <TableHead>Statut</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {meetings.map((meeting) => (
            <TableRow key={meeting.id}>
              <TableCell>{meeting.title}</TableCell>
              <TableCell>
                {format(meeting.date, "PPPp", { locale: fr })}
              </TableCell>
              <TableCell>{meeting.duration} minutes</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    meeting.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : meeting.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {meeting.status === "confirmed"
                    ? "Confirmé"
                    : meeting.status === "pending"
                    ? "En attente"
                    : "Annulé"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
