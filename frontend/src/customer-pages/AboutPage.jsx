import RichText from '../components/RichText';
import Incorporators from '../components/Incorporators';
import { aboutHero, vision, mission, brandStory, incorporators } from '../content/about';
import './AboutPage.css';

export default function AboutPage() {
  return (
    <div className="about-page">
      <section className="band band-red about-hero">
        <div className="band-inner">
          <span className="pill">{aboutHero.pill}</span>
          <h1 className="display about-hero-heading">{aboutHero.heading}</h1>
          <p className="about-hero-sub">{aboutHero.subheading}</p>
        </div>
      </section>

      <section className="about-statements">
        {[vision, mission].map((statement) => (
          <article key={statement.label} className="card about-statement">
            <h2 className="pill">{statement.label}</h2>
            <p>{statement.text}</p>
          </article>
        ))}
      </section>

      <section className="band about-story">
        <div className="band-red about-story-panel">
          <div className="about-story-inner">
            <h2 className="display about-story-heading">{brandStory.heading}</h2>
            <p className="about-story-tagline">{brandStory.tagline}</p>
            {brandStory.paragraphs.map((paragraph, i) => (
              <RichText key={i} text={paragraph} />
            ))}
            <RichText className="about-story-signoff" text={brandStory.signoff} />
          </div>
        </div>
      </section>

      <section className="about-team">
        <span className="pill">Incorporators</span>
        <h2 className="display about-team-heading">the people behind hap'n</h2>
        <Incorporators people={incorporators} />
      </section>
    </div>
  );
}
