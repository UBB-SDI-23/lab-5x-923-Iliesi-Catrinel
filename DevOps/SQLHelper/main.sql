USE [MuseumDB]
GO

-- Drop constraints
ALTER TABLE Exhibitions DROP CONSTRAINT IF EXISTS FK_Exhibitions_Artists_ArtistId;
ALTER TABLE Exhibitions DROP CONSTRAINT IF EXISTS FK_Exhibitions_Museums_MuseumId;
ALTER TABLE Paintings DROP CONSTRAINT IF EXISTS FK_Paintings_Artists_ArtistId;

ALTER TABLE ConfirmationCodes DROP CONSTRAINT IF EXISTS FK_ConfirmationCodes_Users_UserId;
ALTER TABLE UserProfiles DROP CONSTRAINT IF EXISTS FK_UserProfiles_Users_UserId;

ALTER TABLE Exhibitions DROP CONSTRAINT IF EXISTS FK_Exhibitions_Users_UserId;
ALTER TABLE Museums DROP CONSTRAINT IF EXISTS FK_Museums_Users_UserId;
ALTER TABLE Paintings DROP CONSTRAINT IF EXISTS FK_Paintings_Users_UserId;
ALTER TABLE Artists DROP CONSTRAINT IF EXISTS FK_Artists_Users_UserId;

-- Drop unique constraints
DROP INDEX IF EXISTS IX_Users_Name ON Users;
DROP INDEX IF EXISTS IX_ConfirmationCodes_Code ON ConfirmationCodes;

TRUNCATE TABLE ConfirmationCodes
TRUNCATE TABLE UserProfiles
TRUNCATE TABLE Users

TRUNCATE TABLE Exhibitions
TRUNCATE TABLE Museums
TRUNCATE TABLE Paintings
TRUNCATE TABLE Artists
GO

-- BULK INSERT data from CSV files
BULK INSERT Users
FROM '/home/mssql/csv/users.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT UserProfiles
FROM '/home/mssql/csv/user_profiles.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT Artists
FROM '/home/mssql/csv/artists.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT Paintings
FROM '/home/mssql/csv/paintings.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT Museums
FROM '/home/mssql/csv/museums.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

BULK INSERT Exhibitions
FROM '/home/mssql/csv/exhibitions.csv'
WITH (FORMAT = 'CSV', FIRSTROW = 1, FIELDTERMINATOR = ',', ROWTERMINATOR = '\r\n');
GO

-- Recreate constraints
ALTER TABLE Paintings
ADD CONSTRAINT FK_Paintings_Artists_ArtistId FOREIGN KEY (ArtistId) REFERENCES Artists (Id) ON DELETE SET NULL;

ALTER TABLE Exhibitions
ADD CONSTRAINT FK_Exhibitions_Artists_ArtistId FOREIGN KEY (ArtistId) REFERENCES Artists (Id) ON DELETE CASCADE,
    CONSTRAINT FK_Exhibitions_Museums_MuseumId FOREIGN KEY (MuseumId) REFERENCES Museums (Id) ON DELETE CASCADE;
GO

ALTER TABLE UserProfiles
ADD CONSTRAINT FK_UserProfiles_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (Id) ON DELETE CASCADE;

ALTER TABLE ConfirmationCodes
ADD CONSTRAINT FK_ConfirmationCodes_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (Id) ON DELETE CASCADE;

ALTER TABLE Artists
ADD CONSTRAINT FK_Artists_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (ID) ON DELETE SET NULL;

ALTER TABLE Paintings
ADD CONSTRAINT FK_Paintings_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (ID) ON DELETE SET NULL;

ALTER TABLE Museums
ADD CONSTRAINT FK_Museums_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (ID) ON DELETE SET NULL;

ALTER TABLE Exhibitions
ADD CONSTRAINT FK_Exhibitions_Users_UserId FOREIGN KEY (UserId) REFERENCES Users (ID) ON DELETE SET NULL;

CREATE UNIQUE INDEX IX_Users_Name ON Users (Name);
CREATE UNIQUE INDEX IX_ConfirmationCodes_Code ON ConfirmationCodes (Code);
GO

SELECT COUNT(*)
FROM Users

SELECT COUNT(*)
FROM UserProfiles

SELECT *
FROM ConfirmationCodes

SELECT COUNT(*)
FROM Artists

SELECT COUNT(*)
FROM Paintings

SELECT COUNT(*)
FROM Museums

SELECT COUNT(*)
FROM Exhibitions

select top 20 *
FROM Paintings

INSERT INTO Users([Name], [Password], [AccessLevel])
VALUES
	('admin', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918', 3),
	('moderator', 'cfde2ca5188afb7bdd0691c7bef887baba78b709aadde8e8c535329d5751e6fe', 2),
	('regular', '667937c3e7a68ea374716edae34173e66dc54f380cffaccceaf15dfbfad22f99', 1),
	('unconfirmed', 'c78a686d7cf5224908a78db81aad8ee8bc987f4b2bab7eceebae29bfad601c58', 0)

GO

INSERT INTO UserProfiles([UserId], [Bio], [Location], [Birthday], [Gender], [MaritalStatus], [PagePreference])
VALUES
	(10001, 'bio admin', 'location admin', '2000-01-01 00:00:00.0000000', 0, 0, 5),
	(10002, 'bio moderator', 'location moderator', '2000-01-01 00:00:00.0000000', 1, 1, 5),
	(10003, 'bio regular', 'location regular', '2000-01-01 00:00:00.0000000', 2, 2, 5),
	(10004, 'bio unconfirmed', 'location unconfirmed', '2000-01-01 00:00:00.0000000', 0, 3, 5)
GO

INSERT INTO ConfirmationCodes([UserId], [Code], [Expiration], [Used])
VALUES
	(10004, 'd', '2100-01-01 00:00:00.0000000', 0)
GO

INSERT INTO ConfirmationCodes([UserId], [Code], [Expiration], [Used])
VALUES
	(10004, 'a', '2000-01-01 00:00:00.0000000', 0)
GO

SELECT * FROM ConfirmationCodes
SELECT * FROM Users WHERE [Name] IN ('admin', 'moderator', 'regular', 'unconfirmed')
SELECT * FROM UserProfiles WHERE [UserId] IN (10001, 10002, 10003, 10004)
GO
