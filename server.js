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
   res.set('Content-Type', 'text/plain');
   res.send(
      req.query.validationToken ||
         'EwCAA8l6BAAUAOyDv0l6PcCVu89kmzvqZmkWABkAAQ0e42KEy1IcwnEpn9Wvl4zV291Xd2RZjV7Uk076IwuLqfEUDuimF8Y0WRZzoIHUcDhkmal0rwmCPuNWUOBnCLO/dyfZHrnkIe8yVI/o/DBTU74sVn8pRbDi4vPJQxudfbsIBceSwzZW5wMunQp1mUEt+/lcTNOXDU5BQ1V3LdbwFyZVrl+BFWcqR+5PUfLK5IVo9coDNDCZzj4WsDjUD+ab/qLIsUqbjMic3+etf0M/8DOkOnOYUkRRgv0vm7W42nc7aZl6d94aDlzNJ4K0L1VQ+W8HRmYZkDeqs2q7ANlEst034BD/P+X/IfxajBT+fTQHuR/VJ4Q24SK6E1e4ncQDZgAACE53W4yk8IzqUAJykBGTnHTHI54hXXd8SaDCpdkQ2XI17+/th9vqm1yXd/XD5oTxcLwnMl+JEvvszDGbjp4yGWEUQaWQtN+eCke/cPoe+cLRClzYU+jz7Z9tP0q/QAhFMOE3sfXaDUYIMxTzv1pGguSpeKKjq7JcKbFInPwbM7mGR9Y06g4yAEBDAUrLHlqmGNr6i2q1bBs7GfYCCMlMfAyVotazAxkKKLVDR8FU1c6wnvlXT1t2BCdqh+NVtOJo9oX9aX9cDXqxdD7fFi1F7F40HBVqpSFTvzvLeCuV5h7CJ8Bb2gJZe2gBSnUr6yX+N/3QZUCyNCJNUDrO0iz1erUBFk1PMaewiqurA2dZYJOePA6lmsLgB5BDOs2g46pl2y8vlpSwbPmpYU7gz6Qj78b53k/EqwIRNcmPsCLR9/BaixtNdtLxd8jgUVx3CF2/qfKQKLS3Q0e21TrS7qaC0wb7b6t7A4QDCzLU0hk2Rq+YNdlCDCWo7FOQaGohUnjWSfuX7AwTHlmx1g49Zzjn4Bg7nUFNZDphE1Sj66sp9n3gI+ezoTRJzyrDb1hc+FHGy2XYqIChbv2ntOgqQ9i6zNDIY+KTWRO4ncUw7VzSchCoTBp9WyYLpmvGwvHi5IsVzomCZZjtY4zqsIaj2XpVZvSfxqVM0QLAkEjmfr3BkmBaSRQXnquTW+jN4Gz63YTCoWTuSoz4U3HTFlIXcFuMOdKoBueDbYitOCX54VgMFTlqkJlRbESy8mIerj9+zp6mbz61JV3YLMjhVBl29+3bkXPBI38WTEy/H6cNmAI='
   );
   return;

   //  // Check for validation tokens, validate them if present
   //  let areTokensValid = true;
   //  if (req.body.validationTokens) {
   //     const appId = process.env.OAUTH_CLIENT_ID;
   //     const tenantId = process.env.OAUTH_TENANT_ID;
   //     const validationResults = await Promise.all(
   //        req.body.validationTokens.map((token) =>
   //           tokenHelper.isTokenValid(token, appId, tenantId)
   //        )
   //     );

   //     areTokensValid = validationResults.reduce((x, y) => x && y);
   //  }

   //  if (areTokensValid) {
   //     if (req.body.value) {
   //        for (let i = 0; i < req.body.value.length; i++) {
   //           const notification = req.body.value[i];

   //           // Verify the client state matches the expected value
   //           if (
   //              notification.clientState == process.env.SUBSCRIPTION_CLIENT_STATE
   //           ) {
   //              console.log({ notification });
   //           }
   //        }
   //     }
   //  }

   //  res.status(202).end();
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
