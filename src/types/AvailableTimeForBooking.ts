import { TimeForBooking } from './TimeForBooking';

export interface AvailableTimeForBooking {
  interviewerId: string;
  date: number;
  data?: any;
  options: TimeForBooking[];
}
