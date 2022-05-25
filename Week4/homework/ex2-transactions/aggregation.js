const {MongoClient} = require('mongodb');
require('dotenv').config();


const client = new MongoClient(process.env.MONGODB_URL);

async function findCountry(collection, country) {
    const aggregation = [
        {
          '$match': {
            'Country': country
          }
        }, {
          '$project': {
            'Year': '$Year', 
            'pop': {
              '$add': [
                '$M', '$F'
              ]
            }
          }
        }, {
          '$group': {
            '_id': '$Year', 
            'countryPopulation': {
              '$sum': '$pop'
            }
          }
        }, {
          '$sort': {
            '_id': 1
          }
        }
      ];
    try {
        const result = await collection.aggregate(aggregation).toArray();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

async function continentAgeYear(coll, year, age) {
    const aggregation = [
        {
          '$match': {
            'Country': {
              '$in': [
                'AFRICA', 'ASIA', 'LATIN AMERICA AND THE CARIBBEAN', 'NORTHERN AMERICA', 'OCEANIA', 'EUROPE'
              ]
            }, 
            'Year': year, 
            'Age': age
          }
        }, {
          '$project': {
            'continent': '$Country', 
            'Year': '$Year', 
            'M': '$M', 
            'F': '$F', 
            'totalPopulation': {
              '$add': [
                '$M', '$F'
              ]
            }
          }
        }
      ]
    try {
        const result = await coll.aggregate(aggregation).toArray();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}


async function checkDb() {
    try {
        await client.connect();
        console.log("Client connectioned");
        const db = await client.db("databaseWeek4");
        const collection = await db.collection("country_pop_trend");
        console.log("collection connected");
        // await insertTargetFile("./population_pyramid_1950-2022.csv", collection);
        // await findCountry(collection, "Netherlands");
        await continentAgeYear(collection, 2020, "100+");
        return;
        } catch (error) {
        console.error(error);
    } finally {
        client.close();
    }
}

checkDb();
