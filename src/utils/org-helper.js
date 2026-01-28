/**
 * Parses the current window location to extract the Organization ID from the subdomain.
 * e.g., egat.domain.com -> egat
 * Ignores 'www', 'localhost', and IP addresses.
 * @returns {string|null} The Organization ID or null if not found.
 */
export const getOrganizationIdFromUrl = () => {
  const hostname = window.location.hostname;

  // Ignore localhost and IP addresses
  if (hostname === "localhost" || hostname === "127.0.0.1") {
    return "egat2";
  }

  const parts = hostname.split(".");

  // Check if we have at least 2 parts (e.g. org.com) or 3 (org.domain.com)
  // and the first part isn't 'www'
  if (parts.length >= 2) {
    const potentialOrgId = parts[0];
    if (potentialOrgId.toLowerCase() !== "www") {
      return potentialOrgId;
    }
  }

  return null;
};

/**
 * Returns the application base path (basename) for React Router.
 * With subdomain routing, the path is always root '/'.
 * @returns {string} The router basename.
 */
export const getAppBasename = () => {
  return "/";
};
