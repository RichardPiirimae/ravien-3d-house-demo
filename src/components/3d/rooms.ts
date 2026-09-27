// Apartments as they appear on the architect's floor plans (public/floorplan-*.jpg).
// `region` is the apartment's extent on the plan, normalised to the building's
// outline: u runs left → right across the 12 m width, v runs top → bottom along
// the 24 m length. The camera and the section cut are derived from it, so the
// fly-in always frames the right apartment.
//
// Plan → model orientation, checked against the model: plan-left is −x (stair
// core at x ≈ −12), plan-top is −z (Apt V's balcony railings at z ≈ −30).

export interface RoomDef {
  id: string;
  label: string;
  apt: string;
  floor: "ground" | "second";
  area: string;
  beds: number;
  balcony: string | null;
  hotspot: { x: number; y: number }; // % position on the key-plan image
  region: { u0: number; u1: number; v0: number; v1: number };
}

// Generated shots of an apartment; see SceneCore `roomShot`.
export const ROOM_VIEWS = ["Overview", "Plan", "Reverse angle"] as const;

export const ROOMS: RoomDef[] = [
  {
    id: "apt1", label: "Apartment I", apt: "I", floor: "ground", area: "100 m²", beds: 3, balcony: "16 m²",
    hotspot: { x: 42, y: 76 },
    region: { u0: 0, u1: 1, v0: 0.564, v1: 1 },
  },
  {
    id: "apt2", label: "Apartment II", apt: "II", floor: "ground", area: "49 m²", beds: 1, balcony: null,
    hotspot: { x: 62, y: 28 },
    region: { u0: 0.5, u1: 1, v0: 0, v1: 0.436 },
  },
  {
    id: "apt3", label: "Apartment III", apt: "III", floor: "ground", area: "49 m²", beds: 1, balcony: null,
    hotspot: { x: 28, y: 28 },
    region: { u0: 0, u1: 0.5, v0: 0, v1: 0.436 },
  },
  {
    id: "apt4", label: "Apartment IV", apt: "IV", floor: "second", area: "100 m²", beds: 2, balcony: "16 m²",
    hotspot: { x: 38, y: 76 },
    region: { u0: 0, u1: 1, v0: 0.557, v1: 1 },
  },
  {
    id: "apt5", label: "Apartment V", apt: "V", floor: "second", area: "100 m²", beds: 2, balcony: "18 m²",
    hotspot: { x: 38, y: 24 },
    region: { u0: 0, u1: 1, v0: 0, v1: 0.424 },
  },
];
