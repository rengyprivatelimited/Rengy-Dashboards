import rawData from "@/data/mock-data.json";

export type MockData = typeof rawData;

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function getMockData(): MockData {
  return deepClone(rawData);
}

export const mockData: MockData = getMockData();

