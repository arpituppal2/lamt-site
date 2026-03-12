import Link from 'next/link';
import MathDeco from './components/MathDeco';

const stats = [
  { value: 'May 23', label: 'Tournament Date', sub: '2026' },
  { value: 'Gr 6–12', label: 'Division', sub: '2025–2026 school year' },
  { value: '6', label: 'Members / Team', sub: 'Per team' },
  { value: 'UCLA', label: 'Venue', sub: 'Los Angeles, CA' },
];

const formats = [
  {
    icon: '⭐',
    title: 'Special Round!!!',
    desc: 'A surprise competitive round — details coming soon. Stay tuned!',
  },
  {
    icon: 'Σ',
    title: 'Algebra',
    desc: '10-question individual round testing algebraic reasoning and computation. 50 minutes.',
  },
  {
    icon: '△',
    title: 'Geometry',
    desc: '10-question individual round covering Euclidean and coordinate geometry. 50 minutes.',
  },
  {
    icon: 'π',
    title: 'Combinatorics',
    desc: '10-question individual round on counting, probability, and discrete math. 50 minutes.',
  },
  {
    icon: '√',
    title: 'Guts Round',
    desc: 'Live-scored, high-intensity team round where speed and accuracy determine standings in real time.',
  },
];

const highlights = [
  { title: 'Grades 6–12', sub: 'All eligible to compete' },
  { title: 'Teams of 6', sub: 'Grades 6–12 eligible' },
  { title: 'UCLA Campus venue', sub: 'World-class facilities' },
  { title: 'Original problems', sub: 'Crafted by UCLA students' },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#003B5C] text-white">
        <MathDeco latex="\binom{n}{k}" className="top-10 left-6 text-[3.5rem]" />
        <MathDeco latex="n!" className="top-1/3 left-[4%] text-[4rem]" />
        <MathDeco latex="a^2 + b^2 = c^2" className="bottom-12 left-[8%] text-[2.8rem]" />
        <MathDeco latex="\sum_{k=0}^{n} \binom{n}{k} = 2^n" className="top-8 right-[8%] text-[2.4rem]" />
        <MathDeco latex="a^{p-1} \equiv 1 \pmod{p}" className="top-1/2 right-[4%] text-[2.4rem]" />
        <MathDeco latex="V - E + F = 2" className="bottom-16 right-[14%] text-[2.8rem]" />

        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFD100]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:py-28 py-36 text-center">
          <span className="inline-block uppercase tracking-[0.2em] text-[#FFD100] text-xs font-bold mb-6 border border-[#FFD100]/30 rounded-full px-4 py-1.5">
            UCLA Student-Run Competition
          </span>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-5">
            LOS ANGELES<br />
            <span className="text-[#FFD100]">MATH TOURNAMENT</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mb-4 max-w-md mx-auto leading-relaxed">
            A student-led math competition hosted by UCLA students, open to grades 6–12 — May 23, 2026.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Cost: TBD
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              className="bg-[#FFD100] text-[#003B5C] font-bold px-8 py-3 rounded-full hover:bg-yellow-300 transition"
            >
              Join the Waitlist →
            </a>
            <Link
              href="/about"
              className="border border-white/30 text-white px-8 py-3 rounded-full hover:bg-white/10 transition"
            >
              Learn More
            </Link>
          </div>
          <p className="text-slate-500 text-sm mt-8">
            📍 UCLA Campus · Los Angeles, California
          </p>
        </div>
      </section>

      <section className="bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 py-10 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label, sub }) => (
            <div key={label}>
              <p className="text-3xl font-black text-[#003B5C]">{value}</p>
              <p className="text-sm font-semibold text-slate-700 mt-1">{label}</p>
              <p className="text-xs text-slate-400">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-[#2774AE] mb-3">About LAMT</p>
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Celebrating mathematical excellence worldwide
          </h2>
          <p className="text-slate-600 mb-4">
            The Los Angeles Math Tournament (LAMT) is an international student-organized competition hosted at UCLA, designed to inspire and challenge talented mathematicians from around the world.
          </p>
          <p className="text-slate-600 mb-6">
            Problems are written at a high school level. Students in grades 6–12 during the 2025–2026 school year are eligible to participate. Participants compete in individual and team-based events spanning algebra, geometry, number theory, and combinatorics — all problems handcrafted by UCLA’s own math community.
          </p>
          <Link href="/about" className="text-[#2774AE] font-semibold hover:underline">
            Learn more about LAMT →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {highlights.map(({ title, sub }) => (
            <div key={title} className="bg-slate-50 rounded-xl p-5 border border-slate-100">
              <p className="font-bold text-slate-900 text-sm">{title}</p>
              <p className="text-xs text-slate-500 mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#003B5C] text-white py-16">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FFD100] mb-3 text-center">Competition Format</p>
          <h2 className="text-3xl font-bold text-center mb-10">How the tournament works</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {formats.map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="text-3xl mb-3">{icon}</div>
                <h3 className="font-bold text-lg mb-2">{title}</h3>
                <p className="text-slate-300 text-sm">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/schedule" className="text-[#FFD100] font-semibold hover:underline">
              View full schedule →
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Interested in competing?</h2>
        <p className="text-slate-600 mb-2">
          Fill out our waitlist/interest form to be notified when registration opens.
        </p>
        <p className="text-slate-500 text-sm mb-8">Cost: TBD</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://forms.gle/8JUBJaQQv4fmL8th6"
            className="bg-[#003B5C] text-white font-bold px-8 py-3 rounded-full hover:bg-[#002a45] transition"
          >
            Waitlist / Interest Form
          </a>
          <Link
            href="/about"
            className="border border-slate-300 text-slate-700 px-8 py-3 rounded-full hover:bg-slate-50 transition"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  );
}
