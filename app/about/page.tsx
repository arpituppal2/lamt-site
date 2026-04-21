export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-5xl mx-auto">

      <h1 className="font-bold text-[var(--color-text)] leading-tight mb-6"
        style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
      >
        About Us
      </h1>
      <div className="gold-rule mb-16" />

      {/* Mission */}
      <section className="mb-20 max-w-2xl">
        <p className="text-[var(--color-text)] text-lg md:text-xl leading-relaxed mb-6">
          The Los Angeles Math Tournament Group hosts and organizes mathematical contests
          for middle and high school students.
        </p>
        <p className="text-[var(--color-text-secondary)] leading-relaxed mb-6">
          We strive to encourage mathematical exploration and understanding by introducing
          concepts not covered in the typical pre-college curricula to students with high
          mathematical aptitude and interest. Each contest emphasizes collaboration between
          team members, while still allowing individuals to prove their own ability.
        </p>
        <p className="text-[var(--color-text-secondary)] leading-relaxed">
          Any individual currently enrolled in a pre-college institute for youth is welcome
          to compete as long as their primary enrollment is in grade 12 or below by the
          Tournament Date.
        </p>
      </section>

      {/* Team section — scaffold for contributors */}
      <section className="mb-20">
        <h2 className="text-[var(--color-text)] font-semibold text-xl mb-8 tracking-tight">The Team</h2>
        <p className="text-[var(--color-text-muted)] text-sm italic">
          Contributor bios coming soon.
        </p>
      </section>

      {/* UC Disclaimer */}
      <section className="border-t border-[var(--color-border)] pt-10">
        <p className="text-[var(--color-text-muted)] text-sm leading-relaxed max-w-xl">
          We are a student group acting independently of the University of California.
          We take full responsibility for our organization and this web site.
        </p>
      </section>

    </div>
  );
}
