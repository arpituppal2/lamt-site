export default function ArchivePage() {

    const pastFiles = [
        {
            title: '2026',
            files: {
                Problems: {
                    "Algebra & Number Theory": "/lamt2026/AlgNT.pdf",
                    "Combinatorics": "/lamt2026/Combo.pdf",
                    "Geometry": "/lamt2026/Geo.pdf",
                    "Shopping": "/lamt2026/Shopping.pdf",
                    "Guts": "/lamt2026/Guts.pdf"
                },
                Solutions: {
                    "Algebra & Number Theory": "/lamt2026/AlgNT Solutions.pdf",
                    "Combinatorics": "/lamt2026/Combo Solutions.pdf",
                    "Geometry": "/lamt2026/Geo Solutions.pdf",
                    "Shopping": "/lamt2026/Shopping Solutions.pdf",
                    "Guts": "/lamt2026/Guts Solutions.pdf"
                }
                // Results: {
                //     "Rankings": "/lamt2026/lamt2026results.txt"
                // },
                // Other: {
                //     "Apology Letter": "/lamt2026/LAMT Apology Letter.pdf"
                // }
            },
            
        }
    ]

  return (
    <div className="page-shell">
      <header className="page-hero">
        <div>
          <p className="page-kicker">Past Exams</p>
          <span className="gold-rule" />
        </div>
        <div>
          <h1 className="page-title">Archive</h1>
          <p className="page-summary mt-5">
            See our past tournament exams, solutions, and results.
          </p>
        </div>
      </header>

      <div>
        {pastFiles.map((year) => (
            <section key={year.title} className="section-row">
            <h2 className="section-title">{year.title}</h2>
            <div className="grid gap-8">
            {Object.entries(year.files).map(([category, items]) => (
                <div key={category} className="border-t-2 border-[var(--color-border)] pt-5 first:border-t-0 first:pt-0">
                    <h3 className="mb-3 font-extrabold text-[var(--color-text)]">{category}</h3>
                    

                    <ul className="section-copy">
                        {Object.entries(items as Record<string, string>).map(([name, value]) => (
                        <li key={name}>
                            <a href={value} target="_blank" rel="noreferrer" className="text-blue-600 underline hover:text-blue-800">
                                {name}
                            </a>
                        </li>
                        
                        
                        ))}
                    </ul>
                </div>
                
            ))}
            </div>
            </section>
        ))}
      </div>
      
    </div>
  );
}
