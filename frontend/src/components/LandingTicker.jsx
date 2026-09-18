import './LandingTicker.css';

// Each half repeats the items enough times to fill wide screens; sliding by -50% loops seamlessly.
const COPIES_PER_HALF = 4;

export default function LandingTicker({ items, tone = 'red' }) {
  const run = Array.from({ length: COPIES_PER_HALF }, () => items).flat();

  return (
    <div className={`landing-ticker landing-ticker-${tone}`} aria-hidden="true">
      <div className="landing-ticker-track">
        {[0, 1].map((half) => (
          <div key={half} className="landing-ticker-run">
            {run.map((item, i) => (
              <span key={i} className="landing-ticker-item">
                {item}
                <span className="landing-ticker-star">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
