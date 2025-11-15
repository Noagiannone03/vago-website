import { Hero } from './sections/Hero';
import { Problem } from './sections/Problem';
import { Solution } from './sections/Solution';
import { HowItWorks } from './sections/HowItWorks';
import { Download } from './sections/Download';
import { Footer } from './sections/Footer';
import './website.css';

export function WebsiteApp() {
  return (
    <div className="website">
      <Hero />
      <Problem />
      <Solution />
      <HowItWorks />
      <Download />
      <Footer />
    </div>
  );
}
