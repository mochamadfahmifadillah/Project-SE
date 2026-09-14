import { Link } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout";

export default function ArticleDetail() {
  return (
    <PublicLayout>
      <main className="page narrow">
        {/* Breadcrumbs */}
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <Link to="/learn">Learn</Link>
          <span aria-hidden="true">/</span>
          <span>Software Guide</span>
        </nav>

        {/* Article */}
        <article className="content-card article-content">
          <header>
            <span className="eyebrow">SOFTWARE GUIDE</span>

            <h1>How to choose the right software for your business</h1>

            <p>
              Choosing business software requires more than comparing feature
              lists. The right solution should match your business goals,
              budget, team size and implementation capabilities.
            </p>
          </header>

          <section>
            <h2>1. Understand your requirements</h2>

            <p>
              Start by identifying the problems you need the software to solve
              and the workflows that should be improved.
            </p>
          </section>

          <section>
            <h2>2. Compare the available options</h2>

            <p>
              Evaluate features, pricing, integrations, reviews and
              implementation support before making a decision.
            </p>
          </section>

          <section>
            <h2>3. Consider long-term fit</h2>

            <p>
              The best software should support your organization as it grows.
            </p>
          </section>
        </article>
      </main>
    </PublicLayout>
  );
}
