IF NOT EXISTS (
    SELECT name
FROM sys.databases
WHERE name = 'MuseumDB'
)
CREATE DATABASE MuseumDB;
GO
