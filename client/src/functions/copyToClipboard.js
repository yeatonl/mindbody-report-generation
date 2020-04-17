export default function copyToClipboard(string){
  const e = document.createElement("textarea");
  e.value = string;
  document.body.appendChild(e);
  e.select();
  document.execCommand("copy");
  document.body.removeChild(e);
}
