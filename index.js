const express = require('express');
const path = require('path');
const {dbConnect} = require('./connect');
const urlRoute = require('./routes/url');
const URLMODEL = require('./models/url');
const staticRouter = require('./routes/staticRouter');
const apiRouter = require('./routes/apiRoutes');
const app = express();
const port = 3000;

dbConnect('mongodb://localhost:27017/urlfy')
.then(() => console.log('Database Connection Sucessful'));

app.set('view engine', 'ejs');
app.set('views', path.resolve('./views'))
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(express.static("public"));
app.use(express.static("node_modules"));
app.use('/url', urlRoute);
app.use('/', staticRouter);
app.use('/api', apiRouter);

app.get('/url/:shortURL', async (req,res) => {
  const shortURL = req.params.shortURL;
  const insert = await URLMODEL.findOneAndUpdate(
    {
      shortURL
    },
    {
      $push: {
        urlVists:{ timestamp: Date.now(), },
      },
    }
  );
  res.redirect(insert.orgURL);
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})