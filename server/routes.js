var config = require('./db-config.js');
var mysql = require('mysql');

config.connectionLimit = 11;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */



function findCompanyByName(req, res) {

  var query = `
    SELECT * FROM COMPANY WHERE COMPANYNAME LIKE "%${req.params.companyName}%";
  `;

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}



function findCompanyByNameAndFinancing (req, res) {

  var query;
  if (req.params.ftype == "crowdFunding") {
    query = `
      SELECT * 
      FROM COMPANY WHERE COMPANYNAME LIKE "%${req.params.companyName}%"
      AND EXISTS (SELECT * FROM FORM_C WHERE FORM_C.CIK = COMPANY.CIK);`;
  }
  else if (req.params.ftype == "privatePlacement") {
    query = `
      SELECT * 
      FROM COMPANY WHERE COMPANYNAME LIKE "%${req.params.companyName}%"
      AND EXISTS (SELECT * FROM FORM_D WHERE FORM_D.CIK = COMPANY.CIK);`;
  } 
  else {
    query = `
      SELECT * FROM COMPANY WHERE COMPANYNAME LIKE "%${req.params.companyName}%";`;
  }

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}



function findCompanyByNameAndState (req, res) {
  var query = `
    SELECT * FROM COMPANY WHERE COMPANYNAME LIKE "%${req.params.companyName}%" AND STATEORCOUNTRY = "${req.params.cstate}";
  `;

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function findCompanyByNameFinState (req, res) {
  var query;
  if (req.params.ftype == "crowdFunding") {
    query = `
      SELECT * 
      FROM COMPANY WHERE COMPANYNAME LIKE "%${req.params.companyName}%" AND STATEORCOUNTRY = "${req.params.cstate}"
      AND EXISTS (SELECT * FROM FORM_C WHERE FORM_C.CIK = COMPANY.CIK);`;
  }
  else if (req.params.ftype == "privatePlacement") {
    query = `
      SELECT * 
      FROM COMPANY WHERE COMPANYNAME LIKE "%${req.params.companyName}%" AND STATEORCOUNTRY = "${req.params.cstate}"
      AND EXISTS (SELECT * FROM FORM_D WHERE FORM_D.CIK = COMPANY.CIK);`;
  } 
  else {
    query = `
      SELECT * FROM COMPANY WHERE COMPANYNAME LIKE "%${req.params.companyName}%" AND STATEORCOUNTRY = "${req.params.cstate}";`;
  }

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function findCompanyByFinancingAndState (req, res) {
  var query;
  if (req.params.ftype == "crowdFunding") {
    query = `
      SELECT * 
      FROM COMPANY WHERE STATEORCOUNTRY = "${req.params.cstate}"
      AND EXISTS (SELECT * FROM FORM_C WHERE FORM_C.CIK = COMPANY.CIK);`;
  }
  else if (req.params.ftype == "privatePlacement") {
    query = `
      SELECT * 
      FROM COMPANY WHERE STATEORCOUNTRY = "${req.params.cstate}"
      AND EXISTS (SELECT * FROM FORM_D WHERE FORM_D.CIK = COMPANY.CIK);`;
  } 
  else {
    query = `
      SELECT * FROM COMPANY WHERE STATEORCOUNTRY = "${req.params.cstate}";`;
  }

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getCompanyByCIK(req, res) {

  var query = `
    SELECT * FROM COMPANY WHERE CIK = ${req.params.CIK};
  `;

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}



function getWebTrafficByCIK(req, res) {
  
  var query = `
    SELECT * FROM WEB_TRAFFIC WHERE CIK = ${req.params.CIK};
  `;

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getIndusAvgByCIK(req, res) {
  var query = `
    SELECT INDUSTRYGROUPTYPE FROM FORM_D WHERE CIK = ${req.params.CIK};
  `;

  connection.query(query, function (err, rows) {
    var industry;
    if (err) console.log(err);
    else {
      industry = rows[0].INDUSTRYGROUPTYPE;
    }

    query2 = `
      SELECT 
      
      AVG(VISITORS_DAILY) as AVG_VISITORS_DAILY, AVG(VISITORS_MONTHLY) as AVG_VISITORS_MONTHLY, AVG(VISITORS_YEARLY) as AVG_VISITORS_YEARLY,
      AVG(PAGEVIEWS_DAILY) AS AVG_PAGEVIEWS_DAILY, AVG(PAGEVIEW_MONTHLY) AS AVG_PAGEVIEWS_MONTHLY, AVG(PAGEVIEW_YEARLY) AS AVG_PAGEVIEWS_YEARLY
      
      FROM
      
      (SELECT DISTINCT CIK
      FROM FORM_D
      WHERE INDUSTRYGROUPTYPE = "${industry}") t1
      
      JOIN WEB_TRAFFIC USING(CIK);
    `

    connection.query(query2, function (err, rows2) {
      if (err) console.log(err);
      else {
        rows2.push({industry});
        res.json(rows2);
      }
    })


  });
}


function getFormCByCIK(req, res) {

  var query = `
    SELECT * FROM FORM_C WHERE CIK = ${req.params.CIK};
  `;

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

}



function getFormDByCIK(req, res) {

  var query = `
    SELECT * FROM FORM_D WHERE CIK = ${req.params.CIK};
  `;

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });

}

function getPersonDetails(req, res) {

  var query = `
    SELECT COMPANY.CIK, PERSON.NAME, PERSON.TITLE, COMPANY.COMPANYNAME, CITY, 
    STATEORCOUNTRY FROM PERSON 
    JOIN COMPANY ON PERSON.CIK = COMPANY.CIK
    WHERE NAME='${req.params.name}';
  `;

  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getPeopleList(req,res){            
  var query=`(SELECT DISTINCT(Name) FROM PERSON WHERE NAME LIKE '${req.params.search}%')
  UNION                                                                                                      
  (SELECT DISTINCT(NAME) FROM PERSON WHERE NAME LIKE '%${req.params.search}%' AND NAME NOT LIKE '_${req.params.search}%');
  `
  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}


function getAllIndustries(req, res) {
  var query = `select distinct INDUSTRYGROUPTYPE from FORM_D order by INDUSTRYGROUPTYPE;`;
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getDailyWebAnalytics(req, res) {
  var query = `
    SELECT WEB_TRAFFIC.VISITORS_DAILY AS VISITORS, AVG(FORM_C.REVENUEMOSTRECENTFISCALYEAR) AS AVG_REV
    FROM WEB_TRAFFIC JOIN COMPANY USING(CIK) JOIN FORM_C USING(CIK)
    WHERE WEB_TRAFFIC.VISITORS_DAILY > 0 AND FORM_C.REVENUEMOSTRECENTFISCALYEAR > 0
    GROUP BY WEB_TRAFFIC.VISITORS_DAILY
    ORDER BY WEB_TRAFFIC.VISITORS_DAILY;`;

  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getMonthlyWebAnalytics(req, res) {
  var query = `
    SELECT WEB_TRAFFIC.VISITORS_MONTHLY AS VISITORS, AVG(FORM_C.REVENUEMOSTRECENTFISCALYEAR) AS AVG_REV
    FROM WEB_TRAFFIC JOIN COMPANY USING(CIK) JOIN FORM_C USING(CIK)
    WHERE WEB_TRAFFIC.VISITORS_MONTHLY > 0 AND FORM_C.REVENUEMOSTRECENTFISCALYEAR > 0
    GROUP BY WEB_TRAFFIC.VISITORS_MONTHLY
    ORDER BY WEB_TRAFFIC.VISITORS_MONTHLY;`;

  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getYearlyWebAnalytics(req, res) {
  var query = `
    SELECT WEB_TRAFFIC.VISITORS_YEARLY AS VISITORS, AVG(FORM_C.REVENUEMOSTRECENTFISCALYEAR) AS AVG_REV
    FROM WEB_TRAFFIC JOIN COMPANY USING(CIK) JOIN FORM_C USING(CIK)
    WHERE WEB_TRAFFIC.VISITORS_YEARLY > 0 AND FORM_C.REVENUEMOSTRECENTFISCALYEAR > 0
    GROUP BY WEB_TRAFFIC.VISITORS_YEARLY
    ORDER BY WEB_TRAFFIC.VISITORS_YEARLY;`;

  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getAlexaWebAnalytics(req, res) {
  var query = `
    SELECT WEB_TRAFFIC.ALEXA_RANK_3_MONTHS AS VISITORS, AVG(FORM_C.REVENUEMOSTRECENTFISCALYEAR) AS AVG_REV
    FROM WEB_TRAFFIC JOIN COMPANY USING(CIK) JOIN FORM_C USING(CIK)
    WHERE WEB_TRAFFIC.ALEXA_RANK_3_MONTHS > 0 AND FORM_C.REVENUEMOSTRECENTFISCALYEAR > 0
    GROUP BY WEB_TRAFFIC.ALEXA_RANK_3_MONTHS
    ORDER BY WEB_TRAFFIC.ALEXA_RANK_3_MONTHS DESC;`;

  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getJxFormC(req, res) {
  var query = `
      SELECT JURISDICTIONORGANIZATION, COUNT(JURISDICTIONORGANIZATION) AS COUNT
      FROM FORM_C JOIN COMPANY USING(CIK)
      WHERE STATEORCOUNTRY != JURISDICTIONORGANIZATION
      GROUP BY JURISDICTIONORGANIZATION
      ORDER BY COUNT(JURISDICTIONORGANIZATION) DESC
      LIMIT 10;`;

  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getJxFormD(req, res) {
  var query = `
      SELECT JURISDICTIONORGANIZATION, COUNT(JURISDICTIONORGANIZATION) AS COUNT
      FROM FORM_D JOIN COMPANY USING(CIK)
      WHERE STATEORCOUNTRY != JURISDICTIONORGANIZATION
      GROUP BY JURISDICTIONORGANIZATION
      ORDER BY COUNT(JURISDICTIONORGANIZATION) DESC
      LIMIT 10;`;

  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};


function getTopRevenueInIndustry(req, res) {
  var industryType = req.params.industryType;
  var query = `
  SELECT COMPANY.COMPANYNAME AS companyName, AVG(FORM_C.REVENUEMOSTRECENTFISCALYEAR) AS revenue
  FROM FORM_C JOIN FORM_D ON FORM_C.CIK = FORM_D.CIK JOIN COMPANY ON FORM_C.CIK = COMPANY.CIK
  WHERE FORM_D.INDUSTRYGROUPTYPE = '${industryType}'
  GROUP BY COMPANY.COMPANYNAME
  ORDER BY FORM_C.REVENUEMOSTRECENTFISCALYEAR DESC
  LIMIT 10;`;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
};

function getSummaryDataFormDForPerson(req,res){
  var query=`SELECT COUNT(*) as FORM_D_COUNT,SUM(GREATEST(TOTALOFFERINGAMOUNT, TOTALAMOUNTSOLD)) AS FORM_D_SUM FROM FORM_D 
             WHERE CIK 
             IN 
             (SELECT DISTINCT(CIK) FROM PERSON WHERE Name ='${req.params.name}') 
             AND 
             (FILE_NUM, FILING_DATE)
             IN 
             (SELECT FILE_NUM, MAX(FILING_DATE) AS LATEST_FILING FROM FORM_D WHERE CIK IN (SELECT DISTINCT(CIK) FROM PERSON WHERE Name ='${req.params.name}') GROUP BY FILE_NUM)  
             ORDER BY FILE_NUM, FILING_DATE DESC;`
  connection.query(query, function(err, rows) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

function getSummaryDataFormCForPerson(req,res){
  var query = `SELECT COUNT(*) AS FORM_C_COUNT, SUM(OFFERINGAMOUNT) AS FORM_C_SUM
               FROM FORM_C 
               WHERE CIK IN (SELECT DISTINCT(CIK) FROM PERSON WHERE NAME='${req.params.name}')
               AND 
               (FILE_NUMBER,FILING_DATE)
               IN
               (SELECT FILE_NUMBER,MAX(FILING_DATE) AS LATEST_FILING FROM FORM_C 
               WHERE CIK IN (SELECT DISTINCT(CIK) FROM PERSON WHERE NAME='${req.params.name}' AND SUBMISSION_TYPE != 'C-AR')
               GROUP BY FILE_NUMBER);`
  connection.query(query, function(err, rows) {

    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });


}



// The exported functions, which can be accessed in index.js.

module.exports = {
  findCompanyByName: findCompanyByName,
  findCompanyByNameAndFinancing: findCompanyByNameAndFinancing,
  findCompanyByNameAndState: findCompanyByNameAndState,
  findCompanyByNameFinState: findCompanyByNameFinState,
  findCompanyByFinancingAndState: findCompanyByFinancingAndState,
  getCompanyByCIK: getCompanyByCIK,
  getIndusAvgByCIK: getIndusAvgByCIK,
  getFormCByCIK: getFormCByCIK,
  getFormDByCIK: getFormDByCIK,
  getWebTrafficByCIK: getWebTrafficByCIK,
  getPersonDetails: getPersonDetails,
  getPeopleList: getPeopleList,
  getAllIndustries: getAllIndustries,
  getTopRevenueInIndustry: getTopRevenueInIndustry,
  getSummaryDataFormDForPerson: getSummaryDataFormDForPerson,
  getSummaryDataFormCForPerson: getSummaryDataFormCForPerson,
  getDailyWebAnalytics: getDailyWebAnalytics,
  getMonthlyWebAnalytics: getMonthlyWebAnalytics,
  getYearlyWebAnalytics: getYearlyWebAnalytics,
  getAlexaWebAnalytics: getAlexaWebAnalytics,
  getJxFormC: getJxFormC,
  getJxFormD: getJxFormD,
}

