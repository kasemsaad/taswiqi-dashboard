import Api from "./baseUrlCustomer";
import type { UsersServices } from "../components/interfaces/Interfaces";
export const GetCustomersById = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`customers/${id}`);
  return response.data;
};
export const GetCustomers = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>("customers", {
    params,
  });
  return response.data;
};
export const GetCustomersNumbers = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>("customers/get-numbers", {
    params,
  });
  return response.data;
};
export const AddBrands = async (sendData: object): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`brands`, sendData);
  return response.data;
};
export const EditBrands = async (
  id: string,
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`brands/${id}`, sendData);
  return response.data;
};
export const GetBrands = async (params?: GetParams): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>("brands", {
    params,
  });
  return response.data;
};
export const GetAllBrandsnoMeta = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>("brands/get-all-brands");
  return response.data;
};
export const GetAllBrand = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`customers/get-brands/${id}`);
  return response.data;
};
export const GetNumbersComanies = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`brands/get-numbers`);
  return response.data;
};
export const GetRequests = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-requests`, {
    params,
  });
  return response.data;
};
export const CreateBadge = async (sendData: object): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`padges`, sendData);
  return response.data;
};
export const GetHighestBadge = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`padges/get-highest`);
  return response.data;
};
export const GetBadgeNumbers = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`padges/get-numbers`);
  return response.data;
};
export const GetAllpadges = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`padges`, {
    params,
  });
  return response.data;
};
export const deleteChate= async (id: string): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`chat/delete-chat/${id}`);
  return response.data;
};
export const deleteMessage = async (id: string): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`chat/delete-message/${id}`);
  return response.data;
};
export const deleteBadges = async (id: string): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`padges/${id}`);
  return response.data;
};
export const EditBadge = async (
  id: string,
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`padges/${id}`, sendData);
  return response.data;
};
export const GetBadgeById = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`padges/${id}`);
  return response.data;
};
export const EditSetting = async (sendData: object): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`settings/update`, sendData);
  return response.data;
};
export const GetAllSettings = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`settings/get-all`);
  return response.data;
};
export const GetApprovalById = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`approval-requests/${id}`);
  return response.data;
};
export const EditApproval = async (
  id: string,
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `approval-requests/update-approval/${id}`,
    sendData
  );
  return response.data;
};
export const GetAllApproval = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`approval-requests`, {
    params,
  });
  return response.data;
};
export const DeleteApproval = async (id: string): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`approval-requests/${id}`);
  return response.data;
};
export const Notifications = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `notifications/push`,
    sendData
  );
  return response.data;
};
// userService.tsx

interface Notification {
  id: string;
  title: string;
  message: string;
  created_at: string;
  // Add more fields as returned by your API
}

interface NotificationsResponse {
  data: Notification[];
  meta: {
    total: number;
    current_page: number;
    per_page: number;
    last_page: number;
  };
}

interface GetParams {
  page?: number;
  perPage?: number;
  [key: string]: any;
}

export const GetAllNotifications = async (
  params?: GetParams
): Promise<NotificationsResponse> => {
  try {
    const safeParams =
      params && typeof params === "object" && !Array.isArray(params)
        ? params
        : {};

    const response = await Api.get<NotificationsResponse>("notifications", {
      params: safeParams,
    });

    return response.data;
  } catch (error) {
    console.error("API Error: ", error);
    throw error;
  }
};


export const GetAllReports = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`customers/get-reports`, {
    params,
  });
  return response.data;
};
export const GetMesaages = async (
  id: string,
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `chat/get-messages-by-user/${id}`,
    {
      params,
    }
  );
  return response.data;
};
export const SendMessage= async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `chat/send-message`,
    sendData
  );
  return response.data;
};
export const Getchats = async (
  // id: string,
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `chat/get-chats`,
    {
      params,
    }
  );
  return response.data;
};
export const GetAllCustomersNotMeta = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `customers/get-customers-for-dropdown`,
    {
      params,
    }
  );
  return response.data;
};
export const CreateRequest = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `referral-requests/assign-referral`,
    sendData
  );
  return response.data;
};
export const GetNumbersRequstes = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `referral-requests/get-numbers`
  );
  return response.data;
};
export const GetReferralRequestById = async (
  id: string
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-requests/${id}`);
  return response.data;
};

export const GetBrandById = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`brands/${id}`);
  return response.data;
};
export const deleteBrands = async (id: string): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`brands/${id}`);
  return response.data;
};
export const GetAllCountries = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`countries/get-all`);
  return response.data;
};
export const GetAllCategories = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`categories/get-all`);
  return response.data;
};
export const CreareReferralLink = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`referral-link`, sendData);
  return response.data;
};
export const UpdateReferralLink = async (
  id: string,
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `referral-link/${id}`,
    sendData
  );
  return response.data;
};
export const GetReferralLinksById = async (
  id: string
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-link/${id}`);
  return response.data;
};
export const ExportReferralTemplate = async (): Promise<Blob> => {
  const response = await Api.get<Blob>("referral-link/export-template", {
    responseType: "blob",
  });
  return response.data;
};
export const ImportReferralLinks = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `referral-link/import-data`,
    sendData
  );
  return response.data;
};

export const ExportCodeTemplate = async (): Promise<Blob> => {
  const response = await Api.get<Blob>("discount-code/export-template", {
    responseType: "blob",
  });
  return response.data;
};
export const ImportCode = async (sendData: object): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `discount-code/import-data`,
    sendData
  );
  return response.data;
};
export const CreareCode = async (sendData: object): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`discount-code`, sendData);
  return response.data;
};
export const UpdateCode = async (
  id: string,
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `discount-code/${id}`,
    sendData
  );
  return response.data;
};
export const GetcodeById = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`discount-code/${id}`);
  return response.data;
};

export const GetAllWithdrawRequests = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`withdraw-requests`, {
    params,
  });
  return response.data;
};
export const GetWithdrawRequestsById = async (
  id: string
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`withdraw-requests/${id}`);
  return response.data;
};
export const WithdrawStatus = async (
  id: string,
  status: string
): Promise<UsersServices> => {
  const response = await Api.put<UsersServices>(
    `withdraw-requests/update-status/${id}/${status}`
  );
  return response.data;
};
export const GetAllReferralLinkspage = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-link`, {
    params,
  });
  return response.data;
};
export const GetCustomersWithBalance = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `customers/get-customers-with-balance`,
    {
      params,
    }
  );
  return response.data;
};
export const GetCustomersWalletTransactions = async (
  id?: string,
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `customers/get-customer-wallet-transactions/${id}`,
    {
      params,
    }
  );
  return response.data;
};
export const GetAllReferralLinks = async (
  id: string
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `customers/get-referrals/${id}/referral_link`
  );
  return response.data;
};
export const GetNumbersReferralLinks = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-link/get-numbers`);
  return response.data;
};
export const GetNumbersCodes = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`discount-code/get-numbers`);
  return response.data;
};
export const GetAllReferralpage = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-link`, {
    params,
  });
  return response.data;
};
// export const GetAllCodespage = async (
//   params?: GetParams
// ): Promise<UsersServices> => {
//   const response = await Api.get<UsersServices>(`referral-link`, {
//     params,
//   });
//   return response.data;
// };
export const GetAllCodes = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`discount-code`, {
    params,
  });
  return response.data;
};
export const GetAllCodesNotRreserved = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`discount-code/get-not-reserved`, {
    params,
  });
  return response.data;
};
export const GetAllReferralNotRreserved = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-link/get-not-reserved`, {
    params,
  });
  return response.data;
};

export const GetAllDiscountCode = async (
  id: string
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `customers/get-referrals/${id}/discount_code`
  );
  return response.data;
};
export const GetAllWalletRequests = async (
  id: string
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `customers/wallet-requests/${id}`
  );
  return response.data;
};

export const GetAllblocked = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `user-blocks/get-customer-blocks/${id}`
  );
  return response.data;
};
export const GetBlockByCustomerId = async (
  id: string
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(
    `user-blocks/get-customer-blocks/${id}`
  );
  return response.data;
};
export const CreateBlock = async (sendData: object): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`user-blocks`, sendData);
  return response.data;
};
export const CreateBlockBrand= async (sendData: object): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`brand-blocks`, sendData);
  return response.data;
};
export const PushNotification = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `notifications/push`,
    sendData
  );
  return response.data;
};
export const deleteBlock = async (id: string): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`user-blocks/${id}`);
  return response.data;
};
export const deleteDiscountCode = async (
  id: string
): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`discount-code/${id}`);
  return response.data;
};
export const deleteReferralLink = async (
  id: string
): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`referral-link/${id}`);
  return response.data;
};
// Qr
export const DeleteQr = async (id: string): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(
    `whatsapp/delete-session/${id}`
  );
  return response.data;
};

export const CreateQr = async (sendData: object): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(
    `whatsapp/create-session`,
    sendData
  );
  return response.data;
};

export const GetAllRoles = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>("roles", {
    params,
  });
  return response.data;
};
export const GetQrById = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`whatsapp/get-session/${id}`);
  return response.data;
};
export const GetAllQr = async (params?: GetParams): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>("whatsapp/get-all-sessions", {
    params,
  });
  return response.data;
};
export const GetNotificationsUnReadedCount = async (params?: GetParams): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>("notifications/get-unreaded-count", {
    params,
  });
  return response.data;
};
export const DeleteNotificationyId = async (id: string): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(
    `notifications/delete/${id}`
  );
  return response.data;
};
export const DeleteNotificationsReadit = async (): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(
    `notifications/delete-readed`
  );
  return response.data;
};