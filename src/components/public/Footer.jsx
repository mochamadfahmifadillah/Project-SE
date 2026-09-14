import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";

import softwareEmpire from "../../assets/images/software-empire.png";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* =====================================================
            BRAND
        ====================================================== */}
        <div className="footer-brand">
          <button
            type="button"
            className="footer-logo"
            onClick={() => navigate("/")}
            aria-label="Go to Software Empire home"
          >
            <img
              src={softwareEmpire}
              alt="Software Empire"
              className="footer-logo-image"
            />
          </button>

          <p>Discover, compare and choose software with confidence.</p>

          <span className="footer-tagline">
            Software intelligence for modern businesses.
          </span>
        </div>

        {/* =====================================================
            EXPLORE
        ====================================================== */}
        <div className="footer-column">
          <h3>Explore</h3>

          <button type="button" onClick={() => navigate("/software")}>
            Software Directory
          </button>

          <button type="button" onClick={() => navigate("/compare")}>
            Compare
          </button>

          <button type="button" onClick={() => navigate("/recommend")}>
            Recommendations
          </button>

          <button type="button" onClick={() => navigate("/learn")}>
            Learn
          </button>
        </div>

        {/* =====================================================
            COMPANY
        ====================================================== */}
        <div className="footer-column">
          <h3>Company</h3>

          <button type="button">About</button>

          <button type="button">Partners</button>

          <button type="button">Contact</button>
        </div>

        {/* =====================================================
            PLATFORM
        ====================================================== */}
        <div className="footer-column">
          <h3>Platform</h3>

          <button type="button">For Vendors</button>

          <button type="button">For Partners</button>

          <button type="button">Affiliate Program</button>
        </div>
      </div>

      {/* =====================================================
          BOTTOM
      ====================================================== */}
      <div className="footer-bottom">
        <span>
          © {new Date().getFullYear()} Software Empire. All rights reserved.
        </span>

        <div className="footer-bottom-links">
          <button type="button">Privacy</button>

          <button type="button">Terms</button>

          <button
            type="button"
            className="footer-back-top"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            Back to top
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}
