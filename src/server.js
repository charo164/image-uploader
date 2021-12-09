var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var multer = require('multer');
var upload = multer({ dest: 'public/data/uploads/' });

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../', 'public')));

const autoClear = (tp) => {
  const target_path = tp;
  setTimeout(() => {
    fs.rm(target_path, (err) => {
      if (err) console.log(err);
    });
  }, 120000);
};

app.post('/uploads', upload.single('file'), (req, res) => {
  var tmp_path = req.file.path;
  var target_path = 'public/images/uploads/' + req.file.originalname;
  var src = fs.createReadStream(tmp_path);
  var dest = fs.createWriteStream(target_path);
  src.pipe(dest);
  src.on('end', function () {
    autoClear(target_path);
    res.status(200).json({ success: true, filename: req.file.originalname });
  });
  src.on('error', function (err) {
    res.status(200).json({ success: false, src: '' });
  });
});

app.get('/', function (req, res, next) {
  res.render('index', { title: 'Image uploader' });
});

app.get('/image/:filename', function (req, res, next) {
  const filename = req.params.filename;
  res.render('image', { title: 'Image uploader', link: req.get('host') + '/' + filename, filename });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
