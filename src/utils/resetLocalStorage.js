export const resetTownshipData = () => {
  const KEYS_TO_CLEAR = [
    "township",
    "townships",
    "activeTownshipId",
    "initialSetup",
    "setupCompleted",
    "currentBudget",

    // onboarding
    "onboarding_name",
    "onboarding_usage",
    "onboarding_role",
    "onboardingFunds",

    // auth
    "isLoggedIn"
  ];

  KEYS_TO_CLEAR.forEach((key) => {
    localStorage.removeItem(key);
  });

  console.log("✅ Township & onboarding data cleared");
};
