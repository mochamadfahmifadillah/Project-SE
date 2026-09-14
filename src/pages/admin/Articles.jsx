import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  FileText,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";
import {
  deleteAdminArticle,
  getAdminArticles,
} from "../../services/adminService";

export default function Articles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadArticles = useCallback(async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await getAdminArticles();

      setArticles(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load articles:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to load articles.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadArticles();
  }, [loadArticles]);

  const handleDelete = async (article) => {
    const title = getArticleTitle(article);

    const confirmed = window.confirm(
      `Are you sure you want to delete "${title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteAdminArticle(article.id);

      setArticles((current) =>
        current.filter((item) => item.id !== article.id),
      );
    } catch (err) {
      console.error("Failed to delete article:", err);

      window.alert(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to delete article.",
      );
    }
  };

  const totalArticles = articles.length;

  const publishedArticles = articles.filter(
    (article) =>
      article?.status === "published" || article?.is_published === true,
  ).length;

  const draftArticles = articles.filter(
    (article) => article?.status === "draft" || article?.is_published === false,
  ).length;

  return (
    <AdminLayout>
      <div className="admin-content articles-page">
        {/* =========================================================
            PAGE HEADER
        ========================================================== */}

        <section className="articles-page-header">
          <div className="articles-page-heading">
            <span className="eyebrow">CONTENT MANAGEMENT</span>

            <h1>Articles</h1>

            <p>
              Manage educational content and software guides published across
              Software Empire.
            </p>
          </div>

          <div className="articles-page-actions">
            <button
              type="button"
              className="articles-button articles-button-secondary"
              onClick={() => loadArticles(true)}
              disabled={loading || refreshing}
            >
              <RefreshCw size={16} className={refreshing ? "spin" : ""} />

              {refreshing ? "Refreshing..." : "Refresh"}
            </button>

            <button
              type="button"
              className="articles-button articles-button-primary"
            >
              <Plus size={17} />
              Add Article
            </button>
          </div>
        </section>

        {/* =========================================================
            ERROR
        ========================================================== */}

        {error && (
          <section className="articles-alert articles-alert-error">
            <div className="articles-alert-icon">
              <AlertCircle size={19} />
            </div>

            <div className="articles-alert-content">
              <strong>Unable to load articles</strong>

              <p>{error}</p>
            </div>

            <button
              type="button"
              className="articles-button articles-button-secondary"
              onClick={() => loadArticles()}
            >
              Try again
            </button>
          </section>
        )}

        {/* =========================================================
            STATS
        ========================================================== */}

        <section className="articles-stats">
          <ArticleStat
            icon={FileText}
            label="Total Articles"
            value={loading ? "—" : totalArticles}
            description="All content"
          />

          <ArticleStat
            icon={FileText}
            label="Published"
            value={loading ? "—" : publishedArticles}
            description="Live on platform"
          />

          <ArticleStat
            icon={FileText}
            label="Drafts"
            value={loading ? "—" : draftArticles}
            description="Not published"
          />
        </section>

        {/* =========================================================
            MAIN CONTENT
        ========================================================== */}

        <section className="articles-card">
          <div className="articles-card-header">
            <div>
              <span className="eyebrow">CONTENT LIBRARY</span>

              <h2>All Articles</h2>

              <p>Review, edit and manage your published and draft articles.</p>
            </div>

            {!loading && !error && articles.length > 0 && (
              <span className="articles-count">
                {articles.length}{" "}
                {articles.length === 1 ? "article" : "articles"}
              </span>
            )}
          </div>

          {/* =======================================================
              LOADING
          ======================================================== */}

          {loading && (
            <div className="articles-loading">
              <div className="articles-loading-spinner">
                <RefreshCw size={22} />
              </div>

              <div>
                <strong>Loading articles...</strong>

                <span>We're getting the latest content from the platform.</span>
              </div>
            </div>
          )}

          {/* =======================================================
              EMPTY
          ======================================================== */}

          {!loading && !error && articles.length === 0 && (
            <div className="articles-empty">
              <div className="articles-empty-icon">
                <FileText size={27} />
              </div>

              <span className="eyebrow">CONTENT LIBRARY</span>

              <h3>No articles yet</h3>

              <p>
                Create your first article to start publishing useful software
                guides and educational content.
              </p>

              <button
                type="button"
                className="articles-button articles-button-primary"
              >
                <Plus size={17} />
                Add Article
              </button>
            </div>
          )}

          {/* =======================================================
              TABLE
          ======================================================== */}

          {!loading && !error && articles.length > 0 && (
            <div className="articles-table-wrapper">
              <table className="articles-table">
                <thead>
                  <tr>
                    <th>Article</th>
                    <th>Status</th>
                    <th>Author</th>
                    <th>Created</th>
                    <th className="articles-actions-column">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {articles.map((article) => (
                    <tr key={article.id}>
                      {/* ARTICLE */}

                      <td>
                        <div className="article-table-primary">
                          <div className="article-table-icon">
                            <FileText size={17} />
                          </div>

                          <div className="article-table-info">
                            <strong>{getArticleTitle(article)}</strong>

                            <span>{getArticleExcerpt(article)}</span>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`article-status ${getStatusClass(
                            article,
                          )}`}
                        >
                          <span className="article-status-dot" />

                          {getArticleStatus(article)}
                        </span>
                      </td>

                      {/* AUTHOR */}

                      <td>
                        <span className="article-author">
                          {article?.author?.name || article?.author_name || "—"}
                        </span>
                      </td>

                      {/* CREATED */}

                      <td>
                        <span className="article-date">
                          {formatDate(article?.created_at)}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>
                        <div className="article-row-actions">
                          <button
                            type="button"
                            className="article-action-button"
                            title="Edit article"
                            aria-label={`Edit ${getArticleTitle(article)}`}
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="article-action-button article-action-danger"
                            title="Delete article"
                            aria-label={`Delete ${getArticleTitle(article)}`}
                            onClick={() => handleDelete(article)}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </AdminLayout>
  );
}

/* ================================================================
   STAT
================================================================ */

function ArticleStat({ icon: Icon, label, value, description }) {
  return (
    <div className="article-stat-card">
      <div className="article-stat-icon">
        <Icon size={19} />
      </div>

      <div className="article-stat-content">
        <span>{label}</span>

        <strong>{value}</strong>

        <small>{description}</small>
      </div>
    </div>
  );
}

/* ================================================================
   HELPERS
================================================================ */

function getArticleTitle(article) {
  return article?.title || article?.name || "Untitled Article";
}

function getArticleExcerpt(article) {
  if (article?.excerpt) {
    return article.excerpt;
  }

  if (article?.description) {
    return article.description;
  }

  if (article?.content) {
    return article.content.length > 120
      ? `${article.content.slice(0, 120)}...`
      : article.content;
  }

  return "No article description available.";
}

function getArticleStatus(article) {
  if (article?.status === "published" || article?.is_published === true) {
    return "Published";
  }

  return "Draft";
}

function getStatusClass(article) {
  return getArticleStatus(article).toLowerCase();
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
