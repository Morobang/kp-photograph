export default function Footer() {
  return (
    <footer className="bg-off border-t border-paper/5 px-6 md:px-10 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="font-cond tracking-wider text-sm">
            <span className="font-semibold text-gold">K.P_PHO</span>
            <span className="font-light text-paper/80">TOGraph</span>
          </p>
          <p className="font-cond text-xs tracking-[0.25em] uppercase text-muted mt-1">
            Ri Khou Lingedza
          </p>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/kp_photograph"
            target="_blank"
            rel="noopener noreferrer"
            className="font-cond text-xs tracking-widest uppercase text-muted hover:text-gold-light transition-colors"
          >
            Instagram
          </a>
          
          <a
            href="https://wa.me/27000000000"
            target="_blank"
            rel="noopener noreferrer"
            className="font-cond text-xs tracking-widest uppercase text-muted hover:text-gold-light transition-colors"
          >
            WhatsApp
          </a>
        </div>

        <p className="font-body text-xs text-muted font-light">
          © {new Date().getFullYear()} K.P_PHOTOGraph
        </p>
      </div>
    </footer>
  )
}