export const QUERY_KEYS = {
    SESSIONS: {
        ALL: ["sessions"] as const,
        TODAY: ["sessions", "today"] as const,
        RECENT: ["sessions", "recent"] as const,
    },
    CUSTOMERS: {
        ALL: ["customers"] as const,
    },
    EMPLOYEES: {
        ALL: ["employees"] as const,
        OPERATIONAL: ["employees", "operational"] as const,
    },
    PROCEDURES: {
        ALL: ["procedures"] as const,
    },
    SPECIALTIES: {
        ALL: ["specialties"] as const,
    },
} as const;