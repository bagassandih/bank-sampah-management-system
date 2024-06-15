let sidebar = document.getElementById("sidebar");
let content = document.querySelector(".content");
let toggleBtn = document.querySelector(".toggle-btn");
let header = document.querySelector("header");

// Phone screen
// if (screen.width > 768 ) {
//   toggleBtn.remove();
// }

// // Tab screen
// if (screen.width > 767 && screen.width < 1024) {
//   toggleBtn.remove();
// }

// PC screen
if (screen.width > 1024 ) {
  header.style.right = "0";
  header.style["justify-content"] = "end";
  header.style.padding = "20px 0px";
  toggleBtn.remove();
}

let isSidebarOpen = false;
function toggleSidebar() {
  if (!isSidebarOpen) {
    sidebar.style.transform = "translateX(0)";

    if (screen.width <= 425) {
      toggleBtn.style.transform = "translateX(142.5px)";
    } else if (screen.width > 425 && screen.width < 769) {
      toggleBtn.style.transform = "translateX(145px)";
    } else if (screen.width > 769 && screen.width < 977) {
      toggleBtn.style.transform = "translateX(195px)";
    } else if (screen.width > 978 && screen.width < 1025) {
      toggleBtn.style.transform = "translateX("+(screen.width*19)/100+"px)";
    } else {
      toggleBtn.style.transform = "translateX("+(screen.width*20)/100+"px)";
    }

    toggleBtn.style["background-color"] = "#0F1035";
    toggleBtn.style.color = "white";

  } else {

    toggleBtn.style["background-color"] = "#E1E1E1";
    toggleBtn.style.color = "#0F1035";

    sidebar.style.transform = "translateX(-150%)";
    toggleBtn.style.transform = "translateX(0px)";
  }

  isSidebarOpen = !isSidebarOpen;
}
