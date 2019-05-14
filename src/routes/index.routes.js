import {Router} from 'express';
const router = Router();

router.get('/', (req, res) =>
{
    res.send('Bienvenido a Amarson.' +
        '\n' +
        'Esperamos que encuentres el producto que buscas')
}
);
export default router;