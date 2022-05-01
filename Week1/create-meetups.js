const mysql = require("mysql");

const DB_LOGIN = {
  host: "localhost",
  user: "hyfuser",
  password: "hyfpassword",
};

const CREATE_TABLE_INVITEE = `CREATE TABLE IF NOT EXISTS Invitee (
  invitee_no INT AUTO_INCREMENT PRIMARY KEY,
  invitee_name VARCHAR(25),
  invited_by VARCHAR(25)
);`;
const CREATE_TABLE_ROOM = `CREATE TABLE IF NOT EXISTS Room (
	room_no INT AUTO_INCREMENT PRIMARY KEY,
	room_name VARCHAR(25),
	floor_number INT
);`;
const CREATE_TABLE_MEETING = `CREATE TABLE IF NOT EXISTS Meeting (
	meeting_no INT AUTO_INCREMENT PRIMARY KEY,
	meeting_title VARCHAR(50),
	starting_time TIME,
	ending_time TIME,
	room_no INT,
  CONSTRAINT fk_room FOREIGN KEY (room_no) 
  REFERENCES Room(room_no)
  ON DELETE CASCADE
  ON UPDATE CASCADE
);`;

const inviteesData = [
  { invitee_no: 1, invitee_name: "Aiesha", invited_by: "NULL" },
  { invitee_no: 2, invitee_name: "Elif", invited_by: "Mo" },
  { invitee_no: 3, invitee_name: "Eren", invited_by: "NULL" },
  { invitee_no: 4, invitee_name: "Maia", invited_by: "Robin" },
  { invitee_no: 5, invitee_name: "Kaleem", invited_by: "NULL" },
];

const roomsData = [
  { room_no: 1, room_name: "Cantine", floor_number: 2 },
  { room_no: 2, room_name: "Meeting Large", floor_number: 3 },
  { room_no: 3, room_name: "Meeting Small", floor_number: 1 },
  { room_no: 4, room_name: "Lounge", floor_number: 1 },
  { room_no: 5, room_name: "Hallway", floor_number: 2 },
];

const meetingsData = [
  {
    meeting_no: 1,
    meeting_title: "Sync",
    starting_time: "12:00:00",
    ending_time: "13:00:00",
    room_no: 2,
  },
  {
    meeting_no: 2,
    meeting_title: "Brainstorm",
    starting_time: "09:00:00",
    ending_time: "10:00:00",
    room_no: 3,
  },
  {
    meeting_no: 3,
    meeting_title: "Marketing",
    starting_time: "08:30:00",
    ending_time: "09:00:00",
    room_no: 1,
  },
  {
    meeting_no: 4,
    meeting_title: "Future Projects",
    starting_time: "11:00:00",
    ending_time: "13:00:00",
    room_no: 4,
  },
  {
    meeting_no: 5,
    meeting_title: "Construction",
    starting_time: "11:30:00",
    ending_time: "12:30:00",
    room_no: 5,
  },
];

const connection = mysql.createConnection(DB_LOGIN);
const seedDb = () => {
  connection.connect();
  connection.query("CREATE DATABASE IF NOT EXISTS meetup", (error) => {
    if (error) throw error;
  });

  connection.changeUser({ database: "meetup" });

  [CREATE_TABLE_INVITEE, CREATE_TABLE_ROOM, CREATE_TABLE_MEETING].forEach(
    (item) => createTableQuery(connection, item)
  );
  [
    ["Invitee", inviteesData],
    ["Room", roomsData],
    ["Meeting", meetingsData],
  ].forEach((item) => insertData(connection, ...item));
  connection.end();
};

const createTableQuery = (dbConnection, query) => {
  dbConnection.query(query, (error) => {
    if (error) throw error;
    console.log("Table created", query);
  });
};

const insertData = (dbConnection, tableName, table) => {
  table.forEach((item) => {
    dbConnection.query(`INSERT IGNORE INTO ${tableName} SET ?`, item);
  });
};

seedDb();
