import express from 'express';

const app = express();

// Config
app.set('port', process.env.PORT || 3000);

// Rutas
import IndexRoutes from './routes/index.routes';
import ProductsRoutes from './routes/products.routes';

// Middlewares

app.use(express.json());

app.use(IndexRoutes);
app.use('/productos', ProductsRoutes);
export default app;
