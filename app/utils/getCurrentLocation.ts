export interface UserLocation {
  latitude: number
  longitude: number
}

export function getCurrentLocation(): Promise<UserLocation> {
  return new Promise((resolve, reject) => {
    if (!import.meta.client) {
      return reject(new Error("Not running on client"))
    }

    if (!navigator.geolocation) {
      return reject(new Error("Geolocation not supported"))
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    )
  })
}

export async function checkLocationPermission() {
  if (!navigator.permissions) return 'unknown'

  const result = await navigator.permissions.query({
    name: 'geolocation' as PermissionName
  })

  return result.state // 'granted' | 'denied' | 'prompt'
}
