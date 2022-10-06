const tBody = document.getElementById("table__body");
const modalBtn = document.querySelector(".modal__btn");
const sortSelect = document.querySelector(".form-select");
const input = document.querySelector(".form-control");
// TEMPLATE:
const template = document.getElementById("template").content;

const localCurrencies = localStorage.getItem("currencies");

let currencies = [];

if (localCurrencies) {
  currencies = JSON.parse(localCurrencies);
}

// LOADING:
window.onload = () => {
  const spinnerWrapper = document.querySelector(".spinner__wrapper");
  spinnerWrapper.classList.add("d-none");
};

// FUNCTION GET-DATA:
async function getData(url) {
  try {
    const rawData = await fetch(url);
    const { data } = await rawData.json();
    currencies = data;
    localStorage.setItem("currencies", JSON.stringify(data));
  } catch (error) {
    console.error(error);
    console.log("Internet uzildi!");
  }
}

getData("https://pressa-exem.herokuapp.com/api-49");

// FUNCTION RENDER:
function render(data) {
  tBody.innerHTML = "";
  const fragment = document.createDocumentFragment();

  data.forEach((el) => {
    fragment.appendChild(createElements(el));
  });
  tBody.appendChild(fragment);
}

// FUNCTION CREATE-ELEMENT:
function createElements(element) {
  const clonedTemp = template.cloneNode(true);

  clonedTemp.querySelector(".code").textContent = element.Code;
  clonedTemp.querySelector(".name").textContent = element.CcyNm_UZ;
  clonedTemp.querySelector(".letter__code").textContent = element.Ccy;
  clonedTemp.querySelector(".price").textContent = element.Rate;
  clonedTemp.querySelector(".date").textContent = element.Date;
  return clonedTemp;
}
render(currencies);

// MODAL:
const token = window.localStorage.getItem("token");
setTimeout(() => {
  if (!token) {
    modalBtn.click();
    localStorage.setItem("token", "Modal qayta ishlamaydi!");
  }
}, 5000);

// SORT:
sortSelect.addEventListener("change", (ev) => {
  const type = ev.target.value;
  let data = [...currencies];
  data.sort((a, b) => {
    if (type === "expensive") {
      return b.Rate - a.Rate;
    } else if (type === "cheap") {
      return a.Rate - b.Rate;
    } else {
      data = currencies;
    }
  });
  render(data);
});

// FILTER:
input.addEventListener("input", (ev) => {
  const value = ev.target.value;
  let newData;
  if (!isNaN(value)) {
    newData = [...currencies].filter((cur) => {
      if (+cur.Rate >= +value) return cur;
    });
    render(newData);
  }
});


