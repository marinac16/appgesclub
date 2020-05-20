// Les imports importants
import React, {useState, useContext} from 'react';
import ReactDOM from "react-dom";
import {Switch, Route, HashRouter, withRouter} from "react-router-dom";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import HomePage from "./pages/HomePage";
import DashBoard from "./pages/DashBoard";
import MembersPage from "./pages/MembersPage";
import TeamsPage from "./pages/TeamsPage";
import TeamPage from "./pages/TeamPage";
import TeamViewPage from "./pages/TeamViewPage";
import CoachsPage from "./pages/CoachsPage";
import DirigeantsPage from "./pages/DirigeantsPage";
import GroupsPage from "./pages/GroupsPage";
import GroupViewPage from "./pages/GroupViewPage";
import WeekendsPage from "./pages/WeekendsPage";
import WeekendPage from "./pages/WeekendPage";
import WeekendDomViewPage from "./pages/WeekendDomViewPage";
import WeekendExtViewPage from "./pages/WeekendExtViewPage";
import LoginPage from "./pages/LoginPage";
import MemberPageFormik from "./pages/MemberPageFormik";
import RegisterPage from "./pages/RegisterPage";
import AuthAPI from "./services/authAPI";
import AuthContext from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import {Container, Row, Col} from "react-bootstrap"
import { ToastContainer, toast } from 'react-toastify';



import '../css/app.css';
import '../css/sidebar.css';
import 'react-toastify/dist/ReactToastify.css';



AuthAPI.setup();

const App = () => {

  const [isAuthenticated, setIsAuthenticated] = useState(AuthAPI.isAuthenticated());

  const NavbarWithRouter = withRouter(Navbar);


  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      setIsAuthenticated
    }}>
      <HashRouter>
        <NavbarWithRouter/>

        <Container fluid className="container-principal">
          <Row className="row-main">
            {(isAuthenticated && (
            <Col sm={1} className="sidebar bg-blue">
              <Sidebar/>
            </Col>
              ))}
            <Col sm={(isAuthenticated && (11) || (12))}>

              <main className="container-main pt-5">
                <Switch>
                  <Route path="/login" component={LoginPage}/>
                  <Route path="/register" component={RegisterPage}/>
                  <PrivateRoute path="/members/:id" component={MemberPageFormik}/>
                  <PrivateRoute path="/members" component={MembersPage}/>
                  <PrivateRoute path="/teams/:id" component={TeamPage}/>
                  <PrivateRoute path="/teams" component={TeamsPage}/>
                  <PrivateRoute path="/team/:id" component={TeamViewPage}/>
                  <PrivateRoute path="/coachs" component={CoachsPage}/>
                  <PrivateRoute path="/dirigeants" component={DirigeantsPage}/>
                  <PrivateRoute path="/groupes" component={GroupsPage}/>
                  <PrivateRoute path="/groupe/:id" component={GroupViewPage}/>
                  <PrivateRoute path="/weekends/:id" component={WeekendPage}/>
                  <PrivateRoute path="/weekends/" component={WeekendsPage}/>
                  <PrivateRoute path="/weekend/domicile/:id" component={WeekendDomViewPage}/>
                  <PrivateRoute path="/weekend/exterieur/:id" component={WeekendExtViewPage}/>
                  <PrivateRoute path="/dashboard" component={DashBoard}/>
                  <Route path="/" component={HomePage}/>
                </Switch>
              </main>
            </Col>
          </Row>
        </Container>
      </HashRouter>
      <ToastContainer
        position={toast.POSITION.BOTTOM_LEFT}
        hideProgressBar={true}

      />
    </AuthContext.Provider>
  );
};

const rootElement = document.querySelector('#app');
ReactDOM.render(<App/>, rootElement);