/* =====================================================================
   ONBOARDING COURSE CONTENT
   ---------------------------------------------------------------------
   This is the ONLY file you need to edit to add onboarding material.
   Save the file and refresh the browser to see your changes.

   Text fields marked "Markdown" accept:
     # Heading   ## Subheading   **bold**   *italic*   [link](https://...)
     - bullet lists   1. numbered lists   > callout   `code`
     ![image alt](content/images/photo.png)
     Raw HTML lines (starting with "<") are passed straight through,
     so you can paste embeds such as <iframe ...></iframe>.

   Lesson types:  "video" | "reading" | "checklist" | "quiz" | "resource"
   (see the examples in Module 1 for every field each type supports)

   IDs are optional. If you leave them out they are generated from the
   lesson's position (m1-l1, m1-l2, ...). Set an id if you want a lesson's
   saved progress to survive reordering.
   ===================================================================== */

window.COURSE = {
  settings: {
    companyName: "Company Name",
    courseTitle: "New Hire Onboarding",
    tagline: "Everything you need to get set up, meet the team, and do your best work from day one.",
    announcement: "Welcome aboard — start with Module 1 on your first morning",
    logoText: "company",           // shown in the header if logoImage is empty
    logoImage: "",                 // e.g. "content/images/logo.svg"
    level: "All new hires",
    duration: "Self-paced · about 2 weeks",
    format: "Videos, readings, checklists & knowledge checks",
    helpTitle: "Need help?",
    helpContacts: [
      { label: "People Team", detail: "people@example.com", url: "mailto:people@example.com" },
      { label: "IT Help Desk", detail: "#it-help on Slack", url: "" },
      { label: "Your onboarding buddy", detail: "Assigned on day one", url: "" }
    ]
  },

  /* ---------- Landing page ---------- */
  overview: {
    about: `
Add a short welcome message here. Explain what this onboarding course covers,
who it is for, and how long it usually takes to finish.

> Tip: keep this to two or three short paragraphs. New hires skim.
`,
    whatYoullLearn: [
      "Add a learning outcome here",
      "Add a learning outcome here",
      "Add a learning outcome here",
      "Add a learning outcome here"
    ],
    skills: ["Skill or topic", "Skill or topic", "Skill or topic", "Skill or topic", "Skill or topic"]
  },

  // "Where do you want to start?" cards under the hero. `module` = module number (1, 2, ...)
  pathways: [
    { title: "First day?", description: "Start here for logins, introductions, and your week-one plan.", module: 1 },
    { title: "Learning the product?", description: "Add a short description of this starting point.", module: 2 },
    { title: "Setting up your tools?", description: "Add a short description of this starting point.", module: 3 },
    { title: "Ready for your role?", description: "Add a short description of this starting point.", module: 4 }
  ],

  // Numbered journey tabs on the landing page (e.g. 30 / 60 / 90 days). Body is Markdown.
  journey: [
    { title: "Your first week", body: "Describe what a new hire should accomplish in their first week." },
    { title: "Your first 30 days", body: "Describe the goals for the first month." },
    { title: "Your first 60 days", body: "Describe the goals for the second month." },
    { title: "Your first 90 days", body: "Describe what success looks like at 90 days." }
  ],

  // Shown as "Your onboarding team" (like Coursera's instructors). photo is optional.
  team: [
    { name: "Team member name", role: "Role / title", photo: "", bio: "One sentence on how they'll help you." },
    { name: "Team member name", role: "Role / title", photo: "", bio: "One sentence on how they'll help you." },
    { name: "Team member name", role: "Role / title", photo: "", bio: "One sentence on how they'll help you." }
  ],

  faq: [
    { q: "How long does onboarding take?", a: "Add your answer here." },
    { q: "Who do I ask if I get stuck?", a: "Add your answer here." },
    { q: "Do I need to finish every module?", a: "Add your answer here." }
  ],

  /* ---------- Modules & lessons ---------- */
  modules: [
    {
      title: "Welcome to the Company",
      description: "Add a one or two sentence summary of this module.",
      objectives: ["Add a learning objective", "Add a learning objective", "Add a learning objective"],
      lessons: [
        {
          type: "video",
          title: "A welcome from leadership",
          duration: "5 min",
          // Paste a YouTube, Vimeo, Loom, Google Drive or .mp4 link. Leave empty for a placeholder.
          videoUrl: "",
          body: `Add a short summary or transcript of the video here.`
        },
        {
          type: "reading",
          title: "Our mission, vision & values",
          duration: "10 min",
          body: `
## Section heading

Add your reading material here. You can use **bold**, *italics*,
[links](https://example.com), lists and images.

- First point
- Second point
- Third point
`
        },
        {
          type: "checklist",
          title: "Day one checklist",
          duration: "30 min",
          body: "Work through each item. Your progress is saved automatically.",
          items: ["Add a task", "Add a task", "Add a task", "Add a task"]
        },
        {
          type: "resource",
          title: "Handbooks & key links",
          duration: "5 min",
          body: "Bookmark these — you'll come back to them often.",
          links: [
            { label: "Employee handbook", url: "", description: "Add a link and a short description" },
            { label: "Org chart", url: "", description: "Add a link and a short description" },
            { label: "Benefits portal", url: "", description: "Add a link and a short description" }
          ]
        },
        {
          type: "quiz",
          title: "Knowledge check: Welcome",
          duration: "5 min",
          passingScore: 80, // percent needed to pass
          questions: [
            {
              q: "Add a question here?",
              options: ["Answer option A", "Answer option B (correct)", "Answer option C"],
              answer: 1, // index of the correct option, starting at 0
              explanation: "Optional: explain why this is the right answer."
            },
            {
              q: "Add a question here?",
              options: ["Answer option A (correct)", "Answer option B", "Answer option C"],
              answer: 0,
              explanation: ""
            }
          ]
        }
      ]
    },
    {
      title: "Our Products & Customers",
      description: "Add a one or two sentence summary of this module.",
      objectives: ["Add a learning objective", "Add a learning objective"],
      lessons: [
        { type: "video", title: "Product overview", duration: "10 min", videoUrl: "", body: "" },
        { type: "reading", title: "Who our customers are", duration: "15 min", body: "Add your content here." },
        { type: "reading", title: "How we deliver value", duration: "15 min", body: "Add your content here." },
        {
          type: "quiz", title: "Knowledge check: Products", duration: "5 min", passingScore: 80,
          questions: [
            { q: "Add a question here?", options: ["Option A (correct)", "Option B", "Option C"], answer: 0 }
          ]
        }
      ]
    },
    {
      title: "Tools & Systems",
      description: "Add a one or two sentence summary of this module.",
      objectives: ["Add a learning objective", "Add a learning objective"],
      lessons: [
        { type: "reading", title: "Accounts & access", duration: "10 min", body: "Add your content here." },
        { type: "checklist", title: "Tool setup checklist", duration: "45 min", items: ["Add a task", "Add a task", "Add a task"] },
        { type: "video", title: "Tour of our internal tools", duration: "12 min", videoUrl: "", body: "" },
        { type: "resource", title: "System guides", duration: "5 min", links: [{ label: "Add a link", url: "" }] }
      ]
    },
    {
      title: "Your Role & First 90 Days",
      description: "Add a one or two sentence summary of this module.",
      objectives: ["Add a learning objective", "Add a learning objective"],
      lessons: [
        { type: "reading", title: "What success looks like", duration: "10 min", body: "Add your content here." },
        { type: "video", title: "Meet your team", duration: "8 min", videoUrl: "", body: "" },
        { type: "checklist", title: "30-60-90 day plan", duration: "20 min", items: ["Add a goal", "Add a goal", "Add a goal"] },
        {
          type: "quiz", title: "Final knowledge check", duration: "10 min", passingScore: 80,
          questions: [
            { q: "Add a question here?", options: ["Option A", "Option B (correct)", "Option C"], answer: 1 },
            { q: "Add a question here?", options: ["Option A", "Option B", "Option C (correct)"], answer: 2 }
          ]
        }
      ]
    }
  ]
};
