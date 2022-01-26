import { AvailabilityWindow } from './AvailabilityWindow';
import { BookedTime } from './BookedTime';

export interface AvailableWindowProps {
  deleteWindow: (id: any) => () => void;
  window: AvailabilityWindow;
  getAvailabilityWindow: (changedWindow: AvailabilityWindow) => void;
  bookedTimeForCurrentWindow: BookedTime[];
}
