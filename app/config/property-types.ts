export interface PropertyTypeOption {
  value: string;
  label: string;
  sub: string;
  icon: string;
}

export const propertyTypes: PropertyTypeOption[] = [
  { value: "room", label: "Room", sub: "បន្ទប់", icon: "bed" },
  { value: "studio", label: "Studio", sub: "ស្ទូឌីយោ", icon: "building-2" },
  { value: "apartment", label: "Apartment", sub: "អាផាតមិន", icon: "building" },
  { value: "house", label: "House", sub: "ផ្ទះ", icon: "home" },
  { value: "single_room", label: "Single Room", sub: "បន្ទប់សម្រាប់ម្នាក់", icon: "bed-single" },
];
