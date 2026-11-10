export type Language = "en" | "zh";

const en = {
  nav: {
    home: "Home",
    about: "About Me",
    projects: "Projects",
    contact: "Contact",
    resume: "Resume",
  },
  home: {
    name: "Heliang Gao (Tony)",
    tagline:
      "MSIS candidate at Santa Clara University with 5+ years in asset management, building software with Python and AI.",
    bio: "I am pursuing a Master of Science in Information Systems at Santa Clara University after 5+ years in the mutual fund and asset management industry. I now build software and data analysis workflows with Python, SQL, and AI tools.",
    whatIDo: "What I do",
    skills: [
      {
        title: "Software & Data Development",
        description:
          "Building applications and data analysis workflows with Python, SQL, and web frameworks like FastAPI and Next.js.",
      },
      {
        title: "AI & Machine Learning",
        description:
          "Applying machine learning, generative AI, and RAG to real datasets — from model comparison to retrieval-based Q&A with citations.",
      },
      {
        title: "Financial Analysis",
        description:
          "5+ years in mutual funds and asset management: equity research, compliance, risk controls, and fund operations, with written investment recommendations.",
      },
    ],
    featured: "Featured projects",
    viewAll: "View all projects →",
    cta: "Get in touch",
  },
  about: {
    title: "About Me",
    photoAlt: "Portrait of Heliang Gao (Tony)",
    bio: "I am based in San Jose, CA, and I am currently pursuing a Master of Science in Information Systems at Santa Clara University (expected December 2026). Before that, I spent 5+ years in the mutual fund and asset management industry, covering equity research, compliance, risk controls, and fund operations. I build software applications and data analysis workflows with Python and SQL, combining web development and AI tools to support financial research, prediction, and recommendations.",
    resumeLink: "View full resume (PDF) →",
    education: "Education",
    experience: "Experience",
    skills: "Skills",
    educationEntries: [
      {
        school: "Santa Clara University — Leavey School of Business",
        degree: "Master of Science in Information Systems (MSIS)",
        dates: "Jan 2025 – Expected Dec 2026",
        location: "Santa Clara, CA",
        details:
          "Coursework: Data Analysis, Python, Java, Database & SQL, Machine Learning, Deep Learning, NLP, Generative AI, Cloud Computing",
      },
      {
        school: "University of St. Thomas",
        degree: "B.S. in Mathematics",
        dates: "Sep 2014 – Jun 2018",
        location: "St. Paul, MN",
        details: null,
      },
    ],
    experienceEntries: [
      {
        role: "Investment Research Analyst — Equity Research & Investment Recommendations",
        company: "Goldstate Capital Fund Management (Chinese mutual fund manager)",
        location: "Shanghai, China",
        dates: "2023 – 2024",
        highlights: [
          "Tracked key TMT (including electronics) and consumer companies, writing earnings reviews that compared results with market expectations.",
          "Wrote in-depth company reports and presented Hold/Overweight ratings with industry-cycle and timing views at investment meetings.",
        ],
      },
      {
        role: "Compliance Manager — Product Compliance & Risk Controls",
        company: "Goldstate Capital Fund Management (Chinese mutual fund manager)",
        location: "Shanghai, China",
        dates: "2022 – 2023",
        highlights: [
          "Updated compliance policies, risk controls, and product structures for regulatory changes.",
          "Assessed new products on structure, partnerships, credit enhancement, and due diligence.",
        ],
      },
      {
        role: "Operations Manager — Product Design, Structuring & Operations",
        company:
          "Shanghai Goldstate Brilliance Asset Management (Chinese asset manager)",
        location: "Shanghai, China",
        dates: "2019 – 2022",
        highlights: [
          "Ran full-lifecycle operations for 100+ concurrent asset management products (over RMB 40 billion in assets), from product setup and structuring through valuation, impairment, distributions, and fund flows.",
        ],
      },
    ],
    skillGroups: [
      {
        group: "Programming & Web Development",
        skills: ["Python", "SQL", "Java", "FastAPI", "Next.js", "PostgreSQL", "Prisma"],
      },
      {
        group: "Data & AI",
        skills: [
          "Data Cleaning",
          "Visualization",
          "Database Design",
          "Machine Learning",
          "Generative AI",
          "RAG",
        ],
      },
      {
        group: "Cloud & Tools",
        skills: ["AWS", "Linux", "Bash", "Docker", "Git/GitHub", "Excel"],
      },
    ],
  },
  projectsPage: {
    title: "Projects",
    intro:
      "A few things I have built recently — what each project is, what I did, and the tools involved.",
  },
  project: {
    about: "About this project",
    contributions: "What I did",
    outcome: "Outcome",
    back: "← Back to projects",
  },
  projectNotFound: {
    title: "Project not found",
    body: "That project doesn't exist. Check the address, or browse the full list instead.",
    back: "← Back to projects",
  },
  notFound: {
    title: "Page not found",
    body: "The page you are looking for doesn't exist.",
    back: "← Back to home",
  },
  contact: {
    title: "Contact Me",
    intro:
      "Want to say hello, ask a question, or share an opportunity? Send me a message with the form below.",
    name: "Name",
    email: "Email",
    message: "Message",
    send: "Send message",
    success: "Thanks! Your message has been sent.",
    errorBanner: "Your message was not sent. Please fix the errors below.",
    errors: {
      name: "Name can't be empty.",
      email: "Email doesn't look valid.",
      message: "Message can't be empty.",
    },
  },
};

const zh: typeof en = {
  nav: {
    home: "首页",
    about: "关于我",
    projects: "项目",
    contact: "联系",
    resume: "简历",
  },
  home: {
    name: "Heliang Gao (Tony)",
    tagline:
      "圣塔克拉拉大学信息系统硕士在读，拥有 5 年以上资产管理行业经验，用 Python 和 AI 构建软件。",
    bio: "在攻读圣塔克拉拉大学信息系统硕士之前，我在公募基金与资产管理行业工作了 5 年以上。现在，我用 Python、SQL 和 AI 工具构建软件与数据分析流程。",
    whatIDo: "我擅长什么",
    skills: [
      {
        title: "软件与数据开发",
        description:
          "使用 Python、SQL 以及 FastAPI、Next.js 等 Web 框架，构建应用程序与数据分析流程。",
      },
      {
        title: "AI 与机器学习",
        description:
          "将机器学习、生成式 AI 与 RAG 应用到真实数据集——从模型对比到带引用来源的检索问答。",
      },
      {
        title: "金融分析",
        description:
          "5 年以上公募基金与资产管理经验：股票研究、合规、风险控制与基金运营，并撰写投资建议报告。",
      },
    ],
    featured: "精选项目",
    viewAll: "查看全部项目 →",
    cta: "联系我",
  },
  about: {
    title: "关于我",
    photoAlt: "Heliang Gao (Tony) 的照片",
    bio: "我目前住在加州圣何塞，正在圣塔克拉拉大学攻读信息系统硕士（预计 2026 年 12 月毕业）。此前，我在公募基金与资产管理行业工作 5 年以上，覆盖股票研究、合规、风险控制与基金运营。我用 Python 和 SQL 构建软件应用与数据分析流程，并结合 Web 开发与 AI 工具，支持金融研究、预测与投资建议。",
    resumeLink: "查看完整简历（PDF）→",
    education: "教育经历",
    experience: "工作经历",
    skills: "技能",
    educationEntries: [
      {
        school: "Santa Clara University — Leavey School of Business",
        degree: "信息系统硕士（MSIS）",
        dates: "2025 年 1 月 – 预计 2026 年 12 月",
        location: "加州圣塔克拉拉",
        details:
          "课程：数据分析、Python、Java、数据库与 SQL、机器学习、深度学习、自然语言处理、生成式 AI、云计算",
      },
      {
        school: "University of St. Thomas",
        degree: "理学学士（数学）",
        dates: "2014 年 9 月 – 2018 年 6 月",
        location: "明尼苏达州圣保罗",
        details: null,
      },
    ],
    experienceEntries: [
      {
        role: "投资研究分析师——股票研究与投资建议",
        company: "Goldstate Capital Fund Management（中国公募基金管理公司）",
        location: "中国上海",
        dates: "2023 – 2024",
        highlights: [
          "跟踪 TMT（含电子）与消费行业重点公司，撰写业绩点评，将业绩与市场预期进行比较。",
          "撰写深度公司报告，在投研会议上结合行业周期与择时观点给出持有/增持评级。",
        ],
      },
      {
        role: "合规经理——产品合规与风险控制",
        company: "Goldstate Capital Fund Management（中国公募基金管理公司）",
        location: "中国上海",
        dates: "2022 – 2023",
        highlights: [
          "根据监管变化更新合规政策、风险控制与产品结构。",
          "从产品结构、合作方、增信措施与尽职调查等方面评估新产品。",
        ],
      },
      {
        role: "运营经理——产品设计、结构与运营",
        company: "Shanghai Goldstate Brilliance Asset Management（中国资产管理公司）",
        location: "中国上海",
        dates: "2019 – 2022",
        highlights: [
          "负责 100+ 只同时存续资产管理产品的全生命周期运营（规模超 400 亿元人民币），覆盖产品设立与结构设计、估值、减值、分配与资金划转。",
        ],
      },
    ],
    skillGroups: [
      {
        group: "编程与 Web 开发",
        skills: ["Python", "SQL", "Java", "FastAPI", "Next.js", "PostgreSQL", "Prisma"],
      },
      {
        group: "数据与 AI",
        skills: ["数据清洗", "可视化", "数据库设计", "机器学习", "生成式 AI", "RAG"],
      },
      {
        group: "云与工具",
        skills: ["AWS", "Linux", "Bash", "Docker", "Git/GitHub", "Excel"],
      },
    ],
  },
  projectsPage: {
    title: "项目",
    intro: "我近期做的一些项目——每个项目是什么、我做了什么、用了哪些工具。",
  },
  project: {
    about: "关于这个项目",
    contributions: "我做了什么",
    outcome: "成果",
    back: "← 返回项目列表",
  },
  projectNotFound: {
    title: "项目不存在",
    body: "该项目不存在。请检查网址，或浏览完整项目列表。",
    back: "← 返回项目列表",
  },
  notFound: {
    title: "页面不存在",
    body: "你要找的页面不存在。",
    back: "← 返回首页",
  },
  contact: {
    title: "联系我",
    intro: "想打个招呼、提问或分享机会？请用下面的表单给我留言。",
    name: "姓名",
    email: "邮箱",
    message: "留言",
    send: "发送留言",
    success: "谢谢！你的留言已发送。",
    errorBanner: "留言未发送，请修正下方错误。",
    errors: {
      name: "姓名不能为空。",
      email: "邮箱格式看起来不正确。",
      message: "留言不能为空。",
    },
  },
};

export const content: Record<Language, typeof en> = { en, zh };
