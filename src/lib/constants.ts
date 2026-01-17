/**
 * Global System Constants for DSArena
 */

export const LIVES_CONFIG = {
    MAX_LIVES: 3,
    RESTORE_TIME_MS: 10 * 60 * 1000, // 10 minutes
    CACHE_TTL_MS: 5000,
};

export const EXAM_CONFIG = {
    DEFAULT_DURATION_SECONDS: 2 * 60 * 60, // 2 hours
    BYPASS_TIME_MS: 2 * 60 * 60 * 1000, // 2 hours
    BYPASS_EMAILS: [
        'yashramnani.79@gmail.com',
        'madhuatomix@gmail.com',
        'vijay.siruvuru@gmail.com',
        'dinakartenny77@gmail.com',
        'saisushanth.p005@gmail.com',
        'tanoojpuppala3@gmail.com',
        'prabhathbunny16@gmail.com',
        'rajarajendraprasad123@gmail.com',
        'humayun04104@gmail.com',
    ],
    MIN_PASS_SCORE: 60,
};

export const DASHBOARD_CONFIG = {
    CHALLENGE_HISTORY_LIMIT: 12,
    XP_PER_PROBLEM: 50,
    XP_PER_CHALLENGE: 45,
};

export const RANK_THRESHOLDS = {
    ELITE_COMMANDER: 100,
    SENIOR_TACTICIAN: 50,
    PRO_ELITE: 20,
    OPERATIVE: 5,
};

export const REFRESH_INTERVALS = {
    LIVES_POLLING_MS: 1000,
};
