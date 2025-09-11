import api from "@/api";

export const getContacts = async (token: string, search: string) => {
  const response = await api.get(`/admin/contacts?search=${search}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};

export const deleteContacts = async (token: string, ids: number[]) => {
  const response = await api.post(
    `/admin/contacts/delete`,
    { ids },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response;
};

export const editContact = async (token: string, contact: any) => {
  const response = await api.put(`/admin/contacts/${contact.id}`, contact, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response;
};
