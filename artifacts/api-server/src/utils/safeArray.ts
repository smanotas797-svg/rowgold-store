export const safeArray = <T>(data: T[] | undefined | null): T[] => {
  return Array.isArray(data) ? data : [];
};
