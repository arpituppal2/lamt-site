import Link from 'next/link';

const rounds = [
  {
    title: 'Special Round!!!',
    detail: 'A mystery round — details coming soon! 75 min total.',
  },
  {
    title: 'Algebra',
    detail: '50 min, 10 questions — individual round',
  },
  {
    title: 'Geometry',
    detail: '50 min, 10 questions — individual round',
  },
  {
    title: 'Combinatorics',
    detail: '50 min, 10 questions — individual round',
  },
  {
    title: 'Guts Round',
    detail: '60–75 min live-scored team round, number of sets TBD',
  },
  {
    title: 'Integration Bee',
    detail: 'Speed-based integration competition (post-rounds event)',
  },
];

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="bg-[#003B5C] text-white py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight mb-4">
            Los Angeles Math Tournament (LAMT) 2026
          </h1>
          <p className="text-slate-300 text-lg mb-8">
            Student-led math competition | May 23, 2026 at UCLA
          </p>
          <a
            href="https://forms.gle/8JUBJaQQv4fmL8th6"
            className="inline-block bg-[#FFD100] text-[#003B5C] font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition"
          >
            Register / Join Waitlist →
          </a>
        </div>
      </section>

      {/* About Body */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">About LAMT</h2>
        <p className="text-slate-600 mb-6">
          LAMT is a student-led math competition organized by UCLA math students,
          open to students in grades 6–12 during the 2025–2026 academic school year.
          We deliver creative problem-solving across algebra, geometry, number theory,
          and team challenges.
        </p>
        <p className="text-slate-600 mb-10">
          <strong>Our Mission:</strong> Challenge students beyond textbooks with engaging
          rounds that build math passion and community in sunny LA. Fully student-run like our peers.
        </p>

        {/* Rounds Section */}
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Competition Rounds</h2>
        <div className="space-y-4">
          {rounds.map((round) => (
            <div key={round.title} className="border-l-4 border-[#2774AE] pl-4 py-1">
              <p className="font-semibold text-slate-900">{round.title}</p>
              <p className="text-slate-500 text-sm mt-0.5">{round.detail}</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-slate-600 mb-4">Ready to compete?</p>
          <a
            href="https://forms.gle/8JUBJaQQv4fmL8th6"
            className="inline-block bg-[#003B5C] text-white font-bold px-8 py-3 rounded-full hover:bg-[#002a45] transition"
          >
            Join the Waitlist →
          </a>
        </div>
      </section>
    </main>
  );
}
