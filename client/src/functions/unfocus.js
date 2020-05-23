export default function unfocus(event){
  console.log("A");
  if (event.target === document.activeElement){
    console.log("B");
    document.activeElement.blur();
  }
}
