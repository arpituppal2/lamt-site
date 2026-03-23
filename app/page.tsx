import Link from 'next/link';
import MathDeco from './components/MathDeco';

const Icon = ({ type }: { type: string }) => {
  const base = "w-8 h-8 transition-colors duration-300";
  switch (type) {
    case 'algebra':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={base}>
          <path d="M2 18c4-12 16-12 20 0" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'geometry':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={base}>
          <path d="M12 3L2 21h20L12 3z" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="12" cy="15" r="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'combinatorics':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={base}>
          <circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/>
          <path d="M12 7.5l-5 8m10 0l-5-8m-9 10.5h14" strokeLinecap="round"/>
        </svg>
      );
    case 'guts':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={base}>
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    case 'special':
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={base}>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      );
    default: return null;
  }
};

const stats = [
  { value: 'May 17', label: 'Date', sub: '2026' },
  { value: 'Gr 6–12', label: 'Division', sub: '2025–26' },
  { value: '6', label: 'Teams', sub: 'Per team' },
  { value: 'UCLA', label: 'Venue', sub: 'Los Angeles' },
];

const formats = [
  { icon: 'special', title: 'Special Round!!!', desc: 'A surprise competitive team round — details coming soon.' },
  { icon: 'algebra', title: 'Algebra', desc: '10-question individual round testing algebraic reasoning. 50 minutes.' },
  { icon: 'geometry', title: 'Geometry', desc: '10-question individual round covering Euclidean geometry. 50 minutes.' },
  { icon: 'combinatorics', title: 'Combinatorics', desc: 'Individual round on counting and probability. 50 minutes.' },
  { icon: 'guts', title: 'Guts Round', desc: 'Live-scored, high-intensity team round where standings shift in real time.' },
];

export default function HomePage() {
  return (
    <main className="bg-[#0B3C5D] text-white selection:bg-[#F2C94C] selection:text-[#0B3C5D]">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none hero-parallax">
          <MathDeco latex="v_p(x^n - y^n) = v_p(x-y) + v_p(n)" className="math-bg top-[20%] right-[10%] text-4xl" />
          <MathDeco latex="\sum_{n \geq 0} p(n)x^n = \prod_{k \geq 1} \frac{1}{1-x^k}" className="math-bg top-[40%] left-[5%] text-5xl" />
          <MathDeco latex="\phi(n) = \sum_{d \mid n} \mu(d) \frac{n}{d}" className="math-bg bottom-[30%] right-[15%] text-4xl" />
          <MathDeco latex="x^n - 1 = \prod_{d|n} \Phi_d(x)" className="math-bg bottom-[15%] left-[12%] text-3xl" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center reveal-item">
          <span className="inline-block uppercase tracking-[0.4em] text-[#F2C94C] text-[10px] font-bold mb-6 opacity-80">
            UCLA Student-Run Competition
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight">
            LOS ANGELES<br />
            <span className="text-[#F2C94C]">MATH TOURNAMENT</span>
          </h1>
          <p className="max-w-xl mx-auto text-lg text-slate-300/90 mb-12 font-medium">
            Experience mathematical rigor in a grand, high-stakes environment at UCLA. May 17, 2026.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="https://forms.gle/8JUBJaQQv4fmL8th6" className="btn-primary">
              Join the Waitlist
            </Link>
            <Link href="#about" className="px-8 py-3 rounded-lg border border-white/10 hover:bg-white/5 transition-all font-semibold">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────── */}
      <section className="border-y border-white/5 bg-[#0E4F70]/30 py-12 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 reveal-item">
          {stats.map(({ value, label, sub }) => (
            <div key={label} className="text-center group">
              <div className="text-2xl md:text-3xl font-bold text-[#F2C94C] mb-1">{value}</div>
              <div className="text-[10px] uppercase tracking-widest font-black text-slate-400 mb-1">{label}</div>
              <div className="text-xs text-slate-500 font-medium">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────────────── */}
      <section id="about" className="section-padding px-6 relative">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-24 items-center">
          <div className="reveal-item">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Celebrating <span className="text-[#F2C94C]">mathematical excellence</span> worldwide.
            </h2>
            <p className="text-slate-300 text-lg mb-8">
              The Los Angeles Math Tournament (LAMT) is an international competition designed to challenge talented mathematicians from around the world.
            </p>
            <Link href="/about" className="link-underline text-[#F2C94C] font-bold">
              Learn more about LAMT →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 reveal-item">
            <div className="card-premium">
              <div className="text-2xl mb-4 text-[#F2C94C]">🎓</div>
              <h3 className="font-bold mb-2">Grades 6–12</h3>
              <p className="text-slate-400 text-sm">All eligible to compete</p>
            </div>
            <div className="card-premium">
              <div className="text-2xl mb-4 text-[#F2C94C]">👥</div>
              <h3 className="font-bold mb-2">Teams of 6</h3>
              <p className="text-slate-400 text-sm">High school & middle school</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FORMAT ───────────────────────────────────────────────── */}
      <section className="section-padding bg-[#0E4F70]/20 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 reveal-item">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Competition Format</h2>
            <div className="w-12 h-1 bg-[#F2C94C] mx-auto opacity-50 rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 reveal-item">
            {formats.map(({ icon, title, desc }) => (
              <div key={title} className="card-premium flex flex-col p-6">
                <div className="text-[#F2C94C] mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                  <Icon type={icon} />
                </div>
                <h3 className="text-lg font-bold mb-3">{title}</h3>
                <p className="text-slate-400 text-xs leading-relaxed flex-grow">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section className="section-padding px-6 text-center">
        <div className="max-w-2xl mx-auto reveal-item">
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Ready to compete?</h2>
          <p className="text-slate-300 text-lg mb-10">
            Limited spots available for the 2026 tournament.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="https://forms.gle/8JUBJaQQv4fmL8th6" className="btn-primary px-12 py-4 text-lg">
              Waitlist Form
            </Link>
            <Link href="/contact" className="font-bold hover:text-[#F2C94C] transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
