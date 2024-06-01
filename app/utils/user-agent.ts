export function isMobile() {
  const userAgent = navigator.userAgent;

  // Check for touch capability
  const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

  // Match common mobile device user agents
  const mobileUserAgents = [
    /iPhone/i,
    /iPad/i,
    /iPod/i,
    /Android/i,
    /BlackBerry/i,
    /Opera Mini/i,
    /IEMobile/i,
    /Windows Phone/i,
    /Kindle/i,
    /Silk/i,
    /BB10/i,
    /PlayBook/i,
    /Mobile Safari/i,
    /webOS/i,
    /RIM Tablet OS/i,
  ];

  const isMobileDevice = mobileUserAgents.some((pattern) =>
    pattern.test(userAgent),
  );

  return hasTouch && isMobileDevice;
}
