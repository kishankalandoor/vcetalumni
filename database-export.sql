-- MariaDB dump 10.19  Distrib 10.4.28-MariaDB, for osx10.10 (x86_64)
--
-- Host: localhost    Database: vcet_alumni_hub
-- ------------------------------------------------------
-- Server version	10.4.28-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `comments` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `jobs`
--

DROP TABLE IF EXISTS `jobs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `jobs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `company` varchar(255) NOT NULL,
  `location` varchar(255) DEFAULT NULL,
  `job_type` enum('full-time','part-time','contract','internship') DEFAULT 'full-time',
  `description` text NOT NULL,
  `requirements` text DEFAULT NULL,
  `apply_link` varchar(500) DEFAULT NULL,
  `salary_range` varchar(100) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `is_approved` tinyint(1) DEFAULT 1,
  `expires_at` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_is_active` (`is_active`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `jobs`
--

LOCK TABLES `jobs` WRITE;
/*!40000 ALTER TABLE `jobs` DISABLE KEYS */;
INSERT INTO `jobs` VALUES (1,2,'Software Engineer','Google','Bangalore, India','full-time','Join our team to build cutting-edge cloud infrastructure. We are looking for talented engineers with strong problem-solving skills.','B.Tech in CS/IT, Strong DSA skills, Experience with Java/Python, Cloud platforms knowledge','https://careers.google.com/apply/12345','₹15-25 LPA',1,1,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(2,3,'Product Management Intern','Microsoft','Hyderabad, India','internship','Work with experienced PMs to define product roadmaps and features for Azure services.','Final year students, Strong analytical skills, Interest in product development','https://careers.microsoft.com/intern/67890','₹50,000/month',1,1,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(3,5,'Full Stack Developer','Amazon','Remote','full-time','Build scalable web applications for e-commerce platform. Work with React, Node.js, and AWS.','1-3 years experience, JavaScript, React, Node.js, AWS, MongoDB','https://amazon.jobs/apply/54321','$80,000-$120,000',1,1,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(4,4,'Embedded Systems Engineer','Tesla','California, USA','full-time','Design and develop embedded systems for vehicle automation and control.','B.Tech in ECE/EEE, C/C++, RTOS, Hardware debugging','https://tesla.com/careers/apply/98765','$90,000-$140,000',1,1,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52');
/*!40000 ALTER TABLE `jobs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `post_likes`
--

DROP TABLE IF EXISTS `post_likes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `post_likes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `post_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_like` (`post_id`,`user_id`),
  KEY `idx_post_id` (`post_id`),
  KEY `idx_user_id` (`user_id`),
  CONSTRAINT `post_likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`id`) ON DELETE CASCADE,
  CONSTRAINT `post_likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `post_likes`
--

LOCK TABLES `post_likes` WRITE;
/*!40000 ALTER TABLE `post_likes` DISABLE KEYS */;
/*!40000 ALTER TABLE `post_likes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `posts`
--

DROP TABLE IF EXISTS `posts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `posts` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `content` text NOT NULL,
  `image` varchar(255) DEFAULT NULL,
  `post_type` enum('update','achievement','event') DEFAULT 'update',
  `is_approved` tinyint(1) DEFAULT 1,
  `likes_count` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_is_approved` (`is_approved`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `posts`
--

LOCK TABLES `posts` WRITE;
/*!40000 ALTER TABLE `posts` DISABLE KEYS */;
INSERT INTO `posts` VALUES (1,2,'Excited to share that our team just launched a new AI-powered feature at Google! Proud moment for VCET alumni. 🚀',NULL,'achievement',1,15,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(2,3,'Looking for talented graduates for our new office in Hyderabad. VCET students are always welcome to apply!',NULL,'update',1,8,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(3,4,'Just completed a major milestone in autonomous vehicle development. The skills I learned at VCET laid the foundation for this journey.',NULL,'achievement',1,22,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(4,5,'Anyone interested in learning React? Happy to conduct a virtual session for current students. DM me!',NULL,'update',1,12,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(5,6,'Throwback to VCET days! Missing the campus and the amazing faculty. Forever grateful for the education I received.',NULL,'update',1,18,'2025-11-15 16:19:52','2025-11-15 16:19:52');
/*!40000 ALTER TABLE `posts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `profiles`
--

DROP TABLE IF EXISTS `profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `profiles` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(10) unsigned NOT NULL,
  `batch_year` year(4) DEFAULT NULL,
  `department` varchar(100) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `designation` varchar(255) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `contact_email` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(500) DEFAULT NULL,
  `github_url` varchar(500) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_batch_year` (`batch_year`),
  KEY `idx_department` (`department`),
  KEY `idx_company` (`company`),
  CONSTRAINT `profiles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `profiles`
--

LOCK TABLES `profiles` WRITE;
/*!40000 ALTER TABLE `profiles` DISABLE KEYS */;
INSERT INTO `profiles` VALUES (1,2,2018,'Computer Science','Google','Senior Software Engineer','Java, Python, Cloud Computing, Machine Learning','Passionate about building scalable systems and mentoring juniors.','rajesh.kumar@gmail.com','https://linkedin.com/in/rajeshkumar','https://github.com/rajeshkumar',NULL,'Bangalore, India','+91-9876543210','2025-11-15 16:19:52','2025-11-15 16:19:52'),(2,3,2019,'Information Technology','Microsoft','Product Manager','Product Management, Agile, UX Design, Azure','Leading product development for cloud solutions. Love connecting with VCET students!','priya.sharma@gmail.com','https://linkedin.com/in/priyasharma',NULL,NULL,'Hyderabad, India','+91-9876543211','2025-11-15 16:19:52','2025-11-15 16:19:52'),(3,4,2017,'Electronics','Tesla','Hardware Engineer','Embedded Systems, IoT, C++, PCB Design','Working on next-gen autonomous vehicle technology.','amit.patel@gmail.com','https://linkedin.com/in/amitpatel','https://github.com/amitpatel',NULL,'California, USA','+1-4155551234','2025-11-15 16:19:52','2025-11-15 16:19:52'),(4,5,2020,'Computer Science','Amazon','Software Development Engineer','JavaScript, React, Node.js, AWS, MongoDB','Full-stack developer with focus on e-commerce platforms.','sneha.reddy@gmail.com','https://linkedin.com/in/snehareddy','https://github.com/snehareddy',NULL,'Seattle, USA','+1-2065551234','2025-11-15 16:19:52','2025-11-15 16:19:52'),(5,6,2016,'Mechanical','SpaceX','Propulsion Engineer','CAD, Fluid Dynamics, Python, Simulation','Designing rocket engines for Mars missions!','vikram.singh@gmail.com','https://linkedin.com/in/vikramsingh',NULL,NULL,'Texas, USA','+1-3105551234','2025-11-15 16:19:52','2025-11-15 16:19:52'),(6,9,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-15 16:22:20','2025-11-15 16:22:20'),(7,10,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'2025-11-15 16:34:00','2025-11-15 16:34:00');
/*!40000 ALTER TABLE `profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` enum('student','alumni','admin') DEFAULT 'student',
  `is_active` tinyint(1) DEFAULT 1,
  `email_verified` tinyint(1) DEFAULT 0,
  `reset_token` varchar(100) DEFAULT NULL,
  `reset_token_expiry` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`role`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin@vcet.edu','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Admin VCET','admin',1,1,NULL,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(2,'rajesh.kumar@gmail.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Rajesh Kumar','alumni',1,1,NULL,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(3,'priya.sharma@gmail.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Priya Sharma','alumni',1,1,NULL,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(4,'amit.patel@gmail.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Amit Patel','alumni',1,1,NULL,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(5,'sneha.reddy@gmail.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Sneha Reddy','alumni',1,1,NULL,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(6,'vikram.singh@gmail.com','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Vikram Singh','alumni',1,1,NULL,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(7,'student1@vcet.edu','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Anil Kumar','student',1,1,NULL,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(8,'student2@vcet.edu','$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','Pooja Mehta','student',1,1,NULL,NULL,'2025-11-15 16:19:52','2025-11-15 16:19:52'),(9,'demo@demo.demo','$2y$10$D0BeCWbC9zcAdjLERr4Hs.b.sTtlbvfAYzYyAzNqKErGfSqvabT16','Demo','student',1,0,NULL,NULL,'2025-11-15 16:22:20','2025-11-15 16:22:20'),(10,'prabhodabayadi@gmail.com','$2y$10$fdtdT3Fhxnsb/RT.s1qWfe9qCnnZVPR8OE4vqSsRZTfbFdSmF7tt.','prabhodabayadi','student',1,0,NULL,NULL,'2025-11-15 16:34:00','2025-11-15 16:34:00');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-16 12:00:50
