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
            })
        }
        if (answer.start === 'Create New Department') {
            
        }









}
start();
    //////////////////////////////////////////////////////////////////////////////
})