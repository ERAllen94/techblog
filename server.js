const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const session = require('express-session');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const helpers = require('./utils/helpers');

const hbs = exphbs.create({ helpers });
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const sess = {
    secret: 'Shhh its a secret',
    cookie: {},
    resave: false,
    saveUnitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
}

app.use(session(sess));
app.use(routes);
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

sequelize.sync({ force: false }).then(() => {
    app.listen( PORT, () => console.log('Now listening'));
});
