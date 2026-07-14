/*-----Custom JS Dark Mode For Feed01 ------*/
var toggleMode = document.querySelector("._layout_swithing_btn_link");
var layout = document.querySelector("._layout_main_wrapper");
var darkMode = localStorage.getItem("darkMode") === "true";
if (darkMode && layout) {
  layout.classList.add("_dark_wrapper");
}
if (toggleMode) {
  toggleMode.addEventListener("click", function() {
    darkMode = !darkMode;
    localStorage.setItem("darkMode", String(darkMode));
    if (darkMode && layout) {
      layout.classList.add("_dark_wrapper");
    } else if (layout) {
      layout.classList.remove("_dark_wrapper");
    }
  });
}
/*-----Custom JS Dark Mode End For Feed01 ------*/

