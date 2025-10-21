CREATE TABLE link_type (
    link_type_Id INT PRIMARY KEY AUTO_INCREMENT,
    link_type_name VARCHAR(255) NOT NULL CHECK(CHAR_LENGTH(TRIM(link_type_name)) > 0),

    UNIQUE(link_type_name)
);

CREATE TABLE resource (
    resource_Id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE CHECK(CHAR_LENGTH(TRIM(`name`)) > 0),
    `description` TEXT NOT NULL CHECK(CHAR_LENGTH(TRIM(`description`)) BETWEEN 1 AND 8000),
    link_to_resource VARCHAR(2083) NOT NULL CHECK(CHAR_LENGTH(TRIM(link_to_resource)) > 0),
    likes_cache INT NOT NULL DEFAULT 0,
    views_cache INT NOT NULL DEFAULT 0,
    publish_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    origination_date DATE,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    producer VARCHAR(255) CHECK(CHAR_LENGTH(TRIM(producer)) > 0),
    author_user_Id INT,
    link_type_Id INT,

    FOREIGN KEY (author_user_Id) REFERENCES `user`(user_Id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (link_type_Id) REFERENCES link_type(link_type_Id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE stack (
    stack_Id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL UNIQUE CHECK(CHAR_LENGTH(TRIM(`name`)) > 0),
    `description` TEXT NOT NULL CHECK(CHAR_LENGTH(TRIM(`description`)) BETWEEN 1 AND 8000),
    likes_cache INT NOT NULL DEFAULT 0,
    views_cache INT NOT NULL DEFAULT 0,
    creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    is_recommended BOOLEAN NOT NULL DEFAULT FALSE,
    author_user_Id INT,

    FOREIGN KEY (author_user_Id) REFERENCES `user`(user_Id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE interaction_user_resource (
    interaction_user_resource_Id INT PRIMARY KEY AUTO_INCREMENT,
    is_liked BIT(1) NOT NULL DEFAULT b'0',
    is_viewed BIT(1) NOT NULL DEFAULT b'0',
    is_in_view_later BIT(1) NOT NULL DEFAULT b'0',
    is_in_favourites BIT(1) NOT NULL DEFAULT b'0',
    user_Id INT,
    resource_Id INT NOT NULL,

    UNIQUE(user_Id, resource_Id),
    FOREIGN KEY (user_Id) REFERENCES `user`(user_Id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (resource_Id) REFERENCES resource(resource_Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE interaction_user_stack (
    interaction_user_stack_Id INT PRIMARY KEY AUTO_INCREMENT,
    is_liked BIT(1) NOT NULL DEFAULT b'0',
    is_viewed BIT(1) NOT NULL DEFAULT b'0',
    is_in_view_later BIT(1) NOT NULL DEFAULT b'0',
    is_in_favourites BIT(1) NOT NULL DEFAULT b'0',
    user_Id INT,
    stack_Id INT NOT NULL,

    UNIQUE(user_Id, stack_Id),
    FOREIGN KEY (user_Id) REFERENCES `user`(user_Id) ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY (stack_Id) REFERENCES stack(stack_Id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE comment (
    comment_Id INT PRIMARY KEY AUTO_INCREMENT,
    `text` VARCHAR(800) NOT NULL CHECK(CHAR_LENGTH(TRIM(`text`)) > 0),
    likes INT NOT NULL DEFAULT 0,
    creation_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    interaction_user_resource_Id INT,
    interaction_user_stack_Id INT,

    FOREIGN KEY (interaction_user_resource_Id) REFERENCES interaction_user_resource(interaction_user_resource_Id)
                ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (interaction_user_stack_Id) REFERENCES interaction_user_stack(interaction_user_stack_Id)
                ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE resourceStack (
    resource_Id INT NOT NULL,
    stack_Id INT NOT NULL,

    PRIMARY KEY (resource_Id, stack_Id),
    FOREIGN KEY (resource_Id) REFERENCES resource(resource_Id)
                ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (stack_Id) REFERENCES stack(stack_Id)
                ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE resourceDevelopment_direction (
    resource_Id INT NOT NULL,
    development_direction_Id INT NOT NULL,

    PRIMARY KEY (resource_Id, development_direction_Id),
    FOREIGN KEY (resource_Id) REFERENCES resource(resource_Id)
                ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (development_direction_Id) REFERENCES development_direction(development_direction_Id)
                ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE rating (
    rating_Id INT PRIMARY KEY AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL CHECK(CHAR_LENGTH(TRIM(`name`)) > 0),
    rating_authority_link VARCHAR(2083) NOT NULL CHECK(CHAR_LENGTH(TRIM(rating_authority_link)) > 0),
    publish_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratingResource (
    rating_position INT NOT NULL CHECK(rating_position > 0),
    rating_Id INT NOT NULL,
    resource_Id INT NOT NULL,

    UNIQUE(rating_Id, rating_position),
    PRIMARY KEY (rating_Id, resource_Id),
    FOREIGN KEY (rating_Id) REFERENCES rating(rating_Id)
                ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (resource_Id) REFERENCES resource(resource_Id)
                ON DELETE CASCADE ON UPDATE CASCADE
);