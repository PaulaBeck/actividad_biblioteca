import {pool} from './database.js';

// req (request)-> corresponde a la solicitud del cliente
// res (response)-> corresponde a la rta que se le otorga desde el servidor
// con los simbolos [] limitamos a que solo muestre la primer lista y evitar traer la informacion del buffer

class LibroController {
    // obtenemos todo lo que tengamos en la BD con el metodo "getAll"
    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }

    // obtenemos los datos de un registro a partir del id
    async getOne(req, res) {
            const libro = req.body;
            const id_libro = parseInt(libro.id);
            const [result] = await pool.query(`SELECT * FROM libros WHERE id=(?)`, [id_libro]);

            // si el id coincide con la bd, muestra los datos, caso contrario, muestra un error
            if (result[0] != undefined) {
                res.json(result);
            } else {
                res.json({"Error": "Ups, no se ha encontrado el ID del libro"});
            }
    }
}

// se exporta (crea un objeto) para que pueda ser visible fuera del archivo
export const libro = new LibroController(); 