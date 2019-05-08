import {Router} from 'express';
const router = Router();

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
        const producto =
            {
                nombre: req.body.nombre,
                proveedor: req.body.proveedor,
                categoria: req.body.categoria,
                descripcion: req.body.descripcion,
                precio: req.body.precio,
                inventario: req.body.inventario
            };
        const result = await db.collection("productos").insertOne(producto);
        console.log(result.ops[0]);
        res.send('Producto agregado exitosamente');
    }
);

router.put('/:idProducto', async (req, res) =>
    {
        const {idProducto} = req.params;
        const updateTask =
                {
                    precio:-1
                };
        const db = await connect();
        const result = await db.collection("productos").updateOne({_id: ObjectID(idProducto)}, {$inc: updateTask});

        // console.log(result.ops[0]);
        res.send('Compra exitosa');
    }
);

export default router;