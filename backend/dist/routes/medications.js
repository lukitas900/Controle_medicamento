"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../db"));
const router = (0, express_1.Router)();
router.get('/', async (req, res) => {
    try {
        const result = await db_1.default.query('SELECT * FROM medicamentos');
        res.json(result.rows);
    }
    catch (err) {
        console.error(err);
        res.status(500).send('Erro ao buscar medicamentos');
    }
});
exports.default = router;
