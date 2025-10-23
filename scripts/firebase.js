/* Firebase Auth (Google Sign-In only). Stores session in localStorage. */
const EMAIL_ROLE_MAP = {
  "founder@example.com": "Founder",
  "manager@example.com": "Manager"
};

const FirebaseAuth = (() => {
  const appConfig = {
    apiKey: "REPLACE",
    authDomain: "REPLACE.firebaseapp.com",
    projectId: "REPLACE",
    appId: "REPLACE",
  };

  // Using compat CDN loaded in HTML
  firebase.initializeApp(appConfig);
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  const setSession = (user) => {
    const email = user?.email || null;
    const name = user?.displayName || null;
    const photo = user?.photoURL || null;
    const role =
      EMAIL_ROLE_MAP[email] ||
      window.SS?.usersRoleMap?.[email] ||
      "Guest";

    const session = { email, name, photo, role, ts: Date.now() };
    localStorage.setItem("SS_SESSION", JSON.stringify(session));
    window.SS.session = session;
    return session;
  };

  const getSession = () => {
    const raw = localStorage.getItem("SS_SESSION");
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  };

  const clearSession = () => {
    localStorage.removeItem("SS_SESSION");
    window.SS.session = null;
  };

  const signIn = async () => {
    const result = await auth.signInWithPopup(provider);
    return setSession(result.user);
  };

  const signOut = async () => {
    await auth.signOut();
    clearSession();
  };

  return { signIn, signOut, getSession };
})();
