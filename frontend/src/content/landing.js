// All copy for the landing page at /.
// Hap'n is live (Oct 2026): the page sends people to the shop and the seller portal, and says
// which registered company runs it, so the site matches the business on file with partners.

export const socialLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=61583446296787',
  instagram: 'https://www.instagram.com/hapn.co/',
};

// Where the live product is.
export const liveLinks = {
  shop: 'https://shop.hapnapponline.com/',
  sell: 'https://seller.hapnapponline.com/',
  androidApp: 'https://api.hapnapponline.com/download/customer',
};

// Who runs Hap'n, exactly as on the SEC certificate and the BIR Form 2303.
export const company = {
  legalName: 'Hap’n Corporation',
  secRegNo: '2026070259749-00',
  tin: '817-119-272-00000',
  address: 'F106 Finster Bldg., E. Jacinto St., Barangay 32-D, Poblacion District, Davao City 8000',
  email: 'admin@hapnapponline.com',
};

// The shop's policy pages (one copy of each, kept on the shop site).
export const policyLinks = [
  { href: 'https://shop.hapnapponline.com/legal/terms', label: 'Terms of Service' },
  { href: 'https://shop.hapnapponline.com/legal/privacy', label: 'Privacy Policy' },
  { href: 'https://shop.hapnapponline.com/legal/refund', label: 'Refunds' },
  { href: 'https://shop.hapnapponline.com/legal/fees', label: 'Fees and Charges' },
];

// Set small under the name in the header logo.
export const brandTagline = 'Davao’s marketplace';

export const status = 'now live in Davao City';

export const tickerItems = [
  'go on, make it hap’n!',
  'low fees',
  'gikan diri, para diri',
  'now live in dvo!',
  'shop local',
];

// Second ticker, under the hero.
export const marqueeItems = [
  'low fees',
  'shop local',
  'sell in minutes',
  'gikan diri, para diri',
  'go on, make it hap’n!',
];

export const why = {
  eyebrow: 'Why Hap’n',
  heading: 'gikan diri, para diri.',
  text: 'From here, for here.',
};

export const sectionLinks = [
  { href: '#how', label: 'How It Works' },
  { href: '#sellers', label: 'Sellers & Shoppers' },
  { href: '#categories', label: 'Categories' },
  { href: '#vision', label: 'Vision & Mission' },
  { href: '#faq', label: 'FAQ' },
];

export const hero = {
  eyebrow: 'The marketplace for Davao’s MSMEs',
  lead: 'Davao’s local marketplace is open.',
  headline: 'HAP’N!',
  kicker: 'go on, make it hap’n!',
  text: 'Low selling fees, easy sign-up, and a whole city of shoppers ready to discover local finds, built right here in Davao.',
  shopCta: 'shop on hap’n',
  sellCta: 'sell on hap’n',
  appLabel: 'Get the app for',
};

export const phoneTags = ['low fees', 'shop local', 'sell in minutes'];

export const features = [
  { icon: 'peso', title: 'Low Fees', text: 'Sellers keep more of every sale, so local shops can thrive.' },
  { icon: 'check', title: 'Easy to Start', text: 'Sign up in minutes, whether you’re shopping or opening a shop.' },
  { icon: 'pin', title: 'Made for Davao', text: 'A community marketplace connecting our local MSMEs to the whole city.' },
];

export const steps = {
  heading: 'Get Started in Three Steps',
  text: 'Shopping or selling, getting started on Hap’n takes minutes.',
  items: [
    { icon: 'download', title: 'Sign Up', text: 'Open the shop in your browser or the Android app and create your account, whether you’re here to shop or to sell.' },
    { icon: 'explore', title: 'Explore or List', text: 'Discover local finds from all over Davao, or set up your shop and list your products.' },
    { icon: 'bag', title: 'Make It Hap’n', text: 'Check out in a few taps, or get orders and keep more of every sale with low fees.' },
  ],
};

export const audiences = [
  {
    key: 'sellers',
    heading: 'For Sellers',
    lead: 'Turn your small business into a shop the whole city can find.',
    points: [
      'Low selling fees, so you keep more of every sale',
      'Minimal requirements to get started',
      'Three seller tiers, from casual seller to registered business',
      'Reach shoppers across Davao City',
    ],
  },
  {
    key: 'shoppers',
    heading: 'For Shoppers',
    lead: 'Find what Davao makes, all in one place.',
    points: [
      'Discover local finds you won’t see in big online stores',
      'Support Davao MSMEs with every order',
      'Food, apparel, crafts, and more in one place',
    ],
  },
];

// Same categories as the store navbar. tone: red | light | dark; tilt in degrees.
export const categories = {
  heading: 'What You’ll Find on Hap’n',
  text: 'Shops from all over Davao, sorted the way you like to browse.',
  items: [
    { label: 'food', icon: 'food', tone: 'red', tilt: -3 },
    { label: 'apparel', icon: 'apparel', tone: 'light', tilt: 2 },
    { label: 'crafts', icon: 'crafts', tone: 'dark', tilt: -1.5 },
    { label: 'home & living', icon: 'home', tone: 'light', tilt: 3 },
    { label: 'accessories', icon: 'accessories', tone: 'red', tilt: -2 },
    { label: 'stationery', icon: 'stationery', tone: 'light', tilt: 1.5 },
    { label: 'events', icon: 'events', tone: 'dark', tilt: -2.5 },
  ],
};

// The statements come from `vision` and `mission` in about.js so both pages stay in sync.
export const purpose = {
  heading: 'Our Vision & Mission',
  text: 'Why we’re building Hap’n for Davao.',
};

export const faq = {
  heading: 'Frequently Asked Questions',
  contact: {
    heading: 'Something else on your mind?',
    text: 'Email admin@hapnapponline.com, or message us on Facebook or Instagram.',
  },
  items: [
    { question: 'Is Hap’n open now?', answer: 'Yes. Shop at shop.hapnapponline.com, and sellers sign up at seller.hapnapponline.com. Hap’n is run by Hap’n Corporation, here in Davao City.' },
    { question: 'Where can I get the app?', answer: 'The Android app downloads from the button at the top of this page. On any phone or computer, the shop also works in your browser at shop.hapnapponline.com.' },
    { question: 'How much are the selling fees?', answer: 'A commission on each sale, by seller tier: 5% for casual sellers, 12% for startup sellers and 15% for registered businesses. The full list is on our Fees and Charges page.' },
    { question: 'Who can sell on Hap’n?', answer: 'Davao businesses of any size. Hap’n has three seller tiers, from casual sellers just starting out to registered businesses, and the requirements to join are minimal.' },
    { question: 'Do you deliver across Davao City?', answer: 'Yes. Hap’n riders deliver across Davao City. The delivery fee starts at ₱49 and is shown at checkout before you pay.' },
    { question: 'Is Hap’n only for Davao?', answer: 'For now, yes. Hap’n is built in Davao, for Davao, so our first focus is helping the city’s own businesses grow.' },
  ],
};

export const closing = {
  tagline: 'go on, make it hap’n!',
  text: 'A marketplace built in Davao, for Davao.',
  note: 'now live in Davao City',
};

export const landingFooter = {
  site: 'shop.hapnapponline.com',
  siteUrl: 'https://shop.hapnapponline.com/',
  place: 'Built in Davao City',
};
