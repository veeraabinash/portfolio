"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { profile } from "@/data/content";
import { socialLinks } from "./SocialIcons";
import { Icon } from "./icons";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: ".contact-section", start: "top 80%", toggleActions: "play none none none" } })
        .fromTo(".contact-section h3", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" })
        .fromTo(".contact-box", { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, ease: "power3.out" }, "-=0.4");
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <>
      <section className="cta-section section-container">
        <h2 className="title">
          Let&apos;s build something <span>amazing</span> together
        </h2>
        <div className="cta-buttons">
          <a href={`mailto:${profile.email}`} className="cta-btn cta-btn-hire">
            Hire me
          </a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="cta-btn">
            LinkedIn <Icon name="arrow" size={18} />
          </a>
        </div>
      </section>

      <section className="contact-section section-container" id="contact" ref={ref}>
        <div className="contact-container">
          <h3>Contact</h3>
          <div className="contact-flex">
            <div className="contact-box">
              <h4>Email</h4>
              <p>
                <a href={`mailto:${profile.email}`}>{profile.email}</a>
              </p>
              <h4>Phone</h4>
              <p>
                <a href={`tel:${profile.phone.replace(/\s+/g, "")}`}>{profile.phone}</a>
              </p>
              <h4>Location</h4>
              <p>{profile.location}</p>
            </div>
            <div className="contact-box">
              <h4>Social</h4>
              {socialLinks.map((s) => (
                <a key={s.key} href={s.href} target="_blank" rel="noopener noreferrer" className="contact-social">
                  {s.label} <Icon name="arrow" size={18} />
                </a>
              ))}
            </div>
            <div className="contact-box">
              <h2>
                Designed and Developed <br /> by <span>{profile.firstName} {profile.lastName}</span>
              </h2>
              <h5>© {new Date().getFullYear()}</h5>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
