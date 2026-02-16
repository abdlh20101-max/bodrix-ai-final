CREATE TABLE `bankSettings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bankName` varchar(100) NOT NULL,
	`accountName` varchar(100) NOT NULL,
	`accountNumber` varchar(50) NOT NULL,
	`ibanNumber` varchar(50) NOT NULL,
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bankSettings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `walletTransactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`walletId` int NOT NULL,
	`userId` int NOT NULL,
	`type` enum('deposit','withdrawal','purchase','refund','bonus') NOT NULL,
	`amount` varchar(20) NOT NULL,
	`description` text,
	`status` enum('pending','completed','failed','cancelled') NOT NULL DEFAULT 'pending',
	`transactionId` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `walletTransactions_id` PRIMARY KEY(`id`),
	CONSTRAINT `walletTransactions_transactionId_unique` UNIQUE(`transactionId`)
);
--> statement-breakpoint
CREATE TABLE `wallets` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`balance` varchar(20) NOT NULL DEFAULT '0.00',
	`totalDeposited` varchar(20) NOT NULL DEFAULT '0.00',
	`totalSpent` varchar(20) NOT NULL DEFAULT '0.00',
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `wallets_id` PRIMARY KEY(`id`),
	CONSTRAINT `wallets_userId_unique` UNIQUE(`userId`)
);
