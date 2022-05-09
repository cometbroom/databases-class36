const CREATE_TABLE_AUTHORS = `
CREATE TABLE authors (
	author_no INT PRIMARY KEY,
	author_name VARCHAR(100),
	university VARCHAR(100),
	date_of_birth VARCHAR(100),
	h_index INT,
	gender VARCHAR(10)
);
`;
const ADD_MENTOR_COLUMN = `
	ALTER TABLE authors 
	ADD COLUMN mentor INT, 
	ADD CONSTRAINT mentor_fk FOREIGN KEY(mentor) REFERENCES authors(author_no) 
	ON UPDATE cascade 
	ON DELETE cascade;
`;

const INSERT_VALUES = `
	INSERT INTO authors VALUES (1, 'rew', 'rewte', '1990-10-05', 5, 0, 1);
`;

module.exports = () => [CREATE_TABLE_AUTHORS, ADD_MENTOR_COLUMN];
