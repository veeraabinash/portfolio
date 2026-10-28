import SiteProvider from "@/components/SiteContext";
import Loader from "@/components/Loader";
import Cursor from "@/components/Cursor";
import Navbar from "@/components/Navbar";
import SocialIcons from "@/components/SocialIcons";
import CharacterModel from "@/components/CharacterModel";
import Landing from "@/components/Landing";
import About from "@/components/About";
import WhatIDo from "@/components/WhatIDo";
import Career from "@/components/Career";
import Work from "@/components/Work";
import TechStack from "@/components/TechStack";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <SiteProvider>
      <Loader />
      <Cursor />
      <Navbar />
      <SocialIcons />
      <CharacterModel />
      <main className="container-main">
        <Landing />
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <TechStack />
        <Contact />
      </main>
    </SiteProvider>
  );
}
