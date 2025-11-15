import { Hero } from './sections/Hero';
import { Features } from './sections/Features';
import { Download } from './sections/Download';
import { Footer } from './sections/Footer';
import './website.css';

export function WebsiteApp() {
  return (
    <div className="website">
      <Hero />
      <Features />
      <Download />
      <Footer />
    </div>
  );
}
