const app = require('./app');
const pool = require('./utils/dbConnection');

const port = 5000;
app.listen(port, () => {
    console.log('App is running on port', port)
})