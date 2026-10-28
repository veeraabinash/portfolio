import { techStack } from "@/data/content";

function toPyramid(items) {
  const rows = [];
  for (let i = 0, size = 4; i < items.length; i += size, size++) rows.push(items.slice(i, i + size));
  return rows;
}

export default function TechStack() {
  return (
    <section className="techstack">
      <div className="techstack-bg" aria-hidden="true">
        <div className="techstack-grid" />
        <div className="techstack-overlay" />
      </div>
      <div className="techstack-content section-container">
        <h2 className="title">
          My <span>Techstack</span>
        </h2>
        <div className="techstack-pyramid">
          {toPyramid(techStack).map((row, r) => (
            <div className="techstack-row" key={r}>
              {row.map((t) => (
                <div className="techstack-item" key={t.name}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={t.icon} alt="" width="44" height="44" loading="lazy" />
                  <span>{t.name}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
