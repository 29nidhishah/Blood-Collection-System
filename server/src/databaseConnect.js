var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'blqj8qqclqzg8w7dk5bs-mysql.services.clever-cloud.com',
  user     : 'ubzi27y7l0wv8xkr',
  password : 'UqE0X6WhPSZZvw71ybHi',
  database : 'blqj8qqclqzg8w7dk5bs'
});

connection.connect((error) => {
    if (error) {
        console.error('Error connecting to the database:', error);
        return;
    }
    console.log('Connected to the database');
    
    //createBloodGroupTable();
    //queryBloodGroupTable();
    //createHospitalTable();
    //queryHospitalTable();
    //createBloodTable();
    //queryBloodTable();
    //insertHospital('Hospital 3 lithium', 'Kolkata', 'South Kolkata', '25.6', '56', '113 Rashebehari');
    //insertBlood('B65739434', 'S97767644', 'Hospital 3 lithium','2024-07-31',350,'O+');
    //updateBlood('B1234', 'S132');
    //queryAvailableBloodHospital('B+','Hospital 2 lithium');
    //queryAvailableBloodArea('O+','South Kolkata','Kolkata');
    //queryNoOfDonations('2024-02-4','2025-02-5');
    //queryStockBelowThresholdHospital('Hospital 3 lithium',200);
    //queryStockBelowThresholdGeneral(10000);
    //queryStockBelowThresholdBloodGroup('AB+',10000);
    //queryStockBelowThresholdCity('AB+',10000,'Kolkata')
});

function createBloodGroupTable() {
	const sql1 =`CREATE TABLE BloodGroups (GroupType VARCHAR(3) PRIMARY KEY);`;
	connection.query(sql1, (error, result) => {
		if (error) {
		    console.error('Error creating BloodGroups table:', error);
		    return;
		}
		console.log('BloodGroups table created successfully');
	    });

	const sql2=`INSERT INTO BloodGroups (GroupType) VALUES ('A+'), ('A-'), ('B+'), ('B-'), ('AB+'), ('AB-'), ('O+'), ('O-');`;
	connection.query(sql2,(error, result) => {
		if (error) {
		    console.error('Error inserting blood groups:', error);
		    return;
		}
		console.log('Blood groups created successfully');
	    });
}
function createHospitalTable() {
    const sql = `
       CREATE TABLE Hospital (
	    HospitalName VARCHAR(100) PRIMARY KEY,
	    City VARCHAR(50),
	    Area VARCHAR(50),
	    Latitude VARCHAR(50),
	    Longitude VARCHAR(50),
	    Address VARCHAR(50)
            );
    `;
    
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Error creating table:', error);
            return;
        }
        console.log('Table created successfully');
    });
}

function createBloodTable() {
    const sql = `
       CREATE TABLE Blood (
	    BagID VARCHAR(100),
	    BagSegmentNo VARCHAR(100),
	    HospitalName VARCHAR(100),
	    DateOfCollection DATE,
	    DateOfExpiry DATE,
	    Quantity INT,
	    Donated BOOLEAN,
	    DonationDate DATE,
	    BloodGroup VARCHAR(7),
	    PRIMARY KEY (BagID, BagSegmentNo),
	    FOREIGN KEY (HospitalName) REFERENCES Hospital(HospitalName)
	);
    `;
    
    connection.query(sql, (error, result) => {
        if (error) {
            console.error('Error creating table:', error);
            return;
        }
        console.log('Table created successfully');
    });
}

/*function queryHospitalTable() {
    connection.query('SELECT * FROM Hospital;', (error, results, fields) => {
  if (error) throw error;
  console.log('Hospital table:', results);
});
}*/
function queryBloodGroupTable() {
    connection.query('SELECT * FROM BloodGroups;', (error, results, fields) => {
  if (error) throw error;
  console.log('BloodGroups table:', results);
});
}

function queryBloodTable() {
    connection.query('SELECT * FROM Blood;', (error, results, fields) => {
  if (error) throw error;
  console.log('Blood table:', results);
});
}

/*function insertHospital(HospitalName, City, Area, Latitude, Longitude, Address) {
    const sql = `
       INSERT INTO Hospital (HospitalName, City, Area, Latitude, Longitude, Address)
VALUES (?, ?, ?, ?, ?, ?);
    `;
    
    connection.query(sql,[HospitalName, City, Area, Latitude, Longitude, Address], (error, result) => {
        if (error) {
            console.error('Error inserting Hospital:', error);
            return;
        }
        console.log('Hospital created successfully');
    });
}*/

function insertBlood(BagID, BagSegmentNo, HospitalName, DateOfExpiry, Quantity, BloodGroup) {
const sql = `
       INSERT INTO Blood(BagID, BagSegmentNo, HospitalName, DateOfCollection, DateOfExpiry, Quantity, Donated, DonationDate, BloodGroup)
VALUES (?, ?, ?, CURDATE(), ?, ?, FALSE, NULL, ?);
    `;
    
    connection.query(sql,[BagID, BagSegmentNo, HospitalName, DateOfExpiry, Quantity, BloodGroup], (error, result) => {
        if (error) {
            console.error('Error inserting Blood:', error);
            return;
        }
        console.log('Blood record created successfully');
    });
}

function updateBlood(BagID,BagSegmentNo) {
    const sql = `
	       UPDATE Blood
	       SET DonationDate = CURDATE(),
	       Donated = TRUE
	       WHERE BagID = ?
	       AND BagSegmentNo = ?;
    `;
    
    connection.query(sql, [BagID,BagSegmentNo], (error, result) => {
        if (error) {
            console.error('Error inserting Hospital:', error);
            return;
        }
        console.log('Blood successfully updated');
    });
}

function queryAvailableBloodHospital(bloodGroup,hospitalName){
        const sql=
	`SELECT SUM(Quantity) AS TotalQuantity,HospitalName FROM Blood WHERE BloodGroup = ? AND HospitalName = ? AND Donated = FALSE`;
	connection.query(sql, [bloodGroup,hospitalName],(error, results, fields) => {
	  if (error) throw error;
	  console.log('Hospital table:', results);
	});
}
function queryAvailableBloodArea(bloodGroup,area,city){
        const sql=
	`SELECT h.HospitalName, h.Address, SUM(bb.Quantity) AS TotalQuantity
	FROM Hospital h
	JOIN Blood bb ON h.HospitalName = bb.HospitalName
	WHERE h.Area = ?
	AND h.City = ?
	AND bb.Donated = FALSE
	AND bb.BLoodGroup = ?
	GROUP BY h.HospitalName, h.Address;`;
	connection.query(sql, [area,city,bloodGroup],(error, results, fields) => {
	  if (error) throw error;
	  console.log('Result:', results);
	});
}

function queryNoOfDonations(startDate,endDate)
{
   const sql=
	`SELECT COUNT(*) AS TotalDonations
	 FROM Blood
         WHERE DateOfCollection BETWEEN ? AND ?;`;
	connection.query(sql, [startDate,endDate],(error, results, fields) => {
	  if (error) throw error;
	  console.log('Result:', results);
	});
}

function queryStockBelowThresholdHospital(hospital_name,threshold)
{
   const sql=`
	        SELECT bg.GroupType AS BloodGroup, COALESCE(SUM(bb.Quantity), 0) AS TotalBlood
                FROM (SELECT HospitalName FROM Hospital WHERE HospitalName = ?) h
                CROSS JOIN BloodGroups bg 
                LEFT JOIN Blood bb ON bg.GroupType = bb.BloodGroup AND bb.HospitalName = h.HospitalName
                GROUP BY bg.GroupType
                HAVING COALESCE(SUM(bb.Quantity), 0) < COALESCE(?, 0);
		  

   	      `;
	connection.query(sql, [hospital_name,threshold],(error, results, fields) => {
	  if (error) throw error;
	  console.log('Result:', results);
	});
}

/*function queryStockBelowThresholdGeneral(threshold)
{
   const sql=` SELECT h.HospitalName,bg.GroupType AS BloodGroup,COALESCE(SUM(bb.Quantity), 0) AS TotalBloodQuantity
	       FROM Hospital h
	       CROSS JOIN BloodGroups bg
	       LEFT JOIN Blood bb ON h.HospitalName = bb.HospitalName AND bg.GroupType = bb.BloodGroup
	       WHERE
	       bb.Donated = FALSE OR bb.Donated IS NULL 
	       GROUP BY h.HospitalName, bg.GroupType
	       HAVING COALESCE(SUM(bb.Quantity), 0) < COALESCE(?, 0) OR SUM(bb.Quantity) IS NULL;
   	      `;
	connection.query(sql, [threshold],(error, results, fields) => {
	  if (error) throw error;
	  console.log('Result:', results);
	});
}*/

function queryStockBelowThresholdBloodGroup(bloodGroup,threshold)
{
   const sql=` SELECT h.HospitalName,bg.GroupType AS BloodGroup,COALESCE(SUM(bb.Quantity), 0) AS TotalBloodQuantity
	       FROM Hospital h
	       CROSS JOIN BloodGroups bg
	       LEFT JOIN Blood bb ON h.HospitalName = bb.HospitalName AND bg.GroupType = bb.BloodGroup
	       WHERE
	       (bb.Donated = FALSE OR bb.Donated IS NULL) AND bg.GroupType=? 
	       GROUP BY h.HospitalName, bg.GroupType
	       HAVING COALESCE(SUM(bb.Quantity), 0) < ? OR SUM(bb.Quantity) IS NULL;
   	      `;
	connection.query(sql, [bloodGroup,threshold],(error, results, fields) => {
	  if (error) throw error;
	  console.log('Result:', results);
	});
}

function queryStockBelowThresholdCity(bloodGroup,threshold,city)
{
   const sql=` SELECT h.HospitalName,bg.GroupType AS BloodGroup,COALESCE(SUM(bb.Quantity), 0) AS TotalBloodQuantity
	       FROM Hospital h
	       CROSS JOIN BloodGroups bg
	       LEFT JOIN Blood bb ON h.HospitalName = bb.HospitalName AND bg.GroupType = bb.BloodGroup
	       WHERE
	       (bb.Donated = FALSE OR bb.Donated IS NULL) AND bg.GroupType=? AND city=?
	       GROUP BY h.HospitalName, bg.GroupType
	       HAVING COALESCE(SUM(bb.Quantity), 0) < ? OR SUM(bb.Quantity) IS NULL;
   	      `;
	connection.query(sql, [bloodGroup,city,threshold],(error, results, fields) => {
	  if (error) throw error;
	  console.log('Result:', results);
	});
}

//connection.end();

///////////////////////////////////////// QUERY STOCKS BELOW THRESHOLD /////////////////////////////
exports.getStocksBelowThreshold=async (req, res) => {
  try {
    const threshold = req.query.threshold;
    console.log(threshold);
    const sql = `
      SELECT h.HospitalName, bg.GroupType AS BloodGroup, COALESCE(SUM(CASE WHEN bb.donated != TRUE THEN bb.Quantity ELSE 0 END), 0) AS TotalBloodQuantity
      FROM Hospital h
      CROSS JOIN BloodGroups bg
      LEFT JOIN Blood bb ON h.HospitalName = bb.HospitalName AND bg.GroupType = bb.BloodGroup
      WHERE bb.Donated = FALSE OR bb.Donated IS NULL 
      GROUP BY h.HospitalName, bg.GroupType
      HAVING TotalBloodQuantity < ?;
    `;

    const results = await new Promise((resolve, reject) => {
      connection.query(sql, [threshold], (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    console.log('Result:', results);
    res.json(results);
  } catch (error) {
    console.error('Error querying stocks below threshold:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

///////////////////////////// INSERT HOSPITAL /////////////////////////////////////////////
exports.insertHospital= async (req, res) => {
    console.log(req.body);
    const { HospitalName, City, Area, Latitude, Longitude, Address } = req.body;

    try {
        const result = await insertHospitalAsync(HospitalName, City, Area, Latitude, Longitude, Address);
        res.status(200).json({ message: 'Hospital created successfully', result });
    } catch (error) {
        console.error('Error during insertion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

function insertHospitalAsync(HospitalName, City, Area, Latitude, Longitude, Address) {
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO Hospital (HospitalName, City, Area, Latitude, Longitude, Address)
            VALUES (?, ?, ?, ?, ?, ?);
        `;

        connection.query(sql, [HospitalName, City, Area, Latitude, Longitude, Address], (error, result) => {
            if (error) {
                console.error('Error inserting Hospital:', error);
                reject(error);
                return;
            }
            console.log('Hospital created successfully');
            resolve(result);
        });
    });
}

////////////////////////////////// QUERY ALL HOSPITALS ///////////////////////////////////////
exports.queryHospital=async (req, res) => {
  try {
    const results = await queryHospitalTable();
    //console.log(results);
    res.status(200).json(results);
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function queryHospitalTable() {
  try {
    const results = await new Promise((resolve, reject) => {
      connection.query('SELECT * FROM Hospital;', (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });

    console.log('Hospital table:', results);
    return results;
  } catch (error) {
    console.error('Error querying Hospital table:', error);
    throw error;
  }
}
