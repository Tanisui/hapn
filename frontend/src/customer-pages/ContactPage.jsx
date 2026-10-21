import { FiArrowLeft, FiClock, FiFileText, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { LuBuilding2 } from 'react-icons/lu';
import { company, liveLinks, policyLinks } from '../content/landing';
import './LandingPage.css';

// Contact us (Oct 22, 2026): who runs Hap'n and every way to reach the company, on its own page,
// as the payment partner's review asked for. Same details as shop.hapnapponline.com/contact.

function Row({ icon: Icon, label, children }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      <span
        aria-hidden="true"
        className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#F6E3E3] text-[#8B0000]"
      >
        <Icon size={18} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="text-[13px] text-black/60">{label}</span>
        <div className="min-w-0 text-[15px] leading-[1.5] text-black [overflow-wrap:anywhere]">{children}</div>
      </div>
    </div>
  );
}

const LINK = 'inline-flex min-h-[44px] items-center font-semibold text-[#8B0000] underline underline-offset-[3px] hover:text-[#B10100]';

export default function ContactPage() {
  return (
    <div className="landing">
      <div className="landing-wrap flex min-h-[100dvh] flex-col gap-6 py-8">
        <a href="/" className={`${LINK} self-start gap-2 no-underline`}>
          <FiArrowLeft aria-hidden="true" />
          Back to Hap’n
        </a>
        <h1 className="font-display text-[clamp(32px,6vw,48px)] leading-tight text-[#B10100]">Contact us</h1>
        <p className="max-w-[640px] text-[16px] leading-[1.6] text-black/70">
          Hap’n is run by {company.legalName} in Davao City. Reach us by email or phone, or message us from Help in the
          app.
        </p>

        <section aria-labelledby="contact-company" className="flex max-w-[720px] flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 id="contact-company" className="font-head text-[18px] font-semibold">The company</h2>
          <Row icon={LuBuilding2} label="Registered name">
            <strong>{company.legalName}</strong>
            <br />
            SEC Reg. No. {company.secRegNo}
            <br />
            TIN {company.tin}
          </Row>
          <Row icon={FiMapPin} label="Office address">
            <address className="not-italic">{company.address}</address>
          </Row>
        </section>

        <section aria-labelledby="contact-reach" className="flex max-w-[720px] flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm">
          <h2 id="contact-reach" className="font-head text-[18px] font-semibold">Reach us</h2>
          <Row icon={FiMail} label="Email">
            <a href={`mailto:${company.email}`} className={LINK}>{company.email}</a>
          </Row>
          {company.phones.map((p) => (
            <Row key={p.tel} icon={FiPhone} label={p.label}>
              <a href={`tel:${p.tel}`} className={LINK}>{p.text}</a>
            </Row>
          ))}
          <Row icon={FiClock} label="When we reply">
            {company.replyTime}
          </Row>
        </section>

        <section aria-labelledby="contact-policies" className="flex max-w-[720px] flex-col gap-2 rounded-2xl bg-white p-5 shadow-sm">
          <h2 id="contact-policies" className="font-head text-[18px] font-semibold">Policies</h2>
          <nav aria-label="Policies" className="flex flex-wrap gap-x-5">
            {policyLinks.map((link) => (
              <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={`${LINK} gap-1.5`}>
                <FiFileText aria-hidden="true" />
                {link.label}
              </a>
            ))}
          </nav>
          <p className="text-[14px] text-black/60">
            Shop at{' '}
            <a href={liveLinks.shop} className={LINK}>shop.hapnapponline.com</a>
            {' '}· sell at{' '}
            <a href={liveLinks.sell} className={LINK}>seller.hapnapponline.com</a>
          </p>
        </section>

        <p className="mt-auto text-[13px] text-black/55">
          © 2026 {company.legalName} · SEC Reg. No. {company.secRegNo} · TIN {company.tin}
        </p>
      </div>
    </div>
  );
}
