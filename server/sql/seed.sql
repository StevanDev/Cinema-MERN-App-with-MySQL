INSERT INTO movies (title, description, duration_min, genre, rating, poster_url) VALUES
('Inception', 'A mind-bending thriller.', 148, 'Sci-Fi', 8.8, NULL),
('The Dark Knight', 'Batman vs Joker.', 152, 'Action', 9.0, NULL);

INSERT INTO halls (name, `rows`, seats_per_row) VALUES
('Sala 1', 8, 12),
('Sala 2', 10, 10);

INSERT INTO screenings (movie_id, hall_id, starts_at, price) VALUES
(1, 1, DATE_ADD(CURDATE(), INTERVAL 19 HOUR), 350.00),
(2, 2, DATE_ADD(CURDATE(), INTERVAL 21 HOUR), 400.00);