// frontend/src/services/api.js

const API_URL = 'http://localhost:5000/api';

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong');
  }
  return data;
};

// ==================== AUTH APIs ====================

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  return handleResponse(response);
};

// ==================== PROPERTY APIs ====================

export const getProperties = async () => {
  const response = await fetch(`${API_URL}/properties`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const getProperty = async (id) => {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return handleResponse(response);
};

export const createProperty = async (propertyData) => {
  const response = await fetch(`${API_URL}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(propertyData),
  });
  return handleResponse(response);
};

export const updateProperty = async (id, propertyData) => {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(propertyData),
  });
  return handleResponse(response);
};

export const deleteProperty = async (id) => {
  const response = await fetch(`${API_URL}/properties/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

// ==================== USER APIs ====================

export const getUserProfile = async () => {
  const response = await fetch(`${API_URL}/users/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

export const addAddress = async (addressData) => {
  const response = await fetch(`${API_URL}/users/addresses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(addressData),
  });
  return handleResponse(response);
};

export const updateAddress = async (id, addressData) => {
  const response = await fetch(`${API_URL}/users/addresses/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(addressData),
  });
  return handleResponse(response);
};

export const deleteAddress = async (id) => {
  const response = await fetch(`${API_URL}/users/addresses/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

export const addCard = async (cardData) => {
  const response = await fetch(`${API_URL}/users/cards`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(cardData),
  });
  return handleResponse(response);
};

export const deleteCard = async (id) => {
  const response = await fetch(`${API_URL}/users/cards/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
  });
  return handleResponse(response);
};

// ==================== HEALTH CHECK ====================

export const healthCheck = async () => {
  const response = await fetch(`${API_URL}/health`, {
    method: 'GET',
  });
  return handleResponse(response);
};