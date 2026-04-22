import type { Shop, Provider } from "./types"

export const SHOPS: Shop[] = [
  {
    id: "serene-cuts",
    name: "Serene Cuts",
    description: "Premium hair salon in the heart of the city",
    providers: [
      { id: "alice", name: "Alice" },
      { id: "bob", name: "Bob" },
    ],
  },
  {
    id: "glow-spa",
    name: "Glow Spa",
    description: "Relaxing spa treatments and wellness services",
    providers: [
      { id: "diana", name: "Diana" },
      { id: "femi", name: "Femi" },
      { id: "carla", name: "Carla" },
    ],
  },
  {
    id: "peak-physio",
    name: "Peak Physio",
    description: "Sports physiotherapy and rehabilitation",
    providers: [
      { id: "hakim", name: "Dr. Hakim" },
      { id: "park", name: "Dr. Park" },
    ],
  },
]

export function getShopById(id: string): Shop | undefined {
  return SHOPS.find((s) => s.id === id)
}

export function getProviderById(shopId: string, providerId: string): Provider | undefined {
  return getShopById(shopId)?.providers.find((p) => p.id === providerId)
}

export function generateSlots(): string[] {
  const slots: string[] = []
  for (let hour = 9; hour <= 22; hour++) {
    slots.push(`${hour.toString().padStart(2, "0")}:00`)
  }
  return slots
}
