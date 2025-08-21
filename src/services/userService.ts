import { pool } from '../config/database';

export class UserService {
  static async getAllUsers() {
    const result = await pool.query('SELECT id, nome, email, role FROM users');
    return result.rows;
  }

  static async getUserById(id: number) {
    const result = await pool.query('SELECT id, nome, email, role FROM users WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async updateUser(id: number, nome: string, email: string, role: string) {
    const result = await pool.query(
      'UPDATE users SET nome = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, nome, email, role',
      [nome, email, role, id]
    );
    return result.rows[0];
  }

  static async deleteUser(id: number) {
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return { message: 'Usuário deletado com sucesso' };
  }
}
