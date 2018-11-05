import { useState, useEffect } from 'react';

export const useLoadingState = () => {
  const [loading, setLoading] = useState(false);
  const withLoadingState = async task => {
    setLoading(true);
    await task();
    setLoading(false);
  };
  return [loading, withLoadingState];
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
