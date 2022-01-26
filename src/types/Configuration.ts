import { AvailabilityWindow } from './AvailabilityWindow';

export interface Configuration {
  interviewerId?: string;
  title: string;
  duration: number;
  timezone: string;
  availabilityWindow: AvailabilityWindow[];
  relevancePeriod: number;
  relevanceStartingDate: number;
  minimumNoticeTime: number;
  bufferTime: number;
  startTimeIncrement: number;
}
