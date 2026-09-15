import { Link } from 'react-router-dom';
import { FiArrowRight } from 'react-icons/fi';
import { homeBand } from '../content/about';
import './BrandBand.css';

export default function BrandBand() {
  return (
    <section className="band band-red brand-band">
      <div className="band-inner brand-band-inner">
        <div>
          <h2 className="display brand-band-tagline">{homeBand.tagline}</h2>
          <p className="brand-band-text">{homeBand.text}</p>
        </div>
        <Link to="/about" className="btn btn-ghost">
          {homeBand.cta} <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
