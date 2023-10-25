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
    async getOne(req, res){
        try {
            const libro = req.body;
            const id_libro = parseInt(libro.id);
            const [result] = await pool.query(`SELECT * FROM libros WHERE id=(?)`, [id_libro]);
            
            if (result.length === 0) {
                throw new Error('Ups! El libro no fue encontrado. Intente nuevamente');
            }

            res.json(result[0]);

        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'El ID que busca no existe' });
        }
    }

    // agregar un nuevo registro
    async add(req, res) {
        const libro = req.body;
        const [result] = await pool.query(`INSERT INTO libros(nombre, autor, categoria, anio_publicacion, isbn) 
        VALUES (?, ?, ?, ?, ?)`, [libro.nombre, libro.autor, libro.categoria, libro.anio_publicacion, libro.isbn]);
        res.json({"Id insertado": result.insertId});
    }

    // actualizar un registro existente
    async update(req, res) {
        try {
            const libro = req.body;
            const [result] = await pool.query(`UPDATE libros SET nombre=(?), autor=(?), categoria=(?), anio_publicacion=(?), isbn=(?) WHERE id=(?)`, 
                            [libro.nombre, libro.autor, libro.categoria, libro.anio_publicacion, libro.isbn, libro.id]);
        

            if (result.changedRows === 0 || libro.id === 0 || libro.id == "") {
                throw new Error('El libro que busca no fue encontrado');
            }

            res.json({"Registros actualizados": result.changedRows});

        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'El ID no existe' });
        }
    }

    // borrar un registro
    async delete(req, res) {
        const libro = req.body;
        const [result] = await pool.query(`DELETE FROM libros WHERE isbn=(?)`, [libro.isbn]);
        res.json({"Registros eliminados": result.affectedRows});
    }
}

// se exporta (crea un objeto) para que pueda ser visible fuera del archivo
export const libro = new LibroController(); 