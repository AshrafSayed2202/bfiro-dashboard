// Centralized environment helpers / shared keys
// Export the TinyMCE API key so multiple files can import it from one place.
export const TINYMCE_API_KEY =
    import.meta.env.VITE_TINYMCE_API_KEY ||
    "kz12hxq3gafp6aahcb2klz9lnxvmb2fm261jfeb39i8x30xl";
export const USER_UPLOADS = "/backend/uploads";

