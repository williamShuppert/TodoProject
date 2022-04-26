USE master
GO

/***** Database *****/
IF DB_ID('Todo') IS NOT NULL
	DROP DATABASE Todo
GO

CREATE DATABASE Todo
GO 

USE Todo
GO

/***** Tables *****/
CREATE TABLE Users (
	Id			INT				NOT NULL	PRIMARY KEY	IDENTITY,
	Username	VARCHAR(100)	COLLATE Latin1_General_100_CS_AI	NOT NULL	UNIQUE,
	Password	VARBINARY(100)	NOT NULL,
	Salt		NVARCHAR(36)	NOT NULL,
	IsDeleted	BIT				NOT NULL	DEFAULT(0)
)
GO

CREATE TABLE Lists (
	Id		INT				NOT NULL	PRIMARY KEY	IDENTITY,
	OwnerId	INT				NOT NULL,
	Name	VARCHAR(150)	NOT NULL,
	FOREIGN KEY(ownerId) REFERENCES Users(id)
)
GO

CREATE TABLE Items (
	Id				INT				NOT NULL	PRIMARY KEY IDENTITY,
	ListId			INT				NOT NULL,
	Content			VARCHAR(150),
	IsComplete		BIT				NOT NULL	DEFAULT(0),
	DisplayOrder	INT				NOT NULL	DEFAULT(0),
	FOREIGN KEY(listId) REFERENCES Lists(id)
)
GO

/***** Views *****/
CREATE VIEW ActiveUsers AS
SELECT Id, Username, Password, Salt FROM Users WHERE IsDeleted = 0
GO

/***** Stored Procs *****/
CREATE PROC spAddUser
	@username	VARCHAR(25),
	@password	NVARCHAR(60)
AS BEGIN SET NOCOUNT ON

	IF EXISTS (SELECT * FROM Users WHERE Username collate Latin1_General_CS_AS = @username) BEGIN
		SELECT Id = -1, Success = 0, Message = 'username already in use'
		RETURN
	END

	DECLARE @salt NVARCHAR(36) = CAST(NEWID() AS NVARCHAR(36))

	INSERT INTO Users VALUES (
		@username,
		HASHBYTES('SHA2_256', @salt + @password),
		@salt,
		0
	)

	SELECT Id = @@IDENTITY, Success = 1, Message = 'user created'
END
GO

CREATE PROC spUpdateUser
	@id	INT,
	@username	VARCHAR(25)		= NULL,
	@password	NVARCHAR(60)	= NULL
AS BEGIN SET NOCOUNT ON

	IF EXISTS (SELECT TOP(1) * FROM Users WHERE Username collate Latin1_General_CS_AS = @username) BEGIN
		SELECT Success = 0, Message = 'username already in use'
		RETURN
	END

	IF @password IS NOT NULL BEGIN
		DECLARE @salt NVARCHAR(36) = CAST(NEWID() AS NVARCHAR(36))

		UPDATE Users SET
			Password = HASHBYTES('SHA2_256', @salt + @password),
			Salt = @salt
		WHERE Id = @id
	END

	UPDATE Users
	SET	Username = ISNULL(@username, Username)
	WHERE Id = @id

	SELECT Success = 1, Message = 'user updated'
END
GO

CREATE PROC spDeleteUser
	@id	INT
AS BEGIN SET NOCOUNT ON
	UPDATE Users 
	SET IsDeleted = 1
	WHERE Id = @id
END
GO

CREATE PROC spLogin
	@username	VARCHAR(100),
	@password	NVARCHAR(100)
AS BEGIN SET NOCOUNT ON

	DECLARE @id INT = (
		SELECT ISNULL(Id, -1) FROM ActiveUsers
			WHERE
				Username collate Latin1_General_CS_AS = @username AND
				Password = HASHBYTES('SHA2_256', Salt + @password)
	)

	IF (@id != -1) BEGIN
		SELECT Id = @id, Success = 1, Message = 'user verified'
		RETURN
	END

	SELECT Id = @id, Success = 0, 'incorrect credentials'
END
GO

CREATE PROC spLogout
	@username	VARCHAR(100)
AS BEGIN SET NOCOUNT ON
	SELECT Success = 1
END
GO

CREATE PROC spAddList
	@ownerId	INT,
	@name		VARCHAR(150)
AS BEGIN SET NOCOUNT ON
	INSERT INTO Lists VALUES (
		@ownerId,
		@name
	)
	SELECT Id = @@IDENTITY, OwnerId = @ownerId, Name = @name
END
GO

CREATE PROC spGetList
	@listId	INT
AS BEGIN SET NOCOUNT ON
	SELECT * FROM Lists WHERE Id = @listId
END
GO

CREATE PROC spGetLists
	@ownerId	INT
AS BEGIN SET NOCOUNT ON
	SELECT * FROM Lists WHERE OwnerId = @ownerId
END
GO

CREATE PROC spUpdateList
	@listId	INT,
	@ownerId INT,
	@name	VARCHAR(150)
AS BEGIN SET NOCOUNT ON
	UPDATE Lists
	SET Name = @name
	WHERE Id = @listId AND OwnerId = @ownerId
END
GO

CREATE PROC spDeleteList
	@listId		INT,
	@ownerId	INT
AS BEGIN SET NOCOUNT ON
	DECLARE @listOwnerId INT = (SELECT OwnerId FROM Lists WHERE Id = @listId)

	IF (@listOwnerId IS NULL OR @listOwnerId != @ownerId) BEGIN
		SELECT Success = 0, Message = 'user does not own list'
		RETURN
	END

	DELETE FROM Items WHERE ListId = @listId
	DELETE FROM Lists WHERE Id = @listId

	SELECT Success = 1, Message = 'list deleted'
END
GO

CREATE PROC spAddItem
	@listId			INT,				
	@content		VARCHAR(150),
	@displayOrder	INT = 0,
	@reqUserId		INT
AS BEGIN SET NOCOUNT ON

	DECLARE @listOwnerId INT = (SELECT OwnerId FROM Lists WHERE Id = @listId)

	IF (@listOwnerId IS NULL OR @listOwnerId != @reqUserId) BEGIN
		SELECT Id = -1
		RETURN
	END

	INSERT INTO Items VALUES (
		@listId,
		@content,
		0,
		@displayOrder
	)
	SELECT Id = @@IDENTITY
END
GO

CREATE PROC spGetItems
	@listId		INT,
	@reqUserId	INT
AS BEGIN SET NOCOUNT ON
	DECLARE @listOwnerId INT = (SELECT OwnerId FROM Lists WHERE Id = @listId)

	IF (@listOwnerId IS NULL OR @reqUserId != @listOwnerId) BEGIN
		SELECT NULL
		SELECT Success = 0, Message = 'user does not own list'
		RETURN
	END

	SELECT * FROM Items WHERE ListId = @listId ORDER BY DisplayOrder, IsComplete, Id
	SELECT Success = 1, Message = 'items found'
END
GO

CREATE PROC spUpdateItem
	@id				INT,
	@listId			INT = NULL,				
	@content		VARCHAR(150) = NULL,
	@isComplete		BIT = NULL,
	@displayOrder	INT = NULL,
	@reqUserId		INT
AS BEGIN SET NOCOUNT ON
	DECLARE @listOwnerId INT = (SELECT OwnerId FROM Lists l JOIN Items i ON i.ListId = l.Id WHERE i.Id = @id)

	IF (@listOwnerId IS NULL OR @reqUserId != @listOwnerId) BEGIN
		SELECT Success = 0, Message = 'user does not own list'
		RETURN
	END

	UPDATE Items SET
		ListId = ISNULL(@listId, ListId),
		Content = ISNULL(@content, Content),
		DisplayOrder = ISNULL(@displayOrder, DisplayOrder),
		IsComplete = ISNULL(@isComplete, IsComplete)
	WHERE Id = @id

	SELECT Success = 1, Message = 'items updated'
END
GO

CREATE PROC spDeleteItem
	@id			INT,
	@listId		INT,
	@reqUserId	INT
AS BEGIN SET NOCOUNT ON
	DECLARE @listOwnerId INT = (SELECT OwnerId FROM Lists l JOIN Items i ON i.ListId = l.Id WHERE i.Id = @id AND l.Id = @listId)

	IF (@listOwnerId IS NULL OR @reqUserId != @listOwnerId) BEGIN
		SELECT Success = 0, Message = 'user does not own list'
		RETURN
	END

	DELETE FROM Items WHERE Id = @id

	SELECT Success = 1, Message = 'item deleted'
END
GO