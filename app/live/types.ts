// Shared types and data for /live and /admin
// Exported from a separate file to avoid Next.js page export restrictions

export type ScheduleItem = {
  time: string;
  end: string;
  originalTime?: string;
  originalEnd?: string;
  adjustmentReason?: string;
  event: string;
  location: string;
};

export type Update = {
  id: number;
  timestamp: string;
  title: string;
  body: string;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  resolved: boolean;
};

export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { time: "8:00 AM",  end: "8:45 AM",  event: "Contestant Check-In",    location: "Outside MS 4000A" },
  { time: "8:45 AM",  end: "9:15 AM",  event: "Opening Ceremony",       location: "MS 4000A" },
  { time: "9:15 AM",  end: "10:30 AM", event: "Secret Team Round",      location: "MS 4000A, MS 5200" },
  { time: "10:30 AM", end: "11:30 AM", event: "Algebra / Number Theory", location: "MS 4000A, MS 5200" },
  { time: "11:30 AM", end: "12:30 PM", event: "Combinatorics",          location: "MS 4000A, MS 5200" },
  { time: "12:30 PM", end: "1:30 PM",  event: "Lunch & Disputes",       location: "Court of Sciences" },
  { time: "1:30 PM",  end: "2:45 PM",  event: "Geometry",               location: "MS 4000A, MS 5200" },
  { time: "2:45 PM",  end: "4:15 PM",  event: "Guts Round",             location: "MS 4000A, MS 5200" },
  { time: "4:15 PM",  end: "6:00 PM",  event: "Activities",             location: "MS 4000A, MS 5200" },
  { time: "6:00 PM",  end: "7:00 PM",  event: "Awards Ceremony",        location: "MS 4000A" },
];

export const DEFAULT_UPDATES: Update[] = [
  // TEMPLATE — uncomment and fill in:
  // {
  //   id: 1,
  //   timestamp: "8:45 AM",
  //   title: "Opening Ceremony starting now",
  //   body: "Please make your way to MS 4000A. We begin in 5 minutes.",
  // },
];
