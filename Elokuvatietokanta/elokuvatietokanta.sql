-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 13.01.2026 klo 15:19
-- Palvelimen versio: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `elokuvatietokanta`
--

-- --------------------------------------------------------

--
-- Rakenne taululle `movies`
--

CREATE TABLE `movies` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `type` enum('movie','series') DEFAULT NULL,
  `year` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Rakenne taululle `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`) VALUES
(1, 'e', 'esra07bagdat@gmail.com', '$2b$10$XDi91Hyc6kWVzY3mlNyY3.BgSRl3LhnXH35VqfpbH3SrA3k7w61sq'),
(2, 'balik', 'esra070bagdat@gmail.com', '$2b$10$O9xqnuMuf/3aM.VnqJaFFuTRT5lAdlnhqODTpwIMCHnXZrTovOjIS');

-- --------------------------------------------------------

--
-- Rakenne taululle `user_movies`
--

CREATE TABLE `user_movies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `imdb_id` varchar(20) DEFAULT NULL,
  `title` varchar(100) DEFAULT NULL,
  `poster` text DEFAULT NULL,
  `type` varchar(10) DEFAULT NULL,
  `status` enum('watchlist','watched') DEFAULT 'watchlist'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `user_movies`
--

INSERT INTO `user_movies` (`id`, `user_id`, `imdb_id`, `title`, `poster`, `type`, `status`) VALUES
(28, 1, 'tt0499549', 'Avatar', 'https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NjItMDJlYTRlNGJiZjcyXkEyXkFqcGc@._V1_SX300.jpg', 'movie', 'watchlist'),
(29, 1, 'tt1630029', 'Avatar: The Way of Water', 'https://m.media-amazon.com/images/M/MV5BNWI0Y2NkOWEtMmM2OC00MjQ3LWI1YzItZGQxYzQ3NzI4NWZmXkEyXkFqcGc@._V1_SX300.jpg', 'movie', 'watchlist');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_movies`
--
ALTER TABLE `user_movies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `movies`
--
ALTER TABLE `movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `user_movies`
--
ALTER TABLE `user_movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `user_movies`
--
ALTER TABLE `user_movies`
  ADD CONSTRAINT `user_movies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
