/* eslint-disable no-undef */
/* eslint-disable prefer-arrow-callback */
const selectForm = document.getElementById('selectForm');

const select1 = document.getElementById('1');
const select2 = document.getElementById('2');
const select3 = document.getElementById('3');
const select4 = document.getElementById('4');
const select5 = document.getElementById('5');

let result = {
    "ans1": select1.options[select1.selectedIndex].text,
    "ans2": select2.options[select2.selectedIndex].text,
    "ans3": select3.options[select3.selectedIndex].text,
    "ans4": select4.options[select4.selectedIndex].text,
    "ans5": select5.options[select5.selectedIndex].text,
};

function myNewFunction() {
  result = {
    "ans1": select1.options[select1.selectedIndex].text,
    "ans2": select2.options[select2.selectedIndex].text,
    "ans3": select3.options[select3.selectedIndex].text,
    "ans4": select4.options[select4.selectedIndex].text,
    "ans5": select5.options[select5.selectedIndex].text,
  };
}

selectForm.addEventListener('submit', async function(event) {
  event.preventDefault();
  const currentTask = event.target.dataset.title;
  const x = await fetch(`http://localhost:3000/tasks/result/${currentTask}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ result }),
  });
  const y = await x.text();
  selectForm.innerHTML = y;
});
