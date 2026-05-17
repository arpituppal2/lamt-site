// ─── SHARED TYPES & DATA — imported by /live and /admin ─────────────────────

export interface ScheduleItem {
  time: string;
  end: string;
  event: string;
  location: string;
  originalTime?: string;
  adjustmentReason?: string;
}

export interface Update {
  id: number;
  timestamp: string;
  title?: string;
  body: string;
}

export interface Reply {
  id: number;
  body: string;
  timestamp: string;
}

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  timestamp: string;
  resolved: boolean;
  replies?: Reply[];
}

// ─── SCHEDULE DATA ────────────────────────────────────────────────────────────
// Edit times/events here to update the schedule on the live page.
export const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { time: "8:00 AM",  end: "8:45 AM",  event: "Contestant Check-In",   location: "Outside MS 4000A" },
  { time: "8:45 AM",  end: "9:15 AM",  event: "Opening Ceremony",       location: "MS 4000A" },
  { time: "9:15 AM",  end: "10:30 AM", event: "Secret Team Round",       location: "MS 4000A, MS 5200" },
  { time: "10:30 AM", end: "11:30 AM", event: "Algebra / Number Theory", location: "MS 4000A, MS 5200" },
  { time: "11:30 AM", end: "12:30 PM", event: "Combinatorics",            location: "MS 4000A, MS 5200" },
  { time: "12:30 PM", end: "1:30 PM",  event: "Lunch & Disputes",         location: "Court of Sciences" },
  { time: "1:30 PM",  end: "2:45 PM",  event: "Geometry",                 location: "MS 4000A, MS 5200" },
  { time: "2:45 PM",  end: "4:15 PM",  event: "Guts Round",               location: "MS 4000A, MS 5200" },
  { time: "4:15 PM",  end: "6:00 PM",  event: "Activities",               location: "MS 4000A, MS 5200" },
  { time: "6:00 PM",  end: "7:30 PM",  event: "Awards Ceremony",          location: "MS 4000A" },
];

// ─── LIVE UPDATES ─────────────────────────────────────────────────────────────
// To post an update: prepend an object to this array and push.
// { id: Date.now(), timestamp: "10:45 AM", title: "Optional bold title", body: "Your update text." }
export const DEFAULT_UPDATES: Update[] = [
  // Example (remove before tournament):
  // { id: 1, timestamp: "8:00 AM", title: "Welcome to LAMT 2026!",
  //   body: "Check-in is now open outside MS 4000A. See you soon!" },
];
