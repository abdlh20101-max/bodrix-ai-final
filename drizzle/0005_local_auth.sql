-- Add local auth columns to users table
ALTER TABLE `users` ADD COLUMN `username` varchar(64) NULL UNIQUE;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `passwordHash` varchar(255) NULL;
--> statement-breakpoint
ALTER TABLE `users` ADD COLUMN `phone` varchar(20) NULL UNIQUE;
--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `openId` varchar(128) NOT NULL;
