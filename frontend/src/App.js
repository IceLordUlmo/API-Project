import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import { AllGroups } from "./components/AllGroups";
import { GroupFormModal } from "./components/GroupFormModal"

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
          <Route path="/groups/new">
            <GroupFormModal />
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
