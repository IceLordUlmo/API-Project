import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { AllGroups } from "./components/Groups/AllGroups";
import { CreateGroup } from "./components/Groups/CreateGroup"
import { UpdateGroup } from "./components/Groups/UpdateGroup"
import { Landing } from "./components/Landing"
import { OneGroupDetails } from "./components/Groups/OneGroupDetails"
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
          <Route path="/groups/:groupId">
            <OneGroupDetails />
          </Route>
          <Route path="/groups/:groupId/edit">
            <UpdateGroup />
          </Route>
          <Route exact path="/groups/new">
            <CreateGroup />
          </Route>
          <Route exact path="/groups">
            <AllGroups />
          </Route>
          <Route exact path='/'>
            <Landing />
          </Route>
        </Switch>
      )
      }
    </>
  );
}

export default App;
