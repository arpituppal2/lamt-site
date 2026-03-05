export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Contact Us</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#2774AE] mb-2">General Inquiries</h2>
          <p className="text-slate-600 text-sm">Email us at <a href="mailto:uclamathtournament@gmail.com" className="text-[#2774AE] underline">lamt2026@gmail.com</a></p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#2774AE] mb-2">Registration Support</h2>
          <p className="text-slate-600 text-sm">For registration issues, email us with subject line &quot;LAMT Registration Help&quot;.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#2774AE] mb-2">Stay Connected</h2>
          <p className="text-slate-600 text-sm">Join our Discord server for real-time updates. Link will be shared after team registration.</p>
        </div>
      </div>
    </main>
  );
}
