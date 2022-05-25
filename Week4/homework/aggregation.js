const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URL);

async function findCountry(collection, country) {
  //Aggregation to find country's total population at each year
  const aggregation = [
    {
      $match: {
        Country: country,
      },
    },
    {
      $project: {
        Year: "$Year",
        pop: {
          $add: ["$M", "$F"],
        },
      },
    },
    {
      $group: {
        _id: "$Year",
        countryPopulation: {
          $sum: "$pop",
        },
      },
    },
    {
      $sort: {
        _id: 1,
      },
    },
  ];
  try {
    const result = await collection.aggregate(aggregation).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

async function continentAgeYear(coll, year, age) {
  //Aggregation to find continent population according to year and age of population
  const aggregation = [
    {
      $match: {
        Country: {
          $in: [
            "AFRICA",
            "ASIA",
            "LATIN AMERICA AND THE CARIBBEAN",
            "NORTHERN AMERICA",
            "OCEANIA",
            "EUROPE",
          ],
        },
        Year: year,
        Age: age,
      },
    },
    {
      $project: {
        continent: "$Country",
        Year: "$Year",
        M: "$M",
        F: "$F",
        totalPopulation: {
          $add: ["$M", "$F"],
        },
      },
    },
  ];
  try {
    const result = await coll.aggregate(aggregation).toArray();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

async function main() {
  try {
    //Connect and get out collection
    await client.connect();
    const db = await client.db("databaseWeek4");
    const collection = await db.collection("country_pop_trend");

    //Test our functions
    await findCountry(collection, "Netherlands");
    await continentAgeYear(collection, 2020, "100+");
    return;
  } catch (error) {
    console.error(error);
  } finally {
    //Close client
    client.close();
  }
}

main();
