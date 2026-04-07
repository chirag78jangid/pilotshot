export default function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between text-sm text-muted-foreground">
        <span>© 2026 Terms</span>
        <span>
          Made by{" "}
          <a
            href="https://x.com/itschiragX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors underline underline-offset-2"
          >
            me
          </a>
        </span>
      </div>
    </footer>
  );
}
