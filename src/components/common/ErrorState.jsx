import { AlertCircle, RefreshCw } from "lucide-react";

export default function ErrorState({
  title = "Something went wrong",
  message = "We could not load this data. Please try again.",
  onRetry,
}) {
  return (
    <div className="admin-error-state">
      <div className="admin-error-state-icon">
        <AlertCircle size={24} />
      </div>

      <h3>{title}</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          type="button"
          className="admin-button admin-button-primary"
          onClick={onRetry}
        >
          <RefreshCw size={16} />
          Try Again
        </button>
      )}
    </div>
  );
}
