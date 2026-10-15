// Safe demonstration: the mock database prints the query and never executes SQL.
const userInput = "' OR '1'='1";
const query = "SELECT * FROM users WHERE name = '" + userInput + "'";

const mockDatabase = {
  get(sql) {
    console.log("Mock database received:", sql);
    return { simulated: true };
  },
};

mockDatabase.get(query);