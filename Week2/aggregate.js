const PAPER_AUTHORS_COUNT = `
	SELECT paper_title, COUNT(A.author_no) AS number_of_authors 
	FROM research_papers AS rp
	JOIN authors as A on A.author_no = rp.author
	GROUP BY paper_title;
`;

const FEMALE_AUTHORS = `
SELECT COUNT(*) 
FROM research_papers AS rp
JOIN authors as A on A.author_no = rp.author
WHERE A.gender = 'F';
`;

const AVG_H_INDEX = `
SELECT university, AVG(h_index) AS average_h_index 
FROM authors
GROUP BY university;
`;

const SUM_UNI_AUTHORS = `
SELECT university, COUNT(*) AS papers 
FROM paper_authors as pa
JOIN authors AS A ON pa.author_id = A.author_no
JOIN research_papers AS rp ON rp.paper_id = pa.paper_id
GROUP BY university
;`;

const MINMAX_H_INDEX_P_UNI = `
SELECT university, MIN(h_index) AS min, MAX(h_index) AS max 
FROM authors
GROUP BY university
;`;

module.exports = () => [
  PAPER_AUTHORS_COUNT,
  FEMALE_AUTHORS,
  AVG_H_INDEX,
  SUM_UNI_AUTHORS,
  MINMAX_H_INDEX_P_UNI,
];
