const schedule = [
  { time: '8:00 AM',  event: 'Check-in',                   detail: 'Arrive and check in your team.' },
  { time: '8:45 AM',  event: 'Registration & Opening Ceremony', detail: 'Finish check-in; opening remarks.' },
  { time: '9:15 AM',  event: 'Special Round!!!',            detail: '75 minutes total. Details TBA.' },
  { time: '10:45 AM', event: 'Algebra',                     detail: '50 minutes · 10 questions' },
  { time: '12:00 PM', event: 'Geometry',                    detail: '50 minutes · 10 questions' },
  { time: '1:00 PM',  event: 'Lunch & Disputes',            detail: 'Lunch break and dispute window.' },
  { time: '2:00 PM',  event: 'Combinatorics',               detail: '50 minutes · 10 questions' },
  { time: '3:15 PM',  event: 'Guts Round',                  detail: '60–75 minutes · number of rounds TBD' },
  { time: '4:30 PM',  event: 'Integration Bee / Prof. Talk / Tiebreaks', detail: 'Integration Bee, guest lecture, tiebreakers, and final disputes.' },
  { time: '6:00 PM',  event: 'Awards Ceremony',             detail: 'Recognition and prize distribution.' },
];

export default function SchedulePage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-100 mb-2">Day-of Schedule</h1>
      <p className="text-slate-500 mb-8">May 17, 2026 &mdash; Subject to minor adjustments. Final schedule distributed day-of.</p>
      <div className="divide-y divide-slate-100">
        {schedule.map((item) => (
          <div key={item.time} className="py-4">
            <div className="flex items-center gap-6">
              <span className="w-24 text-sm font-mono text-[#2774AE] shrink-0">{item.time}</span>
              <span className="text-slate-200 font-semibold">{item.event}</span>
            </div>
            {item.detail && (
              <p className="text-slate-300 text-sm mt-1 ml-30 pl-[7.5rem]">{item.detail}</p>
            )}
          </div>
        ))}
      </div>
      <p className="text-slate-200 text-xs mt-8">*Schedule is tentative and subject to change.</p>
    </main>
  );
}
