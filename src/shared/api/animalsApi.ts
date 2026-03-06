import { axiosClient } from "./axiosClient";

export interface Animal {
  id: number;
  englishName: string;
  belarussianName: string;
  imageURL: string;
}

export const getAnimals = async (): Promise<Animal[]> => {
  const { data } = await axiosClient.get<Animal[]>("/animals");
  return data;
};
