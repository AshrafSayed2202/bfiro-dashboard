import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AgGridTable from "../../components/AgGridTable";
import Header from "../../components/UI/Header";

const baseURL = import.meta.env.VITE_BASE_URL;

const configs = {
  "ui-kits": {
    apiType: "UI+Kits",
    title: "UI Kits",
    defaultFormat: "Figma, PSD",
    formatHeader: "Format",
    totalLabel: "Total Templates",
    activeLabel: "Active Templates",
    soldFromLabel: "templates",
    createButton: "Create New UI Kit",
    loadingText: "UI Kits",
    errorText: "UI Kits",
    tableName: "uiKits",
    path: "ui-kits",
    itemNamePlural: "UI Kits",
  },
  illustrations: {
    apiType: "Illustrations",
    title: "Illustrations",
    defaultFormat: "SVG, AI, PNG",
    formatHeader: "Format",
    totalLabel: "Total Illustrations",
    activeLabel: "Active Illustrations",
    soldFromLabel: "illustrations",
    createButton: "Create New Illustration",
    loadingText: "Illustrations",
    errorText: "illustrations",
    tableName: "illustrations",
    path: "illustrations",
    itemNamePlural: "Illustrations",
  },
  icons: {
    apiType: "Icons",
    title: "Icons",
    defaultFormat: "SVG, PNG",
    formatHeader: "Format",
    totalLabel: "Total Icon Sets",
    activeLabel: "Active Icon Sets",
    soldFromLabel: "icon sets",
    createButton: "Create New Icon Set",
    loadingText: "Icons",
    errorText: "icons",
    tableName: "icons",
    path: "icons",
    itemNamePlural: "Icons",
  },
  fonts: {
    apiType: "Fonts",
    title: "Fonts",
    defaultFormat: "OTF, TTF, Variable",
    formatHeader: "Format",
    totalLabel: "Total Font Families",
    activeLabel: "Active Font Families",
    soldFromLabel: "font families",
    createButton: "Create New Font Family",
    loadingText: "Fonts",
    errorText: "fonts",
    tableName: "fonts",
    path: "fonts",
    itemNamePlural: "Fonts",
  },
  code: {
    apiType: "Coded+Templates",
    title: "Products",
    defaultFormat: "No formats available",
    formatHeader: "Framework",
    totalLabel: "Total Products",
    activeLabel: "Active Products",
    soldFromLabel: "products",
    createButton: "Create New Product",
    loadingText: "Products",
    errorText: "products",
    tableName: "products",
    path: "code",
    itemNamePlural: "Products",
  },
};

const ProductList = ({ productType }) => {
  const config = configs[productType];

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
    const fetchProducts = async () => {
      if (!config) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(
          `${baseURL}fetch/site/products/getProducts.php?type=${config.apiType}`,
          {
            withCredentials: true,
          },
        );

        if (response.data.status !== 1) {
          throw new Error("API returned an error status");
        }

        const products = response.data.data || [];

        const transformedData = products.map((item) => ({
          id: item.id,
          date: item.releaseDate ? item.releaseDate.split(" ")[0] : "N/A",
          name: item.title,
          format: item.formats
            ? item.formats.map((f) => f.text).join(", ")
            : config.defaultFormat,
          solds: item.solds || 0,
          originalPrice: item.price || 0,
          discount: item.discount || 0,
          finalPrice: (item.price || 0) - (item.discount || 0),
          status: item.status,
        }));

        setData(transformedData);

        const total = transformedData.length;
        const active = transformedData.filter(
          (d) => d.status === "active",
        ).length;
        const inactive = total - active;
        const sold = transformedData.reduce((sum, d) => sum + d.solds, 0);
        const soldFrom = transformedData.filter((d) => d.solds > 0).length;
        const income = transformedData.reduce(
          (sum, d) => sum + d.solds * d.finalPrice,
          0,
        );

        setStats({ total, active, inactive, sold, soldFrom, income });
      } catch (error) {
        console.error(`Error fetching ${config.title}:`, error);
        alert(`Failed to load ${config.errorText}. Please try again.`);
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
    fetchProducts();
  }, [config, productType]);

  if (!config) {
    return <div>Invalid product type</div>;
  }

  const colDefs = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "date", headerName: "Date", width: 120 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "format", headerName: config.formatHeader, width: 130 },
    { field: "solds", headerName: "Solds Number", width: 130 },
    {
      headerName: "Price",
      width: 150,
      cellRenderer: (params) => {
        const original = params.data.originalPrice;
        const discount = params.data.discount;
        const finalPrice = params.data.finalPrice;
        if (discount > 0) {
          return (
            <span>
              <span className="line-through text-gray-500 mr-2">
                {`$${original.toFixed(2)}`}
              </span>
              {`$${finalPrice.toFixed(2)}`}
            </span>
          );
        } else {
          return `$${finalPrice.toFixed(2)}`;
        }
      },
    },
    {
      headerName: "Total Income",
      valueGetter: (params) => params.data.solds * params.data.finalPrice,
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
          onClick={() => navigate(`/${config.path}/${params.data.id}`)}
        >
          details
        </span>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">
          Loading {config.loadingText}...
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={config.title} />

      {/* Stats Cards */}
      <div className="mt-6 flex flex-wrap gap-6">
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">{config.totalLabel}</p>
          <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">{config.activeLabel}</p>
          <p className="text-4xl font-bold text-white mt-2">{stats.active}</p>
          <p className="text-sm text-gray-400 mt-1">
            Inactive: {stats.inactive}
          </p>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Total Sold Items</p>
          <p className="text-4xl font-bold text-white mt-2">{stats.sold}</p>
          <p className="text-sm text-gray-400 mt-1">
            From {stats.soldFrom} {config.soldFromLabel}
          </p>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Total Income</p>
          <p className="text-4xl font-bold text-white mt-2">
            {`$${stats.income.toFixed(2)}`}
          </p>
        </div>
      </div>

      {/* Create Button */}
      <div className="mt-6 flex justify-start">
        <button
          onClick={() => navigate(`/${config.path}/new`)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          {config.createButton}
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 bg-[#171718CC] p-4 rounded-[20px]">
        <div className="h-[650px]">
          <AgGridTable
            importedData={data}
            tableName={config.tableName}
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

export default ProductList;
