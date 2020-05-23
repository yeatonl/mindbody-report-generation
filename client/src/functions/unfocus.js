export default function unfocus(event){
  if (event.target === document.activeElement){
    document.activeElement.blur();
  }
}
