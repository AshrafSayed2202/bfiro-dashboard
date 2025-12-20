import { useState, useEffect } from "react";
import axios from "axios";
import Header from "../../components/UI/Header";
const baseURL = import.meta.env.VITE_BASE_URL; // Adjusted base URL to match backend
const Pricing = () => {
  const [designPrice, setDesignPrice] = useState(0);
  const [designOldPrice, setDesignOldPrice] = useState(0);
  const [subscriptionPrice, setSubscriptionPrice] = useState(0);
  const [subscriptionOldPrice, setSubscriptionOldPrice] = useState(0);
  const [yearlyAccessPrice, setYearlyAccessPrice] = useState(0);
  const [yearlyAccessOldPrice, setYearlyAccessOldPrice] = useState(0);
  const [uxCampPrice, setUxCampPrice] = useState(0);
  const [uxCampOldPrice, setUxCampOldPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPricing();
  }, []);

  const fetchPricing = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        baseURL + "fetch/admin/pricing/pricing.php",
        {
          withCredentials: true,
        }
      );

      if (response.data.status !== 1) {
        throw new Error("API returned an error status");
      }

      const pricingData = response.data.data || [];

      const design = pricingData.find((item) => item.title === "Design") || {
        price: 0,
        discount: 0,
      };
      const subscription = pricingData.find(
        (item) => item.title === "Subscription"
      ) || { price: 0, discount: 0 };
      const yearlyAccess = pricingData.find((item) => item.id == 2) || {
        price: 0,
        discount: 0,
      };
      const uxCamp = pricingData.find((item) => item.id == 3) || {
        price: 0,
        discount: 0,
      };

      setDesignPrice(parseFloat(design.price) || 0);
      setDesignOldPrice(
        (parseFloat(design.price) || 0) + (parseFloat(design.discount) || 0)
      );

      setSubscriptionPrice(parseFloat(subscription.price) || 0);
      setSubscriptionOldPrice(
        (parseFloat(subscription.price) || 0) +
          (parseFloat(subscription.discount) || 0)
      );

      setYearlyAccessPrice(parseFloat(yearlyAccess.price) || 0);
      setYearlyAccessOldPrice(
        (parseFloat(yearlyAccess.price) || 0) +
          (parseFloat(yearlyAccess.discount) || 0)
      );

      setUxCampPrice(parseFloat(uxCamp.price) || 0);
      setUxCampOldPrice(
        (parseFloat(uxCamp.price) || 0) + (parseFloat(uxCamp.discount) || 0)
      );
    } catch (error) {
      console.error("Error fetching Pricing:", error);
      alert("Failed to load pricing. Please try again.");
      setDesignPrice(0);
      setDesignOldPrice(0);
      setSubscriptionPrice(0);
      setSubscriptionOldPrice(0);
      setYearlyAccessPrice(0);
      setYearlyAccessOldPrice(0);
      setUxCampPrice(0);
      setUxCampOldPrice(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(
        baseURL + "actions/admin/pricing/edit.php",
        {
          designPrice,
          designOldPrice,
          subscriptionPrice,
          subscriptionOldPrice,
          yearlyAccessPrice,
          yearlyAccessOldPrice,
          uxCampPrice,
          uxCampOldPrice,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.status !== 1) {
        throw new Error(response.data.message || "Update failed");
      }

      alert("Prices updated successfully");
      fetchPricing();
    } catch (error) {
      console.error("Error updating pricing:", error);
      alert("Failed to update prices. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-white text-xl">Loading Pricing...</div>
      </div>
    );
  }

  return (
    <div>
      <Header title="Pricing" />
      <div className="mt-6 flex flex-wrap gap-6">
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white text-center mb-4">Design</p>
          <div>
            <label className="block text-sm text-gray-400">Current Price</label>
            <input
              type="number"
              step="0.01"
              value={designPrice}
              onChange={(e) => setDesignPrice(parseFloat(e.target.value) || 0)}
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-400">Old Price</label>
            <input
              type="number"
              step="0.01"
              value={designOldPrice}
              onChange={(e) =>
                setDesignOldPrice(parseFloat(e.target.value) || 0)
              }
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white text-center mb-4">Subscription</p>
          <div>
            <label className="block text-sm text-gray-400">Current Price</label>
            <input
              type="number"
              step="0.01"
              value={subscriptionPrice}
              onChange={(e) =>
                setSubscriptionPrice(parseFloat(e.target.value) || 0)
              }
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-400">Old Price</label>
            <input
              type="number"
              step="0.01"
              value={subscriptionOldPrice}
              onChange={(e) =>
                setSubscriptionOldPrice(parseFloat(e.target.value) || 0)
              }
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white text-center mb-4">Yearly Access</p>
          <div>
            <label className="block text-sm text-gray-400">Current Price</label>
            <input
              type="number"
              step="0.01"
              value={yearlyAccessPrice}
              onChange={(e) =>
                setYearlyAccessPrice(parseFloat(e.target.value) || 0)
              }
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-400">Old Price</label>
            <input
              type="number"
              step="0.01"
              value={yearlyAccessOldPrice}
              onChange={(e) =>
                setYearlyAccessOldPrice(parseFloat(e.target.value) || 0)
              }
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        <div className="bg-[#171718CC] p-5 rounded-[20px] flex-1 min-w-[200px]">
          <p className="text-xl text-white text-center mb-4">UX Camp</p>
          <div>
            <label className="block text-sm text-gray-400">Current Price</label>
            <input
              type="number"
              step="0.01"
              value={uxCampPrice}
              onChange={(e) => setUxCampPrice(parseFloat(e.target.value) || 0)}
              className="mt-1 bg-gray-800 text-white p-2 rounded w-full border border-gray-700 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mt-4">
            <label className="block text-sm text-gray-400">Old Price</label>
            <input
              type="number"
              step="0.01"
              value={uxCampOldPrice}
              onChange={(e) =>
                setUxCampOldPrice(parseFloat(e.target.value) || 0)
              }
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

export default Pricing;
