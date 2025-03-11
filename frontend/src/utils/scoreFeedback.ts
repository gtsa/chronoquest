import { t } from "i18next";

export function getScoreMessage(score: number, hint: boolean): string[] {
    if (score >= 100) {
      return [`${hint ? '' : '🏆'} ${t("historian_extraordinaire")}`, t("historian_extraordinaire_desc")];
    } else if (score >= 80) {
      return [t("time_traveller_expert"), t("time_traveller_expert_desc")];
    } else if (score >= 60) {
      return [t("history_enthusiast"), t("history_enthusiast_desc")];
    } else if (score >= 40) {
      return [t("history_explorer"), t("history_explorer_desc")];
    } else {
      return [t("time_traveler_training"), t("time_traveler_training_desc")];
    }
  }
  