export default function ContactPage() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Contact Us</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#2774AE] mb-2">General Inquiries</h2>
          <p className="text-slate-600 text-sm">
            Email us at{' '}
            <a href="mailto:uclamathtournament@gmail.com" className="text-[#2774AE] underline">
              uclamathtournament@gmail.com
            </a>
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#2774AE] mb-2">Registration Support</h2>
          <p className="text-slate-600 text-sm">For registration issues, email us with subject line &quot;[LAMT Registration Help]&quot;.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-[#2774AE] mb-4">Stay Connected</h2>
          <div className="space-y-3">
            <div>
              <a
                href="https://www.facebook.com/groups/1429462591976204/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2774AE] underline text-sm font-medium"
              >
                Facebook Group
              </a>
              <span className="text-slate-500 text-sm"> &mdash; Join our community group for updates.</span>
            </div>
            <div>
              <a
                href="https://www.instagram.com/lamathtournament/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#2774AE] underline text-sm font-medium"
              >
                Instagram @lamathtournament
              </a>
              <span className="text-slate-500 text-sm"> &mdash; Follow us for announcements and highlights.</span>
            </div>
            <div>
              <a href="mailto:uclamathtournament@gmail.com" className="text-[#2774AE] underline text-sm font-medium">
                uclamathtournament@gmail.com
              </a>
              <span className="text-slate-500 text-sm"> &mdash; Please reach us directly by email.</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
