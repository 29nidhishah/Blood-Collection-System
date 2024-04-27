var mysql = require('mysql');
const util = require('util');
var dist = require('geo-distance-js');
var connection = mysql.createConnection({
  host     : 'blqj8qqclqzg8w7dk5bs-mysql.services.clever-cloud.com',
  user     : 'ubzi27y7l0wv8xkr',
  password : 'UqE0X6WhPSZZvw71ybHi',
  database : 'blqj8qqclqzg8w7dk5bs'
});

queryResults=[];

const queryAsync = util.promisify(connection.query).bind(connection);


async function handleProcess(referenceCoordinates) {
    /*try {
      // Connect to the database
      //connection.connect();

      // Wrap the database connection in a Promise to use await
      await new Promise((resolve, reject) => {
        connection.connect((error) => {
          if (error) {
            reject(error);
          } else {
            resolve();
          }
        });
      });

      console.log('Connected to the database');
*/
      try {
        // Query the database
        const queryResults = await queryAvailableBloodArea('O+', 'Kolkata');
        //console.log('Query Results:', queryResults);

        // Sort the results based on distance
        const sortedResults = sortResultsByDistance(queryResults, referenceCoordinates);

        console.log('Sorted Results:', sortedResults);
        return sortedResults;
      } catch (error) {
        console.error('Error querying the database:', error);
      } 
      //finally {
        // Close the database connection
        //connection.end();
        //console.log('Connection closed');
      //}
    //} catch (error) {
    //  console.error('An error occurred:', error);
    //}
  }
  
async function queryAvailableBloodArea(bloodGroup, city) {
    const sql = `
        SELECT h.HospitalName, h.Address, h.Latitude, h.Longitude, SUM(bb.Quantity) AS TotalQuantity
        FROM Hospital h
        JOIN Blood bb ON h.HospitalName = bb.HospitalName
        WHERE h.City = ?
        AND bb.Donated = FALSE
        AND bb.BloodGroup = ?
        GROUP BY h.HospitalName, h.Address;`;

    try {
        const results = await queryAsync(sql, [city, bloodGroup]);
        //console.log('Result:', results);
        return results;
    } catch (error) {
        throw error;
    }
}

function sortResultsByDistance(results, referenceCoordinates) {
    return results.sort((a, b) => {
        const distA = dist.getDistance(a, referenceCoordinates);
        const distB = dist.getDistance(b, referenceCoordinates);

        return distA - distB;
    });
}
/*
try {
	await handleProcess(referenceCoordinates);
}
catch(error) {
 console.log(error);
 }*/
 
exports.sortRecords=async (req,res)=>{
try {
	/*navigator.geolocation.getCurrentPosition((position)=>{
		const {latitude,longitude}=position.coords;
		const referenceCoordinates = { Latitude: latitude, Longitude: longitude };
		
		// Call the function that handles the entire process
      		await handleProcess(referenceCoordinates);
	},
	(error)=> {
		console.log(error.message);
	}
	)*/
	const referenceCoordinates = { Latitude: req.params.Latitude, Longitude: req.params.Longitude };
	const response=await handleProcess(referenceCoordinates);

	//const parsedResponse = await JSON.parse(response);
	res.status(200).send(response);
}
catch(error) {
	console.error('An error occurred:', error);
}
}




