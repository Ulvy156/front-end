export interface PropertyDetail {
  id: string;
  userId: string;
  districtId: number;
  address: string;
  locationUrl: string;
  lat: number | null;
  lng: number | null;

  title: string;
  description: string;
  price: number;
  deposit: number;
  bedroom: number;
  bathroom: number;

  isAvailable: boolean;
  availableFrom: string;
  isFeatured: boolean;
  featuredAt: string | null;
  totalViews: number;

  propertyType: PropertyType;
  sizeSqm: number;
  furnished: boolean;
  isPublished: boolean;
  minimumStayLength: number;

  createdAt: string;
  updatedAt: string;

  user: User;
  images: Image[];
  district: District;

  amenities: Amenity[];
  rules: Rule[];
}
export interface User {
  imgUrl: string | null;
  role: 'ADMIN' | 'USER';
  phones: Phone[];
  name: string;
  email: string;
}

export interface PropertyName {
  nameEn: string;
  nameKh: string;
}

export interface Phone {
  phoneNumber: string;
}

export interface Image {
  imageKey: string;
}

export interface Amenity extends PropertyName {
  icon: string;
}

export interface Rule extends PropertyName {
  icon: string;
}

export interface District extends PropertyName {
  province: Province;
}

export interface Province extends PropertyName{}

export interface PropertyType extends PropertyName {
  icon: string
}
