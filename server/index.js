const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */


/* Find Company by Name */
app.get('/search/company/name/:companyName', routes.findCompanyByName);

/* Find Company by Name and Financing Type */
app.get('/search/company/name/:companyName/financingType/:ftype', routes.findCompanyByNameAndFinancing);

/* Find Company by Name and State */
app.get('/search/company/name/:companyName/state/:cstate', routes.findCompanyByNameAndState);

/* Find Company by Name, Financing Type, and State */
app.get('/search/company/name/:companyName/financingType/:ftype/state/:cstate', routes.findCompanyByNameFinState);

/* Find Company by Financing Type and State */
app.get('/search/company/financingType/:ftype/state/:cstate', routes.findCompanyByFinancingAndState);

/* Get Company Info By CIK */
app.get('/company/:CIK', routes.getCompanyByCIK);

/* Get Web Traffic Info By Company CIK */
app.get('/webtraffic/:CIK', routes.getWebTrafficByCIK);

/* Get Industry Web Traffic Averages By Company CIK */
app.get('/webtraffic/industry/:CIK', routes.getIndusAvgByCIK);

/* Get Daily Web Traffic Data */
app.get('/webanalytics/daily', routes.getDailyWebAnalytics);

/* Get Monthly Web Traffic Data */
app.get('/webanalytics/monthly', routes.getMonthlyWebAnalytics);

/* Get Yearly Web Traffic Data */
app.get('/webanalytics/yearly', routes.getYearlyWebAnalytics);

/* Get Alexa Web Traffic Data */
app.get('/webanalytics/alexa', routes.getAlexaWebAnalytics);

/* Get Foreign Incorporation Jurisdictions for Form C Companies */
app.get('/legal/formc', routes.getJxFormC);

/* Get Foreign Incorporation Jurisdictions for Form D Companies */
app.get('/legal/formd', routes.getJxFormD);

/* Get Form Cs By CIK */
app.get('/formc/:CIK', routes.getFormCByCIK);

/* Get Form Ds By CIK */
app.get('/formd/:CIK', routes.getFormDByCIK);

/* Get Dropdown of People  */
app.get('/peopleList/:search', routes.getPeopleList)

/* Get Individual Person's Page Details */
app.get('/people/:name', routes.getPersonDetails)

/* Get a button for each industry type */
app.get('/industries', routes.getAllIndustries);

/* Get top companies by revenue for a given industry type */
app.get('/industries/:industryType', routes.getTopRevenueInIndustry);

/* Get Summary Form D Data for Person */
app.get('/summary/formd/:name', routes.getSummaryDataFormDForPerson)

/* Get Summary Form C for Person */
app.get('/summary/formc/:name', routes.getSummaryDataFormCForPerson)

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});
