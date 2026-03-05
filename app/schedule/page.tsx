const schedule = [
  { time: '8:00 AM', event: 'Check-in & Registration' },
  { time: '9:00 AM', event: 'Opening Ceremony' },
  { time: '9:30 AM', event: 'Individual Round 1' },
  { time: '10:30 AM', event: 'Individual Round 2' },
  { time: '11:30 AM', event: 'Team Round' },
  { time: '12:30 PM', event: 'Lunch Break' },
  { time: '1:30 PM', event: 'Relay Round' },
  { time: '2:30 PM', event: 'Guts Round' },
  { time: '4:00 PM', event: 'Solutions Review' },
  { time: '4:30 PM', event: 'Awards Ceremony' },
  { time: '5:00 PM', event: 'End of Day' },
];

export default function SchedulePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-2">Day-of Schedule</h1>
      <p className="text-slate-500 mb-8">May 23, 2026 &mdash; Subject to minor adjustments. Final schedule distributed day-of.</p>
      <div className="divide-y divide-slate-100">
        {schedule.map((item) => (
          <div key={item.time} className="flex items-center gap-6 py-3">
            <span className="w-24 text-sm font-mono text-[#2774AE] shrink-0">{item.time}</span>
            <span className="text-slate-800 font-medium">{item.event}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
