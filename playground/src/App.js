import React from "react";
import { CRUD } from "mycomp";

function App() {
  return (
    <CRUD
      entity="WflTerm"
      pageSize={4}
      orderBy={{ field: "termname", by: "DESC" }}
    />
  );
}

export default App;
