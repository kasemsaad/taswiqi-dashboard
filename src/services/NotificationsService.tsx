// services/notificationService.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const NotificationService = {
  getNotifications: async (page = 1, perPage = 10) => {
    const response = await axios.get(`${API_BASE_URL}/notifications`, {
      params: { page, per_page: perPage },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data.data; // Adjusted to match your API response structure
  },
  
  markAsRead: async (notificationId: number) => {
    await axios.patch(`${API_BASE_URL}/notifications/${notificationId}/read`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  },
  
  markAllAsRead: async () => {
    await axios.patch(`${API_BASE_URL}/notifications/mark-all-read`, null, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
  }
};