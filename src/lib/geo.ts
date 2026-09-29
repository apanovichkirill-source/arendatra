import { SERVICE_CITIES } from "@/lib/cities";

// Примерные координаты городов обслуживания (Республика Коми + НАО)
const CITY_COORDS: Record<(typeof SERVICE_CITIES)[number], [number, number]> = {
  "Нарьян-Мар": [67.639, 53.007],
  Харьягинский: [67.767, 55.533],
  Усинск: [65.994, 57.528],
  Печора: [65.136, 57.188],
  Воркута: [67.499, 64.033],
  Ухта: [63.573, 53.695],
  Сыктывкар: [61.668, 50.836],
  Сосногорск: [63.606, 53.883],
  Кожва: [65.114, 57.05],
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

// Ближайший к переданным координатам город из зоны обслуживания
export function nearestCity(lat: number, lon: number): string {
  let best: string = SERVICE_CITIES[0];
  let bestDist = Infinity;
  for (const city of SERVICE_CITIES) {
    const [cLat, cLon] = CITY_COORDS[city];
    const dist = haversineKm(lat, lon, cLat, cLon);
    if (dist < bestDist) {
      bestDist = dist;
      best = city;
    }
  }
  return best;
}

export function mapLink(lat: number, lng: number) {
  return `https://yandex.ru/maps/?pt=${lng},${lat}&z=13&l=map`;
}
