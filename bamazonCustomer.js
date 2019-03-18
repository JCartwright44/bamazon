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

    connection.query('SELECT * FROM products', function (error, res) {
        if (error) {
            console.error(error);
        }
        console.table(res);

    })



    function start() {
        inquirer
            .prompt({
                name: 'start',
                type: 'list',
                message: 'Start or quit?',
                choices: ['Start', 'Quit']
            }).then(function (answer) {
                if (answer.start === 'Quit') {
                    connection.end();
                } else {
                    // Inquire with two messages: 1. The first should ask them the ID of the product they would like to buy. 2. The second message should ask how many units of the product they would like to buy.
                    inquirer
                        .prompt({
                            name: 'productID',
                            type: 'input',
                            message: 'Please enter the Product ID of the product you would like to purchase.',
                        }).then(function (answer) {

                            inquirer
                                .prompt({
                                    name: 'quantity',
                                    type: 'input',
                                    message: 'What is the quantity you would like to purchase?'
                                }).then(function (response) {

                                    var quantity = parseFloat(response.quantity);
                                    connection.query('SELECT * FROM products WHERE ?', {
                                            item_id: answer.productID
                                        },
                                        function (error, res) {
                                            if (error) {
                                                console.error(error);
                                            }
                                            var stock = res[0].stock_quantity;
                                            console.log('stock: ' + stock);
                                            if (quantity > stock) {
                                                console.log('Insufficient quantity! Please start again');
                                                start();
                                            } else {
                                                console.log('Thank you for your purchase of ' + quantity + ' ' + res[0].product_name);
                                                var newStock = stock - quantity;
                                                connection.query('UPDATE products SET ? WHERE ?',
                                                    [{
                                                            stock_quantity: newStock
                                                        },
                                                        {
                                                            item_id: answer.productID
                                                        }
                                                    ],
                                                    function (error, res) {
                                                        if (error) {
                                                            console.error(error);
                                                        }
                                                        // console.log(res);
                                                        connection.query('SELECT * FROM products', function (error, res) {
                                                            if (error) {
                                                                console.error(error);
                                                            }
                                                            console.table(res);
                                                    
                                                        })
                                                    
                                                        inquirer
                                                            .prompt({
                                                                name: 'another',
                                                                type: 'list',
                                                                message: 'Would you like to make another purchase or would you like to quit?',
                                                                choices: ['Another purchase', 'Quit']
                                                            }).then(function (response) {
                                                                if (response.another === 'Another purchase') {
                                                                    start();
                                                                } else {
                                                                    console.log('Goodbye')
                                                                    connection.end();
                                                                }

                                                            })
                                                    }
                                                )
                                            }
                                        })

                                })
                        })

                }
            })
    }

    start()

})
