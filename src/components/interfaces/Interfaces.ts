// interfaces
// import { JSX } from "react/jsx-runtime";


export interface ApiReview {
  id: number;
  type: string;
  review: string;
  rating: number;
  note?: string;
  created_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  order?: {
    id: number;
    order_number: string;
    status: string;
  };
  customer?: {
    id: number;
    name: string;
    email: string;
  };
}







export interface GetParams {
  sort_by?: string;
  sort_order?: "asc" | "desc";
  page?: number;
  per_page?: number;
  searchTerm?: string;
  filter?: {
    status?: string;
        is_active?: string; // إذا كانت القيم محصورة
        category_id?: string; // إذا كانت القيم محصورة
        
      };
      payment_status?: string; // إذا كانت القيم محصورة
}


export interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
  request_url: string;
  filters_applied: boolean;
}

export interface UsersServices {
  id: string;
  sendData: object;
  data: object;
  message: string;
  meta?: PaginationMeta;
  status?: string;
}

export type Permission = {
  id: number;
  name: string;
};
export interface Role {
  id: number;
  name: string;
  status: boolean;
  created_at: string;
  guard_name: string;
  permissions: Permission[];
}
export interface Regions {
  id: number;
  title: string;
  city_id: number;
  city_name: string;
}


export interface Users {
  id: number;
  name: string;
  country: string;
  phone: string;
  code: string;
  gender: 'male' | 'female'; // إذا كان هناك قيمتان فقط للجنس
  status: 'verified' | 'not_verified'; // إذا كانت القيم محصورة
  referralLinkCount: number;
  discountCodeCount: number;
  totalEarning: number;
  totalClients: number;
}
export interface GetCustomersParams {
  page?: number;
  perPage?: number;
  search?: string;
  status?: string;
}

export interface MetaData {
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export interface ApiResponse {
  data: any[];
  meta: MetaData;
}
export interface UserData {
  id: number;
  name: string;
  country: string;
  phone: string;
  code: string;
  gender: "male" | "female";
  birthdate: string; // consider Date if you'll parse it
  status: "verified" | "not_verified"; // update if there are more possible values
  joined_at: string; // consider Date if you'll parse it
  joined_since: string;
  referralLinkCount: number;
  discountCodeCount: number;
  totalEarning: number;
  totalClients: number;
}
export interface UploadedImage {
  image: File;
}