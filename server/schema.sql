CREATE DATABASE todo_app;

USE todo_app;

CREATE TABLE user (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE todo (
    todo_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT false,
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE
);

CREATE TABLE shared_todo (
    shared_id INT AUTO_INCREMENT PRIMARY KEY,
    todo_id INT,
    user_id INT,
    shared_with_id INT,
    FOREIGN KEY (todo_id) REFERENCES TODO(todo_id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES USER(user_id) ON DELETE CASCADE,
    FOREIGN KEY (shared_with_id) REFERENCES USER(user_id) ON DELETE CASCADE
);

INSERT INTO USER (name, email, password) VALUES('Simon', 'simon@example.com', '1234');
INSERT INTO USER (name, email, password) VALUES('Katalina', 'katalina@example.com', '1234');
INSERT INTO TODO (title, user_id) VALUES 
                                ('Make Lunch', 1),
                                ('Do zumba', 2),
                                ('Go for a walk', 1),
                                ('Play valorant', 2);

INSERT INTO SHARED_TODO (todo_id, user_id, shared_with_id) VALUES(4,2,1);

SELECT td.*,
       st.shared_with_id
FROM todo td
LEFT JOIN shared_todo st ON td.todo_id = st.todo_id
WHERE td.user_id = 1 OR st.shared_with_id = 1;