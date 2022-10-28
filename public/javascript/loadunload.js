window.onload = (event) =>  {
    document.getElementById('body').style.opacity='1';
    return true;
  };
window.onbeforeunload = (event) => {
    document.getElementById('body').style.opacity='0';
    return true;
  }