const mysql = require('mysql');
const inquirer = require('inquirer');

var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Gunslinger44',
    database: 'bamazon_DB'
})

console.log('connected as id - before: ' + connection.threadId);


connection.connect(function (error) {
    if (error) throw error;
    console.log('connected as id - after: ' + connection.threadId);






    function start() {
        inquirer
            .prompt({
                name: 'start',
                type: 'list',
                message: 'Please choose from the following list:',
                choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
            }).then(function (answer) {
                if (answer.start === 'Quit') {
                    connection.end();
                }
                if (answer.start === 'View Products for Sale') {
                    console.log('View')
                    connection.query('SELECT * FROM products', function (error, res) {
                        if (error) {
                            console.error(error);
                        }
                        console.table(res);
                    })
                    start();
                }
                if (answer.start === 'View Low Inventory') {
                    console.log('Low')
                    connection.query('SELECT * FROM products WHERE stock_quantity <= 5', function (error, res) {
                        if (error) {
                            console.error(error);
                        }
                        console.table(res);
                    })
                    start();
                }
                if (answer.start === 'Add to Inventory') {
                    console.log('Add')
                    inquirer
                        .prompt({
                            name: 'start',
                            type: 'input',
                            message: 'Type in the ID number of the product to update',
                        }).then(function (answer) {
                            inquirer.prompt({
                                name: 'number',
                                type: 'input',
                                message: 'What is the new stock quantity for this product?'
                            }).then(function (res) {
                                var id = answer.start;
                                var quant = res.number;
                                connection.query("UPDATE products SET stock_quantity= " + quant + " WHERE item_id= " + id, function (error, res) {
                                    if (error) {
                                        console.error(error);
                                    }
                                    // console.table(res)
                                })
                                connection.query('SELECT * FROM products', function (error, res) {
                                    if (error) {
                                        console.error(error);
                                    }
                                    console.table(res);
                                })
                                start();
                            })
                        })
                }
                if (answer.start === 'Add New Product') {
                    console.log('New')
                    inquirer.prompt({
                        name: 'name',
                        type: 'input',
                        message: 'What is the name of the new product?'
                    }).then(function (res) {
                        var name = res.name;
                        inquirer.prompt({
                            name: 'dept',
                            type: 'input',
                            message: 'In which department does this product belong?'
                        }).then(function (res) {
                            var dept = res.dept;
                            inquirer.prompt({
                                name: 'price',
                                type: 'input',
                                message: 'What is the price of the new product?'
                            }).then(function (res) {
                                var price = res.price;
                                inquirer.prompt({
                                    name: 'quant',
                                    type: 'input',
                                    message: 'What is the quantity of the new product on hand?'
                                }).then(function (res) {
                                    var quant = res.quant
                                    connection.query("INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES('"  + name + "', '" + dept + "', '" + price + "', '" + quant + "')", function (error, response) {
                                        if (error) {
                                            console.error(error)
                                        }
                                        connection.query('SELECT * FROM products', function (error, res) {
                                            if (error) {
                                                console.error(error);
                                            }
                                            console.table(res);
                                            start();
                                        })
                                    })
                                })
                            })
                        })
                    })
                    // start();
                }
            })
    }
    start();
    // connection.end();
})