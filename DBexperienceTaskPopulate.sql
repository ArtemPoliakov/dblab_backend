-- Populate resource

INSERT INTO resource (
    resource_Id,
    name,
    description,
    link_to_resource,
    likes_cache,
    views_cache,
    publish_date,
    origination_date,
    is_verified,
    is_recommended,
    producer,
    author_user_Id,
    link_type_Id
)
VALUES

(1,
 'SQLZoo — Interactive SQL Tutorials',
 'Інтерактивна платформа для вивчення SQL через покрокові вправи та виконання реальних запитів у браузері.',
 'https://sqlzoo.net/',
 0, 0,
 '2023-04-18 10:45:00',
 '2023-02-10',
 1, 1,
 'SQLZoo Team',
 10, 1),

(2,
 'W3Schools SQL Reference',
 'Детальний довідник з SQL із прикладами, зручний для швидкого пошуку синтаксису та початківців.',
 'https://www.w3schools.com/sql/',
 0, 0,
 '2023-09-25 09:30:00',
 '2023-06-10',
 1, 0,
 'W3Schools',
 7, 2),

(3,
 'Mode SQL Tutorial',
 'Безкоштовний розширений курс SQL з інтерактивними вправами на основі реальних бізнес-даних та візуалізацією результатів.',
 'https://mode.com/sql-tutorial/',
 0, 0,
 '2024-03-12 16:10:00',
 '2023-11-22',
 1, 1,
 'Mode Analytics',
 13, 3),

(4,
 'Database Normalization Guide',
 'Короткий посібник із нормалізації баз даних (1НФ, 2НФ, 3НФ) з практичними прикладами ефективного проєктування схем.',
 'https://www.databasestar.com/database-normalization/',
 0, 0,
 '2024-07-14 13:00:00',
 '2024-06-05',
 0, 0,
 'Database Star',
 8, 4),

(5,
 'PostgreSQL Official Documentation',
 'Офіційна документація PostgreSQL, що охоплює індексацію, паралелізм запитів, оптимізацію та інші розширені теми.',
 'https://www.postgresql.org/docs/',
 0, 0,
 '2025-02-09 12:00:00',
 '2024-12-20',
 1, 0,
 'PostgreSQL Global Development Group',
 10, 5),

(6,
 'MySQL Tutorial — Official Developer Portal',
 'Офіційний посібник з MySQL, що пояснює принципи побудови баз даних, приклади запитів та рекомендації з проектування.',
 'https://dev.mysql.com/doc/refman/8.0/en/tutorial.html',
 0, 0,
 '2025-07-18 14:45:00',
 '2025-04-10',
 1, 1,
 'Oracle Corporation',
 9, 2);


-- Populate interaction_user_resource


INSERT INTO interaction_user_resource (
    interaction_user_resource_Id,
    is_liked,
    is_viewed,
    is_in_view_later,
    is_in_favourites,
    user_Id,
    resource_Id
)
VALUES
-- Resource 1
(1, 1, 1, 0, 1, 10, 1),
(2, 0, 1, 1, 0, 7, 1),
(3, 1, 1, 0, 0, 8, 1),

-- Resource 2
(4, 0, 1, 0, 0, 6, 2),
(5, 1, 1, 1, 0, 9, 2),
(6, 0, 1, 0, 1, 13, 2),

-- Resource 3
(7, 1, 1, 0, 0, 7, 3),
(8, 1, 1, 1, 1, 8, 3),
(9, 0, 1, 0, 0, 10, 3),

-- Resource 4
(10, 1, 1, 0, 0, 9, 4),
(11, 0, 1, 1, 1, 13, 4),

-- Resource 5
(12, 1, 1, 0, 1, 6, 5),
(13, 0, 1, 1, 0, 10, 5),

-- Resource 6
(14, 1, 1, 0, 1, 8, 6),
(15, 0, 1, 1, 0, 9, 6);


-- Populate comment

INSERT INTO comment (comment_Id, text, likes, interaction_user_resource_Id, interaction_user_stack_Id)
VALUES
(1, 'Great article, very informative!', 2, 1, NULL),
(2, 'I totally agree with the author.', 1, 4, NULL),
(3, 'Could use more examples though.', 0, 7, NULL),
(4, 'Nice explanation, thanks!', 2, 3, NULL),
(5, 'Didn’t understand part of it, but interesting.', 0, 10, NULL),
(6, 'Awesome content, keep it up!', 3, 6, NULL),
(7, 'Too short, but well written.', 1, 9, NULL),
(8, 'Very useful information!', 0, 2, NULL),
(9, 'Loved this one.', 2, 12, NULL),
(10, 'Thanks for sharing!', 1, 5, NULL);


-- Populate rating


INSERT INTO rating (rating_Id, name, rating_authority_link, publish_date, forming_date)
VALUES
(1, 'Top Database Management Systems 2025', 
 'https://www.db-engines.com/en/ranking', 
 '2025-03-10 12:30:00', '2025-02-15'),

(2, 'Best Database Articles 2025', 
 'https://best_db_articles_example.com', 
 '2025-06-20 10:00:00', '2025-05-25'),

(3, 'Best Database Tutoriels 2025', 
 'https://best_db_tutorials_example.com', 
 '2025-05-18 14:45:00', '2025-04-02'),

(4, 'Top Data Analytics Platforms 2024', 
 'https://www.dataleaders.org/rankings/2024', 
 '2024-11-30 09:15:00', '2024-10-10'),

(5, 'SQL Engines Performance Benchmark', 
 'https://www.tpc.org/benchmark/sql-performance-2025', 
 '2025-09-05 16:40:00', '2025-08-01');

 -- Populate ratingResource

INSERT INTO ratingResource (rating_position, rating_Id, resource_Id)
VALUES
-- Top DBMS 2025
(1, 1, 6),  -- MySQL
(2, 1, 5),  -- PostgreSQL

-- Best Database Tutorials 2025
(1, 3, 3),  -- Mode SQL Tutorial
(2, 3, 1),  -- SQLZoo

-- Best Database Articles 2025
(1, 2, 2),  -- W3Schools SQL Reference

-- Top Data Analytics Platforms 2024
(3, 4, 4),  -- Database Normalization Guide
(5, 4, 3),  -- Mode SQL Tutorial (analytics-related)

-- SQL Engines Performance Benchmark
(1, 5, 6),  -- MySQL
(2, 5, 5);  -- PostgreSQL


-- Populate resourceDevelopment_direction


INSERT INTO resourceDevelopment_direction (resource_Id, development_direction_Id)
VALUES
-- SQLZoo — Interactive SQL Tutorials
(1, 7),
(1, 2),

-- W3Schools SQL Reference
(2, 7),
(2, 1),

-- Mode SQL Tutorial
(3, 2),
(3, 6),
(3, 1),

-- Database Normalization Guide
(4, 3),
(4, 7),

-- PostgreSQL Official Documentation
(5, 7),
(5, 3),
(5, 1),

-- MySQL Tutorial — Official Developer Portal
(6, 7),
(6, 1);


-- Count likes and views cache for each resource


SET SQL_SAFE_UPDATES = 0;

UPDATE resource r
LEFT JOIN (
    SELECT 
        resource_Id,
        SUM(CASE WHEN is_liked = b'1' THEN 1 ELSE 0 END) AS like_count,
        SUM(CASE WHEN is_viewed = b'1' THEN 1 ELSE 0 END) AS view_count
    FROM interaction_user_resource
    GROUP BY resource_Id
) iur ON r.resource_Id = iur.resource_Id
SET 
    r.likes_cache = COALESCE(iur.like_count, 0),
    r.views_cache = COALESCE(iur.view_count, 0)
WHERE r.resource_Id > 0;

SET SQL_SAFE_UPDATES = 1;