const url = "http://127.0.0.1:"
export const ServerUrl = url + "5000"
export const PublicFile = ServerUrl + "/assets"
export const defaultFile = /png|img/
export const IMG = `${process.env.PUBLIC_URL}/assets/logo192.png`
export const flashKey = "flash-msg"
export const flexCenter = "flex justify-center items-center"

export namespace Server {
   export const URL = url + "5000"
   export const PUBLIC = `${URL}/assets`
}

export namespace Client {
   export const URL = 'localhost:3000'
   export const PUBLIC = process.env.PUBLIC_URL
   export const sample = `${PUBLIC}/assets/logo192.png`
   export const loading = `${PUBLIC}/assets/loading.gif`
}

export namespace ImgSample {
   const url = process.env.PUBLIC_URL + '/assets/'
   const logo1 = 'logo192.png'
   const logo2 = 'logo512.png'
   export const publicAPI = PublicFile + '/users/1661013791932 - Group 10 (1).png'
   export const single = JSON.stringify(logo1)
   export const arr = JSON.stringify([(logo1), (logo2)])
}
