import Navbar from "../components/Navbar";
import { useParams } from "react-router-dom";

const { id } = useParams();

const Profile = () => {
  return (
    <div>
      <Navbar />
      <h1>Profile Page</h1>
      {/* Profile content goes here */}
    </div>
  );
};
export default Profile;
