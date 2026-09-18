import { mission, vision } from '../content/about';
import './StatementCards.css';

// labelTag keeps each page's heading outline correct: h3 under a section h2 on /, h2 on /about.
export default function StatementCards({ labelTag: Label = 'h3' }) {
  return (
    <div className="statement-cards">
      {[vision, mission].map((statement) => (
        <article key={statement.label} className={`statement-card statement-card-${statement.label.toLowerCase()}`}>
          <Label className="pill">{statement.label}</Label>
          <p>{statement.text}</p>
        </article>
      ))}
    </div>
  );
}
