export function getCookie(cookieName: string) {
  const name = cookieName + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    const c = ca[i].trim();
    if (c.indexOf(name) == 0) {
      return c.substring(name.length);
    }
  }
  return undefined;
}
