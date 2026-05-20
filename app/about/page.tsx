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
    </div>
  );
}
