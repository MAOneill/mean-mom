console.log("hello");

let lat = 3.97;
let lng = -84.41;
getBusStop()

if ("geolocation" in navigator) { 
    // checks if user is sharing location
    navigator.geolocation.getCurrentPosition(function(position) {
       userGeoIP = position;
        lat = position.coords.latitude;
        lng = position.coords.longitude;
       console.log(" positon is ",lat, lng);
       getBusStop()

    })
   }


const alcoholText = document.querySelector('[data-alcohol-text]')
const alcoholImage = document.querySelector('[data-alcohol]')
const inspoText = document.querySelector('[data-inspo-text]')
const inspoImage = document.querySelector('[data-inspo]')
const martaText = document.querySelector('[data-marta-text]')
const martaImage = document.querySelector('[data-marta]')
const guidanceText = document.querySelector('[data-guidance-text]')
const guidanceImage = document.querySelector('[data-guidance]')

const alcoholArray = ['gin','vodka','tequila','mezcal','vodka','rum','brandy','whiskey']
const inspoArray = ['computers', 'cookie', 'definitions', 'miscellaneous', 'people', 'platitudes', 'politics', 'science', 'wisdom' ]
const horoscopeArray = ['aquarius', 'Capricorn', 'pisces', 'scorpio', 'sagittarius', 'libra',
                        'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo']
// defaultData = {'strDrink':"",
//         'strDrinkThumb':"",
//     'data':{'fortune':"DUMMY FORTUNE"}}

function selectRandomFromArray(arr) {
    let index = parseInt(Math.random()*arr.length)
    return arr[index]
}

async function getApiData(url) {
        let response = await fetch(url)
        let data = response.json();
        return data 

    
}
async function getADrink() {

    let alcoholURL = 'https://meanmom.jonathan-ray.com/dranks/' + selectRandomFromArray(alcoholArray)
    // console.log("url is ", alcoholURL)
    let alcoholData =  await getApiData(alcoholURL);
    // console.log(alcoholData);
    alcoholText.textContent = alcoholData.strDrink
    alcoholImage.src = alcoholData.strDrinkThumb


}

async function getInspiration() {

    let inspoURL = 'https://meanmom.jonathan-ray.com/inspiration?category=' + selectRandomFromArray(inspoArray)
    // console.log("url is ", inspoURL)
    let inspoData =  await getApiData(inspoURL);
    console.log(inspoData);
    inspoText.textContent = inspoData.data.fortune
    inspoImage.src = 'https://picsum.photos/400?new'

}

async function getBusStop() {
    let martaURL = 'https://meanmom.jonathan-ray.com/buses' 
    // console.log("url is ", martaURL)
    let martaData =  await getApiData(martaURL);
    console.log(martaData);

    let bestBusStop = "error finding stop"
    let shortestDistance = Infinity;
    martaData.data.forEach(busStop => {
        if (distanceBetweenTwoCoords(lat,lng,busStop.LATITUDE, busStop.LONGITUDE) < shortestDistance) {
            bestBusStop = busStop.TIMEPOINT
        }
    })

    martaText.textContent = bestBusStop
    martaImage.src = 'https://thenypost.files.wordpress.com/2017/11/bus-2.png?w=664&h=441&crop=1 '


}
async function getHoroscope() {
    let horscopeURL = 'https://meanmom.jonathan-ray.com/horoscope/' + selectRandomFromArray(horoscopeArray)
    console.log("url is ", horscopeURL)
    let horscopeData =  await getApiData(horscopeURL);
    guidanceText.textContent = `${horscopeData.data.sunsign}: ${horscopeData.data.horoscope}`
    let randomNum = parseInt(Math.random() * 3)
    guidanceImage.src = `https://picsum.photos/400?${randomNum}`

}

getADrink()
getInspiration()
getHoroscope()



function distanceBetweenTwoCoords(lat1, lon1, lat2, lon2) {
    function toRad(n) {
      return n * Math.PI / 180;
      };
      function toDeg(n) {
      return n * 180 / Math.PI;
      };
    var a = 6378137;
    var b = 6356752.3142;
    var f = 1 / 298.257223563; // WGS-84 ellipsoid params
    var L = toRad((lon2-lon1));
    var x = Math.atan((1 - f));
    var U1 = x * Math.tan(toRad(lat1));
    var U2 = x * Math.tan(toRad(lat2));
    var sinU1 = Math.sin(U1);
    var cosU1 = Math.cos(U1);
    var sinU2 = Math.sin(U2);
    var cosU2 = Math.cos(U2);
    var lambda = L;
    var lambdaP;
    var iterLimit = 100;
    do {
      var sinLambda = Math.sin(lambda),
          cosLambda = Math.cos(lambda),
          sinSigma = Math.sqrt((cosU2 * sinLambda) * (cosU2 * sinLambda) + (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda) * (cosU1 * sinU2 - sinU1 * cosU2 * cosLambda));
      if (0 === sinSigma) {
      return 0; // co-incident points
      };
      var cosSigma = sinU1 * sinU2 + cosU1 * cosU2 * cosLambda,
          sigma = Math.atan2(sinSigma, cosSigma),
          sinAlpha = cosU1 * cosU2 * sinLambda / sinSigma,
          cosSqAlpha = 1 - sinAlpha * sinAlpha,
          cos2SigmaM = cosSigma - 2 * sinU1 * sinU2 / cosSqAlpha,
          C = f / 16 * cosSqAlpha * (4 + f * (4 - 3 * cosSqAlpha));
      if (isNaN(cos2SigmaM)) {
      cos2SigmaM = 0; // equatorial line: cosSqAlpha = 0 (§6)
      };
      lambdaP = lambda;
      lambda = L + (1 - C) * f * sinAlpha * (sigma + C * sinSigma * (cos2SigmaM + C * cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM)));
    } while (Math.abs(lambda - lambdaP) > 1e-12 && --iterLimit > 0);
    
    if (0 === iterLimit) {
      return NaN; // formula failed to converge
    };
    
    var uSq = cosSqAlpha * (a * a - b * b) / (b * b),
        A = 1 + uSq / 16384 * (4096 + uSq * (-768 + uSq * (320 - 175 * uSq))),
        B = uSq / 1024 * (256 + uSq * (-128 + uSq * (74 - 47 * uSq))),
        deltaSigma = B * sinSigma * (cos2SigmaM + B / 4 * (cosSigma * (-1 + 2 * cos2SigmaM * cos2SigmaM) - B / 6 * cos2SigmaM * (-3 + 4 * sinSigma * sinSigma) * (-3 + 4 * cos2SigmaM * cos2SigmaM))),
        s = b * A * (sigma - deltaSigma);
    return s.toFixed(1); // round to .1m precision
  };