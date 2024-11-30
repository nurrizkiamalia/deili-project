const MAX_USES = 2;
const COOLDOWN_HOURS = 1;

export const getUsageKey = (key: string) => `ai_usage_${key}`;

const isBrowser = typeof window !== "undefined";

export const isUsageAllowed = (key: string) => {
  if (!isBrowser) return true; 

  const usage = JSON.parse(localStorage.getItem(getUsageKey(key)) || "{}");
  const now = Date.now();

  if (usage.count >= MAX_USES) {
    if (now - usage.timestamp < COOLDOWN_HOURS * 60 * 60 * 1000) {
      return false;
    }

    localStorage.setItem(getUsageKey(key), JSON.stringify({ count: MAX_USES, timestamp: now }));
  }
  return true;
};

export const getRemainingUses = (key: string) => {
  if (!isBrowser) return MAX_USES;

  const usage = JSON.parse(localStorage.getItem(getUsageKey(key)) || "{}");
  const now = Date.now();

  if (usage.count >= MAX_USES) {
    if (now - usage.timestamp < COOLDOWN_HOURS * 60 * 60 * 1000) {
      return 0; 
    } else {
      localStorage.removeItem(getUsageKey(key));
      return MAX_USES; 
    }
  }

  return Math.max(0, MAX_USES - (usage.count || 0)); 
};

export const recordUsage = (key: string) => {
  if (!isBrowser) return;

  const usage = JSON.parse(localStorage.getItem(getUsageKey(key)) || "{}");
  const now = Date.now();

  if (!usage.timestamp || now - usage.timestamp >= COOLDOWN_HOURS * 60 * 60 * 1000) {
    localStorage.setItem(getUsageKey(key), JSON.stringify({ count: 1, timestamp: now }));
  } else {
    localStorage.setItem(
      getUsageKey(key),
      JSON.stringify({ count: Math.min(MAX_USES, (usage.count || 0) + 1), timestamp: usage.timestamp })
    );
  }
};

export const getCooldownTime = (key: string) => {
  if (!isBrowser) return null; 
  const usage = JSON.parse(localStorage.getItem(getUsageKey(key)) || "{}");
  const now = Date.now();

  if (usage.count >= MAX_USES) {
    const cooldownRemaining = COOLDOWN_HOURS * 60 * 60 * 1000 - (now - usage.timestamp);
    return cooldownRemaining > 0 ? cooldownRemaining : 0;
  }

  return 0; 
};
