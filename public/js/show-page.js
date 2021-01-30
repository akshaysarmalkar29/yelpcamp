const reviewForm = document.querySelector(".reviewForm");
    const defaultStarInput = document.querySelector("input[name='review[rating]']");
    const statusContainer = document.querySelector("#status");
    if(reviewForm) {
        reviewForm.addEventListener("submit", function(e) {
            if(defaultStarInput.checked) {
                statusContainer.classList.remove("d-none");
                e.preventDefault();
            } else {
                statusContainer.classList.add("d-none");
            }
        })
    }

mapboxgl.accessToken = 'pk.eyJ1IjoiYWtzaGF5c2FybWFsa2FyNzQiLCJhIjoiY2tiYzl2OXRoMDk5djJ5bzF4Ymd0cGNiaSJ9.UXDUgCNjWza4idRPAZgFwA';
console.log(campground.geometry.coordinates);
var map = new mapboxgl.Map({
container: 'map', // container id
style: 'mapbox://styles/mapbox/streets-v11', // style URL
center: campground.geometry.coordinates, // starting position [lng, lat]
zoom: 9 // starting zoom
});

var marker = new mapboxgl.Marker()
.setLngLat(campground.geometry.coordinates)
.setPopup(new mapboxgl.Popup({ offset: 25 }).setText(
     `${campground.title} at ${campground.location}`
    ))
.addTo(map);