-- MySQL dump 10.13  Distrib 5.7.24, for osx10.9 (x86_64)
--
-- Host: 127.0.0.1    Database: techbridge_db
-- ------------------------------------------------------
-- Server version	8.0.23

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `availability`
--

DROP TABLE IF EXISTS `availability`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `availability` (
  `listing_id` bigint unsigned NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  KEY `availability_listing_id_foreign` (`listing_id`),
  CONSTRAINT `availability_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listing` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `availability`
--

/*!40000 ALTER TABLE `availability` DISABLE KEYS */;
INSERT INTO `availability` VALUES (322,'2025-05-15','2025-05-22');
/*!40000 ALTER TABLE `availability` ENABLE KEYS */;

--
-- Table structure for table `cache`
--

DROP TABLE IF EXISTS `cache`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `value` mediumtext COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache`
--

/*!40000 ALTER TABLE `cache` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache` ENABLE KEYS */;

--
-- Table structure for table `cache_locks`
--

DROP TABLE IF EXISTS `cache_locks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `cache_locks` (
  `key` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `owner` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration` int NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cache_locks`
--

/*!40000 ALTER TABLE `cache_locks` DISABLE KEYS */;
/*!40000 ALTER TABLE `cache_locks` ENABLE KEYS */;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `category` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Gaming & eSports'),(2,'Photo & Vidéo'),(3,'Audio Professionnel'),(4,'Drones & Accessoires'),(5,'Projecteurs & Écrans'),(6,'Ordinateurs & Tablettes'),(7,'Équipement VR/AR'),(8,'Objets Connectés (Maison)'),(9,'Kits Robotique & Éducatif'),(10,'Imprimantes 3D & Scanners'),(11,'Instruments de Musique Électroniques');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;

--
-- Table structure for table `city`
--

DROP TABLE IF EXISTS `city`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `city` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

/*!40000 ALTER TABLE `city` DISABLE KEYS */;
INSERT INTO `city` VALUES (1,'Casablanca'),(2,'Rabat'),(3,'Marrakech'),(4,'Tanger'),(5,'Agadir'),(6,'Fès'),(7,'Meknès'),(8,'Oujda'),(9,'Tétouan'),(10,'Laâyoune'),(11,'Ttouan');
/*!40000 ALTER TABLE `city` ENABLE KEYS */;

--
-- Table structure for table `image`
--

DROP TABLE IF EXISTS `image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `image` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `listing_id` bigint unsigned NOT NULL,
  `url` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `image_listing_id_foreign` (`listing_id`),
  CONSTRAINT `image_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listing` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

/*!40000 ALTER TABLE `image` DISABLE KEYS */;
INSERT INTO `image` VALUES (8,322,'images/NtbA7syNm0mOT4Q4NFusHFVaUoJtoOo0zBLSaTtU.jpg');
/*!40000 ALTER TABLE `image` ENABLE KEYS */;

--
-- Table structure for table `listing`
--

DROP TABLE IF EXISTS `listing`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `listing` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `partner_id` bigint unsigned NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `price_per_day` decimal(8,2) NOT NULL,
  `status` enum('active','archived','inactive') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'active',
  `is_premium` tinyint(1) NOT NULL DEFAULT '0',
  `premium_start_date` datetime DEFAULT NULL,
  `city_id` bigint unsigned DEFAULT NULL,
  `premium_end_date` datetime DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `delivery_option` tinyint(1) NOT NULL DEFAULT '0',
  `equipment_rating` decimal(8,2) DEFAULT NULL,
  `category_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `listing_partner_id_foreign` (`partner_id`),
  KEY `listing_city_id_foreign` (`city_id`),
  KEY `listing_category_id_foreign` (`category_id`),
  CONSTRAINT `listing_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`) ON DELETE CASCADE,
  CONSTRAINT `listing_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`) ON DELETE CASCADE,
  CONSTRAINT `listing_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=323 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing`
--

/*!40000 ALTER TABLE `listing` DISABLE KEYS */;
INSERT INTO `listing` VALUES (322,111,'retest','desc test',99.00,'active',1,'2025-05-13 16:06:22',NULL,'2025-05-28 16:06:22','2025-05-13 16:06:22',1,NULL,2);
/*!40000 ALTER TABLE `listing` ENABLE KEYS */;

--
-- Table structure for table `migrations`
--

DROP TABLE IF EXISTS `migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `migrations` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `migrations`
--

/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (17,'2019_12_14_000001_create_personal_access_tokens_table',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;

--
-- Table structure for table `notification`
--

DROP TABLE IF EXISTS `notification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `notification` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `user_id` bigint unsigned NOT NULL,
  `type` enum('reservation','review','reminder','system') COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_read` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `notification_user_id_foreign` (`user_id`),
  CONSTRAINT `notification_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notification`
--

/*!40000 ALTER TABLE `notification` DISABLE KEYS */;
/*!40000 ALTER TABLE `notification` ENABLE KEYS */;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `payment` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `amount` decimal(8,2) NOT NULL,
  `commission_fee` decimal(8,2) NOT NULL,
  `partner_payout` decimal(8,2) NOT NULL,
  `payment_date` datetime NOT NULL,
  `status` enum('completed','refunded') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_method` enum('credit_card','paypal') COLLATE utf8mb4_unicode_ci NOT NULL,
  `transaction_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `client_id` bigint unsigned NOT NULL,
  `reservation_id` bigint unsigned NOT NULL,
  `partner_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `payment_client_id_foreign` (`client_id`),
  KEY `payment_reservation_id_foreign` (`reservation_id`),
  KEY `payment_partner_id_foreign` (`partner_id`),
  CONSTRAINT `payment_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payment_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `payment_reservation_id_foreign` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;

--
-- Table structure for table `personal_access_tokens`
--

DROP TABLE IF EXISTS `personal_access_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `personal_access_tokens` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `tokenable_type` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tokenable_id` bigint unsigned NOT NULL,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `abilities` text COLLATE utf8mb4_unicode_ci,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `personal_access_tokens`
--

/*!40000 ALTER TABLE `personal_access_tokens` DISABLE KEYS */;
INSERT INTO `personal_access_tokens` VALUES (1,'App\\Models\\User',109,'auth_token','cdd704b8c4ae66cc93b6b91479dddc48f882b9b471ea7353acc4c146fe63d9c9','[\"*\"]',NULL,NULL,'2025-05-13 12:08:21','2025-05-13 12:08:21'),(2,'App\\Models\\User',110,'auth_token','1e60479b66d3532506b8d00a376a3224051c642d8a0ac29d966a54fe4a361eb1','[\"*\"]',NULL,NULL,'2025-05-13 12:14:07','2025-05-13 12:14:07'),(3,'App\\Models\\User',110,'auth_token','bca5300117dd7227223967c402a9faf52c884b2c790f91735fe4525391a156da','[\"*\"]',NULL,NULL,'2025-05-13 12:36:53','2025-05-13 12:36:53'),(4,'App\\Models\\User',111,'auth_token','3f956bdade5c9a2991adaa797c4182729fe7e0f802041104ea7b31dc5aca95ba','[\"*\"]','2025-05-13 17:51:00',NULL,'2025-05-13 13:48:53','2025-05-13 17:51:00');
/*!40000 ALTER TABLE `personal_access_tokens` ENABLE KEYS */;

--
-- Table structure for table `reservation`
--

DROP TABLE IF EXISTS `reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reservation` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `total_cost` decimal(8,2) NOT NULL,
  `status` enum('pending','confirmed','ongoing','canceled','completed','declined') COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `contract_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `delivery_option` tinyint(1) NOT NULL DEFAULT '0',
  `client_id` bigint unsigned NOT NULL,
  `partner_id` bigint unsigned NOT NULL,
  `listing_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `reservation_client_id_foreign` (`client_id`),
  KEY `reservation_partner_id_foreign` (`partner_id`),
  KEY `reservation_listing_id_foreign` (`listing_id`),
  CONSTRAINT `reservation_client_id_foreign` FOREIGN KEY (`client_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservation_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listing` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reservation_partner_id_foreign` FOREIGN KEY (`partner_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
INSERT INTO `reservation` VALUES (1,'2025-05-11 00:00:00','2025-05-12 00:00:00',297.00,'completed',NULL,'2025-05-13 16:36:38',1,111,111,322),(2,'2025-05-20 00:00:00','2025-05-21 00:00:00',198.00,'canceled',NULL,'2025-05-13 17:33:09',1,111,111,322),(3,'2025-05-11 00:00:00','2025-05-12 00:00:00',198.00,'completed',NULL,'2025-05-13 17:36:07',1,111,111,322),(4,'2025-05-15 00:00:00','2025-05-18 00:00:00',396.00,'pending',NULL,'2025-05-13 18:53:03',1,111,111,322);
/*!40000 ALTER TABLE `reservation` ENABLE KEYS */;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `reservation_id` bigint unsigned NOT NULL,
  `reviewer_id` bigint unsigned NOT NULL,
  `reviewee_id` bigint unsigned NOT NULL,
  `rating` int NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_visible` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL,
  `type` enum('forObject','forClient','forPartner') COLLATE utf8mb4_unicode_ci NOT NULL,
  `listing_id` bigint unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `review_reservation_id_foreign` (`reservation_id`),
  KEY `review_reviewer_id_foreign` (`reviewer_id`),
  KEY `review_reviewee_id_foreign` (`reviewee_id`),
  KEY `review_listing_id_foreign` (`listing_id`),
  CONSTRAINT `review_listing_id_foreign` FOREIGN KEY (`listing_id`) REFERENCES `listing` (`id`) ON DELETE CASCADE,
  CONSTRAINT `review_reservation_id_foreign` FOREIGN KEY (`reservation_id`) REFERENCES `reservation` (`id`) ON DELETE CASCADE,
  CONSTRAINT `review_reviewee_id_foreign` FOREIGN KEY (`reviewee_id`) REFERENCES `user` (`id`) ON DELETE CASCADE,
  CONSTRAINT `review_reviewer_id_foreign` FOREIGN KEY (`reviewer_id`) REFERENCES `user` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (1,1,111,111,2,'nnuhbk',1,'2025-05-13 17:15:59','forClient',322),(2,3,111,111,4,'kuyhjbl',1,'2025-05-13 18:38:17','forPartner',322),(3,3,111,111,3,'yihtkgjvhb,',0,'2025-05-13 18:38:18','forObject',322);
/*!40000 ALTER TABLE `review` ENABLE KEYS */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `firstname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lastname` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_partner` tinyint(1) DEFAULT '0',
  `avatar_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `join_date` datetime NOT NULL,
  `client_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `client_reviews` int NOT NULL DEFAULT '0',
  `partner_rating` decimal(3,2) NOT NULL DEFAULT '0.00',
  `partner_reviews` int NOT NULL DEFAULT '0',
  `longitude` double DEFAULT NULL,
  `latitude` double DEFAULT NULL,
  `city_id` bigint unsigned NOT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_email_unique` (`email`),
  KEY `user_city_id_foreign` (`city_id`),
  CONSTRAINT `user_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `city` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=112 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (101,'FatimaZDev','Fatima Zahra','El Alaoui','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','fatima.elalaoui@example.ma','0661000101','12 Rue de la Liberté, Maârif, Casablanca','USER',1,'','2023-01-15 10:00:00',4.80,15,4.90,25,-7.6187,33.5951,1,NULL,'2023-01-15 09:00:00','2023-01-15 09:00:00'),(102,'MedCoder','Mohammed','Bennani','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','mohammed.bennani@example.ma','0662000202','34 Avenue Hassan II, Agdal, Rabat','USER',1,'','2023-02-20 11:30:00',4.50,10,4.70,18,-6.8498,34.020882,2,NULL,'2023-02-20 10:30:00','2023-02-20 10:30:00'),(103,'YoussefTech','Youssef','Cherkaoui','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','youssef.cherkaoui@example.ma','0663000303','56 Boulevard Mohammed V, Gueliz, Marrakech','USER',1,'','2023-03-10 09:15:00',4.20,8,4.50,12,-7.981084,31.629472,3,NULL,'2023-03-10 08:15:00','2023-03-10 08:15:00'),(104,'AminaConnect','Amina','Saidi','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','amina.saidi@example.ma','0664000404','78 Rue de Paris, Centre Ville, Tanger','USER',1,'','2023-04-05 14:00:00',4.90,20,4.80,22,-5.80777,35.77607,4,NULL,'2023-04-05 14:00:00','2023-04-05 14:00:00'),(111,'KIHLYouns','KIHL','Younes','$2y$12$hsO9Zjg.30W5q5lo5PkpIOqCUJcIcMXqsPrNVz6KcdFOJP7B/h7QS','kihalyouns@gmail.com','0638742013','test desc','USER',1,NULL,'2025-05-13 14:48:52',2.00,1,4.00,1,-5.364451,35.562199,11,NULL,NULL,NULL);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;

--
-- Dumping routines for database 'techbridge_db'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-13 23:27:13
