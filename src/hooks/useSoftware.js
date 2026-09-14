import { useCallback, useEffect, useState } from "react";

import { getSoftware } from "../services/softwareService";

/**
 * Manage software list data.
 *
 * @param {Object} filters
 * @returns {{
 *   software: Array,
 *   loading: boolean,
 *   error: string,
 *   refetch: Function
 * }}
 */
export default function useSoftware(filters = {}) {
  const [software, setSoftware] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSoftware = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getSoftware(filters);

      setSoftware(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load software:", err);

      setSoftware([]);
      setError(
        err?.message || "Unable to load software.",
      );
    } finally {
      setLoading(false);
    }
  }, [
    filters.search,
    filters.category,
    filters.business_size,
    filters.pricing,
    filters.rating,
  ]);

  useEffect(() => {
    fetchSoftware();
  }, [fetchSoftware]);

  return {
    software,
    loading,
    error,
    refetch: fetchSoftware,
  };
}
