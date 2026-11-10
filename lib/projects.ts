export type Language = "en" | "zh";

export type Localized = { en: string; zh: string };

export type Project = {
  slug: string;
  title: Localized;
  summary: Localized;
  dates: string;
  tech: string[];
  description: Localized;
  contributions: Localized[];
  outcome?: Localized;
};

const projects: Project[] = [
  {
    slug: "ai-competitive-intelligence",
    title: {
      en: "AI Competitive Intelligence Platform (SCU-Flex)",
      zh: "AI 竞争情报平台（SCU-Flex）",
    },
    summary: {
      en: "A RAG-powered competitive intelligence prototype unifying disclosures from 6 EMS companies and 5 cloud providers.",
      zh: "一个基于 RAG 的竞争情报原型，整合 6 家 EMS 公司与 5 家云厂商的披露文件。",
    },
    dates: "Jan – Jun 2026",
    tech: ["Python", "FastAPI", "Next.js", "SQLite", "ChromaDB"],
    description: {
      en: "A competitive intelligence prototype built in the SCU Business Intelligence Practicum. It unifies disclosures from 6 EMS companies and 5 cloud providers — 551 documents and 51,501 indexed passages — into one searchable platform, with RAG Q&A over SEC filings and earnings calls.",
      zh: "在圣塔克拉拉大学商业智能实践课程中构建的竞争情报原型。它将 6 家 EMS 公司和 5 家云厂商的披露文件——551 份文档、51,501 条索引段落——整合到一个可检索的平台中，支持对 SEC 文件和业绩电话会进行 RAG 问答。",
    },
    contributions: [
      {
        en: "Led the design and delivery of the prototype using Python, FastAPI, and Next.js.",
        zh: "使用 Python、FastAPI 和 Next.js 主导原型的设计与交付。",
      },
      {
        en: "Built RAG Q&A over SEC filings and earnings calls using SQLite and ChromaDB.",
        zh: "基于 SQLite 和 ChromaDB，构建面向 SEC 文件与业绩电话会的 RAG 问答。",
      },
      {
        en: "Mapped financial terms and tagged fiscal periods across the corpus.",
        zh: "对语料进行金融术语映射与财期标注。",
      },
      {
        en: "Implemented hybrid retrieval with source citations and LLM routing with failover.",
        zh: "实现混合检索（附来源引用）与带故障转移的 LLM 路由。",
      },
    ],
    outcome: {
      en: "The case was selected for AI for Supply Chain Finance, Chapter 11 (in preparation).",
      zh: "该案例被收录进《AI for Supply Chain Finance》第 11 章（编写中）。",
    },
  },
  {
    slug: "bank-marketing-prediction",
    title: {
      en: "Bank Marketing Prediction and Outreach Analysis",
      zh: "银行营销预测与外呼分析",
    },
    summary: {
      en: "A machine learning workflow predicting term-deposit subscriptions from 45,211 bank records.",
      zh: "一个从 45,211 条银行记录预测定期存款订阅的机器学习流程。",
    },
    dates: "Jan – Mar 2026",
    tech: ["Python", "scikit-learn", "XGBoost"],
    description: {
      en: "A project from the Machine Learning with Python course: predicting which bank customers will subscribe to a term deposit from 45,211 records, and using the results to balance outreach coverage against contact costs.",
      zh: "机器学习课程（Machine Learning with Python）项目：从 45,211 条银行客户记录预测客户是否会订阅定期存款，并利用结果在触达覆盖与联系成本之间取得平衡。",
    },
    contributions: [
      {
        en: "Led a 6-person team building a Python workflow with scikit-learn.",
        zh: "带领 6 人团队使用 Python 和 scikit-learn 构建预测流程。",
      },
      {
        en: "Designed the workflow framework, wrote the initial code, and coordinated testing and revisions.",
        zh: "设计流程框架、编写初始代码，并统筹测试与修订。",
      },
      {
        en: "Compared logistic regression, decision tree, random forest, and XGBoost with stratified cross-validation.",
        zh: "使用分层交叉验证对比逻辑回归、决策树、随机森林与 XGBoost。",
      },
      {
        en: "Excluded post-call variables to prevent leakage and used threshold analysis to balance coverage against contact costs.",
        zh: "剔除通话后变量以防止数据泄漏，并用阈值分析平衡覆盖率与联系成本。",
      },
    ],
  },
];

export function getAllProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}
