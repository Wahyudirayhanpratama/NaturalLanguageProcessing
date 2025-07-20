document.getElementById('checkBtn').addEventListener('click', () => {
  chrome.scripting.executeScript({
    target: { tabId: chrome.tabs.TAB_ID }, // placeholder, will replace later
    func: () => window.getSelection().toString(),
  }, (results) => {
    const selectedText = results[0]?.result || "";

    if (!selectedText) {
      document.getElementById("result").innerText = "Tidak ada teks dipilih.";
      return;
    }

    fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText })
    })
    .then(res => res.json())
    .then(data => {
      document.getElementById("result").innerText = "Hasil: " + data.result;
    })
    .catch(err => {
      console.error(err);
      document.getElementById("result").innerText = "Error menghubungi API.";
    });
  });
});