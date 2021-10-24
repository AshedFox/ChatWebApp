import Main from "./components/Main";
import Settings from "./components/Settings";
import Auth from "./components/Auth";
import Reg from "./components/Reg";

export const routes = {
    regRoute: "/reg",
    authRoute: "/auth",
    mainRoute: "/main",
    settingsRoute: "/settings",
}

export const publicRoutes = [
    {
        path: routes.regRoute,
        component: Reg
    },
    {
        path: routes.authRoute,
        component: Auth
    }
]

export const privateRoutes = [
    {
        path: routes.mainRoute,
        component: Main,
    },
    {
        path: routes.settingsRoute,
        component: Settings,
    },
]
