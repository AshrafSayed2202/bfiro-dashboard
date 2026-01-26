// Centralized environment helpers / shared keys
// Export the TinyMCE API key so multiple files can import it from one place.
export const TINYMCE_API_KEY =
    import.meta.env.VITE_TINYMCE_API_KEY ||
    "cx9ny70nqn9ttkap97l54m5k13jlf8x7s8k76k2h96pxf3na";
export const USER_UPLOADS = "/backend/uploads";

