const CREATE_TABLE_PAPERS = `
CREATE TABLE research_papers (
	paper_id INT PRIMARY KEY NOT NULL,
	paper_title VARCHAR(100),
	author INT,
	conference VARCHAR(100),
	publish_date VARCHAR(100)
);
`;
const CREATE_JUNCTION_TABLE = `
CREATE TABLE paper_authors (
	paper_id INT,
	author_id INT,
	CONSTRAINT paper_fk FOREIGN KEY(paper_id) REFERENCES research_papers(paper_id) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT author_fk FOREIGN KEY(author_id) REFERENCES authors(author_no) ON UPDATE CASCADE ON DELETE CASCADE
);
`;

const insert = `
INSERT INTO research_papers VALUES(1, 'hgfh', 1, 'rtret', '2020-02-12');
`;
const insert2 = `
INSERT INTO paper_authors VALUES(1, 1);
`;

module.exports = () => [CREATE_TABLE_PAPERS, CREATE_JUNCTION_TABLE];
