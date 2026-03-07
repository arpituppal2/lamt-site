export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Interest / Waitlist Form</h1>
        <p className="text-slate-600 mb-2">
          LAMT 2026 &mdash; May 23, 2026. Registration is not yet open.
        </p>
        <p className="text-slate-600 mb-2">
          Fill out the form below to join the waitlist and be notified when registration opens.
        </p>
        <p className="text-slate-500 mb-8 text-sm">Cost: TBD &nbsp;&bull;&nbsp; Up to 6 members per team &nbsp;&bull;&nbsp; High school level (all students welcome)</p>
        <a
          href="https://forms.gle/8JUBJaQQv4fmL8th6"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-[#2774AE] text-white font-bold px-10 py-4 rounded-lg hover:bg-[#003B5C] transition-all shadow-md text-base"
        >
          Open Waitlist / Interest Form &rarr;
        </a>
      </div>
    </main>
  );
}
