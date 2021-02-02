-- phpMyAdmin SQL Dump
-- version 5.0.2
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : sam. 30 jan. 2021 à 14:24
-- Version du serveur :  10.4.11-MariaDB
-- Version de PHP : 7.2.31

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `vol`
--

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` int(11) NOT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(60) DEFAULT NULL,
  `tel` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`, `nom`, `prenom`, `email`, `tel`) VALUES
(1, 'adam', '', 'this@gmail.com', 'Ayoub@03');

-- --------------------------------------------------------

--
-- Structure de la table `escales`
--

CREATE TABLE `escales` (
  `id` int(11) NOT NULL,
  `id_fly` int(11) NOT NULL,
  `stopover_name` varchar(255) NOT NULL,
  `hours` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `escales`
--

INSERT INTO `escales` (`id`, `id_fly`, `stopover_name`, `hours`) VALUES
(8, 1, 'safi-paris', '3'),
(10, 1, 'paris-toronto', '8'),
(12, 2, 'safi-madride', '4'),
(14, 2, 'madride-toronto', '8'),
(16, 3, 'Agadir-wahrane', '4'),
(17, 3, 'wahrane-paris', '3'),
(18, 4, 'agadir-dubai', '8'),
(19, 4, 'dubai-paris', '9');

-- --------------------------------------------------------

--
-- Structure de la table `flights_list`
--

CREATE TABLE `flights_list` (
  `id` int(11) NOT NULL,
  `flyingFrom` varchar(100) DEFAULT NULL,
  `flyingTo` varchar(100) DEFAULT NULL,
  `departingDate` date DEFAULT curdate(),
  `returningDate` date DEFAULT NULL,
  `seats` varchar(80) DEFAULT NULL,
  `description` varchar(255) NOT NULL,
  `Price` float NOT NULL,
  `dapart_time` varchar(255) NOT NULL,
  `arrive_time` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Déchargement des données de la table `flights_list`
--

INSERT INTO `flights_list` (`id`, `flyingFrom`, `flyingTo`, `departingDate`, `returningDate`, `seats`, `description`, `Price`, `dapart_time`, `arrive_time`) VALUES
(1, 'safi', 'toronto', '2021-01-26', '2021-02-10', '20', 'this trip from safi to toronto(canada)', 15000, '11h40min ', '19h50min'),
(2, 'safi', 'toronto', '2021-01-29', '2021-02-15', '20', 'this trip from safi to toronto(canada)', 17000, '10h30min', '19h15min'),
(3, 'Agadir', 'paris', '2021-02-08', '2021-02-14', '20', 'this trip from agadir to paris(france)', 2000, '23h40min ', '8h40min '),
(4, 'Agadir', 'paris', '2021-02-13', '2021-02-20', '20', 'this trip from agadir to paris(france)', 1500, '13h10min ', '20h40min ');

-- --------------------------------------------------------

--
-- Structure de la table `reservation`
--

CREATE TABLE `reservation` (
  `id_reservation` int(11) NOT NULL,
  `FullName` varchar(80) DEFAULT NULL,
  `numeroTel` varchar(50) DEFAULT NULL,
  `email` varchar(60) DEFAULT NULL,
  `numeroPassport` varchar(50) DEFAULT NULL,
  `departingDate` date DEFAULT curdate(),
  `returningDate` date DEFAULT NULL,
  `Adult` int(11) DEFAULT NULL,
  `children` int(11) DEFAULT NULL,
  `travel_class` varchar(25) DEFAULT NULL,
  `price` varchar(80) DEFAULT NULL,
  `id_flight` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `escales`
--
ALTER TABLE `escales`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_fly` (`id_fly`);

--
-- Index pour la table `flights_list`
--
ALTER TABLE `flights_list`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id_reservation`),
  ADD KEY `id_flight` (`id_flight`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `escales`
--
ALTER TABLE `escales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT pour la table `flights_list`
--
ALTER TABLE `flights_list`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pour la table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id_reservation` int(11) NOT NULL AUTO_INCREMENT;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `escales`
--
ALTER TABLE `escales`
  ADD CONSTRAINT `fk_fly` FOREIGN KEY (`id_fly`) REFERENCES `flights_list` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`id_flight`) REFERENCES `flights_list` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
