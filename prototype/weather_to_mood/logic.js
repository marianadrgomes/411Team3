//Methods for converting weather to mood
function get_rd_int(range){//random int generator from 0 inclusive to range exclusive
  return Math.floor(Math.random() * Math.floor(range));
}

function return_rd_mood(id){

  //testing code:
  //let id = test
  /* The api for weather returns an id for each type of weather
  the weather condition can be roughly divided by the hundredth digit of the id
  here I assume the id to be the number type.
  The api's table of id for each kind of weather is:
  https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2

  The website i used to find moods for music is:
  https://www.allmusic.com/moods
  feel free to add new/edit moods to each array for each weather
  */
  if (id < 300 && id >= 200) { //weather is thunderstorm
    let psb_mood = ['aggressive','fiery','tense', 'anxious', 'intense',
    'volatile', 'angry', 'epic', 'explosive', 'menacing']
    return psb_mood[get_rd_int(psb_mood.length)]
  }else if (id < 400 && id >= 300) {//weather is drizzle
    let psb_mood = ['calm', 'relaxing', 'peaceful', 'ethereal', 'gentle', 'flowing','romantic','soft']
    return psb_mood[get_rd_int(psb_mood.length)]
  }else if (id < 600 && id >= 500) {//weather is Rain
    let psb_mood = ['bitter','bittersweet','grim', 'melancholy','uplifting']
    return psb_mood[get_rd_int(psb_mood.length)]
  }else if (id < 700 && id >= 600) {//Snow
    let psb_mood = ['whimsical','autumnal','cold', 'innocent', 'magical', 'playful','warm']
    return psb_mood[get_rd_int(psb_mood.length)]
  }else if (id < 800 && id >= 700) {//Atmosphere (mist, smoke, haze, dust..etc)
    let psb_mood = ['airy','ethereal','meditative','unsettling']
    return psb_mood[get_rd_int(psb_mood.length)]
  }else if (id < 900 && id > 800) {//Clouds
    let psb_mood = ['gloomy','dark','enigmatic', 'mellow', 'ominous','optimistic']
    return psb_mood[get_rd_int(psb_mood.length)]
  }else {//Clear clear has an id of exactly 800
    let psb_mood = ['happy','energetic','exuberance','sunny','athletic','fun']
    return psb_mood[get_rd_int(psb_mood.length)]
  }
}

module.exports = {get_rd_int, return_rd_mood}
/* This method returns a single string which represents a mood.
This is based on the assumption that the call on spotify api accepts string keywords.
It requires no parameter (this can easily be changed) and fetches the id data from the const data
defined in the file welcome.js. Based on the id returned, it roughly divides the weather in 7 categories
and returns a randomly chosen mood from the corresponding weather's array of moods (hence the array name
psb_mood for possible moods). I added this randomness just so there could be some fun and less repeating outputs.
Feel free to add or change moods to each array, im also ok if we want to subdivide the weather categories
to be more specific.
*/
