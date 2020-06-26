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
chooseUnit();

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
        $('.location').find('h2').text(capitalizeString(loc));
        $("#icon").attr('src', iconurl);
        $('.desc').find('p').text(capitalizeString(desc));
        $('.temp').find('p').text(`Current temperature: ${temp} °C`);
        $('.min').find('p').text(`Min temperature: ${min} °C`);
        $('.max').find('p').text(`Max temperature: ${max} °C`);
        $('.humidity').find('p').text(`Humidity: ${humidity} %`);
      } else {
        $('.location').find('h2').text(capitalizeString(loc));
        $("#icon").attr('src', iconurl);
        $('.desc').find('p').text(capitalizeString(desc));
        $('.temp').find('p').text(`Current temperature: ${temp} °F`);
        $('.min').find('p').text(`Min temperature: ${min} °F`);
        $('.max').find('p').text(`Max temperature: ${max} °F`);
        $('.humidity').find('p').text(`Humidity: ${humidity} %`);
      }
    })
    .catch(err => {
      $('.location').find('h2').text('');
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

function selectLocation() {
  var location = "";
  $('.location').on('keydown', function (e) {
    if (e.which === 13) {
      location = $(this).val();
      req(location);
    }
  })
}

selectLocation();

const getPosition = () => {
  return new Promise((resolve, reject) => {
    const onSuccess = (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;
      pos = [lat, lng];

      resolve(pos)
    }

    const onError = () => {
      console.log('Can\'t get location info');
      reject();
    }

    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  })
}

function coordToCity(){
  //then needed because of promise returned on getPosition
  getPosition().then((position) => {
    fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position[0]}&longitude=${position[1]}&localityLanguage=en`)
    .then(response => response.json())
    .then(data => {
      let city = data['city'];
      console.log(city);
      return city;
    })
  });
}


