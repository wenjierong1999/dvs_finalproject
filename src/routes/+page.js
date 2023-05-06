//data loader
export const load = ({ fetch }) => {
    const fetch_pointsofinterest = async () => { 
      const res = await fetch('https://vda-lab.github.io/assets/vast2021_businesses.json') 
      const data = await res.json() 
      return data
    }

    const fetch_gps = async () =>{
        const res = await fetch('https://vda-lab.github.io/assets/vast2021_gps_coordinates.json')
        const data = await res.json()
        return data
    }
    const fetch_stops = async () =>{
         const res = await fetch('https://vda-lab.github.io/assets/vast2021_carstops.json')
         const data = await res.json()
         return data
    }
  
    return {
      pointsofinterest: fetch_pointsofinterest(),
      gps: fetch_gps(),
      stops: fetch_stops()
    }
  }