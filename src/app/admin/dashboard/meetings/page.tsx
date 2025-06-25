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

      // Import getClientById dynamically to avoid SSR issues if needed

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8">
        <div className="mb-8 flex items-center gap-4">
          <h3 className="text-2xl font-semibold text-primary flex items-center gap-2">
            <Users className="w-7 h-7 text-muted-foreground" />
            Tableau de bord des réunions
          </h3>
        </div>
        
        <Tabs defaultValue="admin" className="w-full">
          <TabsContent value="admin" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">Gestion des Réunions</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminDashboard 
                  meetings={meetings}
                  onConfirmMeeting={confirmMeeting}
                  onDeleteMeeting={deleteMeeting}
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
