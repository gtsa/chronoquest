import { useEffect, useState } from "react";
import "./PWAInstallPrompt.css";


/* ---------- helpers ---------- */

// `isAndroid` – detects Android devices based on userAgent.
const isAndroid = () => /android/i.test(navigator.userAgent);


// `isPWAInstalled` detect...

async function isPWAInstalled(): Promise<boolean> {
  // ...if the app is installed via standalone mode or WebAPK, or
  if (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as any).standalone === true || // iOS
    document.referrer?.startsWith("android-app://")
  ) {
    return true;
  }

  // ...if the app is running as an installed standalone (installed PWA or WebAPK)
  const getRelated = (navigator as any).getInstalledRelatedApps;
  if (typeof getRelated === "function") {
    try {
      const apps = await getRelated();
      if (apps?.length) return true;
    } catch {/* ignore */}
  }
  return false;
}

// `isChromeMobile` – detects Chrome/Brave mobile browsers that support real install banners.
const isBrave =
  !!(navigator as any).brave ||
  (navigator as any).userAgentData?.brands?.some((b: any) => /Brave/i.test(b.brand));

const isChromeMobile = () =>
  /Chrome\/[.0-9]* Mobile/i.test(navigator.userAgent) &&
  !/EdgA|OPR|YaApp|SamsungBrowser/i.test(navigator.userAgent) &&
  !isBrave;

type BannerMode = "install" | null;

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [mode, setMode] = useState<BannerMode>(null);
  const [locale, setLocale] = useState({
    installLine1: "Install",
    installLine2: "for a better fullscreen experience!",
    installButton: "Install",
    laterButton: "Maybe Later",});

  /* ---------- localisation ---------- */

// Runs once; picks strings for fr / el / es — defaults remain EN.
  useEffect(() => {
    const language = navigator.language || navigator.languages[0];
    
    if (language.startsWith("fr"))
      setLocale({
        installLine1: "Installez",
        installLine2: "pour une meilleure expérience plein écran !",
        installButton: "Installer",
        laterButton: "Plus tard",
      });
    else if (language.startsWith("el"))
      setLocale({
        installLine1: "Εγκαταστήστε το",
        installLine2: "για καλύτερη εμπειρία πλήρους οθόνης!",
        installButton: "Εγκατάσταση",
        laterButton: "Ίσως αργότερα",
      });
    else if (language.startsWith("es"))
      setLocale({
        installLine1: "Instala",
        installLine2: "para una mejor experiencia a pantalla completa!",
        installButton: "Instalar",
        laterButton: "Quizás más tarde",
      });
  }, []);

  useEffect(() => {
    if (!isAndroid()) return;

    (async () => {
      /* hide banner if the PWA (or A2HS shortcut) is already present */
      if (await isPWAInstalled()) {
        setMode(null);
        return;
      }

      /* Chrome path — use beforeinstallprompt */
      if (isChromeMobile()) {
        const handler = (e: any) => {
          e.preventDefault();
          setDeferredPrompt(e);
          setMode("install");
        };
        window.addEventListener("beforeinstallprompt", handler);
        return () => window.removeEventListener("beforeinstallprompt", handler);
      }
    })();
  }, []);


  /* ---------- click handlers ---------- */
  // `onInstall` only exists in Chrome path. We still
  // log the outcome for debugging.
  const onInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const res = await deferredPrompt.userChoice;
    console.log(res.outcome === "accepted" ? "✅ installed" : "❌ dismissed");
    setMode(null);
  };

  if (mode === null) return null;

  /* ---------- UI ---------- */
  return (
    <div className="install-banner">
      <p>
        {locale.installLine1} <strong>ChronoQuest</strong> <br />
        {locale.installLine2}
      </p>
      <div className="install-buttons">
        <button onClick={onInstall}>{locale.installButton}</button>
        <button onClick={() => setMode(null)}>{locale.laterButton}</button>
      </div>
    </div>
  );
}