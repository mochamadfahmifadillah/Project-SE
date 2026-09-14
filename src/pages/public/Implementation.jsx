import { useState } from "react";
import { useNavigate } from "react-router-dom";

import PublicLayout from "../../layouts/PublicLayout";
import Button from "../../components/common/Button";

function Implementation() {
  const [sent, setSent] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setSent(true);
  };

  return (
    <PublicLayout>
      <main className="page narrow">
        <div className="form-head">
          <span className="eyebrow">IMPLEMENTATION REQUEST</span>

          <h1>Let's help you implement your software.</h1>

          <p>
            Tell us about your project and a suitable implementation partner can
            follow up with you.
          </p>
        </div>

        {sent ? (
          <div className="success-box">
            <div className="success-icon">✓</div>

            <h2>Request submitted</h2>

            <p>
              Your implementation request has been recorded. The next step is
              partner matching and follow-up.
            </p>

            <Button onClick={() => navigate("/account")}>
              Go to My Account
            </Button>
          </div>
        ) : (
          <form className="form-card" onSubmit={handleSubmit}>
            <div className="form-grid">
              <label>
                Full name
                <input type="text" placeholder="Your name" required />
              </label>

              <label>
                Work email
                <input type="email" placeholder="name@company.com" required />
              </label>

              <label>
                Company
                <input type="text" placeholder="Company name" required />
              </label>

              <label>
                Company size
                <select defaultValue="" required>
                  <option value="" disabled>
                    Select size
                  </option>

                  <option>1–20</option>
                  <option>21–100</option>
                  <option>101–500</option>
                  <option>500+</option>
                </select>
              </label>

              <label className="full">
                Software of interest
                <select defaultValue="Zoho CRM">
                  <option>Zoho CRM</option>
                  <option>HubSpot CRM</option>
                  <option>Salesforce Sales Cloud</option>
                  <option>Odoo ERP</option>
                </select>
              </label>

              <label className="full">
                Project details
                <textarea
                  placeholder="Describe your implementation needs, timeline and priorities..."
                  rows="6"
                  required
                />
              </label>
            </div>

            <div className="form-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/software/zoho-crm")}
              >
                Cancel
              </Button>

              <Button type="submit">Submit Request</Button>
            </div>
          </form>
        )}
      </main>
    </PublicLayout>
  );
}

export default Implementation;
