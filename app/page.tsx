import Link from 'next/link';

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-[#2774AE] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="uppercase tracking-widest text-[#FFD100] text-sm font-semibold mb-3">Los Angeles Math Tournament</p>
          <h1 className="text-5xl font-extrabold mb-4">LAMT 2026</h1>
          <p className="text-xl text-blue-100 mb-2">May 23, 2026 &bull; Los Angeles, CA</p>
          <p className="text-blue-200 mb-8 max-w-xl mx-auto">
            A premier one-day math competition for middle and high school students across Southern California.
          </p>
          <Link
            href="/register"
            className="inline-block bg-[#FFD100] text-slate-900 font-bold px-8 py-3 rounded-lg hover:bg-yellow-300 transition"
          >
            Register Your Team
          </Link>
        </div>
      </section>

      {/* Quick info */}
      <section className="max-w-5xl mx-auto px-4 py-16 grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-slate-50 rounded-xl p-6">
          <p className="text-3xl font-bold text-[#2774AE]">May 23</p>
          <p className="text-slate-600 mt-1">Tournament Date, 2026</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-6">
          <p className="text-3xl font-bold text-[#2774AE]">MS &amp; HS</p>
          <p className="text-slate-600 mt-1">Middle &amp; High School Divisions</p>
        </div>
        <div className="bg-slate-50 rounded-xl p-6">
          <p className="text-3xl font-bold text-[#2774AE]">4 Members</p>
          <p className="text-slate-600 mt-1">Per Team (max)</p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-900 text-white text-center py-16 px-4">
        <h2 className="text-2xl font-bold mb-3">Ready to compete?</h2>
        <p className="text-slate-400 mb-6">Secure your spot before registration closes.</p>
        <Link
          href="/register"
          className="inline-block border-2 border-[#FFD100] text-[#FFD100] font-semibold px-6 py-2.5 rounded-lg hover:bg-[#FFD100] hover:text-slate-900 transition"
        >
          Register Now
        </Link>
      </section>
    </main>
  );
}
