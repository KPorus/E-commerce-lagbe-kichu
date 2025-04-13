import { cookies } from 'next/headers';

export function getRefreshTokenFromServer() {
  const cookieStore = cookies();
  const refreshToken = cookieStore.get('refreshToken')?.value || null;
  return refreshToken;
}

// export async function refreshAccessTokenf() {
//   const refreshToken = getRefreshTokenFromServer();
//   if (!refreshToken) {
//     throw new Error("No refresh token available");
//   }
// }
