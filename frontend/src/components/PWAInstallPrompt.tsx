import { useEffect, useState } from "react";
import "./PWAInstallPrompt.css";

const isMobileOrTablet = () => {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    /android|iphone|ipad|ipod|opera mini|iemobile|mobile/i.test(navigator.userAgent)
  );
};

const PWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(true);
  const [localizedMessage, setLocalizedMessage] = useState<{
    installLine1: string;
    installLine2: string;
    installButton: string;
    laterButton: string;
  }>({
    installLine1: "Install",
    installLine2: "for a better fullscreen experience!",
    installButton: "Install",
    laterButton: "Maybe Later",
  });

  useEffect(() => {
    const language = navigator.language || navigator.languages[0];

    if (language.startsWith("fr")) {
      setLocalizedMessage({
        installLine1: "Installez",
        installLine2: "pour une meilleure expérience plein écran !",
        installButton: "Installer",
        laterButton: "Plus tard",
      });
    } else if (language.startsWith("el")) {
      setLocalizedMessage({
        installLine1: "Εγκαταστήστε το",
        installLine2: "για καλύτερη εμπειρία πλήρους οθόνης!",
        installButton: "Εγκατάσταση",
        laterButton: "Ίσως αργότερα",
      });
    } else if (language.startsWith("es")) {
      setLocalizedMessage({
        installLine1: "Instala",
        installLine2: "para una mejor experiencia a pantalla completa!",
        installButton: "Instalar",
        laterButton: "Quizás más tarde",
      });
    }
    // Add more languages easily here if needed

  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      if (!isMobileOrTablet()) return;
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();

    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === "accepted") {
      console.log("✅ User accepted install");
    } else {
      console.log("❌ User dismissed install");
    }
    setShowPrompt(false);
  };

  const handleMaybeLater = () => {
    console.log("🔔 User chose 'Maybe later'");
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div className="install-banner">
      <p>
        {localizedMessage.installLine1} <strong>ChronoQuest</strong> <br />
        {localizedMessage.installLine2}
      </p>
      <div className="install-buttons">
        <button onClick={handleInstallClick}>{localizedMessage.installButton}</button>
        <button onClick={handleMaybeLater}>{localizedMessage.laterButton}</button>
      </div>
    </div>
  );
};

export default PWAInstallPrompt;
