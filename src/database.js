import MongoClient from 'mongodb';

export async function connect()
{
    try
    {
        const client = await MongoClient.connect('mongodb://localhost:27019',
        {
            useNewUrlParser: true,
            connectTimeoutMS:1000,
            socketTimeoutMS:1000,
            serverSelectionTimeoutMS:1000

        });
        // console.log('Se ha conectado a la base');

        return client.db("amarson");
    }
    catch(e)
    {
        console.log(e);
    }
}
