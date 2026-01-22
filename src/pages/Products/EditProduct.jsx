import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/UI/Header";
import { Editor } from "@tinymce/tinymce-react";
import { TINYMCE_API_KEY } from "../../utils/env";

const baseURL = import.meta.env.VITE_BASE_URL;
const storageUrl = import.meta.env.VITE_BASE_STORAGE_URL;

const productConfigs = {
  "ui-kits": {
    apiType: "UI Kits",
    title: "UI Kit",
    path: "ui-kits",
    formatLabel: "Format",
    formatOptions: ["Figma", "Sketch", "XD", "Photoshop", "Framer"],
    fileAccept: ".zip,.rar,.7z",
    itemName: "UI Kit",
  },
  illustrations: {
    apiType: "Illustrations",
    title: "Illustration",
    path: "illustrations",
    formatLabel: "Format",
    formatOptions: ["Illustrator", "Photoshop", "Figma", "Sketch", "XD"],
    fileAccept: ".zip,.rar,.7z",
    itemName: "Illustration",
  },
  icons: {
    apiType: "Icons",
    title: "Icon Set",
    path: "icons",
    formatLabel: "Format",
    formatOptions: ["Illustrator", "Photoshop", "Figma", "Sketch", "XD"],
    fileAccept: ".zip,.rar,.7z",
    itemName: "Icon Set",
  },
  fonts: {
    apiType: "Fonts",
    title: "Font Family",
    path: "fonts",
    formatLabel: "Format",
    formatOptions: ["Any format"],
    fileAccept: ".zip,.rar,.7z",
    itemName: "Font Family",
  },
  code: {
    apiType: "Coded Templates",
    title: "Product",
    path: "code",
    formatLabel: "Framework",
    formatOptions: ["React", "Swift"],
    fileAccept: ".zip,.rar,.7z",
    itemName: "Product",
  },
};

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [config, setConfig] = useState(null);

  const [isEditMode, setIsEditMode] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [overview, setOverview] = useState("");
  const [points, setPoints] = useState([]);
  const [formats, setFormats] = useState([]);
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [status, setStatus] = useState("active");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [templateFile, setTemplateFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [cover, setCover] = useState(null);
  const [gallery, setGallery] = useState([]);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState("");
  const [currentCoverUrl, setCurrentCoverUrl] = useState("");
  const [currentGalleryUrls, setCurrentGalleryUrls] = useState([]);
  const [currentPreviewPhotoUrl, setCurrentPreviewPhotoUrl] = useState("");
  const [currentTemplateFileName, setCurrentTemplateFileName] = useState("");

  const [date, setDate] = useState("");
  const [solds, setSolds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${baseURL}fetch/site/products/getProduct.php?id=${id}`,
          {
            withCredentials: true,
          },
        );
        const result = response.data;

        if (result.status !== 1 || !result.data) {
          navigate("/"); // Or dashboard
          return;
        }

        const product = result.data;
        const typeKey = Object.keys(productConfigs).find(
          (key) => productConfigs[key].apiType === product.type,
        );

        if (!typeKey) {
          navigate("/");
          return;
        }

        setConfig(productConfigs[typeKey]);

        setTitle(product.title || "");
        setSubtitle(product.subtitle || "");
        setOverview(product.overview || "");
        const highlights = product.highlights
          ? product.highlights.map((h) => h.highlight || "")
          : [];
        const paddedHighlights = [
          ...highlights,
          ...Array(6 - highlights.length).fill(""),
        ];
        setPoints(paddedHighlights);
        setFormats(
          product.formats ? product.formats.map((f) => f.text || "") : [],
        );

        setPrice(product.price.toString() || "");
        setDiscount(product.discount.toString() || "");

        setStatus(product.status || "active");
        setTags(product.labels ? product.labels.map((l) => l.text || "") : []);
        setDate(product.releaseDate ? product.releaseDate.split(" ")[0] : "");
        setSolds(product.solds || 0);

        // Images
        const images = product.images || [];
        setCurrentCoverUrl(
          images.find((img) => img.purpose === "cover")?.url || "",
        );
        setCurrentGalleryUrls(
          images
            .filter((img) => img.purpose === "gallery")
            .map((img) => img.url),
        );
        setCurrentPreviewPhotoUrl(
          images.find((img) => img.purpose === "preview")?.url || "",
        );
        setCurrentThumbnailUrl(
          images.find((img) => img.purpose === "bg")?.url || "",
        );

        // Files
        const files = product.files || [];
        setCurrentTemplateFileName(files[0]?.storage_path || "");
      } catch (error) {
        console.error("Error fetching product:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading || !config) {
    return (
      <div className="text-white text-center mt-40 text-4xl">Loading...</div>
    );
  }

  const handlePointsChange = (index, value) => {
    const newPoints = [...points];
    newPoints[index] = value;
    setPoints(newPoints);
  };

  const handleFormatChange = (e) => {
    const val = e.target.value;
    if (val && !formats.includes(val)) {
      setFormats([...formats, val]);
    }
  };

  const removeFormat = (index) => {
    setFormats(formats.filter((_, i) => i !== index));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (saving) return;

    const priceNum = parseFloat(price) || 0;
    const discountNum = parseFloat(discount) || 0;

    if (discountNum > priceNum) {
      alert("Discount cannot be more than price.");
      return;
    }

    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("overview", overview);
      formData.append(
        "highlights",
        JSON.stringify(points.filter((p) => p.trim())),
      );
      formData.append("formats", formats.join(","));
      formData.append("price", price);
      formData.append("discount", discount);
      formData.append("status", status);
      formData.append("labels", tags.join(","));

      if (templateFile) formData.append("template_file", templateFile);
      if (thumbnail) formData.append("bg", thumbnail);
      if (cover) formData.append("cover", cover);
      if (previewPhoto) formData.append("preview", previewPhoto);
      gallery.forEach((file, i) => formData.append(`gallery[${i}]`, file));

      await axios.post(
        `${baseURL}actions/products/updateProduct.php?id=${id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        },
      );

      alert(`${config.itemName} updated successfully!`);
      setIsEditMode(false);
      window.location.reload();
    } catch (error) {
      console.error(`Error updating ${config.title.toLowerCase()}:`, error);
      alert(`Failed to update ${config.itemName}. Please try again.`);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleting) return;
    if (
      !window.confirm(
        `Are you sure you want to delete this ${config.itemName.toLowerCase()}? This action cannot be undone.`,
      )
    )
      return;

    setDeleting(true);

    try {
      await axios.post(
        `${baseURL}actions/products/deleteProduct.php?id=${id}`,
        {},
        {
          withCredentials: true,
        },
      );
      alert(`${config.itemName} deleted successfully!`);
      navigate(`/${config.path}`);
    } catch (error) {
      console.error(`Error deleting ${config.title.toLowerCase()}:`, error);
      alert(`Failed to delete ${config.itemName}. Please try again.`);
    } finally {
      setDeleting(false);
    }
  };

  const finalPrice =
    parseFloat(price) - parseFloat(discount) || parseFloat(price) || 0;
  const totalIncome = solds * finalPrice;

  const formatPrefix = {
    "any format": "formats",
    illustrator: "ai",
    powerpoint: "powerpoint",
    "3d studio max": "3ds",
    invision: "invision",
    react: "react",
    "after effects": "ae",
    keynote: "keynote",
    sketch: "sketch",
    blender: "blender",
    lottie: "lottie",
    swift: "swift",
    "cinema 4d": "c4d",
    lunacy: "lunacy",
    xcode: "xcode",
    figma: "figma",
    maya: "maya",
    xd: "xd",
    framer: "framer",
    photoshop: "ps",
  };

  if (!title)
    return (
      <div className="text-white text-center mt-40 text-4xl">
        Product not found
      </div>
    );

  return (
    <div>
      <Header
        title={
          isEditMode ? `Edit ${config.itemName}` : `${config.itemName} Details`
        }
      />

      <div className="mt-8 bg-[#171718CC] p-8 rounded-[20px] max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
          <div className="bg-[#242426] p-6 rounded-[20px] text-center">
            <p className="text-gray-400 text-lg">Upload Date</p>
            <p className="text-3xl font-bold text-white mt-2">{date}</p>
          </div>
          <div className="bg-[#242426] p-6 rounded-[20px] text-center">
            <p className="text-gray-400 text-lg">Solds</p>
            <p className="text-3xl font-bold text-white mt-2">{solds}</p>
          </div>
          <div className="bg-[#242426] p-6 rounded-[20px] text-center">
            <p className="text-gray-400 text-lg">Discount</p>
            <p className="text-3xl font-bold text-white mt-2">
              {`$${parseFloat(discount || 0).toFixed(2)}`}
            </p>
          </div>
          <div className="bg-[#242426] p-6 rounded-[20px] text-center">
            <p className="text-gray-400 text-lg">Final Price</p>
            <p className="text-3xl font-bold text-white mt-2">
              {`$${finalPrice.toFixed(2)}`}
            </p>
          </div>
          <div className="bg-[#242426] p-6 rounded-[20px] text-center">
            <p className="text-gray-400 text-lg">Total Income</p>
            <p className="text-3xl font-bold text-white mt-2">
              {`$${totalIncome.toFixed(2)}`}
            </p>
          </div>
        </div>

        {/* Edit and Delete Buttons (only in view mode) */}
        {!isEditMode && (
          <div className="flex justify-end mb-8 gap-4">
            <button
              onClick={() => setIsEditMode(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition"
            >
              Edit {config.itemName}
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
            >
              {deleting ? "Deleting..." : `Delete ${config.itemName}`}
            </button>
          </div>
        )}

        {isEditMode ? (
          // ==================== EDIT MODE ====================
          <div>
            {/* Uploads */}
            <h2 className="text-2xl font-semibold text-white mb-8">
              Upload Assets
            </h2>

            <div className="space-y-10">
              <div>
                <label className="block text-white text-lg mb-3">
                  Template File (ZIP)
                </label>
                <p className="text-gray-400 mb-3">
                  Current: {currentTemplateFileName}
                </p>
                <input
                  type="file"
                  accept={config.fileAccept}
                  onChange={(e) => setTemplateFile(e.target.files[0] || null)}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-white text-lg mb-3">
                    Thumbnail (356×256)
                  </label>
                  {currentThumbnailUrl && (
                    <img
                      src={
                        "https://bfiro-assests.s3.eu-north-1.amazonaws.com/" +
                        currentThumbnailUrl
                      }
                      alt="current thumbnail"
                      className="mb-4 rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0] || null)}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white"
                  />
                  {thumbnail && (
                    <img
                      src={URL.createObjectURL(thumbnail)}
                      alt="new thumbnail"
                      className="mt-4 rounded-lg"
                    />
                  )}
                </div>
                <div>
                  <label className="block text-white text-lg mb-3">
                    Cover Photo (1920×440)
                  </label>
                  {currentCoverUrl && (
                    <img
                      src={
                        "https://bfiro-assests.s3.eu-north-1.amazonaws.com/" +
                        currentCoverUrl
                      }
                      alt="current cover"
                      className="mb-4 rounded-lg"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setCover(e.target.files[0] || null)}
                    className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white"
                  />
                  {cover && (
                    <img
                      src={URL.createObjectURL(cover)}
                      alt="new cover"
                      className="mt-4 rounded-lg"
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block text-white text-lg mb-3">
                  Gallery Photos (803×628)
                </label>
                {currentGalleryUrls.length > 0 && (
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-4 mb-6">
                    {currentGalleryUrls.map((src, i) => (
                      <img
                        key={i}
                        src={
                          "https://bfiro-assests.s3.eu-north-1.amazonaws.com/" +
                          src
                        }
                        alt={`gallery ${i + 1}`}
                        className="rounded-lg h-40 object-cover"
                      />
                    ))}
                  </div>
                )}
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setGallery(Array.from(e.target.files))}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white"
                />
              </div>

              <div>
                <label className="block text-white text-lg mb-3">
                  Preview Photo (max 3MB)
                </label>
                {currentPreviewPhotoUrl && (
                  <img
                    src={
                      "https://bfiro-assests.s3.eu-north-1.amazonaws.com/" +
                      currentPreviewPhotoUrl
                    }
                    alt="current preview"
                    className="mb-4 rounded-lg max-w-full"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setPreviewPhoto(e.target.files[0] || null)}
                  className="block w-full text-sm text-gray-300 file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-600 file:text-white"
                />
                {previewPhoto && (
                  <img
                    src={URL.createObjectURL(previewPhoto)}
                    className="mt-4 rounded-lg max-w-full"
                  />
                )}
              </div>
            </div>

            <hr className="border-gray-700 my-12" />

            {/* Form Fields */}
            <div className="space-y-12">
              <div>
                <h2 className="text-2xl font-semibold text-white mb-8">
                  Basic Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-white mb-2">Title *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={subtitle}
                      onChange={(e) => setSubtitle(e.target.value)}
                      className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Overview</label>
                <Editor
                  apiKey={TINYMCE_API_KEY}
                  value={overview}
                  init={{
                    height: 400,
                    menubar: false,
                    plugins: [
                      "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
                    ],
                    toolbar:
                      "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
                  }}
                  onEditorChange={(content) => setOverview(content)}
                />
              </div>

              <div>
                <label className="block text-white text-lg mb-4">
                  Highlights
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {points.map((point, i) => (
                    <div key={i}>
                      <label className="text-gray-400 text-sm">
                        Point {i + 1}
                      </label>
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => handlePointsChange(i, e.target.value)}
                        className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <label className="block text-white mb-2">
                    {config.formatLabel} (multi-select)
                  </label>
                  <select
                    value=""
                    onChange={handleFormatChange}
                    className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">
                      Select {config.formatLabel.toLowerCase()}
                    </option>
                    {config.formatOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                  <div className="flex flex-wrap gap-3 mt-4">
                    {formats.map((format, i) => (
                      <span
                        key={i}
                        className="bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-2 text-sm"
                      >
                        {format}
                        <button
                          type="button"
                          onClick={() => removeFormat(i)}
                          className="ml-2 hover:text-gray-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-white mb-2">Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Discount ($)</label>
                  <input
                    type="number"
                    value={discount}
                    onChange={(e) => setDiscount(e.target.value)}
                    className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-white mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">
                  Tags (press Enter)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="w-full bg-[#242426] text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-wrap gap-3 mt-4">
                  {tags.map((tag, i) => (
                    <span
                      key={i}
                      className="bg-blue-600 text-white px-4 py-1 rounded-full flex items-center gap-2 text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(i)}
                        className="hover:text-gray-300"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 justify-end pt-8">
                <button
                  onClick={() => setIsEditMode(false)}
                  disabled={saving}
                  className="px-8 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {saving ? "Saving..." : `Save ${config.itemName}`}
                </button>
              </div>
            </div>
          </div>
        ) : (
          // ==================== VIEW MODE ====================
          <div>
            {currentCoverUrl && (
              <img
                src={
                  "https://bfiro-assests.s3.eu-north-1.amazonaws.com/" +
                  currentCoverUrl
                }
                alt="Cover"
                className="w-full h-96 object-cover rounded-[20px] mb-10"
              />
            )}

            <h2 className="text-4xl font-bold text-white mb-4">{title}</h2>
            {subtitle && (
              <p className="text-2xl text-gray-300 mb-8">{subtitle}</p>
            )}

            {overview && (
              <div
                className="text-lg text-gray-300 mb-10 leading-relaxed prose max-w-none"
                dangerouslySetInnerHTML={{ __html: overview }}
              />
            )}

            {points.filter((p) => p.trim()).length > 0 && (
              <div className="mb-10">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Highlights
                </h3>
                <ul className="list-disc pl-8 text-gray-300 space-y-3 text-lg">
                  {points
                    .filter((p) => p.trim())
                    .map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
              <div>
                <p className="text-lg text-gray-400 mb-3">
                  {config.formatLabel}s
                </p>
                <div className="flex flex-wrap gap-3">
                  {formats.map((f, i) => {
                    const lowerText = f.toLowerCase();
                    const prefix = formatPrefix[lowerText] || lowerText;
                    let fileName;
                    if (lowerText === "any format") {
                      fileName = "formats.svg";
                    } else {
                      fileName = `${prefix}-prog.svg`;
                    }
                    return (
                      <div
                        key={i}
                        className="bg-[#424242] size-[40px] rounded-full flex items-center justify-center"
                      >
                        <img
                          src={storageUrl + `Formats/${fileName}`}
                          className="size-[20px]"
                          alt={f}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
              <div>
                <p className="text-lg text-gray-400 mb-3">Tags</p>
                <div className="flex flex-wrap gap-3">
                  {tags.map((t, i) => (
                    <span
                      key={i}
                      className="bg-gray-700 text-white px-4 py-1 rounded-full text-sm"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-lg text-gray-400 mb-3">Discount</p>
                <p className="text-2xl text-white">{`$${parseFloat(discount || 0).toFixed(2)}`}</p>
              </div>
              <div>
                <p className="text-lg text-gray-400 mb-3">Status</p>
                <span
                  className={`px-5 py-2 rounded-full text-white ${status === "active" ? "bg-green-600" : "bg-red-600"}`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </span>
              </div>
            </div>

            {currentGalleryUrls.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Gallery
                </h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {currentGalleryUrls.map((src, i) => (
                    <img
                      key={i}
                      src={
                        "https://bfiro-assests.s3.eu-north-1.amazonaws.com/" +
                        src
                      }
                      alt={`Gallery ${i + 1}`}
                      className="rounded-lg w-full object-cover h-80"
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Thumbnail
                </h3>
                {currentThumbnailUrl && (
                  <img
                    src={
                      "https://bfiro-assests.s3.eu-north-1.amazonaws.com/" +
                      currentThumbnailUrl
                    }
                    alt="Thumbnail"
                    className="rounded-lg w-full"
                  />
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-white mb-4">
                  Preview Photo
                </h3>
                {currentPreviewPhotoUrl && (
                  <img
                    src={
                      "https://bfiro-assests.s3.eu-north-1.amazonaws.com/" +
                      currentPreviewPhotoUrl
                    }
                    alt="Preview"
                    className="rounded-lg w-full"
                  />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Download
              </h3>
              {currentTemplateFileName && (
                <a
                  href={
                    "https://bfiro-assests.s3.eu-north-1.amazonaws.com/" +
                    currentTemplateFileName
                  }
                  className="text-blue-500 hover:underline text-xl"
                >
                  Download Template
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditProduct;
