export function getUserLocation() {
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const lat = pos.coords.latitude
            const lng = pos.coords.longitude
            console.log(lat, lng)
        },
        (err) => {
            console.error(err)
        }
    )
}