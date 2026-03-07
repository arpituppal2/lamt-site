import Link from 'next/link';
import MathDeco from './components/MathDeco';

const stats = [
  { value: 'May 23', label: 'Tournament Date', sub: '2026' },
  { value: 'HS', label: 'Division', sub: '(All students welcome)' },
  { value: '6', label: 'Members / Team', sub: 'Maximum' },
  { value: 'UCLA', label: 'Venue', sub: 'Los Angeles, CA' },
];

const formats = [
  {
    icon: '\u03a3',
    title: 'Individual Round',
    desc: 'Test your solo problem-solving skills across algebra, geometry, number theory, and combinatorics.',
  },
  {
    icon: '\u222b',
    title: 'Team Round',
    desc: 'Collaborate with teammates on challenging multi-step problems that reward group strategy.',
  },
  {
    icon: '\u03c0',
    title: 'Relay Round',
    desc: 'A fast-paced format where each answer feeds the next \u2014 teamwork and accuracy under pressure.',
  },
  {
    icon: '\u221a',
    title: 'Guts Round',
    desc: 'Live-scored, high-intensity round where speed and accuracy determine standings in real time.',
  },
];

const highlights = [
  { title: 'High School Level', sub: 'All students encouraged to apply' },
  { title: 'Teams of up to 6',  sub: 'International tournament' },
  { title: 'UCLA Campus venue', sub: 'World-class facilities' },
  { title: 'Original problems', sub: 'Crafted by UCLA students' },
];

export default function HomePage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-[#003B5C] text-white">
        <MathDeco latex="\\binom{n}{k}" className="top-10 left-6 text-[3.5rem]" />
        <MathDeco latex="n!" className="top-1/3 left-[4%] text-[4rem]" />
        <MathDeco latex="a^2 + b^2 = c^2" className="bottom-12 left-[8%] text-[2.8rem]" />
        <MathDeco latex="\\sum_{k=0}^{n} \\binom{n}{k} = 2^n" className="top-8 right-[8%] text-[2.4rem]" />
        <MathDeco latex="a^{p-1} \\equiv 1 \\pmod{p}" className="top-1/2 right-[4%] text-[2.4rem]" />
        <MathDeco latex="V - E + F = 2" className="bottom-16 right-[14%] text-[2.8rem]" />

        <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#FFD100]" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-28 sm:py-36 text-center">
          <span className="inline-block uppercase tracking-[0.2em] text-[#FFD100] text-xs font-bold mb-6 border border-[#FFD100]/30 rounded-full px-4 py-1.5">
            UCLA Student-Run Competition
          </span>
          <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[1.05] mb-5">
            LOS ANGELES<br />
            <span className="text-[#FFD100]">MATH TOURNAMENT</span>
          </h1>
          <p className="text-slate-400 text-base sm:text-lg mb-4 max-w-md mx-auto leading-relaxed">
            An international high school math competition hosted by UCLA students \u2014 May 23, 2026. All students are encouraged to apply.
          </p>
          <p className="text-slate-500 text-sm mb-8">
            Cost: TBD
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FFD100] text-slate-900 font-bold px-8 py-3.5 rounded-lg hover:bg-[#FFE566] transition-all shadow-lg hover:-translate-y-0.5 text-sm sm:text-base"
            >
              Join the Waitlist \u2192
            </a>
            <Link
              href="/about"
              className="border border-white/25 text-white font-medium px-8 py-3.5 rounded-lg hover:bg-white/10 transition-all text-sm sm:text-base"
            >
              Learn More
            </Link>
          </div>
          <p className="mt-8 text-slate-500 text-sm">
            \ud83d\udccd UCLA Campus \u00b7 Los Angeles, California
          </p>
        </div>
      </section>

      <section className="bg-[#2774AE]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid grid-cols-2 md:grid-cols-4 divide-x divide-white/20">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="py-8 px-4 text-center text-white">
              <p className="text-3xl sm:text-4xl font-black text-[#FFD100]">{value}</p>
              <p className="text-sm font-semibold mt-1">{label}</p>
              <p className="text-xs text-blue-200 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[#2774AE] text-xs font-bold uppercase tracking-widest mb-3">About LAMT</p>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-6">
              Celebrating mathematical excellence worldwide
            </h2>
            <p className="text-slate-600 leading-relaxed mb-4">
              The Los Angeles Math Tournament (LAMT) is an international student-organized competition hosted at UCLA, designed to inspire and challenge talented mathematicians from around the world.
            </p>
            <p className="text-slate-600 leading-relaxed mb-8">
              Problems are written at a high school level. All students are encouraged to apply. Participants compete in individual and team-based events spanning algebra, geometry, number theory, and combinatorics \u2014 all problems handcrafted by UCLA&apos;s own math community.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-[#2774AE] font-semibold text-sm hover:gap-3 transition-all"
            >
              Learn more about LAMT <span>\u2192</span>
            </Link>
          </div>
          <div className="bg-gradient-to-br from-[#003B5C] to-[#2774AE] rounded-2xl p-8 text-white shadow-xl">
            <div className="space-y-5">
              {highlights.map(({ title, sub }) => (
                <div key={title} className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#FFD100]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-4 h-4 text-[#FFD100]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{title}</p>
                    <p className="text-blue-200 text-xs mt-0.5">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[#2774AE] text-xs font-bold uppercase tracking-widest mb-3">Competition Format</p>
            <h2 className="text-4xl font-extrabold text-slate-900">How the tournament works</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {formats.map(({ icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:-translate-y-1 transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-[#003B5C] flex items-center justify-center mb-5">
                  <span className="text-[#FFD100] text-2xl font-serif italic">{icon}</span>
                </div>
                <h3 className="font-bold text-slate-900 mb-2 text-sm">{title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/schedule" className="text-[#2774AE] text-sm font-semibold hover:underline">
              View full schedule \u2192
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#FFD100] py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Interested in competing?
          </h2>
          <p className="text-slate-700 mb-2 text-lg">
            Fill out our waitlist/interest form to be notified when registration opens.
          </p>
          <p className="text-slate-600 mb-8 text-sm">Cost: TBD</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://forms.gle/8JUBJaQQv4fmL8th6"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#003B5C] text-white font-bold px-8 py-3.5 rounded-lg hover:bg-[#2774AE] transition-all shadow-md text-sm sm:text-base"
            >
              Waitlist / Interest Form
            </a>
            <Link
              href="/contact"
              className="border-2 border-slate-900 text-slate-900 font-semibold px-8 py-3.5 rounded-lg hover:bg-slate-900 hover:text-white transition-all text-sm sm:text-base"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
