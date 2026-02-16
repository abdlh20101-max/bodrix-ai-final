CREATE TABLE `aiChatHistory` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`chatType` enum('admin','private') NOT NULL DEFAULT 'admin',
	`aiProvider` varchar(50) NOT NULL DEFAULT 'openai',
	`aiModel` varchar(50) NOT NULL DEFAULT 'gpt-4',
	`userMessage` text NOT NULL,
	`aiResponse` text NOT NULL,
	`tokens` int NOT NULL DEFAULT 0,
	`isEncrypted` int NOT NULL DEFAULT 0,
	`encryptionKey` varchar(255),
	`status` enum('sent','received','processing','failed') NOT NULL DEFAULT 'received',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `aiChatHistory_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `aiTasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`command` text NOT NULL,
	`status` enum('pending','processing','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`result` text,
	`errorMessage` text,
	`priority` enum('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`startedAt` timestamp,
	`completedAt` timestamp,
	CONSTRAINT `aiTasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` enum('info','success','warning','error','task_completed') NOT NULL DEFAULT 'info',
	`isRead` int NOT NULL DEFAULT 0,
	`actionUrl` varchar(512),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`readAt` timestamp,
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rateLimits` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`resource` varchar(100) NOT NULL,
	`requestCount` int NOT NULL DEFAULT 0,
	`limitPerHour` int NOT NULL DEFAULT 100,
	`resetAt` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rateLimits_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userPermissions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`permission` varchar(100) NOT NULL,
	`isGranted` int NOT NULL DEFAULT 1,
	`grantedBy` int,
	`grantedAt` timestamp NOT NULL DEFAULT (now()),
	`expiresAt` timestamp,
	CONSTRAINT `userPermissions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `webhookEvents` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`eventType` varchar(100) NOT NULL,
	`trigger` text NOT NULL,
	`action` text NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`executionCount` int NOT NULL DEFAULT 0,
	`lastExecuted` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `webhookEvents_id` PRIMARY KEY(`id`)
);
