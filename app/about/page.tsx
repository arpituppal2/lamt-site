export default function AboutPage() {
  const staffGroups = [
    {
      title: "Admin",
      people: [
        "Kenneth Ren",
        "Muztaba Syed",
        "Arpit Uppal",
        "Brooks Wang",
        "Thomas Wu",
        "Vicky Zhang",
      ],
    },
    {
      title: "Problem Writing",
      people: [
        "Arahat Chikkatur",
        "Kyle Hess",
        "Ricky Hu",
        "Bhargava Kanakapura",
        "Jian Kweon",
        "Andrew Li",
        "Aliya Ling",
        "Kenneth Ren",
        "Gautham Subramanian",
        "Muztaba Syed",
        "Albert Tran",
        "Arpit Uppal",
        "Brooks Wang",
        "Thomas Wu",
        "Vicky Zhang",
      ],
    },
    {
      title: "Website & Tech",
      people: ["Aryan Dalal", "Nish Tharakan", "Arpit Uppal"],
    },
    {
      title: "Design and Outreach",
      people: [
        "Patrick Bian",
        "Eva Chung-Yoon",
        "Betty Chang",
        "Arpit Uppal",
        "Vicky Zhang",
      ],
    },
    {
      title: "Tournament Development",
      people: ["Patrick Bian", "Kenneth Ren", "Muztaba Syed", "Arpit Uppal", "Brooks Wang", "Vicky Zhang"],
    },
    {
      title: "General Members",
      people: [
        "Eva Chung-Yoon",
        "Patrick Bian",
        "Richard Cai",
        "Betty Chang",
        "Allan Chen",
        "Arahat Chikkatur",
        "Aryan Dalal",
        "Sean He",
        "Kyle Hess",
        "Ricky Hu",
        "Nathan Jiang",
        "Luke Jones",
        "Bhargava Kanakapura",
        "Jian Kweon",
        "Andrew Li",
        "William Li",
        "Aliya Ling",
        "Anthony Mui",
        "Pierre Nguyen",
        "Gautham Subramanian",
        "Nish Tharakan",
        "Albert Tran",
      ],
    },
    {
      title: "Advising / Friends",
      people: [
        "Richard Chen (SCMC)"
        "Aedan Hui (BMT)",
        "Vivian Loh (CMM)",
        "Oliver Ni (BMT, ICMT)",
        "Arpit Ranasaria (ICMT, SMT)",
        "Taman Truong (ICMT, SCMC)",
        "Nathan Wong (BMT)",
        "Grace Yang (BrUMO)",
        "Yibo Zhang (SCMC)",
      ],
    },
  ];

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-5xl mx-auto">
      <h1
        className="font-bold text-[var(--color-text)] leading-tight mb-6"
        style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
      >
        About Us
      </h1>

      <div className="gold-rule mb-16" />

      {/* Mission */}
      <section className="mb-20 max-w-2xl">
        <p className="text-[var(--color-text)] text-lg md:text-xl leading-relaxed mb-6">
          The Los Angeles Math Tournament Group hosts and organizes
          mathematical contests for middle and high school students.
        </p>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          We strive to encourage mathematical exploration and understanding by
          introducing concepts not covered in the typical pre-college curricula
          to students with high mathematical aptitude and interest. Each contest
          emphasizes collaboration between team members, while still allowing
          individuals to prove their own ability.
        </p>
      </section>

      {/* Team */}
      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">
          LAMT Staff
        </h2>

        <div className="space-y-10">
          {staffGroups.map((group) => (
            <div key={group.title}>
              <h3 className="text-[var(--color-text)] font-medium text-lg mb-3">
                {group.title}
              </h3>

              <ul className="flex flex-wrap gap-x-3 gap-y-2 text-[var(--color-text-secondary)] leading-relaxed">
                {group.people.map((person) => (
                  <li key={person} className="after:content-[','] last:after:content-['']">
                    {person}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* UC Disclaimer */}
      <section className="border-t border-[var(--color-border)] pt-10">
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-xl">
          We are a student group acting independently of the University of
          California; we take full responsibility for our organization and this
          website.
        </p>
      </section>
    </div>
  );
}
