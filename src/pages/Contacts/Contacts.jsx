import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/UI/Header";
const baseURL = import.meta.env.VITE_BASE_URL; // Adjusted base URL to match backend
const Contacts = () => {
  const [figma, setFigma] = useState("");
  const [behance, setBehance] = useState("");
  const [dribble, setDribble] = useState("");
  const [instagram, setInstagram] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [mail, setMail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        baseURL + "fetch/admin/contact/getContacts.php",
        {
          withCredentials: true,
        }
      );

      if (response.data.status !== 1) {
        throw new Error("API returned an error status");
      }

      const contactData = response.data.contact || {};

      setFigma(contactData.figma || "");
      setBehance(contactData.behance || "");
      setDribble(contactData.dribble || "");
      setInstagram(contactData.instagram || "");
      setLinkedin(contactData.linkedin || "");
      setMail(contactData.mail || "");
    } catch (error) {
      console.error("Error fetching Contacts:", error);
      alert("Failed to load contacts. Please try again.");
      setFigma("");
      setBehance("");
      setDribble("");
      setInstagram("");
      setLinkedin("");
      setMail("");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        baseURL + "actions/admin/contact/edit.php",
        {
          figma,
          behance,
          dribble,
          instagram,
          linkedin,
          mail,
        },
        { withCredentials: true }
      );

      if (response.data.status !== 1) {
        throw new Error(response.data.message || "Update failed");
      }

      alert("Contacts updated successfully");
      fetchContacts();
    } catch (error) {
      console.error("Error updating contacts:", error);
      alert("Failed to update contacts. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading Contacts...</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Contacts" />
      <div className="mt-6 grid grid-cols-2 gap-6">
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white mb-4">Figma</p>
          <div>
            <label className="block text-sm text-gray-400">URL</label>
            <input
              type="text"
              value={figma}
              onChange={(e) => setFigma(e.target.value)}
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white mb-4">Behance</p>
          <div>
            <label className="block text-sm text-gray-400">URL</label>
            <input
              type="text"
              value={behance}
              onChange={(e) => setBehance(e.target.value)}
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white mb-4">Dribbble</p>
          <div>
            <label className="block text-sm text-gray-400">URL</label>
            <input
              type="text"
              value={dribble}
              onChange={(e) => setDribble(e.target.value)}
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white mb-4">Instagram</p>
          <div>
            <label className="block text-sm text-gray-400">URL</label>
            <input
              type="text"
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white mb-4">LinkedIn</p>
          <div>
            <label className="block text-sm text-gray-400">URL</label>
            <input
              type="text"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white mb-4">Mail</p>
          <div>
            <label className="block text-sm text-gray-400">Email</label>
            <input
              type="text"
              value={mail}
              onChange={(e) => setMail(e.target.value)}
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-start">
        <button
          onClick={handleSave}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition duration-200"
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Contacts;
