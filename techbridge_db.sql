-- MySQL dump 10.13  Distrib 5.7.24, for osx10.9 (x86_64)
--
-- Host: 127.0.0.1    Database: techbridge_db
-- ------------------------------------------------------
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

/*!40000 ALTER TABLE `category` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `city`
--

/*!40000 ALTER TABLE `city` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `image`
--

/*!40000 ALTER TABLE `image` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `listing`
--

/*!40000 ALTER TABLE `listing` DISABLE KEYS */;
/*!40000 ALTER TABLE `listing` ENABLE KEYS */;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reservation`
--

/*!40000 ALTER TABLE `reservation` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

/*!40000 ALTER TABLE `review` DISABLE KEYS */;
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
  `address` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('USER','ADMIN') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_partner` tinyint(1) NOT NULL DEFAULT '0',
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;



INSERT INTO `user` (`id`, `username`, `firstname`, `lastname`, `password`, `email`, `phone_number`, `address`, `role`, `is_partner`, `avatar_url`, `join_date`, `client_rating`, `client_reviews`, `partner_rating`, `partner_reviews`, `longitude`, `latitude`, `city_id`, `remember_token`, `created_at`, `updated_at`) VALUES
(101, 'FatimaZDev', 'Fatima Zahra', 'El Alaoui', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'fatima.elalaoui@example.ma', '0661000101', '12 Rue de la Liberté, Maârif, Casablanca', 'USER', 1, 'assets/images/avatars/fatima.jpg', '2023-01-15 10:00:00', 4.80, 15, 4.90, 25, -7.618700, 33.595100, 1, NULL, '2023-01-15 10:00:00', '2023-01-15 10:00:00'),
(102, 'MedCoder', 'Mohammed', 'Bennani', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'mohammed.bennani@example.ma', '0662000202', '34 Avenue Hassan II, Agdal, Rabat', 'USER', 1, 'assets/images/avatars/mohammed.jpg', '2023-02-20 11:30:00', 4.50, 10, 4.70, 18, -6.849800, 34.020882, 2, NULL, '2023-02-20 11:30:00', '2023-02-20 11:30:00'),
(103, 'YoussefTech', 'Youssef', 'Cherkaoui', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'youssef.cherkaoui@example.ma', '0663000303', '56 Boulevard Mohammed V, Gueliz, Marrakech', 'USER', 1, 'assets/images/avatars/youssef.jpg', '2023-03-10 09:15:00', 4.20, 8, 4.50, 12, -7.981084, 31.629472, 3, NULL, '2023-03-10 09:15:00', '2023-03-10 09:15:00'),
(104, 'AminaConnect', 'Amina', 'Saidi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'amina.saidi@example.ma', '0664000404', '78 Rue de Paris, Centre Ville, Tanger', 'USER', 1, 'assets/images/avatars/amina.jpg', '2023-04-05 14:00:00', 4.90, 20, 4.80, 22, -5.807770, 35.776070, 4, NULL, '2023-04-05 14:00:00', '2023-04-05 14:00:00'),
(105, 'OmarInnovate', 'Omar', 'Tazi', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'omar.tazi@example.ma', '0665000505', '90 Avenue des FAR, Secteur Touristique, Agadir', 'USER', 1, 'assets/images/avatars/omar.jpg', '2023-05-01 08:45:00', 4.60, 12, 4.60, 15, -9.598107, 30.420970, 5, NULL, '2023-05-01 08:45:00', '2023-05-01 08:45:00');

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'Gaming & eSports'),
(2, 'Photo & Vidéo'),
(3, 'Audio Professionnel'),
(4, 'Drones & Accessoires'),
(5, 'Projecteurs & Écrans'),
(6, 'Ordinateurs & Tablettes'),
(7, 'Équipement VR/AR'),
(8, 'Objets Connectés (Maison)'),
(9, 'Kits Robotique & Éducatif'),
(10, 'Imprimantes 3D & Scanners'),
(11, 'Instruments de Musique Électroniques');

INSERT INTO `city` (`id`, `name`) VALUES
(1, 'Casablanca'),
(2, 'Rabat'),
(3, 'Marrakech'),
(4, 'Tanger'),
(5, 'Agadir'),
(6, 'Fès'),
(7, 'Meknès'),
(8, 'Oujda'),
(9, 'Tétouan'),
(10, 'Laâyoune');


INSERT INTO `listing` (`id`, `partner_id`, `title`, `description`, `price_per_day`, `status`, `is_premium`, `premium_start_date`, `premium_end_date`, `created_at`, `delivery_option`, `equipment_rating`, `category_id`, `city_id`) VALUES
(301, 101, 'Casque VR Pro avec Contrôleurs', 'Expérience VR immersive ultime pour jeux et applications professionnelles. Léger et confortable.', 450.00, 'active', 1, '2025-05-01 00:00:00', '2025-05-31 23:59:59', '2025-04-15 10:00:00', 1, 4.80, 7, 1),
(302, 102, 'Drone DJI Mavic Air 3 avec Fly More Combo', 'Drone compact et puissant, parfait pour les voyages et la capture d''images aériennes 4K HDR.', 700.00, 'active', 0, NULL, NULL, '2025-03-20 14:30:00', 1, 4.90, 4, 2),
(303, 103, 'Enceinte Bluetooth Pro Sound System', 'Qualité sonore exceptionnelle pour événements, fêtes ou usage professionnel. Grande autonomie.', 300.00, 'inactive', 0, NULL, NULL, '2025-02-10 09:00:00', 0, 4.50, 3, 3), -- Status changed to 'inactive' (was 'paused')
(304, 104, 'Kit Éclairage Photo Studio Complet', 'Softbox, parapluies, trépieds et fonds. Idéal pour photographes et vidéastes.', 550.00, 'active', 1, '2025-04-20 00:00:00', '2025-05-20 23:59:59', '2025-01-25 12:10:00', 1, 4.70, 2, 4),
(305, 105, 'Console Gaming Next-Gen + 2 Manettes', 'Plongez dans le futur du jeu vidéo avec cette console surpuissante. Inclus deux manettes et un jeu populaire.', 600.00, 'archived', 0, NULL, NULL, '2024-12-01 18:00:00', 0, 4.90, 1, 5),
(306, 101, 'Imprimante 3D Haute Résolution', 'Pour prototypage rapide et création d''objets personnalisés. Facile à utiliser, grand volume d''impression.', 800.00, 'active', 1, '2025-05-10 00:00:00', '2025-06-10 23:59:59', '2025-04-01 11:00:00', 1, 4.60, 10, 6),
(307, 102, 'MacBook Pro 16 M3 Max', 'Puissance et portabilité extrêmes pour professionnels de la création. Écran Liquid Retina XDR.', 1200.00, 'active', 0, NULL, NULL, '2025-05-01 08:00:00', 1, 5.00, 6, 9),
(308, 103, 'VidéoProjecteur 4K Home Cinema', 'Transformez votre salon en salle de cinéma. Haute luminosité et contraste. Compatible 3D.', 650.00, 'active', 0, NULL, NULL, '2025-03-10 16:00:00', 0, 4.40, 5, 7),
(309, 104, 'Synthétiseur Moog Matriarch', 'Synthétiseur analogique semi-modulaire paraphonique. Sonorités riches et possibilités infinies.', 900.00, 'inactive', 1, '2025-01-01 00:00:00', '2025-01-31 23:59:59', '2024-11-15 13:00:00', 1, 4.90, 11, 8), -- Status changed to 'inactive'
(310, 105, 'Kit Robotique Éducatif Avancé', 'Apprenez la programmation et la robotique avec ce kit complet. Capteurs, moteurs, et microcontrôleur inclus.', 250.00, 'active', 0, NULL, NULL, '2025-04-22 10:20:00', 0, 4.30, 9, 10),
(311, 101, 'GoPro HERO 12 Black', 'Caméra d''action robuste et étanche. Vidéo 5.3K60, stabilisation HyperSmooth 6.0.', 350.00, 'active', 1, '2025-05-11 00:00:00', '2025-06-11 23:59:59', '2025-05-01 00:00:00', 1, 4.90, 2, 1),
(312, 102, 'Tablette Graphique Pro Wacom Intuos', 'Pour artistes numériques et designers. Grande surface active, stylet précis.', 280.00, 'active', 0, NULL, NULL, '2025-02-15 11:00:00', 0, 4.60, 6, 2),
(313, 103, 'Système d''éclairage intelligent Philips Hue', 'Pack de démarrage avec pont et 3 ampoules couleur. Contrôlez l''ambiance lumineuse avec votre voix ou smartphone.', 150.00, 'active', 0, NULL, NULL, '2025-04-30 13:45:00', 1, 4.70, 8, 3),
(314, 104, 'Microphone Pro Rode NT-USB+', 'Microphone USB de qualité studio pour podcasting, streaming, et enregistrement vocal. Filtre anti-pop inclus.', 200.00, 'archived', 0, NULL, NULL, '2025-01-10 17:00:00', 1, 4.80, 3, 4),
(315, 105, 'Nintendo Switch OLED + Mario Kart 8', 'Console portable et de salon avec écran OLED vibrant. Parfait pour jouer en déplacement ou à la maison.', 400.00, 'active', 1, '2025-03-01 00:00:00', '2025-03-15 23:59:59', '2025-02-20 12:00:00', 1, 4.70, 1, 5);

INSERT INTO `availability` (`listing_id`, `start_date`, `end_date`) VALUES
(301, '2025-06-01', '2025-06-15'),
(301, '2025-07-01', '2025-07-31'),
(302, '2025-05-20', '2025-05-30'),
(302, '2025-06-10', '2025-06-25'),
(303, '2025-08-01', '2025-08-10'),
(304, '2025-06-05', '2025-06-15'),
(304, '2025-07-01', '2025-07-10'),
-- No availability for listing 305 (archived)
(306, '2025-07-01', '2025-07-15'),
(306, '2025-08-01', '2025-08-31'),
(307, '2025-05-15', '2025-05-25'),
(307, '2025-06-01', '2025-06-30'),
(308, '2025-06-20', '2025-07-05'),
(309, '2025-09-01', '2025-09-30'),
(310, '2025-05-15', '2025-08-15'),
(311, '2025-05-12', '2025-05-19'),
(311, '2025-06-01', '2025-06-30'),
(312, '2025-07-10', '2025-07-20'),
(313, '2025-05-15', '2025-05-30'),
(313, '2025-06-10', '2025-06-20'),
-- No availability for listing 314 (archived)
(315, '2025-06-01', '2025-06-07'),
(315, '2025-06-15', '2025-06-22');