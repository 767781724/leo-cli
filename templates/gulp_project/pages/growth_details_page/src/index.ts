/**
 * 获取cookie
 * @param {string} cname
 * @return {string}
 */
function getCookie(cname: string) {
  const name = cname + '=';
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
  }
  return '';
};
const lang = getCookie('lang');

switch (lang) {
  case 'en':
    window.location.replace('./en.html');
    break;
  case 'ind':
    window.location.replace('./ind.html');
    break;
  case 'ru':
    window.location.replace('./ru.html');
    break;
  default:
    window.location.replace('./en.html');
    break;
}
