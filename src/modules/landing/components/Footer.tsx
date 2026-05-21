import { Logo } from "@/shared/ui/Logo"

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] px-4 py-8">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Logo size={24} />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} DataLens. 保留所有权利.
        </p>
      </div>
    </footer>
  )
}