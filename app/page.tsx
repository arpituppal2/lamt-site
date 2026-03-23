import Link from 'next/link';
import MathDeco from './components/MathDeco';

const stats = [
  { value: 'May 17', label: 'Tournament Date (Tentative)', sub: '2026' },
  { value: 'Gr 6–12', label: 'Division', sub: '2025–2026 school year' },
  { value: '6', label: 'Members / Team', sub: 'Per team' },
  { value: 'UCLA', label: 'Venue', sub: 'Los Angeles, CA' },
];

const formats = [
  { icon: '⭐', title: 'Special Round!!!', desc: 'A surprise competitive team round — details coming soon. Stay tuned!' },
  { icon: 'Σ', title: 'Algebra', desc: '10-question individual round testing algebraic reasoning and computation. 50 minutes.' },
  { icon: '△', title: 'Geometry', desc: '10-question individual round covering Euclidean and coordinate geometry. 50 minutes.' },
  { icon: 'π', title: 'Combinatorics', desc: '10-question individual round on counting, probability, and discrete math. 50 minutes.' },
  { icon: '√', title: 'Guts Round', desc: 'Live-scored, high-intensity team round where speed and accuracy determine standings in real time.' },
];

const highlights = [
  { icon: '🎓', title: 'Grades 6–12', sub: 'All eligible to compete' },
  { icon: '👥', title: 'Teams of 6', sub: 'Grades 6–12 eligible' },
  { icon: '📍', title: 'UCLA Campus', sub: 'Los Angeles, CA' },
  { icon: '✏️', title: 'Original Problems', sub: 'Crafted by UCLA students' },
];

export default function HomePage() {
  return (
    <main className="bg-[#003B5C] text-white selection:bg-[#FFD100] selection:text-[#003B5C]">
      <div className="noise-overlay" />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <MathDeco latex="v_p(x^n - y^n) = v_p(x-y) + v_p(n)" className="absolute bottom-1/4 right-[5%] text-[2.5rem] anim-float" />
          <MathDeco latex="\displaystyle \sum_{n \geq 0} p(n)x^n = \prod_{k \geq 1} \frac{1}{1-x^k}" className="absolute top-1/4 right-[8%] text-[3rem] anim-float delay-300" />
          <MathDeco latex="\displaystyle d^2 = -a^2 \Delta y \Delta z - b^2 \Delta x \Delta z - c^2 \Delta x \Delta y" className="absolute top-1/3 left-[2%] text-[2.2rem] anim-float delay-150" />
          <MathDeco latex="\displaystyle \phi(n) = \sum_{d \mid n} \mu(d) \frac{n}{d}" className="absolute bottom-1/3 right-[12%] text-[2.8rem] anim-float delay-450" />
          <MathDeco latex="x^n - 1 = \prod_{d|n} \Phi_d(x)" className="absolute top-[15%] left-[12%] text-[2.6rem] anim-float delay-600" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <div className="inline-block anim-fade-up delay-0">
            <span className="inline-flex items-center gap-2 uppercase tracking-[0.3em] text-[#FFD100] text-xs font-bold mb-8 py-2 px-4 rounded-full border border-[#FFD100]/30 bg-[#FFD100]/5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD100] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FFD100]"></span>
              </span>
              UCLA Student-Run Competition
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9] anim-fade-up delay-150">
            <span className="text-white/90">LOS ANGELES</span><br />
            <span className="text-[#FFD100] drop-shadow-[0_0_15px_rgba(255,209,0,0.3)]">MATH TOURNAMENT</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-300 mb-12 leading-relaxed anim-fade-up delay-300">
            A student-led math competition hosted by UCLA students, open to grades 6–12. 
            Experience mathematical rigor in a grand, high-stakes environment.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 anim-fade-up delay-450">
            <Link 
              href="https://forms.gle/8JUBJaQQv4fmL8th6" 
              className="btn-primary group relative px-10 py-5 bg-[#FFD100] text-[#003B5C] font-bold rounded-xl text-lg shadow-xl overflow-hidden"
            >
              <span className="relative z-10">Join the Waitlist</span>
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity" />
            </Link>
            <Link 
              href="#about" 
              className="btn-secondary px-10 py-5 bg-white/5 border border-white/10 text-white font-bold rounded-xl text-lg hover:bg-white/10 backdrop-blur-md transition-all"
            >
              Learn More
            </Link>
          </div>
          
          <div className="mt-16 text-slate-400 text-sm font-medium tracking-widest flex items-center justify-center gap-4 anim-fade-in delay-600">
            <span className="w-8 h-[1px] bg-slate-700"></span>
            📍 UCLA · LOS ANGELES, CALIFORNIA
            <span className="w-8 h-[1px] bg-slate-700"></span>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 anim-fade-in delay-600">
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#FFD100] to-transparent animate-bounce"></div>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────── */}
      <section className="relative z-20 -mt-12 mb-24 px-6">
        <div className="max-w-6xl mx-auto bg-[#002B44]/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl reveal">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map(({ value, label, sub }) => (
              <div key={label} className="stat-item text-center">
                <div className="text-3xl md:text-4xl font-black text-[#FFD100] mb-2">{value}</div>
                <div className="text-xs uppercase tracking-widest font-bold text-slate-400 mb-1">{label}</div>
                <div className="text-sm text-slate-500">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ABOUT LAMT ───────────────────────────────────────────── */}
      <section id="about" className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <div className="reveal">
            <div className="text-[#FFD100] font-bold tracking-widest text-sm uppercase mb-6 flex items-center gap-3">
              <span className="w-10 h-[1px] bg-[#FFD100]/50"></span>
              About LAMT
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
              Celebrating <span className="text-[#FFD100]">mathematical excellence</span> worldwide.
            </h2>
            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              The Los Angeles Math Tournament (LAMT) is an international student-organized competition hosted at UCLA, designed to challenge talented mathematicians from around the world.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed mb-10">
              Students in grades 6–12 compete in individual and team-based events spanning algebra, geometry, number theory, and combinatorics — all problems handcrafted by UCLA’s own math community.
            </p>
            <Link href="/about" className="link-underline text-[#FFD100] font-bold text-lg inline-flex items-center gap-2 group">
              Learn more about LAMT
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal-stagger">
            {highlights.map(({ icon, title, sub }) => (
              <div key={title} className="card-premium p-8 group">
                <div className="text-4xl mb-4 icon-hover">{icon}</div>
                <h3 className="text-xl font-bold text-white group-hover:text-[#FFD100] transition-colors mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPETITION FORMAT ───────────────────────────────────── */}
      <section className="py-24 px-6 section-divider">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20 reveal">
            <div className="text-[#FFD100] font-bold tracking-widest text-sm uppercase mb-6">Tournament Structure</div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">How the competition works</h2>
            <div className="w-24 h-1 bg-[#FFD100] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-16 reveal-stagger">
            {formats.map(({ icon, title, desc }) => (
              <div key={title} className="card-premium p-8 h-full flex flex-col">
                <div className="text-3xl mb-6 icon-hover">{icon}</div>
                <h3 className="text-xl font-bold mb-4 text-white group-hover:text-[#FFD100]">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-grow">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center reveal">
            <Link href="/schedule" className="btn-secondary px-8 py-4 bg-white/5 border border-white/10 rounded-xl font-bold inline-flex items-center gap-3 group">
              View full schedule
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#FFD100]/5 z-0"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 reveal">
          <h2 className="text-4xl md:text-6xl font-black mb-8">Ready to compete?</h2>
          <p className="text-xl text-slate-300 mb-12 leading-relaxed">
            Fill out our waitlist form to be notified the moment registration opens. 
            Limited spots available for the 2026 tournament.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link 
              href="https://forms.gle/8JUBJaQQv4fmL8th6" 
              className="btn-primary px-12 py-5 bg-[#FFD100] text-[#003B5C] font-bold rounded-xl text-xl shadow-2xl"
            >
              Waitlist / Interest Form
            </Link>
            <Link 
              href="/contact" 
              className="px-10 py-5 font-bold text-white hover:text-[#FFD100] transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
