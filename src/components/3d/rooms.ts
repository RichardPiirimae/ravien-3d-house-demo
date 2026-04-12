export interface RoomView {
  camPos: [number, number, number];
  camLook: [number, number, number];
  label?: string;
}

export interface RoomDef {
  id: string;
  label: string;
  apt: string;
  floor: "ground" | "second";
  area: string;
  desc: string;
  hotspot: { x: number; y: number };
  // First view is the entry view; extras enable the carousel
  views: RoomView[];
}

// Ground floor plan image:
//   Apt III (top-left, 49m²)  ~35% x, 30% y
//   Apt II  (top-right, 49m²) ~65% x, 30% y
//   Apt I   (bottom, 100m²)   ~50% x, 77% y
//
// 2nd floor plan image:
//   Apt V   (top, 100m²)      ~50% x, 28% y
//   Apt IV  (bottom, 100m²)   ~50% x, 74% y

export const ROOMS: RoomDef[] = [
  {
    id: "apt1",
    label: "Apartment I",
    apt: "I",
    floor: "ground",
    area: "100 m²",
    desc: "3 bedrooms · balcony 16 m²",
    hotspot: { x: 42, y: 76 },
    views: [
      { camPos: [11.8, 44.4, 71.4],  camLook: [0, 1.8, 2], label: "Overview" },
      { camPos: [-14.4, 27.5, 51.3], camLook: [0, 1.8, 2], label: "Living area" },
      { camPos: [24.4, 43.3, 38.6],  camLook: [0, 1.8, 2], label: "Bedrooms" },
    ],
  },
  {
    id: "apt2",
    label: "Apartment II",
    apt: "II",
    floor: "ground",
    area: "49 m²",
    desc: "1 bedroom",
    hotspot: { x: 62, y: 28 },
    views: [
      { camPos: [15.9, 53.3, -43.5], camLook: [0, 1.8, -8], label: "Living area" },
    ],
  },
  {
    id: "apt3",
    label: "Apartment III",
    apt: "III",
    floor: "ground",
    area: "49 m²",
    desc: "1 bedroom",
    hotspot: { x: 28, y: 28 },
    views: [
      { camPos: [-25.4, 43.4, -45.3], camLook: [0, 1.8, -8], label: "Living area" },
    ],
  },
  {
    id: "apt4",
    label: "Apartment IV",
    apt: "IV",
    floor: "second",
    area: "100 m²",
    desc: "2 bedrooms · balcony 16 m²",
    hotspot: { x: 38, y: 76 },
    views: [
      // Calibrated from live session
      { camPos: [-14.1, 38.8, 42.9], camLook: [-2, 1.6, -9], label: "Overview" },
      { camPos: [18.2, 37.1, 41.6],  camLook: [-2, 1.6, -9], label: "Living area" },
      { camPos: [6, 56.1, 25.5],     camLook: [-2, 1.6, -9], label: "Aerial" },
    ],
  },
  {
    id: "apt5",
    label: "Apartment V",
    apt: "V",
    floor: "second",
    area: "100 m²",
    desc: "2 bedrooms · balcony 18 m²",
    hotspot: { x: 38, y: 24 },
    views: [
      { camPos: [-0.5, 44.6, -50.9], camLook: [0, 8, -8], label: "Overview" },
      { camPos: [20.7, 42, -43.9],   camLook: [0, 8, -8], label: "Living area" },
    ],
  },
];

export const GROUND_ROOMS = ROOMS.filter((r) => r.floor === "ground");
export const SECOND_ROOMS = ROOMS.filter((r) => r.floor === "second");
