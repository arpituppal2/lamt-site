function NavBar() {
  const links = [
    { href: '/#about',    label: 'About' },
    { href: '/#schedule', label: 'Schedule' },
    { href: '/#faq',      label: 'FAQ' },
    { href: '/#contact',  label: 'Contact' },
    { href: '/#register', label: 'Register' },
  ];

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-3 backdrop-blur-xl border-b border-white/10"
      style={{ background: 'rgba(10,25,47,0.85)' }}
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#2774AE]">
          <span className="text-[10px] font-black text-[#FFD100]">LA</span>
        </div>
        <span className="text-sm font-semibold tracking-[0.28em] uppercase text-white/80">
          LAMT 2026
        </span>
      </Link>
      <div className="flex items-center gap-6 text-xs font-semibold tracking-[0.18em] uppercase">
        {links.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className="relative text-white/70 hover:text-[#FFB300] transition-colors"
          >
            <span className="hidden md:inline">{label}</span>
          </Link>
        ))}
      </div>
    </motion.nav>
  );
}
