let unit = 'metric';

function chooseUnit(){
  $('.units').on('click', function(){
    if(this.id === 'f'){
      unit = 'imperial';
      req($('.location').val());
    } else {
      unit = 'metric';
      req($('.location').val());
    }
  })
}
/* chooseUnit();
 */
function capitalizeString(str){
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function req(loc){
  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${loc}&units=${unit}&appid=d12803fd0fe5b74db02ff15ad7e5f71d`)
    .then(response => response.json())
    .then(data => {
      let icon = data['weather'][0]['icon'];
      let iconurl = `http://openweathermap.org/img/w/${icon}.png`;
      let desc = data['weather'][0]['description'];
      let temp = data['main']['temp'];
      let min = data['main']['temp_min'];
      let max = data['main']['temp_max'];
      let humidity = data['main']['humidity'];

      if (unit === 'metric'){
        $('.loc').find('h2').text(capitalizeString(loc));
        $("#icon").attr('src', iconurl);
        $('.desc').find('p').text(capitalizeString(desc));
        $('.temp').find('p').text(`Current temperature: ${temp} °C`);
        $('.min').find('p').text(`Min. temperature: ${min} °C`);
        $('.max').find('p').text(`Max. temperature: ${max} °C`);
        $('.humidity').find('p').text(`Humidity: ${humidity} %`);
      } else {
        $('.loc').find('h2').text(capitalizeString(loc));
        $("#icon").attr('src', iconurl);
        $('.desc').find('p').text(capitalizeString(desc));
        $('.temp').find('p').text(`Current temperature: ${temp} °F`);
        $('.min').find('p').text(`Min. temperature: ${min} °F`);
        $('.max').find('p').text(`Max. temperature: ${max} °F`);
        $('.humidity').find('p').text(`Humidity: ${humidity} %`);
      }
    })
    .catch(err => {
      $('.loc').find('h2').text('');
      $("#icon").attr('src', '');
      $('.desc').find('p').text('');
      $('.temp').find('p').text('');
      $('.min').find('p').text('');
      $('.max').find('p').text('');
      $('.humidity').find('p').text('');
      $('.error').show();
      //hide error after 3 seconds
      setTimeout(function () {
        $('.error').fadeOut('fast');
      }, 1500);
    })
}

/* var location; */
function selectLocation() {
  var location = "";
  $('.location').on('keydown', function (e) {
    if (e.which === 13) {
      location = $(this).val();
      req(location);
    }
  })
}
/* selectLocation(); */

const getPosition = () => {
  return new Promise((resolve, reject) => {
    const onSuccess = (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      pos = [lat, lon];
      resolve(pos)
    }
    const onError = () => {
      console.log('Can\'t get location info');
      reject();
    }
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  })
}

function coordToCity(lat, lon){
  return fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`)
    .then(response => response.json())
    .then(data => {
      const city = data['city'];
      return (city);
    })
}

async function main2(){
  let coor = await getPosition();
  let city = await coordToCity(coor[0], coor[1]);
  $('.location').val(city);
  req(city);
  chooseUnit();
  selectLocation();
}

main2();





