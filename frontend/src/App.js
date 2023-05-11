import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { AllGroups } from "./components/Groups/AllGroups";
import { CreateGroup } from "./components/Groups/CreateGroup"
import { UpdateGroup } from "./components/Groups/UpdateGroup"

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>

          <Route path="/groups/update">
            <UpdateGroup />
          </Route>
          <Route path="/groups/new">
            <CreateGroup />
          </Route>
          <Route exact path="/groups">
            <AllGroups />
          </Route>
        </Switch>
      )
      }
    </>
  );
}

export default App;
