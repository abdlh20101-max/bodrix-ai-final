CREATE TABLE `images` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`messageId` int,
	`url` varchar(512) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileSize` int NOT NULL,
	`mimeType` varchar(50) NOT NULL,
	`uploadedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`content` text NOT NULL,
	`role` enum('user','assistant') NOT NULL DEFAULT 'user',
	`language` varchar(10) NOT NULL DEFAULT 'ar',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `points` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`amount` int NOT NULL,
	`reason` varchar(100) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `points_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `referrals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`referrerId` int NOT NULL,
	`referredUserId` int,
	`referralCode` varchar(50) NOT NULL,
	`pointsEarned` int NOT NULL DEFAULT 0,
	`status` enum('pending','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `referrals_id` PRIMARY KEY(`id`),
	CONSTRAINT `referrals_referralCode_unique` UNIQUE(`referralCode`)
);
--> statement-breakpoint
CREATE TABLE `shares` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`sharedWith` int,
	`shareDate` timestamp NOT NULL DEFAULT (now()),
	`pointsEarned` int NOT NULL DEFAULT 5,
	CONSTRAINT `shares_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`planType` enum('premium_week','premium_month','premium_3months','premium_year','pro_week','pro_month','pro_3months','pro_year') NOT NULL,
	`price` int NOT NULL,
	`currency` varchar(3) NOT NULL DEFAULT 'USD',
	`startDate` timestamp NOT NULL DEFAULT (now()),
	`endDate` timestamp NOT NULL,
	`status` enum('active','cancelled','expired') NOT NULL DEFAULT 'active',
	`paymentMethod` varchar(50),
	`transactionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `watchedAds` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`adId` varchar(100) NOT NULL,
	`watchedAt` timestamp NOT NULL DEFAULT (now()),
	`pointsEarned` int NOT NULL DEFAULT 8,
	CONSTRAINT `watchedAds_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `role` enum('user','admin','developer','premium','pro') NOT NULL DEFAULT 'user';--> statement-breakpoint
ALTER TABLE `users` ADD `accountType` enum('free','premium','pro','developer') DEFAULT 'free' NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `dailyMessagesLimit` int DEFAULT 20 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `dailyImagesLimit` int DEFAULT 2 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `messagesUsedToday` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `imagesUsedToday` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `totalPoints` int DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `lastResetDate` timestamp DEFAULT (now()) NOT NULL;