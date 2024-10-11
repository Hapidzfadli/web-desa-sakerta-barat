export const parseRequirements = (requirementsString: string): string[] => {
  try {
    return JSON.parse(requirementsString);
  } catch {
    return [];
  }
};

export const stringifyRequirements = (requirements: string[]): string => {
  return JSON.stringify(requirements);
};
