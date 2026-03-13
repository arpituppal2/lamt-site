import Link from 'next/link';
import MathDeco from './components/MathDeco';

const stats = [
  { value: 'May 23', label: 'Tournament Date (Tentative)', sub: '2026' },
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
  { icon: '🎓', title: 'Grades 6–12', sub: 'All eligible to compete' },
  { icon: '👥', title: 'Teams of 6', sub: 'Grades 6–12 eligible' },
  { icon: '📍', title: 'UCLA Campus', sub: 'Los Angeles, CA' },
  { icon: '✏️', title: 'Original Problems', sub: 'Crafted by UCLA students' },
];

export default function HomePage() {
  return (
    <main>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-[#003B5C] text-white">
        <MathDeco latex="v_p(x^n - y^n) = v_p(x-y) + v_p(n)" className="top-10 left-6 text-[3.5rem]" />
        <MathDeco latex="\\sum_{\\text{sym}} x_1^{p_1} x_2^{p_2} \\cdots x_n^{p_n} \\geq \sum_{\\text{sym}} x_1^{q_1} x_2^{q_2} \\cdots x_n^{q_n}$" className="top-1/3 left-[4%] text-[3.1rem]" />
        <MathDeco latex="\\sum_{i=1}^n |a_i b_i| \\leq \\left( \\sum_{i=1}^n |a_i|^p \\right)^{1/p} \\left( \\sum_{i=1}^n |b_i|^q \\right)^{1/q}" className="bottom-12 left-[8%] text-[2.8rem]" />
        <MathDeco latex="d^2 = R(R - 2r)" className="top-8 right-[8%] text-[2.4rem]" />
        <MathDeco latex="E\\left[\\sum_{i=1}^n X_i\\right] = \\sum_{i=1}^n E[X_i]" className="top-1/2 right-[4%] text-[2.4rem]" />
        <MathDeco latex="|X/G| = \\frac{1}{|G|} \\sum_{g \\in G} |X^g|" className="bottom-16 right-[14%] text-[2.8rem]" />

        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFD100]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:py-28 py-36 text-center">
          <span className="inline-block uppercase tracking-[0.2em] text-[#FFD100] text-xs font-bold mb-6 border border-[#FFD100]/30 rounded-full px-4 py-1.5">
            UCLA Student-Run Competition
          </span>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-5">
            LOS ANGELES<br />
            <span className="text-[#FFD100]">MATH TOURNAMENT</span>
          </h1>
          <p className="text-[#8BB8E8] text-base sm:text-lg mb-4 max-w-md mx-auto leading-relaxed">
            A student-led math competition hosted by UCLA students, open to grades 6–12 — May 23, 2026.
          </p>
          <p className="text-[#8BB8E8]/60 text-sm mb-8">
            Cost: TBD
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              className="bg-[#FFD100] text-[#003B5C] font-bold px-8 py-3 rounded-full hover:bg-[#FFC72C] transition"
            >
              Join the Waitlist →
            </a>
            <Link
              href="/about"
              className="border border-[#8BB8E8]/40 text-[#8BB8E8] px-8 py-3 rounded-full hover:bg-[#005587]/40 transition"
            >
              Learn More
            </Link>
          </div>
          <p className="text-[#8BB8E8]/60 text-sm mt-8">
            📍 UCLA · Los Angeles, California
          </p>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="bg-[#2774AE]">
        <div className="max-w-5xl mx-auto px-4 py-8 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {stats.map(({ value, label, sub }) => (
            <div key={label}>
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-sm font-semibold text-[#DAEBFE] mt-1">{label}</p>
              <p className="text-xs text-[#8BB8E8]">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT LAMT ───────────────────────────────────────────── */}
      <section className="bg-white">
        <div className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-[#2774AE] mb-3">About LAMT</p>
            <h2 className="text-3xl font-bold text-[#003B5C] mb-4">
              Celebrating mathematical excellence worldwide
            </h2>
            <p className="text-slate-600 mb-4">
              The Los Angeles Math Tournament (LAMT) is an international student-organized competition hosted at UCLA, designed to inspire and challenge talented mathematicians from around the world.
            </p>
            <p className="text-slate-600 mb-6">
              Students in grades 6–12 during the 2025–2026 school year are eligible. Participants compete in individual and team-based events spanning algebra, geometry, number theory, and combinatorics — all problems handcrafted by UCLA’s own math community.
            </p>
            <Link href="/about" className="inline-flex items-center gap-1 text-[#2774AE] font-semibold hover:text-[#003B5C] transition">
              Learn more about LAMT →
            </Link>
          </div>

          {/* Highlight boxes */}
          <div className="grid grid-cols-2 gap-4">
            {highlights.map(({ icon, title, sub }) => (
              <div
                key={title}
                className="rounded-xl p-5 border-2 border-[#DAEBFE] bg-[#DAEBFE]/40 hover:border-[#2774AE] hover:bg-[#DAEBFE] transition group"
              >
                <div className="text-2xl mb-2">{icon}</div>
                <p className="font-bold text-[#003B5C] text-sm">{title}</p>
                <p className="text-xs text-[#005587] mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPETITION FORMAT ───────────────────────────────────── */}
      <section className="bg-[#003B5C] text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#FFD100] mb-3 text-center">Competition Format</p>
          <h2 className="text-3xl font-bold text-white text-center mb-10">How the tournament works</h2>

          {/* 5 boxes: all in one row on wide screens, full stack on narrow — never partial rows */}
          <div className="flex flex-col [@media(min-width:900px)]:flex-row gap-4">
            {formats.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="flex-1 bg-[#005587] rounded-xl p-5 border border-[#2774AE] flex flex-col"
              >
                <div className="text-3xl mb-3 text-[#FFD100]">{icon}</div>
                <h3 className="font-bold text-base text-white mb-2">{title}</h3>
                <p className="text-[#8BB8E8] text-sm leading-relaxed flex-1">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link href="/schedule" className="text-[#FFD100] font-semibold hover:text-[#FFC72C] transition">
              View full schedule →
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="bg-[#DAEBFE] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#003B5C] mb-4">Interested in competing?</h2>
          <p className="text-[#005587] mb-2">
            Fill out our waitlist/interest form to be notified when registration opens.
          </p>
          <p className="text-[#2774AE] text-sm mb-8">Cost: TBD</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              className="bg-[#2774AE] text-white font-bold px-8 py-3 rounded-full hover:bg-[#003B5C] transition"
            >
              Waitlist / Interest Form
            </a>
            <Link
              href="/about"
              className="border-2 border-[#2774AE] text-[#2774AE] font-semibold px-8 py-3 rounded-full hover:bg-[#2774AE] hover:text-white transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
