import React from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import {privateRoutes, publicRoutes, routes} from "../routes";
import {useAppSelector} from "../hooks/useAppSelector";

const AppRouter = () => {
    const {data} = useAppSelector(state => state.user);

    return (
        (data && data.user && data.accessToken && data.validTo && data.validTo.toString() > new Date().toJSON()) ?
            <Switch>
                {privateRoutes.map(({path, component}) =>
                    <Route key={path} path={path} component={component} exact/>
                )}
                <Redirect to={routes.mainRoute}/>
            </Switch> :
            <Switch>
                {publicRoutes.map(({path, component}) =>
                    <Route key={path} path={path} component={component} exact/>
                )}
                <Redirect to={routes.authRoute}/>
            </Switch>
    );
};

export default AppRouter;
