
export interface Meeting {
  id: string;
  date: string;
  time: string;
  isBooked: boolean;
  clientName?: string;
  clientPhone?: string;
  status: 'available' | 'pending' | 'confirmed';
}
