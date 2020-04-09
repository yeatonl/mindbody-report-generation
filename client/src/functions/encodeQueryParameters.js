export default function encodeQueryData(url, parameters) {
  let ret = [];
  for (const [key, value] of Object.entries(parameters)){
    console.log(parameters);
    if (value){
      ret.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
  }


  return url + "?" + ret.join("&");
}
