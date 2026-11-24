import { useEffect, useState } from "react";
import { getJson } from "../api.js";

export function useApi(path, params = {}) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [version, setVersion] = useState(0);
  const key = JSON.stringify(params);

  useEffect(() => {
    setState((old) => ({ ...old, loading: true, error: null }));
    getJson(path, JSON.parse(key))
      .then((data) => setState({ data, loading: false, error: null }))
      .catch(() => setState({ data: null, loading: false, error: "We couldn't load this. Please try again in a moment." }));
  }, [path, key, version]);

  return { ...state, reload: () => setVersion((v) => v + 1) };
}
