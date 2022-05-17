
const { MongoClient, ServerApiVersion } = require("mongodb");
require('dotenv').config();
console.log(process.env.MONGODB_URL); // remove this after you've confirmed it working


const { seedDatabase } = require("./seedDatabase.js");

const NAMES = {
  DB: "databaseWeek3",
  COLL: "bob_ross_episodes"
}

function errorHandle(msg, err) {
  console.log(msg);
  console.error(err);
}

const episodePattern = (season, episode) => `S${season.toString().padStart(2, '0')}E${episode.toString().padStart(2, '0')}`;


async function createEpisodeExercise(client) {
  /**
   * We forgot to add the last episode of season 9. It has this information:
   *
   * episode: S09E13
   * title: MOUNTAIN HIDE-AWAY
   * elements: ["CIRRUS", "CLOUDS", "CONIFER", "DECIDIOUS", "GRASS", "MOUNTAIN", "MOUNTAINS", "RIVER", "SNOWY_MOUNTAIN", "TREE", "TREES"]
   */
  try {
    const result = await client.db(NAMES.DB).collection(NAMES.COLL).insertOne({ 
      episode: 'S09E13',
      title: "MOUNTAIN HIDE-AWAY",
      elements: ["CIRRUS", "CLOUDS", "CONIFER", "DECIDIOUS", "GRASS", "MOUNTAIN", "MOUNTAINS", "RIVER", "SNOWY_MOUNTAIN", "TREE", "TREES"]
    });
    console.log(
      `Created season 9 episode 13 and the document got the id ${result.insertedId}`
    );
    } catch (error) {
    errorHandle("Episode failed to create.", error);
  }
}

async function findEpisodesExercises(client) {
  /**
   * Complete the following exercises.
   * The comments indicate what to do and what the result should be!
   */
  const coll = client.db(NAMES.DB).collection(NAMES.COLL);
  // Find the title of episode 2 in season 2 [Should be: WINTER SUN]
  try {
    const foundDoc = await coll.findOne({episode: episodePattern(2, 2)});
    console.log(
     `The title of episode 2 in season 2 is ${foundDoc.title}`
   );
   } catch (error) {
     console.log(`Episode ${episodePattern(2, 2)} not found: `, error);
   }
 
  // Find the season and episode number of the episode called "BLACK RIVER" [Should be: S02E06]
  const ep6Title = "BLACK RIVER";
  try {
    const foundDoc = await coll.findOne({title: ep6Title});
    console.log(
      `The season and episode number of the "BLACK RIVER" episode is ${foundDoc.episode}`
    );
     } catch (error) {
     console.log(`Episode ${ep6Title} not found: `, error);
   }


  // Find all of the episode titles where Bob Ross painted a CLIFF [Should be: NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL]
  try {
    const searchTerm = "CLIFF";
    const foundDocs = await coll.find({elements: {$in: [searchTerm]}}).toArray();
    const titleDocs = foundDocs.map((doc) => doc.title);
    console.log(
      `The episodes that Bob Ross painted a CLIFF are ${titleDocs}`
    );
     } catch (error) {
     console.log(`Episodes with CLIFF not found: `, error);
   }

  // Find all of the episode titles where Bob Ross painted a CLIFF and a LIGHTHOUSE [Should be: NIGHT LIGHT]
  try {
    const foundDocs = await coll.find({elements: {$all: ["CLIFF", "LIGHTHOUSE"]}}).toArray();
    const titleDocs = foundDocs.map((doc) => doc.title);
    console.log(
      `The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${titleDocs}`
    );
    } catch (error) {
     console.log(`Episodes with cliff and lighthose not found: `, error);
   }



}

async function updateEpisodeExercises(client) {
  /**
   * There are some problems in the initial data that was filled in.
   * Let's use update functions to update this information.
   *
   * Note: do NOT change the data.json file
   */

  // Episode 13 in season 30 should be called BLUE RIDGE FALLS, yet it is called BLUE RIDGE FALLERS now. Fix that
  const coll = client.db(NAMES.DB).collection(NAMES.COLL);

  try {
    const foundDoc = await coll.updateOne({episode: episodePattern(30, 13)}, {$set: {title: "BLUE RIDGE FALLS"}});

    console.log(
      `Ran a command to update episode 13 in season 30 and it updated ${foundDoc.modifiedCount} episodes`
    );
  
       } catch (error) {
     console.log(`Episode ${episodePattern(30, 13)} failed to update: `, error);
   }

  // Unfortunately we made a mistake in the arrays and the element type called 'BUSHES' should actually be 'BUSH' as sometimes only one bush was painted.
  // Update all of the documents in the collection that have `BUSHES` in the elements array to now have `BUSH`
  // It should update 120 episodes!
  try {
    //Find a way to change only one element in all the elements.
    const foundDoc = await coll.updateMany({elements: {$in: ["BUSHES"]}}, {$set: {"elements.$": "BUSH"}});
    console.log(
      `Ran a command to update all the BUSHES to BUSH and it updated ${foundDoc.modifiedCount} episodes`
    );
    
       } catch (error) {
     console.log(`BUSHES tag failed to update: `, error);
   }


}

async function deleteEpisodeExercise(client) {
  /**
   * It seems an errand episode has gotten into our data.
   * This is episode 14 in season 31. Please remove it and verify that it has been removed!
   */
   const coll = client.db(NAMES.DB).collection(NAMES.COLL);

   try {
    const foundDoc = await coll.deleteOne({episode: episodePattern(31, 14)});
    console.log(
      `Ran a command to delete episode and it deleted ${foundDoc.deletedCount} episodes`
    );
  
       } catch (error) {
     console.log(`Episode ${episodePattern(31, 13)} failed to delete: `, error);
   }


}

async function main() {
  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`
    );
  }
  const client = new MongoClient(process.env.MONGODB_URL
  , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed our database
    await seedDatabase(client);

    // CREATE
    await createEpisodeExercise(client);

    // READ
    await findEpisodesExercises(client);

    // UPDATE
    await updateEpisodeExercises(client);

    // DELETE
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    // Always close the connection at the end
    client.close();
  }
}

main();

/**
 * In the end the console should read something like this: 

Created season 9 episode 13 and the document got the id 625e9addd11e82a59aa9ff93
The title of episode 2 in season 2 is WINTER SUN
The season and episode number of the "BLACK RIVER" episode is S02E06
The episodes that Bob Ross painted a CLIFF are NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL
The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are NIGHT LIGHT
Ran a command to update episode 13 in season 30 and it updated 1 episodes
Ran a command to update all the BUSHES to BUSH and it updated 120 episodes
Ran a command to delete episode and it deleted 1 episodes
 
*/
