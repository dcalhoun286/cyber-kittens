const app = require('./index');
const { sequelize } = require('./db');

require('dotenv').config();

const PORT = process.env.PORT | 4000;

app.listen(PORT, () => {
  sequelize.sync({ force: false });
  console.log(`Users are ready at http://localhost:${PORT}`);
});