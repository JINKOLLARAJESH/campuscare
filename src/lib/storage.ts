import {
  Complaint,
  Department,
  UserProfile,
  CampusLocation,
  RoutingRule,
  EscalationConfig,
  AuditLog,
  NotificationItem,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  INITIAL_DEPARTMENTS,
  INITIAL_USERS,
  INITIAL_LOCATIONS,
  INITIAL_ROUTING_RULES,
  INITIAL_ESCALATION_CONFIGS,
  INITIAL_AUDIT_LOGS,
} from './mockData';

const STORAGE_KEYS = {
  COMPLAINTS: 'campuscare_complaints_v1',
  DEPARTMENTS: 'campuscare_departments_v1',
  USERS: 'campuscare_users_v1',
  LOCATIONS: 'campuscare_locations_v1',
  ROUTING_RULES: 'campuscare_routing_rules_v1',
  ESCALATION_CONFIGS: 'campuscare_escalation_configs_v1',
  AUDIT_LOGS: 'campuscare_audit_logs_v1',
  NOTIFICATIONS: 'campuscare_notifications_v1',
  ACTIVE_USER: 'campuscare_active_user_v1',
  THEME: 'campuscare_theme_v1',
};

// Safe JSON parse helper
function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (!item) return defaultValue;
    return JSON.parse(item);
  } catch (err) {
    console.warn(`Error reading localStorage key ${key}`, err);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error writing localStorage key ${key}`, err);
  }
}

export const StorageService = {
  // Complaints
  getComplaints: (): Complaint[] => {
    const stored = safeGet<Complaint[]>(STORAGE_KEYS.COMPLAINTS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
      return INITIAL_COMPLAINTS;
    }
    return stored;
  },

  saveComplaints: (complaints: Complaint[]) => {
    safeSet(STORAGE_KEYS.COMPLAINTS, complaints);
  },

  // Users
  getUsers: (): UserProfile[] => {
    const stored = safeGet<UserProfile[]>(STORAGE_KEYS.USERS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
      return INITIAL_USERS;
    }
    return stored;
  },

  saveUsers: (users: UserProfile[]) => {
    safeSet(STORAGE_KEYS.USERS, users);
  },

  // Active User
  getActiveUser: (): UserProfile => {
    const stored = safeGet<UserProfile | null>(STORAGE_KEYS.ACTIVE_USER, null);
    if (stored) return stored;
    return INITIAL_USERS[0]; // Default to first student
  },

  saveActiveUser: (user: UserProfile) => {
    safeSet(STORAGE_KEYS.ACTIVE_USER, user);
  },

  // Departments
  getDepartments: (): Department[] => {
    const stored = safeGet<Department[]>(STORAGE_KEYS.DEPARTMENTS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
      return INITIAL_DEPARTMENTS;
    }
    return stored;
  },

  saveDepartments: (depts: Department[]) => {
    safeSet(STORAGE_KEYS.DEPARTMENTS, depts);
  },

  // Locations
  getLocations: (): CampusLocation[] => {
    const stored = safeGet<CampusLocation[]>(STORAGE_KEYS.LOCATIONS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
      return INITIAL_LOCATIONS;
    }
    return stored;
  },

  saveLocations: (locations: CampusLocation[]) => {
    safeSet(STORAGE_KEYS.LOCATIONS, locations);
  },

  // Routing Rules
  getRoutingRules: (): RoutingRule[] => {
    const stored = safeGet<RoutingRule[]>(STORAGE_KEYS.ROUTING_RULES, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.ROUTING_RULES, INITIAL_ROUTING_RULES);
      return INITIAL_ROUTING_RULES;
    }
    return stored;
  },

  saveRoutingRules: (rules: RoutingRule[]) => {
    safeSet(STORAGE_KEYS.ROUTING_RULES, rules);
  },

  // Escalation Configs
  getEscalationConfigs: (): EscalationConfig[] => {
    const stored = safeGet<EscalationConfig[]>(STORAGE_KEYS.ESCALATION_CONFIGS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.ESCALATION_CONFIGS, INITIAL_ESCALATION_CONFIGS);
      return INITIAL_ESCALATION_CONFIGS;
    }
    return stored;
  },

  saveEscalationConfigs: (configs: EscalationConfig[]) => {
    safeSet(STORAGE_KEYS.ESCALATION_CONFIGS, configs);
  },

  // Audit Logs
  getAuditLogs: (): AuditLog[] => {
    const stored = safeGet<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, []);
    if (!stored || stored.length === 0) {
      safeSet(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
      return INITIAL_AUDIT_LOGS;
    }
    return stored;
  },

  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const logs = StorageService.getAuditLogs();
    const newLog: AuditLog = {
      ...log,
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1 (Local Session)',
    };
    logs.unshift(newLog);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100)); // Keep last 100
  },

  // Notifications
  getNotifications: (): NotificationItem[] => {
    return safeGet<NotificationItem[]>(STORAGE_KEYS.NOTIFICATIONS, [
      {
        id: 'notif-1',
        userId: 'user-std-1',
        userRole: 'student',
        title: 'Status Updated: CC-2026-00822',
        message: 'Your mess hygiene complaint was updated to "Action Taken".',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        read: false,
        referenceId: 'CC-2026-00822',
        type: 'status_change',
      },
      {
        id: 'notif-2',
        userId: 'user-off-1',
        userRole: 'officer',
        title: 'New Assignment: CC-2026-00821',
        message: 'Hostel Block A water outage assigned to you.',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        read: false,
        referenceId: 'CC-2026-00821',
        type: 'assignment',
      },
    ]);
  },

  saveNotifications: (notifications: NotificationItem[]) => {
    safeSet(STORAGE_KEYS.NOTIFICATIONS, notifications);
  },

  // Reset to factory demo data
  resetAll: () => {
    safeSet(STORAGE_KEYS.COMPLAINTS, INITIAL_COMPLAINTS);
    safeSet(STORAGE_KEYS.DEPARTMENTS, INITIAL_DEPARTMENTS);
    safeSet(STORAGE_KEYS.USERS, INITIAL_USERS);
    safeSet(STORAGE_KEYS.LOCATIONS, INITIAL_LOCATIONS);
    safeSet(STORAGE_KEYS.ROUTING_RULES, INITIAL_ROUTING_RULES);
    safeSet(STORAGE_KEYS.ESCALATION_CONFIGS, INITIAL_ESCALATION_CONFIGS);
    safeSet(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    safeSet(STORAGE_KEYS.ACTIVE_USER, INITIAL_USERS[0]);
  },
};
