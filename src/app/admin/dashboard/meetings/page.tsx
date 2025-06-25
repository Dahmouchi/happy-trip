'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Meeting } from "./types";
import AdminDashboard from "./meeting-dashboard";

const MeetingsPage = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: '1',
      date: '2025-01-02',
      time: '10:00',
      isBooked: false,
      status: 'available'
    },
    {
      id: '2',
      date: '2025-01-02',
      time: '14:00',
      isBooked: true,
      clientName: 'Younes',
      clientPhone: '+212622538418',
      status: 'pending'
    }
  ]);

  const addMeeting = (date: string, time: string) => {
    const newMeeting: Meeting = {
      id: Date.now().toString(),
      date,
      time,
      isBooked: false,
      status: 'available'
    };
    setMeetings(prev => [...prev, newMeeting]);
  };

  const bookMeeting = (meetingId: string, clientName: string, clientPhone: string) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, isBooked: true, clientName, clientPhone, status: 'pending' as const }
        : meeting
    ));
  };

  const confirmMeeting = (meetingId: string) => {
    setMeetings(prev => prev.map(meeting => 
      meeting.id === meetingId 
        ? { ...meeting, status: 'confirmed' as const }
        : meeting
    ));
  };

  const deleteMeeting = (meetingId: string) => {
    setMeetings(prev => prev.filter(meeting => meeting.id !== meetingId));
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
                  onAddMeeting={addMeeting}
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
