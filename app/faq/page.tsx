const faqs = [
  { q: 'Who can participate?', a: 'Only students in grades 6–12 during the 2025–2026 academic school year are eligible to participate in LAMT.' },
  { q: 'Can 6th graders participate?', a: 'Yes! 6th grade is totally fine. LAMT is geared toward high schoolers, but younger students who are up for the challenge are absolutely welcome. No special registration process — just sign up like everyone else. However, note that poor behavior, which is more common amongst the youngest, will result in immediate disqualification.' },
  { q: 'How many students per team?', a: 'Up to 6 students per team. A school may register multiple teams.' },
  { q: 'Is there a registration fee?', a: 'Registration fee information will be announced soon. Check back for updates.' },
  { q: 'What topics are covered?', a: 'Algebra, Geometry, Number Theory, Combinatorics, and more — following AMC/AIME style.' },
  { q: 'Where is the tournament held?', a: 'Los Angeles, CA. Exact venue TBA. Will be announced via email to registered teams.' },
  { q: 'Can individuals participate without a team?', a: 'Yes, individual registration may be available. But you should probably stop being lonely for this one. Details coming soon.' },
  { q: 'How do I get updates?', a: 'Join our Discord server (link shared after registration) and watch for emails to your coach.' },
];

export default function FAQPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((item) => (
          <div key={item.q} className="border-l-4 border-[#2774AE] pl-4">
            <p className="font-semibold text-slate-900 mb-1">{item.q}</p>
            <p className="text-slate-600 text-sm">{item.a}</p>          </div>
        ))}
      </div>
    </main>
  );
}
