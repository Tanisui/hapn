import './Incorporators.css';

export function getInitials(name) {
  const words = name.trim().split(/\s+/);
  const first = words[0][0];
  const last = words.length > 1 ? words[words.length - 1][0] : '';
  return (first + last).toUpperCase();
}

export default function Incorporators({ people }) {
  if (people.length === 0) {
    return (
      <div className="card incorporators-empty">
        <p>meet the team soon</p>
      </div>
    );
  }

  return (
    <ol className="incorporators-grid">
      {people.map((person) => (
        <li key={person.name} className="card incorporator-card">
          {person.photo ? (
            <img className="incorporator-photo" src={person.photo} alt={person.name} />
          ) : (
            <span className="incorporator-initials" aria-hidden="true">
              {getInitials(person.name)}
            </span>
          )}
          <div className="incorporator-text">
            <p className="incorporator-name">{person.name}</p>
            {person.role && <p className="incorporator-role">{person.role}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}
