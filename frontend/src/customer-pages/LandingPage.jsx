import { FaApple, FaFacebookF, FaGooglePlay, FaInstagram } from 'react-icons/fa';
import {
  FiCheck,
  FiDownload,
  FiFacebook,
  FiInstagram,
  FiMapPin,
  FiMenu,
  FiSearch,
  FiShoppingBag,
} from 'react-icons/fi';
import { LuCalendar, LuGlasses, LuHouse, LuPalette, LuPencil, LuShirt, LuSoup } from 'react-icons/lu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import LandingTicker from '../components/LandingTicker';
import PhoneMockup from '../components/PhoneMockup';
import { mission, vision } from '../content/about';
import {
  audiences,
  brandTagline,
  categories,
  closing,
  faq,
  features,
  hero,
  landingFooter,
  marqueeItems,
  phoneTags,
  purpose,
  sectionLinks,
  socialLinks,
  status,
  steps,
  tickerItems,
  why,
} from '../content/landing';
import './LandingPage.css';

const featureIcons = { check: FiCheck, pin: FiMapPin };
const stepIcons = { download: FiDownload, explore: FiSearch, bag: FiShoppingBag };
const categoryIcons = {
  food: LuSoup,
  apparel: LuShirt,
  crafts: LuPalette,
  home: LuHouse,
  accessories: LuGlasses,
  stationery: LuPencil,
  events: LuCalendar,
};

function ExternalLink({ href, children, ...props }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
      {children}
    </a>
  );
}

function StatusBadge({ className = '' }) {
  return (
    <Badge variant="outline" className={`landing-status ${className}`}>
      <span className="landing-dot" aria-hidden="true" />
      {status}
    </Badge>
  );
}

// Stacked logo: the flat mark beside the name, with what Hap'n is set small underneath.
// Decorative; the link or title around it carries the accessible name.
function BrandLockup({ className = '' }) {
  return (
    <span className={`landing-lockup ${className}`} aria-hidden="true">
      <span className="landing-brand-mark" />
      <span className="landing-brand-text">
        <span className="landing-brand-name">
          Hap<span className="landing-brand-ap">’</span>n
        </span>
        <span className="landing-brand-tagline">{brandTagline}</span>
      </span>
    </span>
  );
}

function SectionHead({ id, heading, children, className = '' }) {
  return (
    <div className={`landing-section-head ${className}`}>
      <h2 id={id}>{heading}</h2>
      {children && <p>{children}</p>}
    </div>
  );
}

// Below 1080px the header nav is hidden, so this sheet is the only way to jump to a section.
// The sheet is portaled outside .landing, so it is styled with Tailwind utilities.
function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="landing-menu-trigger" aria-label="Open menu">
          <FiMenu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      {/* Returning focus to the trigger would scroll back to the top after a section link. */}
      <SheetContent side="right" className="w-[300px] font-body" onCloseAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader className="px-6 pt-6">
          <SheetTitle className="font-display font-normal">
            <BrandLockup className="landing-lockup-sm" />
            <span className="sr-only">Hap’n</span>
          </SheetTitle>
          <SheetDescription className="sr-only">Jump to a section of the page or follow Hap’n.</SheetDescription>
        </SheetHeader>
        <nav aria-label="Menu sections" className="flex flex-col px-3">
          {sectionLinks.map((link) => (
            <SheetClose asChild key={link.href}>
              <a
                href={link.href}
                className="rounded-lg px-3 py-3 font-head text-base font-semibold text-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {link.label}
              </a>
            </SheetClose>
          ))}
        </nav>
        <Separator className="mx-6 w-auto" />
        <div className="flex flex-col items-start gap-4 px-6">
          <StatusBadge />
          <Button asChild className="w-full font-head">
            <ExternalLink href={socialLinks.facebook}>
              <FiFacebook aria-hidden="true" />
              Follow Us
            </ExternalLink>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* Each band that carries the mark draws its own copy; they line up on screen,
   so the colour changes at the band edge while the shape stays put. */
function BandMark() {
  return <span className="landing-mark" aria-hidden="true" />;
}

export default function LandingPage() {
  return (
    <div className="landing">
      <LandingTicker items={tickerItems} />

      <div className="landing-wrap">
        <header className="landing-header landing-rise">
          <a className="landing-brand" href="#top" aria-label="Hap’n, back to top">
            <BrandLockup />
          </a>
          <nav className="landing-nav" aria-label="Page sections">
            {sectionLinks.map((link) => (
              <a key={link.href} href={link.href}>{link.label}</a>
            ))}
          </nav>
          <div className="landing-header-actions">
            <Button asChild className="landing-follow">
              <ExternalLink href={socialLinks.facebook}>
                <FiFacebook aria-hidden="true" />
                Follow Us
              </ExternalLink>
            </Button>
            <MobileMenu />
          </div>
        </header>
      </div>

      <main id="top">
        {/* Poster hero: the name at full volume on paper. */}
        <section className="landing-hero" aria-label="Introduction">
          <div className="landing-wrap landing-hero-inner">
            <div className="landing-hero-copy">
              <div className="landing-hero-badges landing-rise landing-rise-2">
                <Badge className="landing-eyebrow">{hero.eyebrow}</Badge>
                <StatusBadge />
              </div>
              <h1 className="landing-title landing-rise landing-rise-2">
                <span className="landing-title-lead">{hero.lead}</span>
                <span className="landing-title-pop">{hero.headline}</span>
              </h1>
              <p className="landing-lede landing-rise landing-rise-3">{hero.text}</p>

              <div className="landing-cta landing-rise landing-rise-4">
                <div className="landing-cta-row">
                  <Button asChild size="lg">
                    <ExternalLink href={socialLinks.facebook}>
                      <FiFacebook aria-hidden="true" />
                      {hero.facebookCta}
                    </ExternalLink>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <ExternalLink href={socialLinks.instagram}>
                      <FiInstagram aria-hidden="true" />
                      {hero.instagramCta}
                    </ExternalLink>
                  </Button>
                </div>
                <ul className="landing-stores" aria-label="App stores">
                  <li className="landing-store">
                    <FaApple aria-hidden="true" />
                    <span>
                      <small>{hero.storeLabel}</small>
                      <strong>App Store</strong>
                    </span>
                  </li>
                  <li className="landing-store">
                    <FaGooglePlay aria-hidden="true" />
                    <span>
                      <small>{hero.storeLabel}</small>
                      <strong>Google Play</strong>
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="landing-hero-phone landing-rise landing-rise-4">
              <PhoneMockup tags={phoneTags} tagline={hero.kicker} />
            </div>
          </div>
        </section>

        <LandingTicker items={marqueeItems} tone="light" />

        <section className="landing-why" aria-labelledby="why-title">
          <BandMark />
          <div className="landing-wrap landing-why-inner">
            <div className="landing-why-head">
              <p className="landing-eyebrow-text">{why.eyebrow}</p>
              <h2 id="why-title">{why.heading}</h2>
              <p className="landing-why-sub">{why.text}</p>
            </div>
            <div className="landing-why-list">
              {features.map((feature) => {
                const Icon = featureIcons[feature.icon];
                return (
                  <div key={feature.title} className="landing-feature">
                    <span className="landing-feature-icon" aria-hidden="true">
                      {Icon ? <Icon /> : <span className="landing-peso">₱</span>}
                    </span>
                    <h3 className="landing-feature-title">{feature.title}</h3>
                    <p>{feature.text}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Steps as a numbered track: the order is the information. */}
        <section id="how" className="landing-section landing-how" aria-labelledby="how-title">
          <div className="landing-wrap">
            <SectionHead id="how-title" heading={steps.heading}>{steps.text}</SectionHead>
            <ol className="landing-steps">
              {steps.items.map((step, i) => {
                const Icon = stepIcons[step.icon];
                return (
                  <li key={step.title} className="landing-step">
                    <div className="landing-step-track">
                      <span className="landing-step-num" aria-hidden="true">{i + 1}</span>
                      {i < steps.items.length - 1 && <span className="landing-step-line" aria-hidden="true" />}
                    </div>
                    <div className="landing-step-body">
                      <p className="landing-step-label" aria-hidden="true">
                        <Icon />
                      </p>
                      <h3>{step.title}</h3>
                      <p className="landing-step-text">{step.text}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* Two tickets: notched edges and a perforation, like a market stall stub. */}
        <section id="sellers" className="landing-section landing-tickets" aria-label="For sellers and shoppers">
          <BandMark />
          <div className="landing-wrap landing-tickets-grid">
            {audiences.map((audience) => (
              <article key={audience.key} className={`landing-ticket landing-ticket-${audience.key}`}>
                <span className="landing-ticket-notch landing-ticket-notch-left" aria-hidden="true" />
                <span className="landing-ticket-notch landing-ticket-notch-right" aria-hidden="true" />
                <h2>{audience.heading}</h2>
                <p className="landing-ticket-lead">{audience.lead}</p>
                <span className="landing-ticket-perf" aria-hidden="true" />
                <ul className="landing-ticks">
                  {audience.points.map((point) => (
                    <li key={point}>
                      <span className="landing-tick" aria-hidden="true"><FiCheck /></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild variant={audience.key === 'sellers' ? 'paper' : 'default'} className="landing-ticket-cta">
                  <ExternalLink href={audience.key === 'sellers' ? socialLinks.facebook : socialLinks.instagram}>
                    {audience.key === 'sellers' ? <FiFacebook aria-hidden="true" /> : <FiInstagram aria-hidden="true" />}
                    {audience.key === 'sellers' ? hero.facebookCta : hero.instagramCta}
                  </ExternalLink>
                </Button>
              </article>
            ))}
          </div>
        </section>

        {/* Category mosaic: food leads on a wide tile, the rest tile around it. */}
        <section id="categories" className="landing-categories" aria-labelledby="categories-title">
          <BandMark />
          <div className="landing-wrap">
            <SectionHead id="categories-title" heading={categories.heading} className="on-dark">
              {categories.text}
            </SectionHead>
            <ul className="landing-tiles" aria-label="Categories">
              {categories.items.map((category) => {
                const Icon = categoryIcons[category.icon];
                return (
                  <li key={category.label} className={`landing-tile landing-tile-${category.tone}`}>
                    <span className="landing-tile-icon" aria-hidden="true"><Icon /></span>
                    <span className="landing-tile-label">{category.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section id="vision" className="landing-section landing-purpose" aria-labelledby="vision-title">
          <BandMark />
          <div className="landing-wrap landing-purpose-inner">
            <span className="landing-stamp" aria-hidden="true">
              gikan diri,
              <br />
              para diri.
            </span>
            <SectionHead id="vision-title" heading={purpose.heading}>{purpose.text}</SectionHead>
            <div className="landing-statements">
              <div className="landing-statement landing-statement-vision">
                <h3>{vision.label}</h3>
                <p>{vision.text}</p>
              </div>
              <div className="landing-statement landing-statement-mission">
                <h3>{mission.label}</h3>
                <p>{mission.text}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Every answer is visible: six questions, nothing to open. */}
        <section id="faq" className="landing-section landing-faq" aria-labelledby="faq-title">
          <div className="landing-wrap">
            <SectionHead id="faq-title" heading={faq.heading} />
            <div className="landing-faq-grid">
              {faq.items.map((item) => (
                <article key={item.question} className="landing-qa">
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </article>
              ))}
            </div>
            <div className="landing-faq-contact on-dark">
              <p className="landing-faq-contact-text">
                <strong>{faq.contact.heading}</strong> {faq.contact.text}
              </p>
              <div className="landing-faq-contact-cta">
                <Button asChild variant="paper">
                  <ExternalLink href={socialLinks.facebook}>
                    <FiFacebook aria-hidden="true" />
                    Facebook
                  </ExternalLink>
                </Button>
                <Button asChild variant="paper">
                  <ExternalLink href={socialLinks.instagram}>
                    <FiInstagram aria-hidden="true" />
                    Instagram
                  </ExternalLink>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="landing-closing on-dark" aria-labelledby="closing-title">
          <BandMark />
          <div className="landing-wrap landing-closing-inner">
            <span className="landing-closing-mark" aria-hidden="true" />
            <StatusBadge className="landing-status-on-red" />
            <h2 id="closing-title" className="landing-closing-tagline">{closing.tagline}</h2>
            <p className="landing-closing-text">{closing.text}</p>
            <div className="landing-closing-cta">
              <Button asChild size="lg" variant="paper">
                <ExternalLink href={socialLinks.facebook}>
                  <FiFacebook aria-hidden="true" />
                  follow on facebook
                </ExternalLink>
              </Button>
              <Button asChild size="lg" variant="on-red">
                <ExternalLink href={socialLinks.instagram}>
                  <FiInstagram aria-hidden="true" />
                  follow on instagram
                </ExternalLink>
              </Button>
            </div>
            <p className="landing-closing-note">{closing.note}</p>
          </div>
        </section>
      </main>

      <footer className="landing-footer">
        <div className="landing-wrap landing-footer-inner">
          <div className="landing-footer-top">
            <a className="landing-brand" href="#top" aria-label="Hap’n, back to top">
              <BrandLockup />
            </a>
            <nav className="landing-footer-nav" aria-label="Footer">
              {sectionLinks.map((link) => (
                <a key={link.href} href={link.href}>{link.label}</a>
              ))}
            </nav>
            <div className="landing-social">
              <ExternalLink href={socialLinks.facebook} className="landing-social-icon" aria-label="Follow Hap’n on Facebook">
                <FaFacebookF aria-hidden="true" />
              </ExternalLink>
              <ExternalLink href={socialLinks.instagram} className="landing-social-icon" aria-label="Follow Hap’n on Instagram">
                <FaInstagram aria-hidden="true" />
              </ExternalLink>
            </div>
          </div>
          <span className="landing-footer-rule" aria-hidden="true" />
          <div className="landing-footer-bottom">
            <p>
              © 2026 Hap’n · <a href={landingFooter.siteUrl}>{landingFooter.site}</a>
            </p>
            <p>{landingFooter.place}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
