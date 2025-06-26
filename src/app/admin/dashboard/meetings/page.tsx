/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from "react";
import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import AdminDashboard from "./meeting-dashboard";
import { Meeting } from "@prisma/client";
import { getAllMeetings } from "@/actions/meetingsActions";
import { getClientById } from "@/actions/client";
import { toast } from "react-toastify";




const MeetingsPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      const data = await getAllMeetings();
      if (!data || !Array.isArray(data)) {
        console.error("Failed to fetch meetings or data is not an array");
        return;
      }

      const meetingsWithClient = await Promise.all(
        data.map(async (item: any) => {
          let clientName = "";
          let clientPhone = "";
          let clientEmail = "";
          if (item.clientId) {
            try {
              const client = await getClientById(item.clientId);
              clientName = client?.name ?? "";
              clientPhone = client?.phone !== undefined && client?.phone !== null ? String(client.phone) : "";
              clientEmail = client?.email ?? "";
            } catch (e) {
              console.error("Failed to fetch client", e);
            }
          }
          return {
            ...item,
            clientName,
            clientPhone,
            clientEmail,
          };
        })
      );
      setMeetings(meetingsWithClient);
    };
    fetchMeetings();
  }, []);

  const confirmMeeting = async (meetingId: string) => {
    try {
      const { confirmMeeting } = await import('@/actions/meetingsActions');
      await confirmMeeting(meetingId);
      setMeetings(prev => prev.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, status: 'confirmed' }
          : meeting
      ));
      if (typeof window !== "undefined") {
        toast.success("Réunion confirmée avec succès.");
      }
    } catch (error) {
      console.error("Failed to confirm meeting:", error);
      if (typeof window !== "undefined") {
        toast.error("Échec de la confirmation de la réunion.");
      }
    }
  };

  const deleteMeeting = async (meetingId: string) => {
    try {
      await import('@/actions/meetingsActions').then(({ deleteMeeting }) => deleteMeeting(meetingId));
      setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
      // Show toast alert
      if (typeof window !== "undefined") {
        toast.success("Réunion supprimée avec succès.");
      }
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      if (typeof window !== "undefined") {
        toast.error("Échec de la suppression de la réunion.");
      }
    }
  };


  const finishMeeting = async (meetingId: string) => {
    try {
      const { finishMeeting } = await import('@/actions/meetingsActions');
      await finishMeeting(meetingId);
      setMeetings(prev => prev.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, status: 'finished' }
          : meeting
      ));
      if (typeof window !== "undefined") {
        toast.success("Réunion terminée avec succès.");
      }
    } catch (error) {
      console.error("Failed to finish meeting:", error);
      if (typeof window !== "undefined") {
        toast.error("Échec de la termination de la réunion.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-4 px-2 sm:px-4 md:py-8">
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <h3 className="text-xl sm:text-2xl font-semibold text-primary flex items-center gap-2">
        <Users className="w-6 h-6 sm:w-7 sm:h-7 text-muted-foreground" />
        <span>Tableau de bord des réunions</span>
        </h3>
      </div>
      
      <Tabs defaultValue="admin" className="w-full">
        <TabsContent value="admin" className="mt-4 sm:mt-6">
        <Card className="w-full">
          <CardHeader>
          <CardTitle className="text-lg sm:text-xl font-semibold text-primary">
            Gestion des Réunions
          </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-4">
          <AdminDashboard 
            meetings={meetings}
            onConfirmMeeting={confirmMeeting}
            onDeleteMeeting={deleteMeeting}
            onFinishMeeting={finishMeeting}
          />
          </CardContent>
        </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
};

export default MeetingsPage;
