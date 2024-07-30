const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');

require('body-parser-xml')(bodyParser);

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const saiRouter = require('./routes/service-access-information');
const m8Router = require('./routes/m8');
const consumptionReportingRouter = require('./routes/consumption-reporting');
const metricsReportingRouter = require('./routes/metrics-reporting');
const metricsUIRouter = require('./routes/reporting-ui/metrics');
const consumptionUIRouter = require('./routes/reporting-ui/consumption');
const sseRouter = require('./routes/reporting-ui/sse');

const app = express();
app.use(compression());

app.use(logger('dev'));
app.use(express.json());

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(bodyParser.text({ type: 'application/xml' }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/3gpp-m5/v2/service-access-information', saiRouter);
app.use('/m8/', m8Router);
app.use('/3gpp-m5/v2/consumption-reporting', consumptionReportingRouter);
app.use('/3gpp-m5/v2/metrics-reporting', metricsReportingRouter);

const UI_ENDPOINT = '/reporting-ui';
app.use(`${UI_ENDPOINT}/metrics`, metricsUIRouter);
app.use(`${UI_ENDPOINT}/consumption`, consumptionUIRouter);
app.use(`${UI_ENDPOINT}/sse`, sseRouter);

module.exports = app;
