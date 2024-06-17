const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

const connection = mysql.createConnection({
    user: 'root',
    password: 'pandora987600',
    host: 'localhost',
    port: '3306',
    database: 'productnode'
});

connection.connect((err) => {
    if (err) {
      console.error('Помилка підключення до бази даних: ' + err.stack);
      return;
    }
    console.log('Підключено до бази даних.');
});

app.get('/', (req, res) => {
    connection.query('SELECT * FROM Materials', (error, materialsResults) => {
        if (error) throw error;
        const materials = materialsResults;

        connection.query('SELECT * FROM Warehouse', (error, warehouseResults) => {
            if (error) throw error;
            const warehouses = warehouseResults;

            connection.query('SELECT * FROM Operations', (error, operationsResults) => {
                if (error) throw error;
                const operations = operationsResults;

                connection.query('SELECT * FROM Suppliers', (error, suppliersResults) => {
                    if (error) throw error;
                    const suppliers = suppliersResults;

                    res.render('view', { materials, warehouses, operations, suppliers });
                });
            });
        });
    });
});

app.post('/materials', (req, res) => {
    const { material_name, price, quantity, availability, description } = req.body;
    connection.query('INSERT INTO Materials (material_name, price, quantity, availability, description) VALUES (?, ?, ?, ?, ?)', 
        [material_name, price, quantity, availability, description], 
        (error, results) => {
            if (error) throw error;
            res.redirect('/');
        }
    );
});

app.post('/materials/delete', (req, res) => {
    const materialId = req.body.material_id;
    connection.query('DELETE FROM Materials WHERE material_ID = ?', [materialId], (error, results) => {
        if (error) throw error;
        res.redirect('/');
    });
});

app.post('/materials/update', (req, res) => {
    const { material_id, material_name, price, quantity, availability, description } = req.body;
    connection.query('UPDATE Materials SET material_name = ?, price = ?, quantity = ?, availability = ?, description = ? WHERE material_ID = ?', 
        [material_name, price, quantity, availability, description, material_id], 
        (error, results) => {
            if (error) throw error;
            res.redirect('/');
        }
    );
});

app.post('/warehouse/create', (req, res) => {
    const { warehouse_name, address, contact_information } = req.body;
    connection.query('INSERT INTO Warehouse (warehouse_name, address, contact_information) VALUES (?, ?, ?)', 
        [warehouse_name, address, contact_information], 
        (error, results) => {
            if (error) throw error;
            res.redirect('/');
        }
    );
});

app.post('/warehouse/delete', (req, res) => {
    const warehouseId = req.body.warehouse_id;
    connection.query('DELETE FROM Warehouse WHERE warehouse_id = ?', [warehouseId], (error, results) => {
        if (error) throw error;
        res.redirect('/');
    });
});

app.post('/suppliers/add', (req, res) => {
    const { company_name, contact_information, additional_info } = req.body;
    connection.query('INSERT INTO Suppliers (company_name, contact_information, additional_info) VALUES (?, ?, ?)', 
        [company_name, contact_information, additional_info], 
        (error, results) => {
            if (error) throw error;
            res.redirect('/');
        }
    );
});

app.post('/suppliers/delete', (req, res) => {
    const supplierId = req.body.supplier_id;
    connection.query('DELETE FROM Suppliers WHERE supplier_id = ?', [supplierId], (error, results) => {
        if (error) throw error;
        res.redirect('/');
    });
});

app.post('/operations/add', (req, res) => {
    const { operation_type, operation_date, material_id, quantity, target_warehouse_id } = req.body;
    connection.query('INSERT INTO Operations (operation_type, operation_date, material_id, quantity, target_warehouse_id) VALUES (?, ?, ?, ?, ?)', 
        [operation_type, operation_date, material_id, quantity, target_warehouse_id], 
        (error, results) => {
            if (error) throw error;
            res.redirect('/');
        }
    );
});

app.post('/operations/delete', (req, res) => {
    const operationId = req.body.operation_id;
    connection.query('DELETE FROM Operations WHERE operation_id = ?', [operationId], (error, results) => {
        if (error) throw error;
        res.redirect('/');
    });
});

app.listen(PORT, () => console.log(`Сервер запущено на порту ${PORT}`));
module.exports = connection;