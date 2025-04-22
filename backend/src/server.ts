import express from 'express';
import cors from 'cors';
import patientRoutes from './routes/patients';
import medicationRoutes from './routes/medications';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/patients', patientRoutes);
app.use('/medications', medicationRoutes);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});