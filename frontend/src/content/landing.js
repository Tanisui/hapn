// All copy for the landing page at /.
// Drafts that still need real details from the owner are marked TODO owner.

export const socialLinks = {
  facebook: 'https://www.facebook.com/profile.php?id=61583446296787',
  instagram: 'https://www.instagram.com/hapn.co/',
};

// Set small under the name in the header logo.
export const brandTagline = 'Davao’s marketplace';

export const status = 'almost hap’n-ing in dvo!';

export const tickerItems = [
  'go on, make it hap’n!',
  'low fees',
  'gikan diri, para diri',
  'almost hap’n-ing in dvo!',
  'in progress...',
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
  lead: 'something big is about to...',
  headline: 'HAP’N!',
  kicker: 'go on, make it hap’n!',
  text: 'Low selling fees, easy sign-up, and a whole city of shoppers ready to discover local finds — all in one app built right here in Davao.',
  facebookCta: 'get launch news on facebook',
  instagramCta: 'follow on instagram',
  storeLabel: 'Coming soon to',
};

export const phoneTags = ['low fees', 'shop local', 'sell in minutes'];

export const features = [
  { icon: 'peso', title: 'Low Fees', text: 'Sellers keep more of every sale, so local shops can thrive.' },
  { icon: 'check', title: 'Easy to Start', text: 'Sign up in minutes, whether you’re shopping or opening a shop.' },
  { icon: 'pin', title: 'Made for Davao', text: 'A community marketplace connecting our local MSMEs to the whole city.' },
];

// TODO owner: confirm the step wording.
export const steps = {
  heading: 'Get Started in Three Steps',
  text: 'Shopping or selling, getting started on Hap’n takes minutes.',
  items: [
    { icon: 'download', title: 'Download and Sign Up', text: 'Get the app at launch and create your account, whether you’re here to shop or to sell.' },
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
    lead: 'Find what Davao makes, all in one app.',
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
    text: 'Send us a message on Facebook or Instagram.',
  },
  items: [
    // TODO owner: confirm launch timing.
    { question: 'When does Hap’n launch?', answer: 'Very soon, right here in Davao City. Follow us on Facebook or Instagram and you’ll be the first to hear the launch date.' },
    { question: 'Where can I download the app?', answer: 'Hap’n is coming to the App Store and Google Play. We’ll post the download links here and on our socials on launch day.' },
    // TODO owner: add the exact fee rates.
    { question: 'How much are the selling fees?', answer: 'Low, and set so small merchants actually profit. We’ll share the exact rates before launch.' },
    // TODO owner: confirm tier names and requirements.
    { question: 'Who can sell on Hap’n?', answer: 'Davao businesses of any size. Hap’n has three seller tiers, from casual sellers just starting out to registered businesses, and the requirements to join are minimal.' },
    // TODO owner: confirm delivery coverage.
    { question: 'Do you deliver across Davao City?', answer: 'Hap’n connects shoppers with sellers all over Davao City. We’ll share delivery details at launch.' },
    { question: 'Is Hap’n only for Davao?', answer: 'For now, yes. Hap’n is built in Davao, for Davao, so our first focus is helping the city’s own businesses grow.' },
  ],
};

export const closing = {
  tagline: 'go on, make it hap’n!',
  text: 'A marketplace built in Davao, for Davao.',
  note: 'not long now',
};

export const landingFooter = {
  site: 'hapnapponline.com',
  siteUrl: 'https://hapnapponline.com',
  place: 'Built in Davao City',
};
