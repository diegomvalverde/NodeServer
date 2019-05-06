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
        console.log(result);
        res.send('hola xD');
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
                proveedor: req.body.proveedor
            };
        const result = await db.collection("productos").insertOne(producto);
        console.log(result.ops[0]);
        res.send('Producto agregado exitosamente');
    }
);

export default router;