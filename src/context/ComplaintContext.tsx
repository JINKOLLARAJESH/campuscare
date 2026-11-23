import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Complaint,
  Department,
  CampusLocation,
  AuditLog,
  NotificationItem,
  ComplaintStatus,
  ComplaintPriority,
  ComplaintCategory,
  EscalationLevel,
} from '../types';
import { StorageService } from '../lib/storage';
import { generateReferenceId, generateTrackingSecret } from '../lib/utils';
import { useAuth } from './AuthContext';
import { useToast } from '../components/ui/Toast';

export interface SubmitComplaintInput {
  title: string;
  description: string;
  category: ComplaintCategory;
  subcategory: string;
  location: string;
  incidentDate: string;
  priority: ComplaintPriority;
  reportingMode: 'anonymous' | 'identified';
  attachments?: { name: string; size: string; type: string; url: string }[];
  aiClassified?: Complaint['aiClassified'];
}

interface ComplaintContextType {
  complaints: Complaint[];
  departments: Department[];
  locations: CampusLocation[];
  auditLogs: AuditLog[];
  notifications: NotificationItem[];
  unreadCount: number;
  submitComplaint: (input: SubmitComplaintInput) => Complaint;
  updateStatus: (
    complaintId: string,
    newStatus: ComplaintStatus,
    note?: string
  ) => void;
  sendMessage: (complaintId: string, content: string) => void;
  reopenComplaint: (complaintId: string, reason: string) => void;
  escalateComplaint: (complaintId: string) => void;
  getComplaintByReference: (
    refId: string,
    secret?: string
  ) => { complaint: Complaint | null; error?: string };
  markNotificationRead: (id: string) => void;
  resetDemoData: () => void;
}

const ComplaintContext = createContext<ComplaintContextType | undefined>(undefined);

export const ComplaintProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const { success, info, warning } = useToast();

  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    StorageService.getComplaints()
  );
  const [departments, setDepartments] = useState<Department[]>(() =>
    StorageService.getDepartments()
  );
  const [locations, setLocations] = useState<CampusLocation[]>(() =>
    StorageService.getLocations()
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    StorageService.getAuditLogs()
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    StorageService.getNotifications()
  );

  // Sync back to storage on state change
  useEffect(() => {
    StorageService.saveComplaints(complaints);
  }, [complaints]);

  useEffect(() => {
    StorageService.saveDepartments(departments);
  }, [departments]);

  useEffect(() => {
    StorageService.saveNotifications(notifications);
  }, [notifications]);

  // Determine assigned department based on routing rules
  const resolveDepartment = (category: ComplaintCategory): string => {
    switch (category) {
      case 'Hostel':
        return 'Hostel Administration';
      case 'Mess':
        return 'Mess & Dining Committee';
      case 'Academics':
        return 'Academic Affairs';
      case 'Faculty':
      case 'Harassment and Safety':
        return 'Grievance Redressal Committee';
      case 'Infrastructure':
        return 'Infrastructure & Maintenance';
      case 'Administration':
      case 'Other':
      default:
        return 'Administrative Operations';
    }
  };

  const submitComplaint = (input: SubmitComplaintInput): Complaint => {
    const referenceId = generateReferenceId();
    const trackingSecret = generateTrackingSecret();
    const assignedDept = resolveDepartment(input.category);
    const isSensitive =
      input.category === 'Harassment and Safety' || input.category === 'Faculty';

    const deadlineDate = new Date();
    deadlineDate.setDate(deadlineDate.getDate() + (input.priority === 'Critical' ? 2 : 4));

    const newComplaint: Complaint = {
      id: `c-${Date.now()}`,
      referenceId,
      trackingSecret,
      title: input.title,
      description: input.description,
      category: input.category,
      subcategory: input.subcategory,
      location: input.location,
      incidentDate: input.incidentDate || new Date().toISOString().split('T')[0],
      priority: input.priority,
      status: 'Submitted',
      reportingMode: input.reportingMode,

      // If identified and user logged in
      studentId: input.reportingMode === 'identified' ? user?.id : undefined,
      studentName: input.reportingMode === 'identified' ? user?.name : undefined,
      studentRollNumber:
        input.reportingMode === 'identified' ? user?.rollNumber : undefined,
      studentEmail: input.reportingMode === 'identified' ? user?.email : undefined,

      assignedDepartment: assignedDept,
      escalationLevel: 1,
      escalationDeadline: deadlineDate.toISOString(),
      isEscalated: false,
      isSensitive,

      attachments: (input.attachments || []).map((a, i) => ({
        id: `att-new-${i}`,
        name: a.name,
        size: a.size,
        type: a.type,
        url: a.url,
      })),

      timeline: [
        {
          id: `t-${Date.now()}-1`,
          status: 'Submitted',
          title:
            input.reportingMode === 'anonymous'
              ? 'Grievance Lodged Anonymously'
              : 'Grievance Registered by Student',
          description: `Case registered with tracking ID ${referenceId}. Auto-routed to ${assignedDept}.`,
          timestamp: new Date().toISOString(),
          actorName: input.reportingMode === 'anonymous' ? 'Anonymous Student' : (user?.name || 'Student'),
          actorRole: 'student',
        },
      ],

      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      aiClassified: input.aiClassified,
    };

    setComplaints((prev) => [newComplaint, ...prev]);

    // Record Audit Log
    StorageService.addAuditLog({
      actorName: input.reportingMode === 'anonymous' ? 'Anonymous Complainant' : (user?.name || 'Student'),
      actorRole: 'student',
      action: 'COMPLAINT_SUBMISSION',
      targetType: 'Complaint',
      targetId: referenceId,
      details: `New grievance submitted in category ${input.category} (${input.reportingMode})`,
    });
    setAuditLogs(StorageService.getAuditLogs());

    // Update location counter
    setLocations((prev) =>
      prev.map((loc) =>
        loc.name === input.location
          ? { ...loc, activeIncidents: loc.activeIncidents + 1 }
          : loc
      )
    );

    // Create Notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: 'user-off-1',
      userRole: 'officer',
      title: `New Case: ${referenceId}`,
      message: `${input.title.slice(0, 50)}... routed to ${assignedDept}`,
      timestamp: new Date().toISOString(),
      read: false,
      referenceId,
      type: 'assignment',
    };
    setNotifications((prev) => [newNotif, ...prev]);

    success('Grievance Registered Successfully', `Reference ID: ${referenceId}`);

    return newComplaint;
  };

  const updateStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    note?: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const timelineEntry = {
          id: `t-${Date.now()}`,
          status: newStatus,
          title: `Status Updated to "${newStatus}"`,
          description: note || `Grievance status progressed to ${newStatus}.`,
          timestamp: new Date().toISOString(),
          actorName: user?.name || 'Department Officer',
          actorRole: (user?.role || 'officer') as any,
        };

        const isResolved = newStatus === 'Resolved' || newStatus === 'Closed';

        return {
          ...c,
          status: newStatus,
          resolvedAt: isResolved ? new Date().toISOString() : c.resolvedAt,
          updatedAt: new Date().toISOString(),
          timeline: [...c.timeline, timelineEntry],
        };
      })
    );

    const targetComplaint = complaints.find((c) => c.id === complaintId);
    if (targetComplaint) {
      StorageService.addAuditLog({
        actorName: user?.name || 'Department Officer',
        actorRole: user?.role || 'officer',
        action: 'STATUS_UPDATE',
        targetType: 'Complaint',
        targetId: targetComplaint.referenceId,
        details: `Status advanced to ${newStatus}. Note: ${note || 'None'}`,
      });
      setAuditLogs(StorageService.getAuditLogs());

      info(`Status Updated to ${newStatus}`, `Case ${targetComplaint.referenceId}`);
    }
  };

  const sendMessage = (complaintId: string, content: string) => {
    const isStudent = user?.role === 'student';

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const senderDisplayName =
          isStudent && c.reportingMode === 'anonymous'
            ? 'Anonymous Student'
            : (user?.name || (isStudent ? 'Student' : 'Department Officer'));

        const newMsg = {
          id: `msg-${Date.now()}`,
          complaintId,
          senderRole: (user?.role || 'student') as any,
          senderName: senderDisplayName,
          content,
          timestamp: new Date().toISOString(),
          isAnonymous: isStudent && c.reportingMode === 'anonymous',
        };

        return {
          ...c,
          updatedAt: new Date().toISOString(),
          messages: [...c.messages, newMsg],
        };
      })
    );

    const target = complaints.find((c) => c.id === complaintId);
    if (target) {
      StorageService.addAuditLog({
        actorName: user?.name || 'User',
        actorRole: user?.role || 'student',
        action: 'MESSAGE_SENT',
        targetType: 'Message',
        targetId: target.referenceId,
        details: `Secure message sent in case ${target.referenceId}`,
      });
      setAuditLogs(StorageService.getAuditLogs());
    }
  };

  const reopenComplaint = (complaintId: string, reason: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;

        const timelineEntry = {
          id: `t-${Date.now()}`,
          status: 'Reopened' as ComplaintStatus,
          title: 'Grievance Reopened by Complainant',
          description: `Justification: "${reason}"`,
          timestamp: new Date().toISOString(),
          actorName: c.reportingMode === 'anonymous' ? 'Anonymous Student' : (user?.name || 'Student'),
          actorRole: 'student' as any,
        };

        return {
          ...c,
          status: 'Reopened' as ComplaintStatus,
          reopenReason: reason,
          escalationLevel: Math.min(4, c.escalationLevel + 1) as EscalationLevel,
          isEscalated: true,
          updatedAt: new Date().toISOString(),
          timeline: [...c.timeline, timelineEntry],
        };
      })
    );

    const target = complaints.find((c) => c.id === complaintId);
    if (target) {
      StorageService.addAuditLog({
        actorName: user?.name || 'Student',
        actorRole: 'student',
        action: 'COMPLAINT_REOPEN',
        targetType: 'Complaint',
        targetId: target.referenceId,
        details: `Case reopened: ${reason}`,
      });
      setAuditLogs(StorageService.getAuditLogs());

      warning('Grievance Reopened', `Reference ${target.referenceId} escalated to higher authority review.`);
    }
  };

  const escalateComplaint = (complaintId: string) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== complaintId) return c;
        const nextLevel = Math.min(4, c.escalationLevel + 1) as EscalationLevel;

        const timelineEntry = {
          id: `t-${Date.now()}`,
          status: 'Escalated' as ComplaintStatus,
          title: `Escalated to Level ${nextLevel}`,
          description: `Automatic deadline threshold reached or authority manual trigger. Case escalated to Level ${nextLevel} oversight.`,
          timestamp: new Date().toISOString(),
          actorName: user?.name || 'CampusCare Escalation Engine',
          actorRole: (user?.role || 'admin') as any,
        };

        return {
          ...c,
          isEscalated: true,
          escalationLevel: nextLevel,
          status: 'Escalated' as ComplaintStatus,
          updatedAt: new Date().toISOString(),
          timeline: [...c.timeline, timelineEntry],
        };
      })
    );

    const target = complaints.find((c) => c.id === complaintId);
    if (target) {
      StorageService.addAuditLog({
        actorName: user?.name || 'System',
        actorRole: user?.role || 'admin',
        action: 'ESCALATION_TRIGGER',
        targetType: 'Complaint',
        targetId: target.referenceId,
        details: `Case escalated to Level ${Math.min(4, target.escalationLevel + 1)}`,
      });
      setAuditLogs(StorageService.getAuditLogs());
      warning('Grievance Escalated', `Case ${target.referenceId} routed to Grievance Committee`);
    }
  };

  const getComplaintByReference = (
    refId: string,
    secret?: string
  ): { complaint: Complaint | null; error?: string } => {
    const cleanRef = refId.trim().toUpperCase();
    const found = complaints.find(
      (c) => c.referenceId.toUpperCase() === cleanRef
    );

    if (!found) {
      return { complaint: null, error: 'No grievance found matching this Reference ID.' };
    }

    if (found.reportingMode === 'anonymous') {
      if (!secret || secret.trim().toUpperCase() !== found.trackingSecret.toUpperCase()) {
        return {
          complaint: null,
          error:
            'This is a protected Anonymous grievance. A valid Tracking Secret Token (e.g. SEC-XXXXXXXX) is required for access.',
        };
      }
    }

    return { complaint: found };
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const resetDemoData = () => {
    StorageService.resetAll();
    setComplaints(StorageService.getComplaints());
    setDepartments(StorageService.getDepartments());
    setLocations(StorageService.getLocations());
    setAuditLogs(StorageService.getAuditLogs());
    setNotifications(StorageService.getNotifications());
    info('System Reset', 'All demo complaints, departments, and logs restored to initial factory state.');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <ComplaintContext.Provider
      value={{
        complaints,
        departments,
        locations,
        auditLogs,
        notifications,
        unreadCount,
        submitComplaint,
        updateStatus,
        sendMessage,
        reopenComplaint,
        escalateComplaint,
        getComplaintByReference,
        markNotificationRead,
        resetDemoData,
      }}
    >
      {children}
    </ComplaintContext.Provider>
  );
};

export const useComplaints = () => {
  const context = useContext(ComplaintContext);
  if (!context)
    throw new Error('useComplaints must be used within ComplaintProvider');
  return context;
};
