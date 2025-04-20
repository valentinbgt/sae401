-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Hôte : db
-- Généré le : dim. 20 avr. 2025 à 10:50
-- Version du serveur : 11.7.2-MariaDB-ubu2404
-- Version de PHP : 8.2.27

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `sae401`
--

-- --------------------------------------------------------

--
-- Structure de la table `Module`
--

CREATE TABLE `Module` (
  `id` int(11) NOT NULL,
  `code` varchar(191) NOT NULL,
  `titre` varchar(191) NOT NULL,
  `semestre` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `Module`
--

INSERT INTO `Module` (`id`, `code`, `titre`, `semestre`) VALUES
(1, 'WS401', 'Développer pour le Web', 4),
(2, 'WS402', 'Concevoir un dispositif interactif', 4),
(3, 'WS410', 'Portfolio', 4),
(4, 'WS411', 'Stage', 4),
(5, 'WR401', 'Anglais', 4),
(6, 'WR403', 'Design d\'expérience', 4),
(7, 'WR405', 'Création et design interactif', 4),
(8, 'WR406', 'Développement front', 4),
(9, 'WR407', 'Développement back', 4),
(10, 'WR408', 'Déploiement de services', 4),
(11, 'WR409', 'Développement et Modélisation Unity', 4),
(12, 'WS101', 'Auditer une communication numérique', 1),
(13, 'WS102', 'Concevoir une recommandation de communication numérique', 1),
(14, 'WS103', 'Produire les éléments d\'une communication visuelle', 1),
(15, 'WS104', 'Produire un contenu audio et vidéo', 1),
(16, 'WS105', 'Produire un site Web', 1),
(17, 'WS106', 'Gérer un projet de communication numérique', 1),
(18, 'WS107', 'Production d’un Podcast', 1),
(19, 'WR101', 'Anglais', 1),
(20, 'WR102', 'Anglais Renforcé', 1),
(21, 'WR103', 'Ergonomie et Accessibilité', 1),
(22, 'WR104', 'Culture numérique', 1),
(24, 'WR105', 'Stratégies de communication et marketing', 1),
(25, 'WR106', 'Expression, communication et rhétorique', 1),
(26, 'WR107', 'Écriture multimédia et narration', 1),
(27, 'WR108', 'Production graphique', 1),
(28, 'WR109', 'Culture artistique', 1),
(29, 'WR110', 'Production audio et vidéo', 1),
(30, 'WR112', 'Intégration', 1),
(31, 'WR113', 'Développement Web', 1),
(32, 'WR115', 'Hébergement', 1),
(33, 'WR116', 'Représentation et traitement de l\'information', 1),
(34, 'WR117', 'Gestion de projet', 1),
(35, 'WR118', 'Économie, gestion et droit du numérique', 1),
(36, 'WR119', 'Projet Personnel et Professionnel', 1),
(37, 'WS201', 'Explorer les usages du numérique', 2),
(38, 'WS202', 'Concevoir un produit ou un service et sa communication', 2),
(39, 'WS203', 'Concevoir un site web avec une source de données', 2),
(40, 'WS204', 'Construire sa présence en ligne', 2),
(41, 'WS210', 'Portfolio', 2),
(42, 'WR201', 'Anglais', 2),
(43, 'WR202', 'Anglais Renforcé', 2),
(44, 'WR203', 'Ergonomie et Accessibilité', 2),
(45, 'WR204', 'Culture numérique', 2),
(46, 'WR205', 'Stratégies de communication et marketing', 2),
(47, 'WR206', 'Expression, communication et rhétorique', 2),
(48, 'WR207', 'Écriture multimédia et narration', 2),
(49, 'WR208', 'Production graphique', 2),
(50, 'WR209', 'Culture artistique', 2),
(51, 'WR210', 'Production audio et vidéo', 2),
(52, 'WR211', 'Gestion de contenus', 2),
(53, 'WR212', 'Intégration', 2),
(54, 'WR213', 'Développement Web', 2),
(55, 'WR214', 'Système d\'information', 2),
(56, 'WR215', 'Hébergement', 2),
(57, 'WR216', 'Représentation et traitement de l\'information', 2),
(58, 'WR217', 'Gestion de projet', 2),
(59, 'WR218', 'Économie, gestion et droit du numérique', 2),
(60, 'WR219', 'Projet Personnel et Professionnel', 2);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `Module`
--
ALTER TABLE `Module`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `Module_code_key` (`code`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `Module`
--
ALTER TABLE `Module`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=61;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
