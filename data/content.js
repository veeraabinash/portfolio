export const profile = {
  firstName: "Veeraabinash",
  lastName: "M",
  intro: "Hello! I'm",
  rolePrefix: "A Creative",
  roleSwap: ["Web", "React"],
  roleSuffix: "Developer",
  email: "mveeraabinash@gmail.com",
  phone: "+91 99435 39941",
  linkedin: "https://www.linkedin.com/in/veeraabinash-m-696b5328b",
  resume: "https://www.linkedin.com/in/veeraabinash-m-696b5328b",
  location: "Chennai, India",
  about:
    "I'm a web developer with 2 years of hands-on experience building dynamic, responsive and scalable web applications with React, Next.js and Redux. I integrate REST APIs, JWT authentication, Razorpay and Stripe payments and role-based access control, and I care about engaging user experiences backed by clean, maintainable code.",
};

export const services = [
  {
    title: "Develop",
    subtitle: "React & Next.js applications",
    text: "Building responsive, high-performance web apps with React, Next.js and Redux — reusable UI components, smooth state management and pixel-careful layouts that work across browsers and devices.",
    tags: ["React JS", "Next JS", "Redux", "JavaScript (ES6+)", "HTML5", "CSS3", "Bootstrap"],
  },
  {
    title: "Integrate",
    subtitle: "APIs, auth & payments",
    text: "Connecting frontends to real backends: REST APIs alongside Node.js developers, JWT authentication, role-based access for Admin, HR and Vendor users, and secure Razorpay and Stripe checkouts and subscriptions.",
    tags: ["REST APIs", "Node.js", "SQL", "JWT", "RBAC", "Razorpay", "Stripe"],
  },
];

export const career = [
  {
    role: "Web Developer",
    place: "2 years of professional experience",
    year: "NOW",
    text: "Developing and maintaining React and Next.js applications with Redux, building reusable components, integrating REST APIs, payment gateways and JWT auth, implementing RBAC for multi-user platforms, and taking part in code reviews on GitHub.",
  },
  {
    role: "B.E. Computer Science",
    place: "Sri Raaja Raajan College of Engineering & Technology",
    year: "2024",
    text: "Bachelor of Engineering in Computer Science (2020 – 2024), CGPA 7.2, Amaravathipudur, Karaikudi.",
  },
];

export const works = [
  {
    title: "Business Services Hub",
    category: "SaaS platform · UAE project",
    text: "Subscription-based business services suite for UAE clients, with a customer website and a full admin panel for users, plans and services.",
    tools: "React JS, Stripe subscriptions, RBAC",
    hue: 262,
  },
  {
    title: "Krishpar",
    category: "Job portal & assessments",
    text: "Job portal where HR teams manage listings, candidates and skill assessments, with AI-driven candidate matching and filterable dashboards.",
    tools: "React JS, AI matching, Dashboards",
    hue: 210,
  },
  {
    title: "WeLearn Tamil",
    category: "Online course platform",
    text: "Interactive Tamil learning platform with course purchases, progress tracking and secure enrollment.",
    tools: "React JS, Redux, Razorpay, JWT",
    hue: 18,
  },
  {
    title: "True Value for Money",
    category: "Multi-role admin panel",
    text: "Admin panel for Superadmin, Admin, Vendor, HR and Order Manager roles with order management and real-time delivery tracking for salon stores.",
    tools: "React JS, RBAC, Order tracking",
    hue: 150,
  },
  {
    title: "Decors",
    category: "Decoration booking platform",
    text: "Booking site for function decorations — browse packages, check real-time availability and pay online.",
    tools: "React JS, Razorpay",
    hue: 330,
  },
  {
    title: "Weather App",
    category: "Real-time weather data",
    text: "Live temperature, humidity and wind speed for any searched location, with graceful handling of invalid cities.",
    tools: "JavaScript, Weather API",
    hue: 195,
  },
];

const devicon = (slug, file = `${slug}-original`) =>
  `https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/${slug}/${file}.svg`;

const simpleIcon = (slug) => `https://cdn.jsdelivr.net/npm/simple-icons@13.21.0/icons/${slug}.svg`;

// Rendered as a widening pyramid: 4, 5, 6, 7 per row.
export const techStack = [
  { name: "React JS", icon: devicon("react") },
  { name: "Next JS", icon: devicon("nextjs") },
  { name: "TypeScript", icon: devicon("typescript") },
  { name: "JavaScript", icon: devicon("javascript") },

  { name: "Redux", icon: devicon("redux") },
  { name: "HTML5", icon: devicon("html5") },
  { name: "CSS3", icon: devicon("css3") },
  { name: "Tailwind CSS", icon: devicon("tailwindcss") },
  { name: "MUI", icon: devicon("materialui") },

  { name: "Bootstrap", icon: devicon("bootstrap") },
  { name: "Three.js", icon: devicon("threejs") },
  { name: "GSAP", icon: simpleIcon("greensock") },
  { name: "Konva.js", icon: simpleIcon("konva") },
  { name: "i18next", icon: simpleIcon("i18next") },
  { name: "Socket.IO", icon: devicon("socketio") },

  { name: "Node.js", icon: devicon("nodejs") },
  { name: "MongoDB", icon: devicon("mongodb") },
  { name: "SQL", icon: devicon("mysql") },
  { name: "Git", icon: devicon("git") },
  { name: "GitHub", icon: devicon("github") },
  { name: "Postman", icon: devicon("postman") },
  { name: "Figma", icon: devicon("figma") },
];
