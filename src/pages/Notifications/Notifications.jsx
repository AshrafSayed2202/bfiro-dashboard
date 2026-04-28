import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AgGridTable from "../../components/AgGridTable";
import Header from "../../components/UI/Header";

const baseURL = import.meta.env.VITE_BASE_URL;

const Notifications = () => {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [pushes, setPushes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPushModal, setShowPushModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [pushGroup, setPushGroup] = useState("ux_camp");

  const [newContent, setNewContent] = useState("");

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${baseURL}actions/admin/notifications/fetch.php`,
        {
          withCredentials: true,
        },
      );

      if (res.data.status === 1) {
        setNotifications(res.data.notifications || []);
      } else {
        throw new Error(res.data.message);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  // Fetch pushes (all or for specific notification)
  const fetchPushes = async (notificationId = null) => {
    try {
      const url = notificationId
        ? `${baseURL}actions/admin/notifications/pushes.php?notification_id=${notificationId}`
        : `${baseURL}actions/admin/notifications/pushes.php`;

      const res = await axios.get(url, { withCredentials: true });

      if (res.data.status === 1) {
        setPushes(res.data.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchPushes();
  }, []);

  // Add New Notification
  const handleAddNotification = async () => {
    if (!newContent.trim()) {
      alert("Content cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        `${baseURL}actions/admin/notifications/add.php`,
        { content: newContent },
        { withCredentials: true },
      );

      if (res.data.status === 1) {
        alert("Notification created successfully");
        setNewContent("");
        setShowAddModal(false);
        fetchNotifications();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create notification");
    }
  };

  // Push Notification
  const openPushModal = (notif) => {
    setSelectedNotification(notif);
    setPushGroup("ux_camp");
    setShowPushModal(true);
  };

  const handlePush = async () => {
    if (!selectedNotification) return;

    try {
      const res = await axios.post(
        `${baseURL}actions/admin/notifications/push.php`,
        {
          notification_id: selectedNotification.id,
          group: pushGroup,
        },
        { withCredentials: true },
      );

      if (res.data.status === 1) {
        alert(`Pushed to ${res.data.users_received} users successfully!`);
        setShowPushModal(false);
        fetchPushes(selectedNotification.id); // Refresh pushes for this notification
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to push notification");
    }
  };

  // Delete Notification
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification and all its pushes?")) return;

    try {
      const res = await axios.post(
        `${baseURL}actions/admin/notifications/remove.php`,
        { id },
        { withCredentials: true },
      );

      if (res.data.status === 1) {
        alert("Notification deleted");
        fetchNotifications();
        fetchPushes();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  // Column Definitions
  const notiColDefs = [
    { field: "id", headerName: "ID", width: 80 },
    {
      field: "content",
      headerName: "Content",
      flex: 2,
      wrapText: true,
      autoHeight: true,
    },
    { field: "created_date", headerName: "Created At", flex: 1 },
    {
      headerName: "Actions",
      width: 220,
      cellRenderer: (params) => (
        <div className="flex gap-2">
          <button
            onClick={() => openPushModal(params.data)}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
          >
            Push
          </button>
          <button
            onClick={() => handleDelete(params.data.id)}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const pushColDefs = [
    { field: "user_id", headerName: "User ID", width: 100 },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1 },
    {
      field: "is_read",
      headerName: "Read",
      width: 100,
      cellRenderer: (p) => (p.value == "0" ? "No" : "Yes"),
    },
    { field: "notification_id", headerName: "Notification ID", width: 120 },
    { field: "created_date", headerName: "Received At", flex: 1 },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading Notifications...</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Notifications Management" />

      {/* Add Button */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
        >
          + New Notification
        </button>
      </div>

      {/* Notifications Table */}
      <div className="mt-6">
        <Header title="All Notifications" />
        <div className="mt-4 bg-[#171718CC] p-4 rounded-[20px]">
          <div className="h-[420px]">
            <AgGridTable
              importedData={notifications}
              tableName="notifications"
              colDefs={notiColDefs}
              selectible={true}
              pdfExport={true}
              csvExport={true}
              colsManage={true}
              roleNumber={65}
            />
          </div>
        </div>
      </div>

      {/* Push History Table */}
      <div className="mt-10">
        <Header title="Push History" />
        <div className="mt-4 bg-[#171718CC] p-4 rounded-[20px]">
          <div className="h-[420px]">
            <AgGridTable
              importedData={pushes}
              tableName="notificationPushes"
              colDefs={pushColDefs}
              selectible={true}
              pdfExport={true}
              csvExport={true}
              colsManage={true}
              roleNumber={65}
            />
          </div>
        </div>
      </div>

      {/* ==================== ADD MODAL ==================== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171718CC] p-8 rounded-[20px] w-[500px]">
            <h2 className="text-white text-2xl mb-6">
              Create New Notification
            </h2>

            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="Write notification content here..."
              className="w-full h-40 p-4 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
            />

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewContent("");
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNotification}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
              >
                Create Notification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PUSH MODAL ==================== */}
      {showPushModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#171718CC] p-8 rounded-[20px] w-96">
            <h2 className="text-white text-2xl mb-4">Push Notification</h2>
            <p className="text-gray-400 mb-6 line-clamp-2">
              {selectedNotification.content}
            </p>

            <div className="mb-6">
              <label className="block text-white mb-2">Send to Group</label>
              <select
                value={pushGroup}
                onChange={(e) => setPushGroup(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 text-white"
              >
                <option value="new_release">New Releases</option>
                <option value="ux_camp">UX Camp Users</option>
                <option value="offers">Special Offers</option>
              </select>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPushModal(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handlePush}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded"
              >
                Push Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
