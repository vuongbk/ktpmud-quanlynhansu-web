import { Routes, Route } from "react-router-dom";
import Layout from '../Components/Layout';
import EditPage from "../Pages/EditPage";
import Home from '../Pages/Home';
import Staffs from '../Pages/Staffs';

const Router = () => {
    return (
      <>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="/staff" element={<Staffs />} />
            <Route path="/edit-staff" element={<EditPage />} />
          </Route>
        </Routes>
    </>
    )
  };
  
export default Router;