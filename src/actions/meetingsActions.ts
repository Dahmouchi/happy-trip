'use server';
import prisma from "@/lib/prisma";
import { resend } from "./resend";


export async function getAllMeetings()
{
  try {
    const meetings = await prisma.meeting.findMany({
      orderBy: { createdAt: "asc" },
      include: {
        client: {
          select: {
            name: true,
            phone: true,
          },
        },
      },
    });
    return meetings;
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return [];
  }
}


export async function deleteMeeting(meetingId: string) {
  try {
    const deletedMeeting = await prisma.meeting.delete({
      where: { id: meetingId },
    });
    return deletedMeeting;
  } catch (error) {
    console.error("Error deleting meeting:", error);
    throw new Error("Failed to delete meeting");
  }
}

export async function confirmMeeting(meetingId: string) {
  try {
    const updatedMeeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: 'confirmed' },
    });
    return updatedMeeting;
  } catch (error) {
    console.error("Error confirming meeting:", error);
    throw new Error("Failed to confirm meeting");
  }
}

export async function updateMeeting(
  meetingId: string,
  title: string,
  date: Date,
  description?: string
) {
  try {
    const updatedMeeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: {
        title,
        date,
        description,
      },
    });
    return updatedMeeting;
  } catch (error) {
    console.error("Error updating meeting:", error);
    throw new Error("Failed to update meeting");
  }
}


export async function finishMeeting(meetingId: string) {
  try {
    const updatedMeeting = await prisma.meeting.update({
      where: { id: meetingId },
      data: { status: 'finished' },
    });
    return updatedMeeting;
  } catch (error) {
    console.error("Error finishing meeting:", error);
    throw new Error("Failed to finish meeting");
  }
}



export async function sendEmailToClient(email: string, subject: string, message: string) {
  try {
    const result = await resend.emails.send({
      from: 'HappyTrip <onboarding@resend.dev>', // works by default
      to: [email],
      subject,
      html: `<p>${message}</p>`,
    });

    return { success: true, result };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
}
