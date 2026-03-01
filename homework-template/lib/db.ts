// /lib/db.ts
import { Plant } from '@/types'; // Assuming types are defined here

// 1. Prevent multiple instances of the "client" during HMR
const globalForDb = global as unknown as { db: MockPrisma };

class MockPrisma {
  private plants: Plant[] = [
    { id: '1', name: 'Spike', species: 'Snake Plant', location: 'Office', lastWatered: new Date('2023-10-01'), status: 'Healthy' },
    { id: '2', name: 'Fernie', species: 'Boston Fern', location: 'Living Room', lastWatered: new Date('2023-10-05'), status: 'Thirsty' },
  ];

  async findMany(filter?: { location?: string }) {
    if (filter?.location) {
      return this.plants.filter(p => p.location.toLowerCase() === filter.location?.toLowerCase());
    }
    return [...this.plants];
  }

  async findUnique(id: string) {
    return this.plants.find(p => p.id === id) || null;
  }

  async create(data: Omit<Plant, 'id'>) {
    const newPlant = { ...data, id: Math.random().toString(36).substring(7) };
    this.plants.push(newPlant);
    return newPlant;
  }

  async update(id: string, data: Partial<Plant>) {
    const index = this.plants.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.plants[index] = { ...this.plants[index], ...data };
    return this.plants[index];
  }

  async delete(id: string) {
    const index = this.plants.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.plants.splice(index, 1);
    return true;
  }
}

// 2. Export the singleton
export const db = globalForDb.db || new MockPrisma();

if (process.env.NODE_ENV !== 'production') globalForDb.db = db;