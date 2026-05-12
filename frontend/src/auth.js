export const getStoredUser = () => {
  const raw = localStorage.getItem('libraryUser');
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getStoredUser());

export const isAdmin = () => getStoredUser()?.role === 'ADMIN';
