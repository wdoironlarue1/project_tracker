import "./App.scss";
import NavBar from "./components/NavBar";
import TrackerPage from "./components/pages/TrackerPage";
import HomePage from "./components/pages/HomePage";
import Dashboard from "./components/pages/Dashboard";
import Login from "./components/pages/Login";
import { Route, Switch } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

function App() {
  const { isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      <NavBar />
      <Switch>
        <Route path="/" exact component={HomePage} />
        <Route path="/tracker" exact component={TrackerPage} />
        <Route path="/dashboard" exact component={Dashboard} />
        <Route path="/login" exact component={Login} />
      </Switch>
    </div>
  );
}

export default App;
