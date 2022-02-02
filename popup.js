let shareButton = document.getElementById("share");

shareButton.addEventListener("click", async () => {
  let [tab] = await chrome.tabs.query({active: true, currentWindow: true});

  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    function: shareResult,
  });
});

function shareResult() {
  let board = document.getElementById("board");
  const rows = [...board.children];
  
  let result = rows.filter(row => {
    const letter = row.children[0];
    return letter.classList.contains("right") ||
      letter.classList.contains("wrong") ||
      letter.classList.contains("place");
  }).map(row => {
    const letters = [...row.children];
    return letters.map(l => {
      let state = "w";
      if (l.classList.contains("right")) {
        state = "r";
      }
      if (l.classList.contains("place")) {
        state = "p";
      }
      return [l.innerHTML, state];
    });
  })

  let termo = JSON.parse(localStorage.getItem('termo'));
  let solution = termo.state.solution;
  let normSolution = termo.state.normSolution;

  result = `${result},${solution.split('')},${normSolution.split('')}`;

  const url = `https://lucaspoffo.github.io/?q=${btoa(result.toString())}&v=2`;
  copyToClipboard(url);

  function copyToClipboard(str) {
    const el = document.createElement('textarea');
    el.value = str;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
  };
}


