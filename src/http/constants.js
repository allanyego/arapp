export const ROOT_URL =
  process.env.NODE_ENV === "production"
    ? "https://safe360-ke.herokuapp.com"
    : "http://localhost:8080";

export const APPOINTMENT = {
  STATUSES: {
    UNANSWERED: "UNANSWERED",
    ACCEPTED: "ACCEPTED",
    REJECTED: "REJECTED",
    CLOSED: "CLOSED",
  },
};

export const SERVER_URL = `${ROOT_URL}/api/v1`;

export const USER = {
  ACCOUNT_TYPES: {
    USER: "USER",
    COUNSELLOR: "COUNSELLOR",
    HEALTH_FACILITY: "HEALTH_FACILITY",
    ADMIN: "ADMIN",
    LAW_ENFORCER: "LAW_ENFORCER",
  },
};

export const STORAGE_KEY = "arapp-erttyy-storageKey";

export const PROFILE_PICTURE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
];

export const REGEX = {
  PHONE: /^\+(?:[0-9]\x20?){6,14}[0-9]$/,
};

export const MAX_ATTACHMENT_SIZE = 2500000;

export const INCIDENT_TYPES = {
  SMS: "SMS",
  VIDEO: "VIDEO",
};
