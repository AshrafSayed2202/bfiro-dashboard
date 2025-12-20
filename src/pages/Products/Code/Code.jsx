import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AgGridTable from "../../../components/AgGridTable";
import Header from "../../../components/UI/Header";
const baseURL = import.meta.env.VITE_BASE_URL; // Adjusted base URL to match backend
const Code = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    sold: 0,
    soldFrom: 0,
    income: 0,
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCodeTemplates();
  }, []);

  const fetchCodeTemplates = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        baseURL + "fetch/site/products/getProducts.php?type=Coded+Templates",
        {
          withCredentials: true,
        }
      );

      // Check API status
      if (response.data.status !== 1) {
        throw new Error("API returned an error status");
      }

      const codeTemplates = response.data.data || [];

      const transformedData = codeTemplates.map((item) => ({
        id: item.id,
        date: item.releaseDate ? item.releaseDate.split(" ")[0] : "N/A",
        name: item.title,
        format: item.formats
          ? item.formats.map((f) => f.text).join(", ")
          : "No formats available",
        solds: item.sales_count || 0, // Note: sales_count missing in backend; defaults to 0
        price: item.price - (item.discount || 0),
        status: item.status,
      }));

      setData(transformedData);

      const total = transformedData.length;
      const active = transformedData.filter(
        (d) => d.status === "active"
      ).length;
      const inactive = total - active;
      const sold = transformedData.reduce((sum, d) => sum + d.solds, 0);
      const soldFrom = transformedData.filter((d) => d.solds > 0).length;
      const income = transformedData.reduce(
        (sum, d) => sum + d.solds * d.price,
        0
      );

      setStats({ total, active, inactive, sold, soldFrom, income });
    } catch (error) {
      console.error("Error fetching Products:", error);
      // Optional: Show user-friendly error (e.g., via toast)
      alert("Failed to load products. Please try again."); // Replace with your UI lib
      setData([]);
      setStats({
        total: 0,
        active: 0,
        inactive: 0,
        sold: 0,
        soldFrom: 0,
        income: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const colDefs = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "format", headerName: "Framework", width: 130 },
    { field: "solds", headerName: "Solds Number", width: 130 },
    {
      field: "price",
      headerName: "Price",
      width: 110,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
    },
    {
      headerName: "Total Income",
      valueGetter: (params) => params.data.solds * params.data.price,
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
      width: 140,
    },
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
      headerName: "Activities",
      width: 100,
      cellRenderer: (params) => (
        <span
          className="text-blue-500 cursor-pointer hover:underline"
          onClick={() => navigate(`/code/${params.data.id}`)}
        >
          details
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading Products...</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Products" />
      <div className="mt-6 flex flex-wrap gap-6">
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Total Products</p>
          <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Active Products</p>
          <p className="text-4xl font-bold text-white mt-2">{stats.active}</p>
          <p className="text-sm text-gray-400 mt-1">
            Inactive: {stats.inactive}
          </p>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Total Sold Items</p>
          <p className="text-4xl font-bold text-white mt-2">{stats.sold}</p>
          <p className="text-sm text-gray-400 mt-1">
            From {stats.soldFrom} products
          </p>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Total Income</p>
          <p className="text-4xl font-bold text-white mt-2">
            ${stats.income.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-start">
        <button
          onClick={() => navigate("/code/new")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          Create New Product
        </button>
      </div>

      <div className="mt-6 bg-[#171718CC] p-4 rounded-[20px]">
        <div className="h-[650px] ">
          <AgGridTable
            className="h-full w-full"
            importedData={data}
            tableName="products"
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

export default Code;
