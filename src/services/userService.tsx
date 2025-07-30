import Api from "./baseUrlCustomer";
import {
  GetParams,
  UsersServices,
} from "../components/interfaces/Interfaces";

// Roles
// export const GetAllRoles = async (
//   params?: GetParams
// ): Promise<UsersServices> => {
//   const response = await Api.get<UsersServices>("roles", {
//     params,
//   });
//   return response.data;
// };
// export const GetQrById = async (id: string): Promise<UsersServices> => {
//   const response = await Api.get<UsersServices>(`whatsapp/get-session/${id}`);
//   return response.data;
// };
// Roles
// export const GetPermissionByRoleId = async (
//   id: string
// ): Promise<UsersServices> => {
//   const response = await Api.get<UsersServices>(`roles/${id}`);
//   return response.data;
// };

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
export const AddBrands = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`brands`, sendData);
  return response.data;
};
export const EditBrands = async (id: string,
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`brands/${id}`, sendData);
  return response.data;
};
export const GetBrands = async (
  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>("brands", {
    params,
  });
  return response.data;
};
export const GetAllBrandsnoMeta = async (
): Promise<UsersServices> => {
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
export const GetRequests = async (  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-requests`, {
    params,
  });
  return response.data;
};
export const CreateRequest = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`referral-requests/assign-referral`, sendData);
  return response.data;
};
export const GetNumbersRequstes = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-requests/get-numbers`);
  return response.data;
};
export const GetReferralRequestById = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-requests/${id}`);
  return response.data;
};
export const GetBrandById = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`brands/${id}`);
  return response.data;
};
export const deleteBrands = async (
  id: string,
): Promise<UsersServices> => {
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
  id:string,
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`referral-link/${id}`, sendData);
  return response.data;
};
export const GetReferralLinksById= async (id:string
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-link/${id}`);
  return response.data;
};
export const ExportReferralTemplate = async (): Promise<Blob> => {
  const response = await Api.get<Blob>('referral-link/export-template', {
    responseType: "blob",
  });
  return response.data;
};
export const ImportReferralLinks = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`referral-link/import-data`, sendData);
  return response.data;
};

export const ExportCodeTemplate = async (): Promise<Blob> => {
  const response = await Api.get<Blob>('discount-code/export-template', {
    responseType: "blob",
  });
  return response.data;
};
export const ImportCode = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`discount-code/import-data`, sendData);
  return response.data;
};
export const CreareCode = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`discount-code`, sendData);
  return response.data;
};
export const UpdateCode = async (
  id:string,
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`discount-code/${id}`, sendData);
  return response.data;
};
export const GetcodeById= async (id:string
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`discount-code/${id}`);
  return response.data;
};


export const GetAllReferralLinkspage = async (params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-link`, {
    params,
  });
  return response.data;
};
export const GetAllReferralLinks = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`customers/get-referrals/${id}/referral_link`);
  return response.data;
};
export const GetNumbersReferralLinks = async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-link/get-numbers`);
  return response.data;
};
export const GetNumbersCodes= async (): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`discount-code/get-numbers`);
  return response.data;
};
export const GetAllCodespage = async (  params?: GetParams
): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`referral-link`, {
    params,
  });
  return response.data;
};

export const GetAllDiscountCode = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`customers/get-referrals/${id}/discount_code`);
  return response.data;
};
export const GetAllWalletRequests = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`customers/wallet-requests/${id}`);
  return response.data;
};

export const GetAllblocked = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`user-blocks/get-customer-blocks/${id}`);
  return response.data;
};
export const GetBlockByCustomerId = async (id: string): Promise<UsersServices> => {
  const response = await Api.get<UsersServices>(`user-blocks/get-customer-blocks/${id}`);
  return response.data;
};
export const CreateBlock = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`user-blocks`, sendData);
  return response.data;
};
export const PushNotification = async (
  sendData: object
): Promise<UsersServices> => {
  const response = await Api.post<UsersServices>(`notifications/push`, sendData);
  return response.data;
};
export const deleteBlock = async (
  id: string,
): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`user-blocks/${id}`);
  return response.data;
};
export const deleteDiscountCode = async (
  id: string,
): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`discount-code/${id}`);
  return response.data;
};
export const deleteReferralLink = async (
  id: string,
): Promise<UsersServices> => {
  const response = await Api.delete<UsersServices>(`referral-link/${id}`);
  return response.data;
};
