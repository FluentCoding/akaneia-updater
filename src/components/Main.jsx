import { Switch, Route } from "react-router-dom";

import Home from "../pages/Home";
import Setup from "../pages/Setup";

export default function Main() {
  return (
    <Switch>
      <Route exact path="/" component={Home}></Route>
      <Route exact path="/setup" component={Setup}></Route>
    </Switch>
  );
}
