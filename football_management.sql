-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Apr 21, 2026 at 09:54 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `football_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `arbitres`
--

CREATE TABLE `arbitres` (
  `id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `postnom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `licence` varchar(20) DEFAULT NULL,
  `categorie` varchar(20) DEFAULT NULL,
  `region` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `arbitres`
--

INSERT INTO `arbitres` (`id`, `user_id`, `nom`, `postnom`, `prenom`, `licence`, `categorie`, `region`, `created_at`, `updated_at`) VALUES
(1, NULL, 'Mbuyi', 'Kabongo', 'Jean', 'ARB001', 'National', 'Kinshasa', '2026-04-13 22:18:49', '2026-04-13 22:18:49');

-- --------------------------------------------------------

--
-- Table structure for table `classements`
--

CREATE TABLE `classements` (
  `id` int NOT NULL,
  `competition_id` int NOT NULL,
  `club_id` int NOT NULL,
  `equipe` varchar(255) NOT NULL,
  `matchs_joues` int DEFAULT '0',
  `victoires` int DEFAULT '0',
  `nuls` int DEFAULT '0',
  `defaites` int DEFAULT '0',
  `buts_pour` int DEFAULT '0',
  `buts_contre` int DEFAULT '0',
  `diff_buts` int DEFAULT '0',
  `points` int DEFAULT '0',
  `forme` varchar(10) DEFAULT '',
  `saison` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `classements`
--

INSERT INTO `classements` (`id`, `competition_id`, `club_id`, `equipe`, `matchs_joues`, `victoires`, `nuls`, `defaites`, `buts_pour`, `buts_contre`, `diff_buts`, `points`, `forme`, `saison`, `created_at`, `updated_at`) VALUES
(1, 2, 0, 'AS VITA CLUB', 1, 0, 0, 1, 0, 1, -1, 0, 'D', '2026-2027', '2026-04-18 21:35:24', '2026-04-21 09:48:43'),
(2, 1, 0, 'AS VITA CLUB', 3, 1, 1, 1, 4, 5, -1, 4, 'VND', '2026-2027', '2026-04-18 21:35:24', '2026-04-21 09:48:43'),
(3, 1, 0, 'Virunga Sport', 2, 0, 1, 1, 1, 3, -2, 1, 'DN', '2026-2027', '2026-04-18 21:35:24', '2026-04-21 09:48:43'),
(11, 3, 2, 'AS VITA CLUB', 1, 0, 0, 1, 2, 4, -2, 0, 'D', '2026-2027', '2026-04-18 23:28:47', '2026-04-21 09:48:43'),
(57, 3, 3, 'Mazembe', 0, 0, 0, 0, 0, 0, 0, 0, '', '2026-2027', '2026-04-19 16:28:10', '2026-04-21 09:48:43'),
(58, 3, 1, 'Virunga Sport', 1, 1, 0, 0, 4, 2, 2, 3, 'V', '2026-2027', '2026-04-19 16:28:10', '2026-04-21 09:48:43'),
(60, 2, 3, 'Mazembe', 1, 1, 0, 0, 1, 0, 1, 3, 'V', '2026-2027', '2026-04-19 16:43:46', '2026-04-21 09:48:43');

-- --------------------------------------------------------

--
-- Table structure for table `clubs`
--

CREATE TABLE `clubs` (
  `id` int NOT NULL,
  `nom_club` varchar(100) NOT NULL,
  `sigle` varchar(10) NOT NULL,
  `date_creation` date DEFAULT NULL,
  `ville` varchar(100) NOT NULL,
  `province` varchar(100) DEFAULT NULL,
  `stade` varchar(100) DEFAULT NULL,
  `couleurs` varchar(50) DEFAULT NULL,
  `logo` longtext,
  `president` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `division` int DEFAULT '1',
  `statut` varchar(20) DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `clubs`
--

INSERT INTO `clubs` (`id`, `nom_club`, `sigle`, `date_creation`, `ville`, `province`, `stade`, `couleurs`, `logo`, `president`, `telephone`, `email`, `division`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'Virunga Sport', 'VS', '1945-01-02', 'Goma', 'Nord-Kivu', 'De l\'unite', 'Vert-Noire', 'data:image/jpeg;base64,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', 'Joseph Kabila', '0977742669', 'joseph@gmail.com', 1, 'actif', '2026-04-12 09:06:29', '2026-04-12 09:43:02'),
(2, 'AS VITA CLUB', 'ASV ', '1900-01-01', 'Goma', 'Nord-Kivu ', 'De l\'unite', ' vert-black', 'data:image/jpeg;base64,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', 'Eliel ', NULL, 'eliel@gmail.com', 1, 'actif', '2026-04-12 09:30:10', '2026-04-12 09:30:10'),
(3, 'Mazembe', 'TPM', '1978-01-01', 'Kinshasa', 'Kinshasa', 'Martyrs', 'Noire-Blanc', NULL, 'Promesse musay', '0998546777', 'promessemusay@gmail.com', 1, 'actif', '2026-04-13 23:39:49', '2026-04-13 23:39:49');

-- --------------------------------------------------------

--
-- Table structure for table `competitions`
--

CREATE TABLE `competitions` (
  `id` int NOT NULL,
  `nom_competition` varchar(100) NOT NULL,
  `type_competition` varchar(50) NOT NULL,
  `saison` varchar(10) NOT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL,
  `nombre_equipes` int DEFAULT NULL,
  `format_competition` varchar(50) DEFAULT NULL,
  `statut` varchar(20) DEFAULT 'active',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `competitions`
--

INSERT INTO `competitions` (`id`, `nom_competition`, `type_competition`, `saison`, `date_debut`, `date_fin`, `nombre_equipes`, `format_competition`, `statut`, `created_at`, `updated_at`) VALUES
(1, 'tam sport', 'championnat', '2026-2027', '2026-04-13', '2026-04-16', 2, 'elimination_directe', 'cloturee', '2026-04-13 19:31:09', '2026-04-18 20:58:12'),
(2, 'CHAN', 'coupe', '2026-2027', '2026-01-01', '2026-04-15', 5, 'poule_unique', 'active', '2026-04-13 20:45:17', '2026-04-13 20:45:17'),
(3, 'congo league', 'supercoupe', '2026-2027', '2026-04-14', '2027-04-08', 3, 'elimination_directe', 'active', '2026-04-13 23:45:51', '2026-04-13 23:45:51');

-- --------------------------------------------------------

--
-- Table structure for table `joueurs`
--

CREATE TABLE `joueurs` (
  `id` int NOT NULL,
  `club_id` int DEFAULT NULL,
  `nom` varchar(100) NOT NULL,
  `postnom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `date_naissance` date DEFAULT NULL,
  `nationalite` varchar(50) DEFAULT 'RDC',
  `numero_maillot` int DEFAULT NULL,
  `poste` varchar(50) DEFAULT NULL,
  `taille` decimal(5,2) DEFAULT NULL,
  `poids` decimal(5,2) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `date_signature` date DEFAULT NULL,
  `fin_contrat` date DEFAULT NULL,
  `statut` varchar(20) DEFAULT 'actif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `joueurs`
--

INSERT INTO `joueurs` (`id`, `club_id`, `nom`, `postnom`, `prenom`, `date_naissance`, `nationalite`, `numero_maillot`, `poste`, `taille`, `poids`, `photo`, `date_signature`, `fin_contrat`, `statut`, `created_at`, `updated_at`) VALUES
(2, 2, 'ephreme', 'kisomo', 'kamabale', '2007-02-02', 'RDC', 4, 'Défenseur', 180.00, 75.00, '', '2026-02-02', '2027-02-02', 'actif', '2026-04-12 22:54:35', '2026-04-12 22:54:35'),
(3, 2, 'king', 'kong', 'kisomo', '2003-01-01', 'RDC', 11, 'Attaquant', 175.00, 62.00, '', '2025-01-01', '2030-01-01', 'actif', '2026-04-12 22:59:50', '2026-04-12 22:59:50'),
(4, 1, 'kambale', 'kisomo', 'ephreme', '2003-04-04', 'RDC', 11, 'Attaquant', 180.00, 75.00, '', '2003-01-01', '2027-02-02', 'actif', '2026-04-12 23:01:16', '2026-04-12 23:01:16'),
(5, 2, 'Test BLACKBOXAI', 'Fixed', 'SQL', '2000-01-01', 'RDC', 99, 'Attaquant', 180.50, 75.00, '', '2024-01-01', '2025-01-01', 'actif', '2026-04-13 20:38:39', '2026-04-13 20:38:39'),
(6, 3, 'corneille', 'makasi', 'byden', '1940-01-01', 'RDC', 1, 'Gardien', 160.00, 62.00, '', '2000-01-01', '2026-05-27', 'actif', '2026-04-13 23:54:12', '2026-04-13 23:54:12'),
(7, 2, 'bakambu', 'cedrick', 'lbakagoal', '1995-01-01', 'RDC', 17, 'Attaquant', 180.00, 75.00, '', '2026-04-16', '2027-04-17', 'actif', '2026-04-16 17:43:08', '2026-04-16 17:43:08');

-- --------------------------------------------------------

--
-- Table structure for table `matchs`
--

CREATE TABLE `matchs` (
  `id` int NOT NULL,
  `competition_id` int DEFAULT NULL,
  `club_domicile_id` int DEFAULT NULL,
  `club_exterieur_id` int DEFAULT NULL,
  `journee` int DEFAULT NULL,
  `date_match` date DEFAULT NULL,
  `heure_match` time DEFAULT NULL,
  `stade` varchar(100) DEFAULT NULL,
  `arbitre_id` int DEFAULT NULL,
  `statut` varchar(20) DEFAULT 'programme',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `matchs`
--

INSERT INTO `matchs` (`id`, `competition_id`, `club_domicile_id`, `club_exterieur_id`, `journee`, `date_match`, `heure_match`, `stade`, `arbitre_id`, `statut`, `created_at`, `updated_at`) VALUES
(4, 1, 2, 1, 1, '2026-01-01', '01:00:00', 'De l\'unite', 1, 'termine', '2026-04-13 22:26:41', '2026-04-16 11:12:52'),
(5, 2, 2, 3, 1, '2026-04-17', '12:00:00', 'De l\'unite', 1, 'termine', '2026-04-16 12:51:56', '2026-04-18 21:27:00'),
(6, 1, 3, 2, 2, '2026-04-18', '13:00:00', 'Martyrs', 1, 'termine', '2026-04-16 12:52:46', '2026-04-19 16:23:28'),
(7, 1, 1, 2, 1, '2026-04-14', '15:00:00', 'Stade des Martyrs', 1, 'termine', '2026-04-16 14:09:54', '2026-04-16 15:51:56'),
(8, 3, 2, 3, 1, '2026-04-19', '22:00:00', 'de l\'unite', 1, 'termine', '2026-04-19 16:19:48', '2026-04-19 22:01:01'),
(9, 3, 3, 2, 2, '2026-04-19', '22:00:00', 'martyrs', 1, 'termine', '2026-04-19 16:21:51', '2026-04-19 22:01:01'),
(10, 3, 1, 2, 3, '2026-04-06', '13:00:00', 'martyrs', 1, 'termine', '2026-04-19 16:27:12', '2026-04-19 16:28:05'),
(11, 3, 3, 1, 4, '2026-04-20', '10:00:00', 'de l\'unite', 1, 'termine', '2026-04-19 16:29:46', '2026-04-20 18:40:29');

-- --------------------------------------------------------

--
-- Table structure for table `match_buteurs`
--

CREATE TABLE `match_buteurs` (
  `id` int NOT NULL,
  `match_id` int NOT NULL,
  `joueur_id` int NOT NULL,
  `nb_buts` int DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `participations`
--

CREATE TABLE `participations` (
  `id` int NOT NULL,
  `club_id` int DEFAULT NULL,
  `competition_id` int DEFAULT NULL,
  `date_inscription` date DEFAULT (curdate()),
  `statut_validation` varchar(20) DEFAULT 'en_attente',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `participations`
--

INSERT INTO `participations` (`id`, `club_id`, `competition_id`, `date_inscription`, `statut_validation`, `created_at`, `updated_at`) VALUES
(1, 2, 1, '2026-04-13', 'valide', '2026-04-13 20:10:50', '2026-04-13 21:22:09'),
(2, 1, 1, '2026-04-13', 'valide', '2026-04-13 20:13:40', '2026-04-13 21:22:12'),
(3, 2, 2, '2026-04-13', 'valide', '2026-04-13 20:45:38', '2026-04-13 21:22:23'),
(4, 2, 3, '2026-04-18', 'valide', '2026-04-18 19:26:07', '2026-04-18 22:51:28'),
(5, 1, 3, '2026-04-19', 'valide', '2026-04-19 16:07:46', '2026-04-19 16:16:18'),
(6, 3, 3, '2026-04-19', 'valide', '2026-04-19 16:13:10', '2026-04-19 16:16:21'),
(7, 3, 2, '2026-04-19', 'valide', '2026-04-19 16:14:37', '2026-04-19 16:16:33');

-- --------------------------------------------------------

--
-- Table structure for table `resultats`
--

CREATE TABLE `resultats` (
  `id` int NOT NULL,
  `match_id` int DEFAULT NULL,
  `buts_domicile` int DEFAULT '0',
  `buts_exterieur` int DEFAULT '0',
  `observations` text,
  `validation_officielle` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `resultats`
--

INSERT INTO `resultats` (`id`, `match_id`, `buts_domicile`, `buts_exterieur`, `observations`, `validation_officielle`, `created_at`, `updated_at`) VALUES
(1, 4, 2, 0, 'l\'ASV a donninee largement virunga ', 1, '2026-04-16 11:12:52', '2026-04-16 11:18:27'),
(2, 7, 1, 1, '', 1, '2026-04-16 15:51:56', '2026-04-16 19:33:46'),
(3, 5, 0, 1, '', 1, '2026-04-18 21:27:00', '2026-04-18 21:27:05'),
(4, 6, 4, 1, 'Mzembe est trop fort ', 1, '2026-04-19 16:23:28', '2026-04-19 16:23:37'),
(5, 10, 4, 2, '', 1, '2026-04-19 16:28:05', '2026-04-19 16:28:10');

-- --------------------------------------------------------

--
-- Table structure for table `trophees`
--

CREATE TABLE `trophees` (
  `id` int NOT NULL,
  `nom_trophee` varchar(100) NOT NULL,
  `type_trophee` varchar(50) NOT NULL,
  `description` text,
  `competition_id` int DEFAULT NULL,
  `club_gagnant_id` int DEFAULT NULL,
  `joueur_gagnant_id` int DEFAULT NULL,
  `date_remise` date DEFAULT NULL,
  `lieu_remise` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `attribue_par` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `trophees`
--

INSERT INTO `trophees` (`id`, `nom_trophee`, `type_trophee`, `description`, `competition_id`, `club_gagnant_id`, `joueur_gagnant_id`, `date_remise`, `lieu_remise`, `created_at`, `updated_at`, `attribue_par`) VALUES
(1, '🏆 Champion 2026-2027', 'championnat', NULL, 1, 2, NULL, '2026-04-19', NULL, '2026-04-19 02:07:19', '2026-04-19 02:07:19', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` varchar(20) NOT NULL DEFAULT 'visiteur',
  `nom` varchar(100) DEFAULT NULL,
  `prenom` varchar(100) DEFAULT NULL,
  `telephone` varchar(20) DEFAULT NULL,
  `avatar` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `club_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password_hash`, `role`, `nom`, `prenom`, `telephone`, `avatar`, `is_active`, `club_id`, `created_at`, `updated_at`) VALUES
(1, 'superadmin', 'admin@football.com', '$2a$10$IoVTnxdbL1HlzUqTe0v0BOvo.F2wFVpG0Bl5TL4oSC1h.vrlT0y/G', 'super_admin', 'Administrateur', 'Principal', NULL, NULL, 1, NULL, '2026-04-09 18:52:32', '2026-04-09 18:52:32'),
(2, 'admin_sportif', 'admin@sport.com', '$2a$10$7.HzpEJfEk2LEWzqR6CvIusit2b3MTMtBUys8aiuYK4EHtvtBFnW6', 'admin_sportif', 'Admin', 'Sportif', NULL, NULL, 1, NULL, '2026-04-09 18:52:32', '2026-04-09 18:52:32'),
(3, 'resp_ocjs', 'ocjs@club.com', '$2a$10$/50LGCwpU/R.TqpsQ914g.zWLITACwrR6oIgwAvD37A9obHN.qWgC', 'responsable_club', 'Responsable', 'Club', NULL, NULL, 1, NULL, '2026-04-09 18:52:32', '2026-04-10 10:19:54'),
(4, 'arbitre1', 'arbitre@test.com', '$2a$10$3kpF4NCeY1NOl5ZStSNvA.EepihYCoGQ0j7dbHpBs6LflllSAU9ju', 'arbitre', 'Arbitre', 'Jean', NULL, NULL, 1, NULL, '2026-04-09 18:52:32', '2026-04-09 18:52:32'),
(5, 'visiteur1', 'visiteur@test.com', '$2a$10$k0IaE5WSvnh.GJfNyH9i4eJtOZJRq.l5RcXNe/u90PgXD2GK6o1Yy', 'visiteur', 'Visiteur', 'Test', NULL, NULL, 1, NULL, '2026-04-09 18:52:32', '2026-04-09 18:52:32'),
(6, 'testuser', 'test@test.com', '$2a$10$vHHT3SFSNrm/TR6KdgtWSOMNf6qaoCRfnif72EhuiC/VXKIekMi7.', 'visiteur', 'Test', 'User', '', NULL, 1, NULL, '2026-04-12 08:53:28', '2026-04-12 08:53:28'),
(7, 'Ephreme kisomo', 'ephremekisomo003@gmail.com', '$2a$10$ztfH6x1UygOn6i5mygV7/uZiktIDnxE0fxxbKS22KiwxZTLLapR7C', 'responsable_club', '', '', '0977742669', NULL, 1, 2, '2026-04-12 08:56:26', '2026-04-12 09:58:15'),
(8, 'Fresh', 'Fesh@gmail.com', '$2a$10$4/o6Vn14yYPOcGFd2l.4oO7rNnYBB5SHOXfFKvGqkMQYJ5/bXROX6', 'admin_sportif', 'Fresh', 'Cool', '0979669120', NULL, 1, NULL, '2026-04-12 10:14:26', '2026-04-12 23:27:38'),
(9, 'king kong', 'kingkong@gmail.com', '$2a$10$lzL.h4cEIHh6Uf3QFDWoLO6y3n4iSAwsuuVT0dO8nGv7FDxisfyiu', 'responsable_club', 'king', 'kong', '0993005787', NULL, 1, 1, '2026-04-13 18:06:49', '2026-04-13 18:06:49'),
(10, 'Robert', 'robertmusema21@gmail.com', '$2a$10$.Oo.fj9kPeELOr1IoNjy7.4OpFVi/7PDKCAWc/r5Qw1xvuaSjf5Dm', 'arbitre', 'kilesu', 'robert', '0977742669', NULL, 1, NULL, '2026-04-13 21:53:38', '2026-04-13 21:53:38'),
(11, 'Kanku', 'kankumulamba3@gmail.com', '$2a$10$Ox6nxa4hbbpJdePxZUmMSuGsLIb8kkpWr3stc7wf3IVeWmn2YLYq6', 'admin_sportif', 'Esther', 'mulamba', '0970749789', NULL, 1, NULL, '2026-04-13 23:33:17', '2026-04-13 23:33:17'),
(12, 'jospin', 'jospintheophil@gmail.com', '$2a$10$wv8//T8omWhD9vWuMtfQ5OGm913eUm/nZ/r5VmQWzbcgaxW.Q.DHW', 'responsable_club', 'jospin', 'theophil', '0977885428', NULL, 1, 3, '2026-04-13 23:41:29', '2026-04-13 23:41:29'),
(13, 'promesse', 'promessemusay@gmail.com', '$2a$10$OhJFV35S8jnOaeky4rNzWeIawREW7oPzrrcsAQ3RqPhjVMGIOhbuK', 'visiteur', '', '', '', NULL, 1, NULL, '2026-04-13 23:58:36', '2026-04-13 23:58:36'),
(14, 'kapinga', 'theresekapinga047@gmail.com', '$2a$10$uLVST3FDk1ET/TegvXha7Op/PbaDie7bzDDxqb76/Oo6G3oHxbL92', 'admin_sportif', 'therese', 'kapinga', '0981041568', NULL, 1, NULL, '2026-04-16 17:34:43', '2026-04-16 17:34:43'),
(15, 'albert', 'albert@gmail.com', '$2a$10$9xBXwvlGoNdz3bIYBM90NuRDetjbQUp2AwspAHo8KRfmJkT1nhSnm', 'arbitre', 'albert', 'mutamba', '0977742667', NULL, 1, NULL, '2026-04-16 17:47:53', '2026-04-16 17:47:53'),
(16, 'lisa', 'lisa@gmail.com', '$2a$10$pIx.p/n9eSWQ/GbfwXaQveUvhpeH1O.zlclkHVqqViWmwJjl2lUfe', 'visiteur', '', '', '', NULL, 1, NULL, '2026-04-16 17:51:01', '2026-04-19 01:42:33'),
(17, 'agnes ', 'agneskapeta@gmail.com', '$2a$10$xpXWfbNPWtad0VSo10P0.OSDGShHbBlUK6Z9dUi0LAkOCRxvVPWxO', 'visiteur', '', '', '', NULL, 1, NULL, '2026-04-21 08:44:12', '2026-04-21 09:55:59');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `arbitres`
--
ALTER TABLE `arbitres`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `licence` (`licence`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `classements`
--
ALTER TABLE `classements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `competition_id` (`competition_id`,`equipe`),
  ADD KEY `idx_classements_comp` (`competition_id`);

--
-- Indexes for table `clubs`
--
ALTER TABLE `clubs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_clubs_nom` (`nom_club`),
  ADD KEY `idx_clubs_statut` (`statut`);

--
-- Indexes for table `competitions`
--
ALTER TABLE `competitions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_competitions_statut` (`statut`);

--
-- Indexes for table `joueurs`
--
ALTER TABLE `joueurs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_joueurs_club` (`club_id`),
  ADD KEY `idx_joueurs_statut` (`statut`);

--
-- Indexes for table `matchs`
--
ALTER TABLE `matchs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `club_domicile_id` (`club_domicile_id`),
  ADD KEY `club_exterieur_id` (`club_exterieur_id`),
  ADD KEY `arbitre_id` (`arbitre_id`),
  ADD KEY `idx_matchs_competition` (`competition_id`),
  ADD KEY `idx_matchs_date` (`date_match`);

--
-- Indexes for table `match_buteurs`
--
ALTER TABLE `match_buteurs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `match_id` (`match_id`,`joueur_id`),
  ADD KEY `joueur_id` (`joueur_id`);

--
-- Indexes for table `participations`
--
ALTER TABLE `participations`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_participation` (`club_id`,`competition_id`),
  ADD KEY `idx_participations_competition` (`competition_id`);

--
-- Indexes for table `resultats`
--
ALTER TABLE `resultats`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_resultats_match` (`match_id`);

--
-- Indexes for table `trophees`
--
ALTER TABLE `trophees`
  ADD PRIMARY KEY (`id`),
  ADD KEY `competition_id` (`competition_id`),
  ADD KEY `club_gagnant_id` (`club_gagnant_id`),
  ADD KEY `joueur_gagnant_id` (`joueur_gagnant_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `idx_users_role` (`role`),
  ADD KEY `idx_users_club` (`club_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `arbitres`
--
ALTER TABLE `arbitres`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `classements`
--
ALTER TABLE `classements`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=122;

--
-- AUTO_INCREMENT for table `clubs`
--
ALTER TABLE `clubs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `competitions`
--
ALTER TABLE `competitions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `joueurs`
--
ALTER TABLE `joueurs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `matchs`
--
ALTER TABLE `matchs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `match_buteurs`
--
ALTER TABLE `match_buteurs`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `participations`
--
ALTER TABLE `participations`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `resultats`
--
ALTER TABLE `resultats`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `trophees`
--
ALTER TABLE `trophees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `arbitres`
--
ALTER TABLE `arbitres`
  ADD CONSTRAINT `arbitres_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `classements`
--
ALTER TABLE `classements`
  ADD CONSTRAINT `classements_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `joueurs`
--
ALTER TABLE `joueurs`
  ADD CONSTRAINT `joueurs_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `matchs`
--
ALTER TABLE `matchs`
  ADD CONSTRAINT `matchs_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `matchs_ibfk_2` FOREIGN KEY (`club_domicile_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `matchs_ibfk_3` FOREIGN KEY (`club_exterieur_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `matchs_ibfk_4` FOREIGN KEY (`arbitre_id`) REFERENCES `arbitres` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `match_buteurs`
--
ALTER TABLE `match_buteurs`
  ADD CONSTRAINT `match_buteurs_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matchs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `match_buteurs_ibfk_2` FOREIGN KEY (`joueur_id`) REFERENCES `joueurs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `participations`
--
ALTER TABLE `participations`
  ADD CONSTRAINT `participations_ibfk_1` FOREIGN KEY (`club_id`) REFERENCES `clubs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `participations_ibfk_2` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `resultats`
--
ALTER TABLE `resultats`
  ADD CONSTRAINT `resultats_ibfk_1` FOREIGN KEY (`match_id`) REFERENCES `matchs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `trophees`
--
ALTER TABLE `trophees`
  ADD CONSTRAINT `trophees_ibfk_1` FOREIGN KEY (`competition_id`) REFERENCES `competitions` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `trophees_ibfk_2` FOREIGN KEY (`club_gagnant_id`) REFERENCES `clubs` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `trophees_ibfk_3` FOREIGN KEY (`joueur_gagnant_id`) REFERENCES `joueurs` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
