import { apiClient } from "@/lib/apiClient";
import { roleEndpoints } from "@/lib/endpoints";

export type RoleStatus = "active" | "inactive";

export interface Role {
  userTypeId: number;
  userType: string;
  userTypeLabel: string;
  status: RoleStatus;
  isServerOwnerRequestable?: number | boolean;
}

export interface RolesResponse {
  data: Role[];
}
export interface RoleResponse {
  data: Role;
}

export interface CreateRolePayload {
  userType: string;
  userTypeLabel: string;
  status?: RoleStatus;
  isServerOwnerRequestable?: boolean | number;
}

export interface UpdateRolePayload {
  userType: string;
  userTypeLabel: string;
  status: RoleStatus;
  isServerOwnerRequestable?: boolean | number;
}

export const fetchRoles = async (): Promise<RolesResponse> => {
  const res = await apiClient.get(roleEndpoints.getAll);
  return res.data as RolesResponse;
};

export const fetchRequestableRoles = async (): Promise<RolesResponse> => {
  const res = await apiClient.get(roleEndpoints.getRequestables);
  return res.data as RolesResponse;
};

export const fetchRoleById = async (
  id: string | number
): Promise<RoleResponse> => {
  const res = await apiClient.get(roleEndpoints.getById(id));
  return res.data as RoleResponse;
};

export const createRole = async (
  payload: CreateRolePayload
): Promise<RoleResponse> => {
  const res = await apiClient.post(roleEndpoints.create, payload);
  return res.data as RoleResponse;
};

export const updateRole = async (
  id: string | number,
  payload: UpdateRolePayload
): Promise<RoleResponse> => {
  const res = await apiClient.put(roleEndpoints.update(id), payload);
  return res.data as RoleResponse;
};

export const deleteRole = async (
  id: string | number
): Promise<{ roleId: number; deleted: boolean }> => {
  const res = await apiClient.delete(roleEndpoints.delete(id));
  return res.data as { roleId: number; deleted: boolean };
};
