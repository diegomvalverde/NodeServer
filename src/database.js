import MongoClient from 'mongodb';

export async function connect()
{
    try
    {
        const client = await MongoClient.connect('mongodb://localhost:27019',
        {
            useNewUrlParser: true
        });
        console.log('Se ha conectado a la base');
        return client.db("amarson");
    }
    catch(e)
    {
        console.log(e);
    }
}
