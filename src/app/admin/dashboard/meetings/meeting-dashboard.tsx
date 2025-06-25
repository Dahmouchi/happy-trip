/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { formatWithOptions } from "date-fns/fp";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Plus, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
import { useToast } from "@/hooks/use-toast";
import { Meeting as PrismaMeeting } from "@prisma/client";

// Extend the Meeting type to include clientName and clientPhone
interface Meeting extends PrismaMeeting {
  clientName?: string;
  clientPhone?: string;
  clientEmail?: string;
}

interface AdminDashboardProps {
  meetings: Meeting[];
  onConfirmMeeting: (meetingId: string) => void;
  onDeleteMeeting: (meetingId: string) => void;
}

const AdminDashboard = ({
  meetings,
  onConfirmMeeting,
  onDeleteMeeting,
}: AdminDashboardProps) => {
  const { toast } = useToast();


  const handleConfirmMeeting = (
    meetingId: string,
    clientName: string,
    clientPhone: string
  ) => {
    onConfirmMeeting(meetingId);

    const meetingId_short = meetingId.slice(-4);
    const jitsiRoom = `meeting-${meetingId_short}`;
    toast({
      title: "Rendez-vous Confirmé",
      description: `WhatsApp envoyé à ${clientName} : "Votre rendez-vous est confirmé ! ID : ${meetingId_short}, Lien Jitsi: https://meet.jit.si/${jitsiRoom}"`,
    });
  };

  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "cancelled":
        return <Badge variant="destructive">Annulé</Badge>;
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "confirmed":
        return <Badge className="bg-green-600">Confirmé</Badge>;
      default:
        return null;
    }
  };

  // Helper to parse meeting.date as Date
  const parseMeetingDate = (meeting: Meeting) => {
    // meeting.date might be a string or Date
    return typeof meeting.date === "string"
      ? new Date(meeting.date)
      : meeting.date;
  };

  const pendingMeetings = meetings.filter((m) => m.status === "pending");
  const allMeetings = [...meetings].sort(
    (a, b) =>
      parseMeetingDate(a).getTime() - parseMeetingDate(b).getTime()
  );

  return (
    <div className="space-y-6">
      {/* Approbations en attente */}
      {pendingMeetings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
              <Clock className="h-5 w-5" />
              Approbations en Attente ({pendingMeetings.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingMeetings.map((meeting) => {
                const dateObj = parseMeetingDate(meeting);
                return (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-orange-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium">
                            {formatWithOptions(
                              { locale: fr },
                              "dd MMM yyyy"
                            )(dateObj)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>
                            {dateObj.toLocaleTimeString("fr-FR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-muted-foreground">
                        <strong>Client :</strong> {meeting.clientName} |{" "}
                        <strong>Téléphone :</strong> {meeting.clientPhone} | {" "}
                        <strong>Durée :</strong> {meeting.duration} minutes |{" "}
                        <strong>email : </strong> {meeting.clientEmail}
                        
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4 mr-2" />
                            Confirmer & Envoyer WhatsApp
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Confirmer le rendez-vous
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir confirmer ce rendez-vous
                              avec {meeting.clientName} ? Un message WhatsApp
                              sera envoyé avec l&apos;ID de confirmation et le
                              lien Jitsi Meet.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                handleConfirmMeeting(
                                  meeting.id,
                                  meeting.clientName!,
                                  meeting.clientPhone!
                                )
                              }
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Confirmer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Supprimer le rendez-vous
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir supprimer ce rendez-vous
                              ? Cette action ne peut pas être annulée.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDeleteMeeting(meeting.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Supprimer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tous les rendez-vous */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Tous les Créneaux ({allMeetings.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {allMeetings.map((meeting) => {
              const dateObj = parseMeetingDate(meeting);
              return (
                <div
                  key={meeting.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="font-medium">
                        {formatWithOptions({ locale: fr }, "dd MMM yyyy")(
                          dateObj
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {dateObj.toLocaleTimeString("fr-FR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    {getStatusBadge(meeting.status)}
                    {meeting.clientName && (
                      <span className="text-sm text-muted-foreground">
                        ({meeting.clientName})
                      </span>
                    )}
                    {meeting.status === "confirmed" && (
                        <Button
                        size="sm"
                        onClick={() => {
                          const meetingId_short = meeting.id.slice(-4);
                          const jitsiRoom = `meeting-${meetingId_short}`;
                          window.open(
                            `https://meet.jit.si/${jitsiRoom}`,
                            "_blank"
                          );
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-xs"
                        >
                        Rejoindre Jitsi
                        </Button>
                    )}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Supprimer le créneau</AlertDialogTitle>
                        <AlertDialogDescription>
                          Êtes-vous sûr de vouloir supprimer ce créneau de
                          rendez-vous ? Cette action ne peut pas être annulée.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Annuler</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDeleteMeeting(meeting.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          Supprimer
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              );
            })}
            {allMeetings.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Aucun créneau de rendez-vous ajouté pour le moment. Ajoutez
                votre premier créneau ci-dessus.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;