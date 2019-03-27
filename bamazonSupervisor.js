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
    //////////////////////////////////////////////////////////////////////////////

    function start() {

        inquirer
            .prompt({
                name: 'start',
                type: 'list',
                message: 'Please choose from the following list:',
                choices: ['View Products Sales by Department', 'Create New Department', 'Quit']
            }).then(function (answer) {
                    if (answer.start === 'Quit') {
                        connection.end();
                    }
                    if (answer.start === 'View Products Sales by Department') {
                        connection.query('SELECT * FROM departments ORDER BY department_name', function (error, res) {
                            if (error) {
                                console.error(error);
                            }
                            console.table(res);
                            // Here, create vars of total_profit, over_head_costs, and product_sales

                            // Here, place them into variables

                            
                            // Here, join the two tables
                        
                        })
                    }
                    if (answer.start === 'Create New Department') {
                        console.log('New')
                        inquirer.prompt({
                            name: 'name',
                            type: 'input',
                            message: 'What is the name of the new Department?'
                        }).then(function (res) {
                            var name = res.name;
                            connection.query("INSERT INTO products(product_name, department_name, price, stock_quantity) VALUES('" + name + "', '" + dept + "', '" + price + "', '" + quant + "')", function (error, response) {
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
                    }})
                }
            })

start();
//////////////////////////////////////////////////////////////////////////////
