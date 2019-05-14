import {Router} from 'express';
const router = Router();
const redis = require('redis');
const REDIS_PORT = process.env.REDIS_PORT;

let redisClient = redis.createClient(REDIS_PORT);


redisClient.on('connect', function()
{
    console.log(">> Se ha conectado a Redis <<")
}
);


//Database connection
import {connect} from "../database";

// import {ObjectID} from "mongodb";

const {ObjectID} = require("mongodb");

// Consulta toda la colección de la base
router.get('/', async (req, res) => {
        const db = await connect();
        const result = await db.collection("productos").find({}).toArray();
        // console.log(result);
        res.json(result);
    }
);

// Consulta la colección de la base por proveedor
router.get('/:id', async (req, res) => {
        const {id} = req.params;
        const db = await connect();
        const result = await db.collection("productos").find({proveedor: id}).toArray();
        // console.log(result);
        res.json(result);
    }
);


router.post('/', async (req, res) => {
        const db = await connect();
        // console.log(req.body);
        const proveedor = req.body.proveedor;
        const producto =
            {
                nombre: req.body.nombre,
                categoria: req.body.categoria,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                inventario: req.body.inventario
            };
        const result = await db.collection("productos").update({ proveedor: proveedor},
            {
                $push: {
                    productos: producto
                }
            }, { upsert: true }
            );
        console.log(result.ops[0]);
        res.send('Producto agregado exitosamente');
    }
);

router.put('/:idProveedor/:idProducto', async (req, res) =>
    {
        const {idProveedor, idProducto} = req.params;
        const db = await connect();
        const result = await db.collection("productos").updateOne({_id: ObjectID(idProveedor), "productos.nombre" : idProducto}, {$inc: {"productos.$.inventario": -1}});

        // console.log(result.ops[0]);
        res.send('Compra exitosa');
    }
);

export default router;