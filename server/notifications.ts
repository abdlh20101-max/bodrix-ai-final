import { EventEmitter } from "events";

/**
 * Real-time Notifications System with WebSocket
 * يوفر إشعارات فورية للمستخدمين
 */

export type NotificationType = "success" | "error" | "warning" | "info" | "task";

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  data?: Record<string, any>;
}

export interface NotificationEvent {
  notification: Notification;
  recipients: string[];
}

class NotificationManager extends EventEmitter {
  private notifications: Map<string, Notification[]> = new Map();
  private unreadCount: Map<string, number> = new Map();
  private subscribers: Map<string, Set<(notification: Notification) => void>> =
    new Map();

  /**
   * Create and send notification
   */
  async sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      actionUrl?: string;
      data?: Record<string, any>;
    }
  ): Promise<Notification> {
    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId,
      type,
      title,
      message,
      timestamp: new Date(),
      read: false,
      actionUrl: options?.actionUrl,
      data: options?.data,
    };

    // Store notification
    if (!this.notifications.has(userId)) {
      this.notifications.set(userId, []);
    }
    this.notifications.get(userId)!.push(notification);

    // Update unread count
    const currentUnread = this.unreadCount.get(userId) || 0;
    this.unreadCount.set(userId, currentUnread + 1);

    // Emit to subscribers
    this.emitToSubscribers(userId, notification);

    // Emit event
    this.emit("notification:created", {
      notification,
      recipients: [userId],
    } as NotificationEvent);

    console.log(`[Notifications] Sent ${type} notification to ${userId}: ${title}`);

    return notification;
  }

  /**
   * Send broadcast notification to multiple users
   */
  async broadcastNotification(
    userIds: string[],
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      actionUrl?: string;
      data?: Record<string, any>;
    }
  ): Promise<Notification[]> {
    const notifications: Notification[] = [];

    for (const userId of userIds) {
      const notification = await this.sendNotification(
        userId,
        type,
        title,
        message,
        options
      );
      notifications.push(notification);
    }

    return notifications;
  }

  /**
   * Send task notification
   */
  async sendTaskNotification(
    userId: string,
    taskId: string,
    status: "started" | "progress" | "completed" | "failed",
    message: string,
    progress?: number
  ): Promise<Notification> {
    const titles: Record<string, string> = {
      started: "🚀 بدء المهمة",
      progress: "⏳ المهمة قيد التنفيذ",
      completed: "✅ اكتملت المهمة",
      failed: "❌ فشلت المهمة",
    };

    return this.sendNotification(
      userId,
      "task",
      titles[status],
      message,
      {
        actionUrl: `/tasks/${taskId}`,
        data: { taskId, status, progress },
      }
    );
  }

  /**
   * Mark notification as read
   */
  markAsRead(userId: string, notificationId: string): boolean {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return false;

    const notification = userNotifications.find((n) => n.id === notificationId);
    if (!notification) return false;

    if (!notification.read) {
      notification.read = true;
      const currentUnread = this.unreadCount.get(userId) || 0;
      this.unreadCount.set(userId, Math.max(0, currentUnread - 1));
    }

    return true;
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(userId: string): number {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return 0;

    let count = 0;
    for (const notification of userNotifications) {
      if (!notification.read) {
        notification.read = true;
        count++;
      }
    }

    this.unreadCount.set(userId, 0);
    return count;
  }

  /**
   * Get user notifications
   */
  getNotifications(
    userId: string,
    options?: {
      limit?: number;
      offset?: number;
      unreadOnly?: boolean;
    }
  ): Notification[] {
    const userNotifications = this.notifications.get(userId) || [];

    let filtered = userNotifications;

    if (options?.unreadOnly) {
      filtered = filtered.filter((n) => !n.read);
    }

    const limit = options?.limit || 50;
    const offset = options?.offset || 0;

    return filtered.slice(-limit - offset, -offset || undefined).reverse();
  }

  /**
   * Get unread count
   */
  getUnreadCount(userId: string): number {
    return this.unreadCount.get(userId) || 0;
  }

  /**
   * Delete notification
   */
  deleteNotification(userId: string, notificationId: string): boolean {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return false;

    const index = userNotifications.findIndex((n) => n.id === notificationId);
    if (index === -1) return false;

    const notification = userNotifications[index];
    userNotifications.splice(index, 1);

    if (!notification.read) {
      const currentUnread = this.unreadCount.get(userId) || 0;
      this.unreadCount.set(userId, Math.max(0, currentUnread - 1));
    }

    return true;
  }

  /**
   * Clear all notifications
   */
  clearNotifications(userId: string): number {
    const userNotifications = this.notifications.get(userId);
    if (!userNotifications) return 0;

    const count = userNotifications.length;
    this.notifications.delete(userId);
    this.unreadCount.delete(userId);

    return count;
  }

  /**
   * Subscribe to notifications
   */
  subscribe(
    userId: string,
    callback: (notification: Notification) => void
  ): () => void {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }

    this.subscribers.get(userId)!.add(callback);

    // Return unsubscribe function
    return () => {
      this.subscribers.get(userId)?.delete(callback);
    };
  }

  /**
   * Emit notification to subscribers
   */
  private emitToSubscribers(userId: string, notification: Notification): void {
    const subscribers = this.subscribers.get(userId);
    if (!subscribers) return;

    subscribers.forEach((callback: (notification: Notification) => void) => {
      try {
        callback(notification);
      } catch (error) {
        console.error("[Notifications] Error in subscriber callback:", error);
      }
    });
  }

  /**
   * Get notification statistics
   */
  getStats(): {
    totalNotifications: number;
    totalUsers: number;
    unreadCount: number;
    avgPerUser: number;
  } {
    let totalNotifications = 0;
    let unreadCount = 0;

    this.notifications.forEach((notifications: Notification[]) => {
      totalNotifications += notifications.length;
      unreadCount += notifications.filter((n: Notification) => !n.read).length;
    });

    const totalUsers = this.notifications.size;
    const avgPerUser = totalUsers > 0 ? totalNotifications / totalUsers : 0;

    return {
      totalNotifications,
      totalUsers,
      unreadCount,
      avgPerUser,
    };
  }

  /**
   * Clear old notifications (older than X days)
   */
  clearOldNotifications(daysOld: number = 30): number {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    let deletedCount = 0;

    this.notifications.forEach((notifications: Notification[], userId: string) => {
      const filtered = notifications.filter((n: Notification) => n.timestamp > cutoffDate);

      if (filtered.length < notifications.length) {
        deletedCount += notifications.length - filtered.length;
        this.notifications.set(userId, filtered);
      }
    });

    return deletedCount;
  }
}

export const notificationManager = new NotificationManager();
