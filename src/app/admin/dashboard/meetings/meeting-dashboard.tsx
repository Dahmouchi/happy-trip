/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { formatWithOptions } from "date-fns/fp";
import { fr } from "date-fns/locale";
import { Calendar, Clock, Plus, Check, Trash2, UserIcon, PhoneIcon, MailIcon } from "lucide-react";
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
  onFinishMeeting: (meetingId: string) => void;
}

const AdminDashboard = ({
  meetings,
  onConfirmMeeting,
  onDeleteMeeting,
  onFinishMeeting,
}: AdminDashboardProps) => {
  const { toast } = useToast();


  const handleConfirmMeeting = (
    meetingId: string,
    clientName: string,
    clientPhone: string,
    clientEmail: string
  ) => {
    onConfirmMeeting(meetingId);

    // toast({
    //   title: "Rendez-vous confirmé",
    //   description: `Un email de confirmation a été envoyé à ${clientEmail}.`,
    // });

    // Appel à l'API pour envoyer l'email de confirmation
    fetch("/api/send-confirmation-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
      to: clientEmail,
      name: clientName,
      meetingId: meetingId,
      }),
    })
      .then((res) => {
      if (!res.ok) {
        throw new Error("Erreur lors de l'envoi de l'email");
      }
      })
      .catch(() => {
      toast({
        title: "Erreur lors de l'envoi de l'email",
        description: "Impossible d'envoyer l'email de confirmation.",
        variant: "destructive",
      });
      });
  };

  const handleFinishMeeting = (meetingId: string) => {
    onFinishMeeting(meetingId);
    toast({
      title: "Rendez-vous Terminé",
      description: "Le rendez-vous a été marqué comme terminé.",
    });
  }
  const getStatusBadge = (status: Meeting["status"]) => {
    switch (status) {
      case "cancelled":
        return <Badge variant="destructive">Annulé</Badge>;
      case "pending":
        return <Badge variant="secondary">En attente</Badge>;
      case "confirmed":
        return <Badge className="bg-green-600">Confirmé</Badge>;
      case "finished":
        return <Badge className="bg-blue-600">Terminé</Badge>;
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
                      <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-4 items-center">
                        {meeting.clientName && (
                          <span className="flex items-center gap-1">
                            <UserIcon className="h-4 w-4 text-primary" />
                            <strong>Client :</strong> {meeting.clientName}
                          </span>
                        )}
                        {meeting.clientPhone && (
                          <span className="flex items-center gap-1">
                            <PhoneIcon className="h-4 w-4 text-primary" />
                            <strong>Téléphone :</strong> {meeting.clientPhone}
                          </span>
                        )}
                        {meeting.clientEmail && (
                          <span className="flex items-center gap-1">
                            <MailIcon className="h-4 w-4 text-primary" />
                            <strong>Email :</strong> {meeting.clientEmail}
                          </span>
                        )}
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
                                  meeting.clientPhone!,
                                  meeting.clientEmail!
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
                  <div className="flex flex-col gap-1 flex-1">
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
                    {meeting.status === "confirmed" && (() => {
                      const now = new Date();
                      const meetingDate = parseMeetingDate(meeting);
                      const diffMs = meetingDate.getTime() - now.getTime();
                      const diffMin = diffMs / (1000 * 60);
                      const isEnabled = diffMin <= 15 ;

                      if (now > meetingDate) {
                        return (
                          <span className="text-xs text-red-600 ml-2">
                            Ce rendez-vous est passé.
                          </span>
                        );
                      }

                      return (
                        <div className="flex flex-col items-start">
                          <Button
                            size="sm"
                            onClick={() => {
                              const jitsiRoom = `meeting-${meeting.id}`;
                              window.open(
                                `https://meet.jit.si/${jitsiRoom}`,
                                "_blank"
                              );
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-xs"
                            disabled={!isEnabled}
                            title={
                              !isEnabled
                                ? "Le bouton sera activé 15 minutes avant le début du rendez-vous"
                                : undefined
                            }
                          >
                            Rejoindre Jitsi
                          </Button>
                          {!isEnabled && (
                            <span className="text-xs text-muted-foreground mt-1">
                              Le bouton sera activé 15 minutes avant le début du rendez-vous
                            </span>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 flex flex-wrap gap-4">
                    {meeting.clientEmail && (
                    <span>
                      <strong>Email :</strong> {meeting.clientEmail}
                    </span>
                    )}
                    {meeting.clientPhone && (
                    <span>
                      <strong>Téléphone :</strong> {meeting.clientPhone}
                    </span>
                    )}
                  </div>
                  </div>
                    <div className="flex gap-2">
                    {/* Supprimer le créneau */}
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

                    {/* Marquer comme terminé */}
                    {meeting.status === "confirmed" ? (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            Marquer comme terminé
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Marquer le rendez-vous comme terminé
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Êtes-vous sûr de vouloir marquer ce rendez-vous comme terminé&nbsp;?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annuler</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => {
                                handleFinishMeeting(meeting.id);
                              }}
                            >
                              Terminer
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    ) : meeting.status === "completed" ? (
                      <Badge className="bg-blue-600 text-white" variant="default">
                        Terminé
                      </Badge>
                    ) : null}
                    </div>
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