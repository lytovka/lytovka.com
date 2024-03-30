export const updateQueryParameterInCurrentHistoryEntry = (
  queryKey: string,
  queryValue: string,
) => {
  const currentSearchParams = new URLSearchParams(window.location.search);
  if (queryValue) {
    currentSearchParams.set(queryKey, queryValue);
  } else {
    currentSearchParams.delete(queryKey);
  }
  const newUrl = [window.location.pathname, currentSearchParams.toString()]
    .filter(Boolean)
    .join("?");
  window.history.replaceState(null, "", newUrl);
};
