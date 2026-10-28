import { profile } from "@/data/content";
import { Icon } from "./icons";

export const socialLinks = [
  { key: "linkedin", label: "LinkedIn", href: profile.linkedin },
  { key: "mail", label: "Email", href: `mailto:${profile.email}` },
];

export default function SocialIcons() {
  return (
    <div className="icons-section">
      <div className="social-icons">
        {socialLinks.map((s) => (
          <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
            <Icon name={s.key} />
          </a>
        ))}
      </div>
      <a className="resume-button" href={profile.resume} target="_blank" rel="noopener noreferrer">
        <span className="hover-link" data-text="Resume">
          <span>Resume</span>
        </span>
        <Icon name="arrow" size={22} />
      </a>
    </div>
  );
}
