1. What columns violate 1NF?
A: food_description, food_code
2. What entities do you recognize that could be extracted?
A: Members with address, dinner_id with date, venue code with description, food_code and food_description can be extracted themselves and be joined by a table name food_order.
3. Name all the tables and columns that would make a 3NF compliant solution.
A: 
- Table: members. Columns: id (pk), name, address
- Table: dinners. Columns: id (pk), date, member_id (fk), venue_id(fk)
- Table: venues. Columns: id (pk), description
- Table: planned_dinners. Columns: id (pk), dinner_id (fk), guest_id (fk member), venue_id (fk)

