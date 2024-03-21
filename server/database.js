import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise()

export async function getTodosById(id) {
    const [rows] = await pool.query(
        `SELECT td.*
         FROM todo td
         LEFT JOIN shared_todo st ON td.todo_id = st.todo_id
         WHERE td.user_id = ? OR st.shared_with_id = ?;
         `, [id, id]
    )
    return rows
}

export async function getTodoById(id) {
    const [row] = await pool.query(
        `SELECT * FROM todo WHERE todo_id = ?;`,
        [id]
    )
    return row[0]
}

export async function getSharedTodoById(id) {
    const [rows] = await pool.query(
        `SELECT * FROM shared_todo WHERE todo_id = ?`,
        [id]
    )
    return rows[0]
}
export async function getUserByID(id) {
    const [rows] = await pool.query(`SELECT * FROM user WHERE user_id = ?`, [id]);
    return rows[0];
}

export async function getUserByEmail(email) {
    const [rows] = await pool.query(`SELECT * FROM user WHERE email = ?`, [
        email,
    ]);
    return rows[0];
}

export async function createTodo(user_id, title) {
    const [result] = await pool.query(
        `
      INSERT INTO todo (user_id, title)
      VALUES (?, ?)
    `,
        [user_id, title]
    );
    const todoID = result.insertId;
    return getTodo(todoID);
}

export async function deleteTodo(id) {
    const [result] = await pool.query(
        `
      DELETE FROM todo WHERE todo_id = ?;
      `,
        [id]
    );
    return result;
}

export async function toggleCompleted(id, value) {
    const newValue = value === true ? "TRUE" : "FALSE";
    const [result] = await pool.query(
        `
      UPDATE todo
      SET completed = ${newValue} 
      WHERE todo_id = ?;
      `,
        [id]
    );
    return result;
}

export async function shareTodo(todo_id, user_id, shared_with_id) {
    const [result] = await pool.query(
        `
      INSERT INTO shared_todo (todo_id, user_id, shared_with_id) 
      VALUES (?, ?, ?);
      `,
        [todo_id, user_id, shared_with_id]
    );
    return result.insertId;
}

getUserByID(1)