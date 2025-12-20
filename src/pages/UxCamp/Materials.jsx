import { useState, useEffect } from "react";
import axios from "axios";
import AgGridTable from "../../components/AgGridTable";
import Header from "../../components/UI/Header";
const baseURL = import.meta.env.VITE_BASE_URL; // Adjusted base URL to match backend
const storageURL = import.meta.env.VITE_BASE_STORAGE_URL; // Adjusted storage URL to match backend
const Materials = () => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [stats, setStats] = useState({ total: 0 });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    file: null,
  });
  const [error, setError] = useState(null);

  const baseStorageUrl = `${storageURL}uxcamp/`;

  const typeToField = {
    "E-book": "E-Book",
    "UI Kit": "UI Kit",
    "Mobile App Template": "Mobile App Template",
    "Landing Page Template": "Landing Page Template",
  };

  const availableTypes = Object.keys(typeToField);

  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${baseURL}fetch/admin/uxCamp/materials.php`,
        { withCredentials: true }
      );

      if (response.data.status !== 1) {
        throw new Error("API returned an error status");
      }

      const materials = response.data.materials || [];
      setData(materials);
      setStats({ total: response.data.total || 0 });
    } catch (error) {
      console.error("Error fetching materials:", error);
      alert("Failed to load materials. Please try again.");
      setData([]);
      setStats({ total: 0 });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.type || !formData.file) {
      setError("Type and file are required");
      return;
    }
    setError(null);

    const field = typeToField[formData.type];
    if (!field) {
      setError("Invalid type");
      return;
    }

    const form = new FormData();
    form.append(field, formData.file);

    try {
      const response = await axios.post(
        `${baseURL}actions/admin/uxCamp/editMaterial.php`,
        form,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (response.data.status !== 1) {
        throw new Error(response.data.message || "Failed to save");
      }

      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      console.error("Error saving material:", error);
      setError(error.message || "Failed to save. Please try again.");
    }
  };

  const handleEdit = (material) => {
    setFormData({
      type: material.type,
      file: null,
    });
    setIsEdit(true);
    setCurrentId(material.id);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      type: "",
      file: null,
    });
    setIsEdit(false);
    setCurrentId(null);
    setError(null);
  };

  const colDefs = [
    { field: "id", headerName: "ID", width: 80 },
    { field: "type", headerName: "Type", flex: 1 },
    {
      field: "path",
      headerName: "File",
      flex: 1,
      cellRenderer: (params) =>
        params.value ? (
          <a
            href={baseStorageUrl + params.value}
            download
            className="text-blue-500 hover:underline"
          >
            Download
          </a>
        ) : (
          "No file"
        ),
    },
    { field: "created_at", headerName: "Created At", flex: 1 },
    {
      headerName: "Actions",
      width: 200,
      cellRenderer: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(params.data)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading Materials...</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Materials" />

      {/* Stats Cards */}
      <div className="mt-6 flex flex-wrap gap-6">
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px] text-center">
          <p className="text-xl text-white">Total Materials</p>
          <p className="text-4xl font-bold text-white mt-2">{stats.total}</p>
        </div>
      </div>

      {/* Add Button */}
      <div className="mt-6 flex justify-start">
        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          Add New Material
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171718CC] p-8 rounded-[20px] w-96">
            <h2 className="text-white text-2xl mb-4">
              {isEdit ? "Edit" : "Add"} Material
            </h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="mb-4">
              <label className="block text-white mb-1">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                disabled={isEdit}
                className="w-full p-2 rounded bg-gray-800 text-white"
              >
                <option value="">Select Type</option>
                {availableTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-white mb-1">File</label>
              <input
                type="file"
                accept="application/pdf,application/zip,application/x-zip-compressed"
                onChange={handleFileChange}
                className="w-full text-white"
              />
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  resetForm();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Save
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
            tableName="materials"
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

export default Materials;
