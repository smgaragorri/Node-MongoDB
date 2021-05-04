// MongoDB
// Importar el cliente de MongoDB
const MongoClient = require('mongodb').MongoClient;

// Especificar la URL de conexión por defecto al servidor local
const url = 'mongodb://localhost:27017';

// Nombre de la base de datos a la que conectarse
const dbName = 'nodejs-mongo';

// Crear una instancia del cliente de MongoDB
const client = new MongoClient(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

function addDb(document) {
  client
    .connect()
    .then(async () => {
      console.log('Conectado con éxito al servidor');
      const db = client.db(dbName);
      // Obtener la referencia a la colección
      const collection = db.collection('usuarios');
      // Llamar a la función para insertar
      const insertResult = await collection.insertOne(document);
      console.log('Resultado de la inserción: ', insertResult.result);
      const findResult = await collection.find({}).toArray();
      console.log('Documentos recuperados: ', findResult);
      client.close();
    })
    .catch((error) => {
      console.log(
        `Se produjo algún error en las operaciones con la base de datos: ${error}`
      );
      client.close();
    });
}

// Conectar el cliente al servidor
client.connect(function (err) {
  if (err) {
    console.log('Error al conectar al servidor: ', err);
    return;
  }
  console.log('Conectado con éxito al servidor');
  client.close();
});

// Node
// Requerir el interfaz http
const http = require('http');
const querystring = require('querystring');

// Definir el puerto a utilizar
const port = 3000;

// Crear el servidor y definir la respuesta que se le da a las peticiones
const server = http.createServer((request, response) => {
  // Extrear el contenido de la petición
  const { headers, method, url } = request;
  console.log('headers: ', headers);
  console.log('method: ', method);
  console.log('url: ', url);
  let body = [];
  request
    .on('error', (err) => {
      console.error(err);
    })
    .on('data', (chunk) => {
      // El cuerpo de la petición puede venir en partes, aquí se concatenan
      body.push(chunk);
    })
    .on('end', () => {
      // El cuerpo de la petición está completo
      body = Buffer.concat(body).toString();
      console.log('body: ', body);
      addDb(querystring.decode(body));
      // Código de estado HTTP que se devuelve
      response.statusCode = 200;
      response.end();
    });
});

server.listen(port, () => {
  console.log('Servidor ejecutándose...');
  console.log('Abrir en un navegador http://localhost:3000');
});
