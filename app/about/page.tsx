export default function AboutPage() {
  const staffGroups = [
    {
      title: 'Admin',
      people: ['Kenneth Ren', 'Muztaba Syed', 'Arpit Uppal', 'Brooks Wang', 'Thomas Wu', 'Vicky Zhang'],
    },
    {
      title: 'Problem Writing',
      people: [
        'Arahat Chikkatur',
        'Kyle Hess',
        'Ricky Hu',
        'Bhargava Kanakapura',
        'Jian Kweon',
        'Andrew Li',
        'Aliya Ling',
        'Anthony Mui',
        'Kenneth Ren',
        'Gautham Subramanian',
        'Muztaba Syed',
        'Albert Tran',
        'Arpit Uppal',
        'Brooks Wang',
        'Thomas Wu',
        'Vicky Zhang',
      ],
    },
    {
      title: 'Website & Tech',
      people: ['Aryan Dalal', 'Nish Tharakan', 'Arpit Uppal'],
    },
    {
      title: 'Design and Outreach',
      people: ['Patrick Bian', 'Eva Chung-Yoon', 'Betty Chang', 'Arpit Uppal', 'Vicky Zhang'],
    },
    {
      title: 'Tournament Development',
      people: ['Patrick Bian', 'Kenneth Ren', 'Muztaba Syed', 'Arpit Uppal', 'Brooks Wang', 'Vicky Zhang'],
    },
    {
      title: 'General Members',
      people: [
        'Patrick Bian',
        'Richard Cai',
        'Betty Chang',
        'Allan Chen',
        'Arahat Chikkatur',
        'Eva Chung-Yoon',
        'Aryan Dalal',
        'Sean He',
        'Kyle Hess',
        'Ricky Hu',
        'Nathan Jiang',
        'Luke Jones',
        'Bhargava Kanakapura',
        'Jian Kweon',
        'Andrew Li',
        'William Li',
        'Aliya Ling',
        'Anthony Mui',
        'Pierre Nguyen',
        'Gautham Subramanian',
        'Nish Tharakan',
        'Albert Tran',
      ],
    },
    {
      title: 'Advising / Friends',
      people: [
        'Richard Chen (SCMC)',
        'Aedan Hui (BMT)',
        'Vivian Loh (CMM)',
        'Oliver Ni (BMT, ICMT)',
        'Arpit Ranasaria (ICMT, SMT)',
        'Taman Truong (ICMT, SCMC)',
        'Nathan Wong (BMT)',
        'Grace Yang (BrUMO)',
        'Yibo Zhang (SCMC)',
      ],
    },
  ];

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Organization</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title hero-animate-words">
            <span className="word">About</span>{' '}
            <span className="word">Us</span>
          </h1>
          <p className="page-summary reveal mt-5">
            The Los Angeles Math Tournament Group hosts and organizes mathematical contests for middle and high school students.
          </p>
        </div>
      </header>

      <section className="section-row">
        <h2 className="section-title">Mission</h2>
        <div className="stagger-parent grid gap-5">
          <p className="section-copy">
            We strive to encourage mathematical exploration and understanding by introducing concepts not covered in the typical pre-college curricula to students with high mathematical aptitude and interest.
          </p>
          <p className="section-copy">
            Each contest emphasizes collaboration between team members, while still allowing individuals to prove their own ability.
          </p>
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">LAMT Staff</h2>
        <div className="stagger-parent grid gap-8">
          {staffGroups.map((group) => (
            <div key={group.title} className="border-t-2 border-[var(--color-border)] pt-5 first:border-t-0 first:pt-0">
              <h3 className="mb-3 font-extrabold text-[var(--color-text)]">{group.title}</h3>
              <p className="section-copy">{group.people.join(', ')}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-row">
        <h2 className="section-title">UC Disclaimer</h2>
        <p className="section-copy reveal">
          We are a student group acting independently of the University of California; we take full responsibility for our organization and this website.
        </p>
      </section>

      <section className="section-row">
        <h2 className="section-title">Privacy Policy</h2>
        <div className="stagger-parent grid gap-5">
          <p className="section-copy">
            <strong>Last updated: August 2026.</strong> This policy describes how the Los Angeles Math Tournament (LAMT) Group collects, uses, and protects your information.
          </p>

          <h3 className="mt-3 font-extrabold text-[var(--color-text)]">Information We Collect</h3>
          <ul className="section-copy ml-6 list-disc space-y-2">
            <li><strong>Email address</strong> — when you subscribe to our mailing list on the homepage or via the pop-up prompt.</li>
            <li><strong>Name, email, and message</strong> — when you submit the contact form or join the live help desk on tournament day.</li>
            <li><strong>Contest registration data</strong> — handled by our third-party registration platform (ContestDojo); LAMT does not store registration data directly.</li>
          </ul>

          <h3 className="mt-3 font-extrabold text-[var(--color-text)]">How We Use Your Information</h3>
          <ul className="section-copy ml-6 list-disc space-y-2">
            <li>Email addresses are used solely to send tournament announcements and updates.</li>
            <li>Contact form and live chat messages are used to respond to your questions and provide tournament-day support.</li>
            <li>We never sell, rent, or share your email address with third parties for marketing purposes.</li>
          </ul>

          <h3 className="mt-3 font-extrabold text-[var(--color-text)]">Data Storage & Security</h3>
          <p className="section-copy">
            Your data is stored in a secure PostgreSQL database hosted on Railway, encrypted in transit via TLS. Access is restricted to authorized LAMT staff via password-protected admin accounts. We do not store payment information, Social Security numbers, or other sensitive financial data.
          </p>

          <h3 className="mt-3 font-extrabold text-[var(--color-text)]">Data Retention & Your Rights</h3>
          <ul className="section-copy ml-6 list-disc space-y-2">
            <li><strong>Unsubscribe</strong> — Every announcement email includes a one-click unsubscribe link. You may also unsubscribe at any time by emailing us.</li>
            <li><strong>Request deletion</strong> — You may request that we delete your email address, messages, or live chat history at any time.</li>
            <li><strong>Access</strong> — You may request a copy of the personal data we hold about you.</li>
          </ul>
          <p className="section-copy">
            To exercise any of these rights, contact us at <a className="subtle-link" href="mailto:uclamathtournament@gmail.com">uclamathtournament@gmail.com</a>.
          </p>

          <h3 className="mt-3 font-extrabold text-[var(--color-text)]">Children&rsquo;s Privacy</h3>
          <p className="section-copy">
            LAMT serves middle and high school students. Parental consent is obtained through our registration platform (ContestDojo) for contest participation. Email subscriptions are voluntary and may be unsubscribed at any time. We encourage parents or guardians to review this policy with their students.
          </p>

          <h3 className="mt-3 font-extrabold text-[var(--color-text)]">Changes to This Policy</h3>
          <p className="section-copy">
            We may update this policy as our practices evolve. The "Last updated" date above will always reflect the most recent revision. If we make material changes, we will notify subscribers via email.
          </p>

          <h3 className="mt-3 font-extrabold text-[var(--color-text)]">Contact</h3>
          <p className="section-copy">
            Questions about this privacy policy? Email us at <a className="subtle-link" href="mailto:uclamathtournament@gmail.com">uclamathtournament@gmail.com</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
