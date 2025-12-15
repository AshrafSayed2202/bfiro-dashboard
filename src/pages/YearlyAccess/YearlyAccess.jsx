import { useState, useEffect } from "react";
import axios from "axios";
import AgGridTable from "../../components/AgGridTable";
import Header from "../../components/UI/Header";

const YearlyAccess = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    unauthorized: 0,
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    user_id: "",
    purchased_date: "",
    end_date: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchYearlyAccess();
  }, []);

  const fetchYearlyAccess = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost/bfiro_backend/fetch/admin/accessYearly/getAccessYearly.php",
        {
          withCredentials: true,
        }
      );

      if (response.data.status !== 1) {
        throw new Error("API returned an error status");
      }

      const accessData = response.data.data || [];

      const transformedData = accessData.map((access) => ({
        id: access.id,
        userId: access.user_id,
        name: access.name,
        email: access.email,
        purchasedDate: access.purchased_date || "N/A",
        endDate: access.end_date || "N/A",
        status: access.status,
        unauthorized: access.unauthorized_downloads || 0,
      }));

      setData(transformedData);

      const total = transformedData.length;
      const active = transformedData.filter(
        (d) => d.status === "active"
      ).length;
      const inactive = total - active;
      const unauthorized = transformedData.reduce(
        (sum, d) => sum + d.unauthorized,
        0
      );

      setStats({ total, active, inactive, unauthorized });
    } catch (error) {
      console.error("Error fetching Yearly Access:", error);
      alert("Failed to load Yearly Access. Please try again.");
      setData([]);
      setStats({ total: 0, active: 0, inactive: 0, unauthorized: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost/bfiro_backend/actions/accessYearly/addUser.php",
        formData,
        {
          withCredentials: true,
        }
      );

      if (response.data.status !== 1) {
        throw new Error(response.data.message || "Failed to add user");
      }

      setShowModal(false);
      setFormData({ user_id: "", purchased_date: "", end_date: "" });
      setError(null);
      fetchYearlyAccess();
    } catch (error) {
      console.error("Error adding user:", error);
      setError(error.message || "Failed to add user. Please try again.");
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const response = await axios.post(
        "http://localhost/bfiro_backend/fetch/accessYearly/editUser.php",
        {
          user_id: userId,
          status: newStatus,
        },
        { withCredentials: true }
      );

      if (response.data.status !== 1) {
        throw new Error(response.data.message || "Failed to update status");
      }

      fetchYearlyAccess();
    } catch (error) {
      console.error("Error toggling status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const colDefs = [
    { field: "id", headerName: "Access ID", width: 120 },
    { field: "userId", headerName: "User ID", width: 100 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "purchasedDate", headerName: "Purchased Date", width: 180 },
    { field: "endDate", headerName: "End Date", width: 180 },
    { field: "unauthorized", headerName: "Unauthorized Downloads", width: 180 },
    {
      field: "status",
      headerName: "Status",
      width: 110,
      cellRenderer: (params) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            params.value === "active"
              ? "bg-green-900 text-green-300"
              : "bg-gray-700 text-gray-300"
          }`}
        >
          {params.value}
        </span>
      ),
    },
    {
      headerName: "Actions",
      width: 150,
      cellRenderer: (params) => (
        <button
          className={`px-4 py-1 rounded text-white ${
            params.data.status === "active"
              ? "bg-red-600 hover:bg-red-700"
              : "bg-green-600 hover:bg-green-700"
          }`}
          onClick={() =>
            handleToggleStatus(params.data.userId, params.data.status)
          }
        >
          {params.data.status === "active" ? "Deactivate" : "Activate"}
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading Yearly Access...</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Yearly Access" />

      {/* Stats Cards */}
      <div className="mt-6 flex flex-wrap gap-6">
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Total Access</p>
          <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Active Access</p>
          <p className="text-4xl font-bold text-white mt-2">{stats.active}</p>
          <p className="text-sm text-gray-400 mt-1">
            Inactive: {stats.inactive}
          </p>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Unauthorized Downloads</p>
          <p className="text-4xl font-bold text-white mt-2">
            {stats.unauthorized}
          </p>
        </div>
      </div>

      {/* Add Button */}
      <div className="mt-6 flex justify-start">
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          Add New User
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171718CC] p-8 rounded-[20px] w-96">
            <h2 className="text-white text-2xl mb-4">Add Yearly Access</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <input
              type="number"
              name="user_id"
              placeholder="User ID"
              value={formData.user_id}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
            />
            <input
              type="datetime-local"
              name="purchased_date"
              placeholder="Purchased Date"
              value={formData.purchased_date}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
            />
            <input
              type="datetime-local"
              name="end_date"
              placeholder="End Date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="w-full mb-4 p-2 rounded bg-gray-800 text-white"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="mt-6 bg-[#171718CC] p-4 rounded-[20px]">
        <div className="h-[650px]">
          <AgGridTable
            importedData={data}
            tableName="yearlyAccess"
            colDefs={colDefs}
            selectible={true}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            pdfExport={true}
            csvExport={true}
            colsManage={true}
            roleNumber={65}
          />
        </div>
      </div>
    </div>
  );
};

export default YearlyAccess;
