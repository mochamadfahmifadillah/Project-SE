import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import AccountLayout from "../../layouts/AccountLayout";
import Button from "../../components/common/Button";
import Icon from "../../components/common/Icon";

import { getMe } from "../../services/authService";
import { getSavedSoftware } from "../../services/savedSoftwareService";
import { getComparisons } from "../../services/compareService";

function Account() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [savedSoftware, setSavedSoftware] = useState([]);
  const [comparisons, setComparisons] = useState([]);
  const [implementations, setImplementations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadAccount() {
      try {
        setLoading(true);
        setError("");

        const [meResponse, savedResponse, comparisonsResponse] =
          await Promise.all([getMe(), getSavedSoftware(), getComparisons()]);

        if (cancelled) return;

        const currentUser =
          meResponse?.user ||
          meResponse?.data?.user ||
          meResponse?.data ||
          meResponse;

        const saved = savedResponse?.data || savedResponse || [];

        const comparisonData =
          comparisonsResponse?.data || comparisonsResponse || [];

        setUser(currentUser);

        setSavedSoftware(Array.isArray(saved) ? saved : []);

        setComparisons(Array.isArray(comparisonData) ? comparisonData : []);

        /*
        |--------------------------------------------------------------------------
        | Implementation Requests
        |--------------------------------------------------------------------------
        |
        | Untuk sementara data implementation belum diambil
        | karena endpoint GET belum tersedia.
        |
        */

        setImplementations([]);
      } catch (err) {
        console.error("Failed to load account:", err);

        if (!cancelled) {
          setError(
            err?.message || "Unable to load your account. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadAccount();

    return () => {
      cancelled = true;
    };
  }, []);

  const displayName = user?.name || "there";

  return (
    <AccountLayout>
      <div className="account-header">
        <div>
          <span className="eyebrow">MY ACCOUNT</span>

          <h1>Welcome back, {displayName}</h1>

          <p>
            Manage your saved software, comparisons and implementation requests.
          </p>
        </div>

        <Button onClick={() => navigate("/recommend")}>Find Software</Button>
      </div>

      {/* ERROR */}
      {error && (
        <div className="auth-error" role="alert">
          <strong>Unable to load account</strong>

          <span>{error}</span>
        </div>
      )}

      {/* STATS */}
      <div className="account-grid">
        {/* SAVED SOFTWARE */}
        <div className="content-card">
          <span className="eyebrow">SAVED SOFTWARE</span>

          <h2>{loading ? "—" : savedSoftware.length}</h2>

          <p>Products saved for later.</p>
        </div>

        {/* COMPARISONS */}
        <div className="content-card">
          <span className="eyebrow">COMPARISONS</span>

          <h2>{loading ? "—" : comparisons.length}</h2>

          <p>Comparison sets created.</p>
        </div>

        {/* IMPLEMENTATIONS */}
        <div className="content-card">
          <span className="eyebrow">IMPLEMENTATIONS</span>

          <h2>{loading ? "—" : implementations.length}</h2>

          <p>Implementation requests.</p>
        </div>
      </div>

      {/* SAVED SOFTWARE */}
      <div className="content-card">
        <div className="section-head">
          <div>
            <span className="eyebrow">SAVED SOFTWARE</span>

            <h2>Your software shortlist</h2>
          </div>

          {!loading && savedSoftware.length > 0 && (
            <span className="eyebrow">{savedSoftware.length} SAVED</span>
          )}
        </div>

        {/* LOADING */}
        {loading && (
          <div className="empty">
            <h3>Loading your shortlist...</h3>

            <p>Please wait while we load your saved software.</p>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !savedSoftware.length && (
          <div className="empty">
            <h3>Your shortlist is empty</h3>

            <p>Save software you are interested in and it will appear here.</p>

            <Button onClick={() => navigate("/software")}>
              Explore Software
            </Button>
          </div>
        )}

        {/* LIST */}
        {!loading && savedSoftware.length > 0 && (
          <div className="list">
            {savedSoftware.map((item) => (
              <div className="list-row" key={item.id}>
                <div className="software-logo">
                  {(item.name || "SW").slice(0, 2).toUpperCase()}
                </div>

                <div>
                  <b>{item.name}</b>

                  <span>
                    {item.category || "Software"}

                    {item.rating ? ` · ${item.rating} ★` : ""}
                  </span>
                </div>

                <button
                  type="button"
                  className="text-btn"
                  onClick={() => navigate(`/software/${item.slug}`)}
                >
                  View
                  <Icon name="arrow" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}

export default Account;
