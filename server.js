require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const { logger, logEvents } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
// const corsOptions = require("./config/corsOptions");
const connectDB = require('./config/dbConn.js');
const tokenHelper = require('./helpers/tokenHelper.js');

const PORT = process.env.PORT || 3500;

connectDB();

app.use(logger);

// app.use(cors(corsOptions))
app.use(cors());

app.use(express.json());

app.use(cookieParser());

app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', require('./route/root'));

/** route for users */
app.use('/users', require('./route/userRoutes'));

/** route for ages */
app.use('/ages', require('./route/ageRoutes'));

/** route for branches */
app.use('/branches', require('./route/branchRoutes'));

/** route for skills */
app.use('/skills', require('./route/skillRoutes'));

/** route for products */
app.use('/products', require('./route/productRoutes'));

/** route for roles */
app.use('/roles', require('./route/roleRoutes'));

/** route for carts */
app.use('/carts', require('./route/cartRoutes'));

/** route for orders */
app.use('/orders', require('./route/orderRoutes'));

/** route for mails */
app.use('/mails', require('./route/mailRoutes'));

app.get('/calendar', async (req, res) => {
   if (req.query && req.query.validationToken) {
      res.set('Content-Type', 'text/plain');
      res.send(req.query.validationToken);
      return;
   }

   // Check for validation tokens, validate them if present
   let areTokensValid = true;
   if (req.body.validationTokens) {
      const appId = process.env.OAUTH_CLIENT_ID;
      const tenantId = process.env.OAUTH_TENANT_ID;
      const validationResults = await Promise.all(
         req.body.validationTokens.map((token) =>
            tokenHelper.isTokenValid(token, appId, tenantId)
         )
      );

      areTokensValid = validationResults.reduce((x, y) => x && y);
   }

   if (areTokensValid) {
      for (let i = 0; i < req.body.value.length; i++) {
         const notification = req.body.value[i];

         // Verify the client state matches the expected value
         if (
            notification.clientState == process.env.SUBSCRIPTION_CLIENT_STATE
         ) {
            console.log({ notification });
         }
      }
   }

   res.status(202).end();
});

app.all('*', (req, res) => {
   res.status(404);
   if (req.accepts('html')) {
      res.sendFile(path.join(__dirname, 'views', '404.html'));
   } else if (req.accepts('json')) {
      res.json({
         message: '404 Not Found',
      });
   } else {
      res.type('txt').send('404 Not Found');
   }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
   console.log('Connected to mongoDB');
   app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
   console.log(err);
   logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      'mongoErrLog.log'
   );
});
