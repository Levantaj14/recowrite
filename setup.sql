CREATE DATABASE IF NOT EXISTS recowrite;

-- Create socials_types table and insert initial data
CREATE TABLE IF NOT EXISTS recowrite.socials_types (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO recowrite.socials_types (id, name) VALUES (1, 'Instagram');
INSERT INTO recowrite.socials_types (id, name) VALUES (2, 'X');
INSERT INTO recowrite.socials_types (id, name) VALUES (3, 'Bluesky');
INSERT INTO recowrite.socials_types (id, name) VALUES (4, 'Medium');


-- Create report reasons table and insert initial data
CREATE TABLE IF NOT EXISTS recowrite.report_reasons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    label VARCHAR(255) NOT NULL UNIQUE
);

INSERT INTO recowrite.report_reasons (id, label) VALUES (1, 'Spam');
INSERT INTO recowrite.report_reasons (id, label) VALUES (2, 'Hate speech or abusive content');
INSERT INTO recowrite.report_reasons (id, label) VALUES (3, 'Harassment or bullying');
INSERT INTO recowrite.report_reasons (id, label) VALUES (4, 'Sexual or explicit content');
INSERT INTO recowrite.report_reasons (id, label) VALUES (5, 'Violent or graphic content');
INSERT INTO recowrite.report_reasons (id, label) VALUES (6, 'Misinformation');
INSERT INTO recowrite.report_reasons (id, label) VALUES (7, 'Copyright infringement');
INSERT INTO recowrite.report_reasons (id, label) VALUES (8, 'Plagiarism');