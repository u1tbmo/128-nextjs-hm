export type PlantStatus = 'Healthy' | 'Thirsty' | 'Overwatered';

export interface Plant {
  id: string;
  name: string;
  species: string;
  location: string;
  lastWatered: Date; // ISO string
  status: PlantStatus;
}