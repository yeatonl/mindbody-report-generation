export default function unfocus(event){
  if (document.activeElement === event.target){
    document.activeElement.blur();
  }
}
