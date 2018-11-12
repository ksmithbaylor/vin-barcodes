import { useState, useEffect } from 'react';

export const useLoadingState = (initial, loadTask) => {
  const [{ state, loading }, setState] = useState({
    state: initial,
    loading: false
  });

  const setDirectly = newValue => setState({ state: newValue, loading });
  const loadAndSet = (...args) => {
    setState({ state, loading: true });
    loadTask(...args).then(result =>
      setState({ state: result, loading: false })
    );
  };

  return [state, setDirectly, loading, loadAndSet];
};

export const useUrlSync = (desiredURL, update) => {
  // url -> state
  useEventListener('popstate', event => update(event.target.location.pathname));

  // state -> url
  useEffect(() => {
    if (window.location.pathname !== desiredURL) {
      window.history.pushState({}, document.title, desiredURL);
    }
  });
};

export const useEventListener = (eventName, callback) => {
  useEffect(() => {
    window.addEventListener(eventName, callback);
    return () => window.removeEventListener(eventName, callback);
  }, []);
};
