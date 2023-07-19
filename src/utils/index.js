export function checkBrowser() {
  // Check browser and version
  var userAgent = navigator.userAgent;
  var browserName = '';
  var browserVersion = '';

  // Check for Firefox
  if (userAgent.indexOf('Firefox') > -1) {
    browserName = 'Mozilla Firefox';
    browserVersion = userAgent.match(/Firefox\/(\d+\.\d+)/)[1];
  }
  // Check for Chrome
  else if (userAgent.indexOf('Chrome') > -1) {
    browserName = 'Google Chrome';
    browserVersion = userAgent.match(/Chrome\/(\d+\.\d+)/)[1];
  }
  // Check for Safari
  else if (userAgent.indexOf('Safari') > -1) {
    browserName = 'Apple Safari';
    browserVersion = userAgent.match(/Version\/(\d+\.\d+)/)[1];
  }
  // Check for Internet Explorer
  else if (
    userAgent.indexOf('MSIE') > -1 ||
    userAgent.indexOf('Trident/') > -1
  ) {
    browserName = 'Microsoft Internet Explorer';
    browserVersion = userAgent.match(/(?:MSIE |rv:)(\d+\.\d+)/)[1];
  }
  // Check for Edge (Chromium-based)
  else if (userAgent.indexOf('Edg') > -1) {
    browserName = 'Microsoft Edge';
    browserVersion = userAgent.match(/Edg\/(\d+\.\d+)/)[1];
  }
  // Check for Opera
  else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR/') > -1) {
    browserName = 'Opera';
    browserVersion = userAgent.match(/(?:Opera|OPR)\/(\d+\.\d+)/)[1];
  }

  return browserName;
}

export function getOS() {
  const { userAgent } = window.navigator;
  const { platform } = window.navigator;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = null;

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
}
