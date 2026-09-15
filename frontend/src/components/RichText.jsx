// Renders copy where **double asterisks** mark bold spans. Never injects HTML.
export default function RichText({ text, as: Tag = 'p', className }) {
  const parts = text.split('**');
  // An even number of parts means the last ** has no closing partner.
  const hasUnmatched = parts.length % 2 === 0;
  const lastIndex = parts.length - 1;

  const nodes = parts.map((part, i) => {
    if (hasUnmatched && i === lastIndex) return `**${part}`;
    if (i % 2 === 1) return <strong key={i}>{part}</strong>;
    return part;
  });

  return <Tag className={className}>{nodes}</Tag>;
}
