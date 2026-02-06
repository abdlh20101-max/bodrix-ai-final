import * as fs from "fs";
import * as path from "path";

/**
 * 24/7 Auto-Backup System
 * Creates automatic backups every hour with full project snapshots
 */

export interface BackupMetadata {
  id: string;
  timestamp: Date;
  type: "hourly" | "daily" | "weekly" | "manual";
  size: number;
  status: "success" | "failed" | "partial";
  description?: string;
}

export interface BackupInfo {
  id: string;
  timestamp: Date;
  path: string;
  size: number;
  type: string;
  canRestore: boolean;
}

class AutoBackupSystem {
  private backupDir = "/home/ubuntu/bodrix-ai-final/.backups";
  private projectRoot = "/home/ubuntu/bodrix-ai-final";
  private backupHistory: BackupMetadata[] = [];
  private backupInterval = 60 * 60 * 1000; // 1 hour in milliseconds

  constructor() {
    this.initializeBackupSystem();
    this.startAutoBackup();
  }

  /**
   * Initialize backup system
   */
  private initializeBackupSystem(): void {
    // Create backup directory if it doesn't exist
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      console.log(`[Backup] Created backup directory: ${this.backupDir}`);
    }

    // Load existing backups
    this.loadBackupHistory();
  }

  /**
   * Load backup history from metadata file
   */
  private loadBackupHistory(): void {
    const metadataFile = path.join(this.backupDir, "metadata.json");

    try {
      if (fs.existsSync(metadataFile)) {
        const data = fs.readFileSync(metadataFile, "utf-8");
        this.backupHistory = JSON.parse(data);
        console.log(
          `[Backup] Loaded ${this.backupHistory.length} backup records`
        );
      }
    } catch (error) {
      console.error("[Backup] Failed to load backup history:", error);
      this.backupHistory = [];
    }
  }

  /**
   * Save backup history to metadata file
   */
  private saveBackupHistory(): void {
    const metadataFile = path.join(this.backupDir, "metadata.json");

    try {
      fs.writeFileSync(metadataFile, JSON.stringify(this.backupHistory, null, 2));
    } catch (error) {
      console.error("[Backup] Failed to save backup history:", error);
    }
  }

  /**
   * Start automatic backup scheduler
   */
  private startAutoBackup(): void {
    // Run first backup immediately
    this.createBackup("hourly", "Automatic hourly backup");

    // Schedule hourly backups
    setInterval(() => {
      this.createBackup("hourly", "Automatic hourly backup");
    }, this.backupInterval);

    // Schedule daily backup at midnight
    this.scheduleDailyBackup();

    console.log("[Backup] Auto-backup system started (hourly + daily)");
  }

  /**
   * Schedule daily backup at midnight
   */
  private scheduleDailyBackup(): void {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    setTimeout(() => {
      this.createBackup("daily", "Automatic daily backup");
      // Repeat every 24 hours
      setInterval(() => {
        this.createBackup("daily", "Automatic daily backup");
      }, 24 * 60 * 60 * 1000);
    }, timeUntilMidnight);
  }

  /**
   * Create a backup snapshot
   */
  async createBackup(
    type: "hourly" | "daily" | "weekly" | "manual",
    description?: string
  ): Promise<BackupMetadata> {
    const backupId = `backup_${type}_${Date.now()}`;
    const backupPath = path.join(this.backupDir, backupId);

    const metadata: BackupMetadata = {
      id: backupId,
      timestamp: new Date(),
      type,
      size: 0,
      status: "failed",
      description,
    };

    try {
      // Create backup directory
      fs.mkdirSync(backupPath, { recursive: true });

      // Copy important directories
      const dirsToBackup = [
        "client/src",
        "server",
        "drizzle",
        "shared",
        "package.json",
        "pnpm-lock.yaml",
        ".env.example",
      ];

      for (const dir of dirsToBackup) {
        const source = path.join(this.projectRoot, dir);
        const dest = path.join(backupPath, dir);

        if (fs.existsSync(source)) {
          this.copyDirectory(source, dest);
        }
      }

      // Calculate backup size
      metadata.size = this.getDirectorySize(backupPath);
      metadata.status = "success";

      console.log(
        `[Backup] Created ${type} backup: ${backupId} (${this.formatSize(metadata.size)})`
      );
    } catch (error) {
      console.error(`[Backup] Failed to create ${type} backup:`, error);
      metadata.status = "failed";
    }

    // Add to history
    this.backupHistory.push(metadata);
    this.saveBackupHistory();

    // Cleanup old backups (keep last 30 days)
    this.cleanupOldBackups();

    return metadata;
  }

  /**
   * Copy directory recursively
   */
  private copyDirectory(source: string, dest: string): void {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }

    const files = fs.readdirSync(source);

    for (const file of files) {
      const sourceFile = path.join(source, file);
      const destFile = path.join(dest, file);

      // Skip node_modules and other large directories
      if (
        file === "node_modules" ||
        file === ".git" ||
        file === ".backups" ||
        file === "dist" ||
        file === "build"
      ) {
        continue;
      }

      if (fs.statSync(sourceFile).isDirectory()) {
        this.copyDirectory(sourceFile, destFile);
      } else {
        fs.copyFileSync(sourceFile, destFile);
      }
    }
  }

  /**
   * Get directory size in bytes
   */
  private getDirectorySize(dir: string): number {
    let size = 0;

    try {
      const files = fs.readdirSync(dir);

      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
          size += this.getDirectorySize(filePath);
        } else {
          size += stat.size;
        }
      }
    } catch (error) {
      console.error("[Backup] Error calculating directory size:", error);
    }

    return size;
  }

  /**
   * Format bytes to human readable format
   */
  private formatSize(bytes: number): string {
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`;
  }

  /**
   * Cleanup old backups (keep last 30 days)
   */
  private cleanupOldBackups(): void {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const backupsToDelete = this.backupHistory.filter(
      (backup) => new Date(backup.timestamp) < thirtyDaysAgo
    );

    for (const backup of backupsToDelete) {
      const backupPath = path.join(this.backupDir, backup.id);

      try {
        if (fs.existsSync(backupPath)) {
          fs.rmSync(backupPath, { recursive: true, force: true });
          console.log(`[Backup] Deleted old backup: ${backup.id}`);
        }

        // Remove from history
        this.backupHistory = this.backupHistory.filter((b) => b.id !== backup.id);
      } catch (error) {
        console.error(`[Backup] Failed to delete backup ${backup.id}:`, error);
      }
    }

    this.saveBackupHistory();
  }

  /**
   * Get list of available backups
   */
  getAvailableBackups(): BackupInfo[] {
    return this.backupHistory
      .filter((b) => b.status === "success")
      .map((b) => ({
        id: b.id,
        timestamp: new Date(b.timestamp),
        path: path.join(this.backupDir, b.id),
        size: b.size,
        type: b.type,
        canRestore: fs.existsSync(path.join(this.backupDir, b.id)),
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Get latest backup
   */
  getLatestBackup(): BackupInfo | null {
    const backups = this.getAvailableBackups();
    return backups.length > 0 ? backups[0] : null;
  }

  /**
   * Get backup statistics
   */
  getBackupStats(): {
    totalBackups: number;
    successfulBackups: number;
    failedBackups: number;
    totalSize: string;
    lastBackup?: Date;
  } {
    const successful = this.backupHistory.filter((b) => b.status === "success");
    const failed = this.backupHistory.filter((b) => b.status === "failed");
    const totalSize = successful.reduce((sum, b) => sum + b.size, 0);

    return {
      totalBackups: this.backupHistory.length,
      successfulBackups: successful.length,
      failedBackups: failed.length,
      totalSize: this.formatSize(totalSize),
      lastBackup: successful.length > 0 ? new Date(successful[0].timestamp) : undefined,
    };
  }
}

export const autoBackup = new AutoBackupSystem();
