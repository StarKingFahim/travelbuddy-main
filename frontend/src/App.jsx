import React, { useEffect, useState } from "react";
import { RouterProvider, Outlet, createBrowserRouter } from "react-router-dom";
import { Provider, useSelector } from "react-redux";
import store from "./redux/store";

// Components
import Header from "./components/Header";

// Pages
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Profile from "./components/Profile";
import Loading from "./components/loading/Loading";
import GroupChatBox from "./components/chatComponents/GroupChatBox";
import NotificationBox from "./components/NotificationBox";
// import GroupChatBox from "./components/GroupChatBox";


const Layout = () => {

    const profileDetails = useSelector(
        (store) => store.condition.profileDetails
    );

    const isGroupChat = useSelector(
        (store) => store.condition.isGroupChat
    );

    const isNotification = useSelector(
        (store) => store.condition.isNotification
    );

    const isLoading = useSelector((store) => store.condition.isLoading);

    const [position, setPosition] = useState("bottom-left");

    useEffect(() => {

        const handleResize = () => {
            if (window.innerWidth >= 600) {
                setPosition("bottom-left");
            } else {
                setPosition("top-left");
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, []);


    return (
        <div>
            <ToastContainer
                newestOnTop={false}
                position={position}
                draggable
                pauseOnHover
                autoClose={3000}
                hideProgressBar={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                stacked
                limit={3}
                toastStyle={{
                    textTransform: "capitalize",
                }}
            />

            <div className="h-16 md:h-20"></div>

            <div className="min-h-[85vh]  p-2 sm:p-4">
                <Outlet />
                {profileDetails && <Profile />}
                {isGroupChat && <GroupChatBox />}
                {isNotification && <NotificationBox />}
            </div>

            <Header />

            {isLoading && <Loading />}

        </div>
    );
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout />,
        children: [
            {
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/signup",
                element: <SignUp />,
            },
            {
                path: "/signin",
                element: <SignIn />,
            },
            {
                path: "*",
                element: <ErrorPage />,
            },
        ],
        errorElement: <ErrorPage />,
    },
]);


function App() {
    return (
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    );
}

export default App;
