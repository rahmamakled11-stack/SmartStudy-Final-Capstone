import { Outlet } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { Brain, Menu, X } from 'lucide-react'
import { useState } from 'react'

export function LandingLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-2">
              <Brain className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">SmartStudy</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/features" className="text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About</Link>
              <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link>
              <Link to="/login" className="text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
              <Link to="/register" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">Get Started</Link>
            </div>

            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border px-4 py-4 space-y-3">
            <Link to="/features" className="block text-muted-foreground">Features</Link>
            <Link to="/pricing" className="block text-muted-foreground">Pricing</Link>
            <Link to="/about" className="block text-muted-foreground">About</Link>
            <Link to="/contact" className="block text-muted-foreground">Contact</Link>
            <Link to="/login" className="block text-muted-foreground">Sign In</Link>
            <Link to="/register" className="block bg-primary text-primary-foreground px-4 py-2 rounded-lg text-center">Get Started</Link>
          </div>
        )}
      </nav>
      <Outlet />
    </div>
  )
}
