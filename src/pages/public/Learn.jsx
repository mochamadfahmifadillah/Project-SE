import PublicLayout from "../../layouts/PublicLayout";

export default function Learn() {
  const articles = [
    {
      id: 1,
      title: "How to choose CRM software",
      category: "CRM",
      description: "Understand the key factors when evaluating CRM platforms.",
      slug: "how-to-choose-crm-software",
    },
    {
      id: 2,
      title: "Software implementation guide",
      category: "GUIDE",
      description: "Learn how to prepare your organization for implementation.",
      slug: "software-implementation-guide",
    },
    {
      id: 3,
      title: "Cloud software vs traditional software",
      category: "INSIGHTS",
      description: "Compare the benefits of modern cloud-based software.",
      slug: "cloud-software-vs-traditional-software",
    },
  ];

  return (
    <PublicLayout>
      <main className="page">
        {/* Page Header */}
        <header className="page-head">
          <div>
            <span className="eyebrow">LEARN</span>

            <h1>Learn about software</h1>

            <p>
              Practical guides and insights to help you make better software
              decisions.
            </p>
          </div>
        </header>

        {/* Articles */}
        <section className="card-grid" aria-label="Software learning articles">
          {articles.map((article) => (
            <article className="content-card" key={article.id}>
              <span className="eyebrow">{article.category}</span>

              <h2>{article.title}</h2>

              <p>{article.description}</p>

              <a
                href={`/learn/${article.slug}`}
                className="text-btn"
                aria-label={`Read article: ${article.title}`}
              >
                Read article
                <span aria-hidden="true"> →</span>
              </a>
            </article>
          ))}
        </section>
      </main>
    </PublicLayout>
  );
}
