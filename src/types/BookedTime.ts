import { AvailabilityWindow } from './AvailabilityWindow';

export interface BookedTime {
  day: number;
  bookedTime: AvailabilityWindow[];
}
