import "./App.css";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/layouts/DashboardLayout";

/**
 * Root application component that renders the dashboard layout and page heading.
 *
 * @returns {JSX.Element} A React element containing a DashboardLayout wrapping an h1 heading with the text "HireWise".
 */
function App() {
  return (
    <>
      <DashboardLayout>
        <h1 className="font-faustina text-2xl font-bold">HireWise</h1>
      </DashboardLayout>
    </>
  );
}

export default App;