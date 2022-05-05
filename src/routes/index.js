import auth from './authRoutes.js';
import transactions from './transactionsRoutes.js';

function init(app) {
    app.use(auth);
    app.use(transactions);
}

export default init;
