import { Outlet } from "react-router";
import Header from "../components/common/Header";
import Footer from "../components/common/Footer";

const MainLayout = () => {
  return (
    <div>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
export default MainLayout;
