export type UserType = {
  _id: string;
  username: string;
  email: string;
  role: "USER" | "ADMIN" | "SELLER" | "MANAGER" | "ACCOUNTANT" | "INVENTORY";
  status: "BAN" | "UNBAN";
  created_by: string | null;
  created_at: string;
  __v: number;
};
