export function isMobile() {
  return (
    navigator.maxTouchPoints > 0 &&
    navigator.userAgent.search(
      /iOS|iPhone OS|Android|BlackBerry|opera mini|opera mobi|mobi.+Gecko|Windows Phone/i
    ) !== -1
  );
}
