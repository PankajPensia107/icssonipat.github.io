const homePage = document.querySelector("#Home-Page");
const recordedPage = document.querySelector("#Recorded-Page");
const headerName = document.getElementById("HeaderName");
const goBackBtn = document.querySelectorAll("#GoBackBtn");
const RecordedPageBtn = document.querySelector("#RecordedPageBtn");
const HomePageBtn = document.querySelector("#HomePageBtn");
let walletPage = document.querySelector("#Wallet-Page");
let bottomWalletBtn = document.querySelector("#bottomWalletBtn");

function hideAllPages() {
  const allPages = [homePage, recordedPage, walletPage];
  allPages.forEach((page) => {
    if (page) {
      page.style.display = "none";
    }
  });
}

goBackBtn.forEach((button) => {
  button.addEventListener('click', function() {
    console.log('go back is working.')
    hideAllPages();
    homePage.style.display = "block";
    headerName.innerHTML = "Home";
    homePage.style.transition = "1s";
  });
});

RecordedPageBtn.addEventListener("click", function(){
  hideAllPages();
  headerName.innerHTML = "Recorded Page";
  recordedPage.style.display = "block";
  
  recordedPage.style.transition = "1s";
  homePage.style.transition = "1s";
});

HomePageBtn.addEventListener("click", function () {
  hideAllPages();
  headerName.innerHTML = "Home Page";
  homePage.style.display = "block";
  setActiveClass(HomePageBtn);
});


bottomWalletBtn.addEventListener("click", function () {
  hideAllPages();
  headerName.innerHTML = "Home Page";
  walletPage.style.display = "block";
  setActiveClass(HomePageBtn);
});
