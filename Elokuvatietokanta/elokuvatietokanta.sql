-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 16.01.2026 klo 11:58
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
-- Rakenne taululle `reviews`
--

CREATE TABLE `reviews` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `img_url` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `watch_date` date DEFAULT NULL,
  `thoughts` text DEFAULT NULL,
  `best_scene` text DEFAULT NULL,
  `quote` text DEFAULT NULL,
  `drop_rating` int(11) DEFAULT 0,
  `fire_rating` int(11) DEFAULT 0,
  `score` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `reviews`
--

INSERT INTO `reviews` (`id`, `user_id`, `title`, `img_url`, `category`, `genre`, `watch_date`, `thoughts`, `best_scene`, `quote`, `drop_rating`, `fire_rating`, `score`, `created_at`) VALUES
(8, 1, 'testi2', '', 'Elokuva', '1', '2026-01-14', 'testi1', 'testi1', 'testi1', 1, 1, 2, '2026-01-16 10:54:53');

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
(2, 'balik', 'esra070bagdat@gmail.com', '$2b$10$O9xqnuMuf/3aM.VnqJaFFuTRT5lAdlnhqODTpwIMCHnXZrTovOjIS'),
(3, 'kati.saara', 'katike.kemppainen@gmail.com', '$2b$10$yx2nsW7bma6V/ejsjq9Dqe1to9HdxkZK2ettkaRFkN85YSgz7ZV4W');

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
  `status` enum('watchlist','watched') DEFAULT 'watchlist',
  `rating` int(11) DEFAULT NULL,
  `review` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Vedos taulusta `user_movies`
--

INSERT INTO `user_movies` (`id`, `user_id`, `imdb_id`, `title`, `poster`, `type`, `status`, `rating`, `review`, `created_at`) VALUES
(28, 1, 'tt0499549', 'Avatar', 'https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NjItMDJlYTRlNGJiZjcyXkEyXkFqcGc@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 11:10:27'),
(31, 2, 'tt0499549', 'Avatar', 'https://m.media-amazon.com/images/M/MV5BMDEzMmQwZjctZWU2My00MWNlLWE0NjItMDJlYTRlNGJiZjcyXkEyXkFqcGc@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 11:10:27'),
(39, 2, 'tt0117571', 'Scream', 'https://m.media-amazon.com/images/M/MV5BMjA2NjU5MTg5OF5BMl5BanBnXkFtZTgwOTkyMzQxMDE@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 11:10:27'),
(41, 3, 'tt0120338', 'Titanic', 'https://m.media-amazon.com/images/M/MV5BYzYyN2FiZmUtYWYzMy00MzViLWJkZTMtOGY1ZjgzNWMwN2YxXkEyXkFqcGc@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 11:10:27'),
(42, 3, 'tt0426769', 'Peppa Pig', 'https://m.media-amazon.com/images/M/MV5BYmZjZWQ0OTktODdlYy00ZjA1LWJlNzYtNmYwMDc4YzQzZmQwXkEyXkFqcGc@._V1_SX300.jpg', 'series', 'watchlist', NULL, NULL, '2026-01-15 11:10:27'),
(43, 1, 'tt0095016', 'Die Hard', 'https://m.media-amazon.com/images/M/MV5BMGNlYmM1NmQtYWExMS00NmRjLTg5ZmEtMmYyYzJkMzljYWMxXkEyXkFqcGc@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 11:10:27'),
(44, 1, 'tt0952640', 'Alvin and the Chipmunks', 'https://m.media-amazon.com/images/M/MV5BNDVjMWNkNjEtOGU5YS00Y2Q2LTgwYjMtMTg0YWM2ZGE2MDM3XkEyXkFqcGc@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 11:10:27'),
(45, 1, 'tt0110845', 'Plastic Little: The Adventures of Captain Tita', 'https://m.media-amazon.com/images/M/MV5BMTYzOTE1OTU5Ml5BMl5BanBnXkFtZTcwNTgzMjUyMQ@@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 19:41:20'),
(46, 1, 'tt0110845', 'Plastic Little: The Adventures of Captain Tita', 'https://m.media-amazon.com/images/M/MV5BMTYzOTE1OTU5Ml5BMl5BanBnXkFtZTcwNTgzMjUyMQ@@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 19:41:21'),
(47, 1, 'tt0110845', 'Plastic Little: The Adventures of Captain Tita', 'https://m.media-amazon.com/images/M/MV5BMTYzOTE1OTU5Ml5BMl5BanBnXkFtZTcwNTgzMjUyMQ@@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 19:41:21'),
(50, 1, 'tt5813916', 'The Mountain II', 'https://m.media-amazon.com/images/M/MV5BOTkyMjMyZjAtODFkZi00Zjc1LTk3MDAtMTU4MjZlOWE0ZWI0XkEyXkFqcGc@._V1_SX300.jpg', 'movie', 'watchlist', NULL, NULL, '2026-01-15 20:31:50');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `movies`
--
ALTER TABLE `movies`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reviews`
--
ALTER TABLE `reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
-- AUTO_INCREMENT for table `reviews`
--
ALTER TABLE `reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `user_movies`
--
ALTER TABLE `user_movies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=51;

--
-- Rajoitteet vedostauluille
--

--
-- Rajoitteet taululle `reviews`
--
ALTER TABLE `reviews`
  ADD CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Rajoitteet taululle `user_movies`
--
ALTER TABLE `user_movies`
  ADD CONSTRAINT `user_movies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
