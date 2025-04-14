import { Router } from 'express';
import pool from '../db';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM medicamentos');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar medicamentos');
    }
});

export default router;