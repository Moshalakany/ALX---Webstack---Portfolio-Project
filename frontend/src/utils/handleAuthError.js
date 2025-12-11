/**
 * Handles authentication errors by clearing local storage, cookies, and redirecting to login
 */
export const handleAuthError = () => {
	// Clear local storage
	localStorage.removeItem("chat-user");
	localStorage.clear();
	
	// Clear all cookies
	document.cookie.split(";").forEach((cookie) => {
		const name = cookie.split("=")[0].trim();
		document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
	});
	
	// Redirect to login
	window.location.href = "/login";
};

/**
 * Checks if the response indicates an authentication error
 * @param {Response} res - Fetch response object
 * @returns {boolean} - True if it's an auth error
 */
export const isAuthError = (res) => {
	return res.status === 401 || res.status === 403;
};

/**
 * Enhanced fetch wrapper that automatically handles auth errors
 * @param {string} url - The URL to fetch
 * @param {RequestInit} options - Fetch options
 * @returns {Promise<Response>} - The fetch response
 */
export const authFetch = async (url, options = {}) => {
	try {
		const response = await fetch(url, {
			...options,
			credentials: 'include', // Always include credentials
		});

		if (isAuthError(response)) {
			handleAuthError();
			throw new Error('Authentication failed');
		}

		return response;
	} catch (error) {
		// If it's a network error and we suspect it might be auth-related
		if (error.message === 'Authentication failed') {
			throw error;
		}
		
		// For other network errors, still throw them normally
		throw error;
	}
};
