/* eslint-disable quote-props */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable func-names */
// /* eslint-disable prefer-arrow-callback */
// const fetchBtn = document.getElementById('fetchBtn');
const formFetch = document.getElementById('fetchPhrase');
const getPhrase = document.getElementById('getPhrase');
const input = document.getElementById('fetchInput');
formFetch.addEventListener('submit', async function (event) {
  event.preventDefault();
  const result = await fetch(`https://shakespeare.p.rapidapi.com/shakespeare.json?text=${formFetch.phrase.value}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "shakespeare.p.rapidapi.com",
      "x-rapidapi-key": "858f638d65msha01dd089364905cp1f9f89jsn1a61f2e7f4f1",
      "x-funtranslations-api-secret": ""
    }
  });
  const x = await result.json();
  getPhrase.innerText = x.contents.translated;
  input.value = '';
});
