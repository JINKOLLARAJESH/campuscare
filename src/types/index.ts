export type UserRole = 'student' | 'officer' | 'committee' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  rollNumber?: string;
  avatar?: string;
  phone?: string;
  badge?: string;
}

export type ComplaintCategory =
  | 'Academics'
  | 'Faculty'
  | 'Hostel'
  | 'Mess'
  | 'Infrastructure'
  | 'Administration'
  | 'Harassment and Safety'
  | 'Other';

export type ComplaintPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus =
  | 'Submitted'
  | 'Acknowledged'
  | 'Assigned'
  | 'Under Investigation'
  | 'Action Taken'
  | 'Resolved'
  | 'Reopened'
  | 'Escalated'
  | 'Closed';

export type EscalationLevel = 1 | 2 | 3 | 4;

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface TimelineEntry {
  id: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | 'System';
}

export interface Message {
  id: string;
  complaintId: string;
  senderRole: UserRole;
  senderName: string;
  content: string;
  timestamp: string;
  isAnonymous: boolean;
  attachments?: Attachment[];
}

export interface Complaint {
  id: string;
  referenceId: string; // e.g. CC-2026-00821
  trackingSecret: string; // Random secure key for anonymous retrieval
  title: string;
  description: string;
  category: ComplaintCategory;
  subcategory: string;
  location: string;
  incidentDate: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  reportingMode: 'anonymous' | 'identified';
  
  // Student info (omitted/masked if anonymous)
  studentId?: string;
  studentName?: string;
  studentRollNumber?: string;
  studentEmail?: string;
  
  // Routing & assignment
  assignedDepartment: string;
  assignedOfficerId?: string;
  assignedOfficerName?: string;
  
  // Escalation & sensitivity
  escalationLevel: EscalationLevel;
  escalationDeadline: string; // ISO date string
  isEscalated: boolean;
  isSensitive: boolean; // Committee-only access
  
  // Metadata & history
  attachments: Attachment[];
  timeline: TimelineEntry[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  satisfactionRating?: number; // 1 to 5
  reopenReason?: string;
  aiClassified?: {
    suggestedCategory: ComplaintCategory;
    suggestedSubcategory: string;
    suggestedPriority: ComplaintPriority;
    suggestedDepartment: string;
    confidence: number;
    keywords: string[];
  };
}

export interface Department {
  id: string;
  name: string;
  code: string;
  description: string;
  headName: string;
  email: string;
  categoriesHandled: ComplaintCategory[];
  totalComplaints: number;
  resolvedComplaints: number;
  avgResolutionDays: number;
}

export interface CampusLocation {
  id: string;
  name: string;
  building: string;
  zone: string;
  coordinates: { x: number; y: number }; // Percentage positions 0-100 on map
  activeIncidents: number;
  resolvedIncidents: number;
}

export interface RoutingRule {
  id: string;
  category: ComplaintCategory;
  subcategory?: string;
  targetDepartment: string;
  defaultPriority: ComplaintPriority;
  isRestricted: boolean; // Flagged for Grievance Committee review
}

export interface EscalationConfig {
  level: EscalationLevel;
  name: string;
  authorityTitle: string;
  maxHoursBeforeEscalation: number;
  notifyRoles: UserRole[];
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole | 'System';
  action: string;
  targetType: 'Complaint' | 'User' | 'Department' | 'System' | 'Message';
  targetId: string;
  details: string;
  ipAddress?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  userRole: UserRole;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  complaintId?: string;
  referenceId?: string;
  type: 'status_change' | 'escalation' | 'message' | 'assignment' | 'alert';
}
