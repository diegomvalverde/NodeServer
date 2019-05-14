// Mi api podrá ser ejecutada en distintos entornos
import '@babel/polyfill';

import app from './server'

async function main()
{
    await app.listen(app.get('port'));
    console.log('>>> Se ha iniciado en el puerto ', app.get('port'), " <<<")
}

main();