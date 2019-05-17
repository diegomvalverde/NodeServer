import {Router} from 'express';
const router = Router();
const redis = require('redis');
const {promisify} = require('util');
const REDIS_PORT = process.env.REDIS_PORT;

// bluebird.promisifyAll(redis);

const redisClient = redis.createClient(REDIS_PORT);
const getAsync = promisify(redisClient.get).bind(redisClient);
const exists = promisify(redisClient.exists).bind(redisClient);

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
    try {
        const db = await connect();
        const proveedores = await db.collection("proveedores").find({}, {proveedor: "", id: 0}).toArray();
        // console.log(proveedores);
        const products = [];
        for (let i = 0; i < proveedores.length; i++) {
            const prov = proveedores[i].proveedor;
            try {

                const pro = await db.collection("productos").find({proveedor: prov}).toArray();
                // console.log(pro[0].proveedor);
                const prod = {proveedor:prov, online:1, productos:pro[0].productos};
                redisClient.set(pro[0].proveedor, JSON.stringify(prod));
                products.push(prod);

            }
            catch(e) {
                // console.log(e)
                if(await redisClient.exists(prov))
                {
                    const jsonProductos = JSON.parse(await getAsync(prov));
                    // console.log(JSON.parse(productos));
                    const prod = {proveedor:prov, online:0, productos:jsonProductos.productos};
                    redisClient.set(prov, JSON.stringify(prod));
                    products.push(prod);
                }
            }
        }
        // const result = await db.collection("productos").find({}).toArray();
        // console.log(proveedores[0].proveedor);
        // console.log(proveedores);
        res.json(products);
    }
    catch(e)
    {

    }
    }

);

// Consulta la colección de la base por proveedor
router.get('/:nombreProveedor', async (req, res) => {
    const {nombreProveedor} = req.params;
    if (await exists(nombreProveedor))
    {
        const resultado = JSON.parse(await getAsync(nombreProveedor));
        console.log("Se cargó de redis...");
        res.json(resultado);
    }
    else {
        const db = await connect();
        const result = await db.collection("productos").find({proveedor: nombreProveedor}).toArray();
        const jsonResult = {proveedor:result[0].proveedor, online:1, productos:result[0].productos};
        redisClient.set(jsonResult.proveedor, JSON.stringify(jsonResult));
        // console.log(jsonResult);
        res.json(jsonResult);
    }
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
        const result = await db.collection("productos").update({ "proveedor": proveedor},
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
