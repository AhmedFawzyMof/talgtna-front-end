import api from "@/api";

export const getCoupons = async (token: string, search: string) => {
  const response = await api.get(`/admin/coupons?search=${search}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
export const addCoupon = async (
  token: string,
  coupon: { code: string; value: number }
) => {
  const response = await api.post("/admin/coupons", coupon, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
export const editCoupon = async (
  token: string,
  coupon: { code: string; value: number }
) => {
  const response = await api.put(`/admin/coupons/${coupon.code}`, coupon, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteCoupon = async (token: string, ids: string[]) => {
  const response = await api.delete(`/admin/coupons`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { ids },
  });
  return response;
};
