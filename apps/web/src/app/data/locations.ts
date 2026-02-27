export const CITY_NEIGHBORHOODS = [
  {
    city: "Brooklyn, NY",
    neighborhoods: ["Williamsburg", "Bushwick", "Bed-Stuy", "Crown Heights", "Greenpoint"],
  },
  {
    city: "New York, NY",
    neighborhoods: ["Lower East Side", "East Village", "Harlem", "Chelsea", "Bushwick"],
  },
  {
    city: "Austin, TX",
    neighborhoods: ["East Austin", "South Congress", "Zilker", "Hyde Park", "North Loop"],
  },
  {
    city: "Los Angeles, CA",
    neighborhoods: ["Silver Lake", "Echo Park", "Highland Park", "Venice", "Koreatown"],
  },
  {
    city: "Nashville, TN",
    neighborhoods: ["East Nashville", "12 South", "Germantown", "The Gulch", "Hillsboro"],
  },
];

export const CITY_OPTIONS = CITY_NEIGHBORHOODS.map((entry) => entry.city);

export function neighborhoodsForCity(city: string) {
  return CITY_NEIGHBORHOODS.find((entry) => entry.city === city)?.neighborhoods ?? [];
}
