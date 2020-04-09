export default function encodeQueryData(url, parameters) {
  let ret = [];
  if (parameters){
    for (const [key, value] of Object.entries(parameters)){
      if (value){
        ret.push(encodeURIComponent(key) + "=" + encodeURIComponent(value));
      }
    }

    return url + "?" + ret.join("&");
  }
  return url;
}
