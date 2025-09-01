export function Footer() {
  return (
    <footer className="py-12 px-6 border-t border-border bg-card/50" data-testid="footer">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-primary-foreground" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <span className="text-lg font-bold" data-testid="footer-brand">ResumeOptimizer Pro</span>
            </div>
            <p className="text-sm text-muted-foreground" data-testid="footer-description">
              Free AI-powered resume optimization for product designers seeking their dream jobs.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors" data-testid="link-how-it-works">How it works</a></li>
              <li><a href="#features" className="hover:text-foreground transition-colors" data-testid="link-features">Features</a></li>
              <li><a href="#privacy" className="hover:text-foreground transition-colors" data-testid="link-privacy">Privacy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#design-tips" className="hover:text-foreground transition-colors" data-testid="link-design-tips">Design tips</a></li>
              <li><a href="#job-search" className="hover:text-foreground transition-colors" data-testid="link-job-search">Job search guide</a></li>
              <li><a href="#salary-insights" className="hover:text-foreground transition-colors" data-testid="link-salary-insights">Salary insights</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#about" className="hover:text-foreground transition-colors" data-testid="link-about">About</a></li>
              <li><a href="#contact" className="hover:text-foreground transition-colors" data-testid="link-contact">Contact</a></li>
              <li><a href="#terms" className="hover:text-foreground transition-colors" data-testid="link-terms">Terms</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-sm text-muted-foreground" data-testid="footer-copyright">
            © 2024 ResumeOptimizer Pro. Built with ❤️ for the design community.
          </p>
        </div>
      </div>
    </footer>
  );
}
