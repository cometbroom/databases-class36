const AUTHOR_NAME_QUERY = `
	SELECT authors.author_name, A.author_name AS mentor_name
	FROM authors
	JOIN authors as A ON A.mentor = authors.author_no;
`;

const AUTHOR_PAPER_QUERY = `
	SELECT A.*, rp.paper_title 
	FROM paper_authors AS pa
	JOIN research_papers AS rp ON rp.paper_id = pa.paper_id
	JOIN authors as A ON A.author_no = pa.author_id;
`;

module.exports = () => [AUTHOR_NAME_QUERY, AUTHOR_PAPER_QUERY];
