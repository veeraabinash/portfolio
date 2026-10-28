import { profile } from "@/data/content";

export default function Landing() {
  const [a, b] = profile.roleSwap;
  return (
    <section className="landing-section" id="top">
      <div className="landing-container">
        <div className="landing-intro">
          <h2>{profile.intro}</h2>
          <h1>
            {profile.firstName.toUpperCase()}
            <br />
            <span>{profile.lastName.toUpperCase()}</span>
          </h1>
        </div>
        <div className="landing-info">
          <h3>{profile.rolePrefix}</h3>
          <div className="landing-swap">
            <h2 className="landing-swap-a">{a.toUpperCase()}</h2>
            <h2 className="landing-swap-b">{b.toUpperCase()}</h2>
          </div>
          <h2 className="landing-info-h2">{profile.roleSuffix.toUpperCase()}</h2>
        </div>
      </div>
    </section>
  );
}
