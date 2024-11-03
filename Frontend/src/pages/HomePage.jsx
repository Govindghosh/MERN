import { useSelector } from "react-redux";
import useLogout from "../hooks/user/useLogout";
import { ToastContainer } from "react-toastify";
import UploadVideoForm from "../components/UploadVideoForm";
import VideoList from "../components/VideoList";
import ChannelProfileUI from "../components/ChannelProfileUI";

function HomePage() {
    const { logoutUser, loading } = useLogout();
    const authUser = useSelector((state) => state.auth.user);
    console.log("authUser: ", authUser);
    if (!authUser) {
        return <div className="m-10">Please log in to view this page.</div>;
    }

    return (
        <div className="m-10">
            <h1 className="text-2xl font-bold mb-4">Home Page</h1>
            <div className="space-y-2">
                <h3 className="text-lg">User ID: {authUser?.data?.user?._id}</h3>
                <h3 className="text-lg">Username: {authUser?.data?.user?.username}</h3>
                <h3 className="text-lg">Email: {authUser?.data?.user?.email}</h3>
                <h3 className="text-lg">Full Name: {authUser?.data?.user?.fullName}</h3>
                {authUser?.data?.user?.avatar && (
                    <img
                        src={authUser.data.user.avatar}
                        alt="User Avatar"
                        className="rounded-full w-24 h-24"
                    />
                )}
                {authUser?.data?.user?.coverImage && (
                    <img
                        src={authUser.data.user.coverImage}
                        alt="User Cover"
                        className="rounded-lg w-full max-w-md"
                    />
                )}
            </div>
            <div className="m5">
                <UploadVideoForm />
            </div>
            <div className="m5">
                <VideoList />
            </div>
            <div>
                <ChannelProfileUI />
            </div>
            <button
                onClick={logoutUser}
                type="button"
                className="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600 dark:hover:bg-purple-700 dark:focus:ring-purple-900"
            >
                {loading ? "Logging Out..." : "Log Out"}
            </button>
            <ToastContainer />
        </div>
    );
}

export default HomePage;
