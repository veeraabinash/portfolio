import { profile } from "@/data/content";

export default function About() {
  return (
    <section className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">{profile.about}</p>
      </div>
    </section>
  );
}
