const createBlurredWord = (word) => {
  const wrapper = document.createElement("span");
  wrapper.classList.add("censored-hate-word");
  wrapper.style.position = "relative";
  wrapper.style.display = "inline-block";
  wrapper.style.backgroundColor = "#ffe6e6";
  wrapper.style.padding = "2px 4px";
  wrapper.style.margin = "2px";

  const blurred = document.createElement("span");
  blurred.innerText = word;
  blurred.style.filter = "blur(5px)";
  blurred.style.transition = "filter 0.3s";
  blurred.setAttribute("data-blur", "true");

  // Saat kata di-klik, hilangkan blur
  blurred.addEventListener("click", () => {
    const isBlurred = blurred.getAttribute("data-blur") === "true";
    blurred.style.filter = isBlurred ? "none" : "blur(5px)";
    blurred.setAttribute("data-blur", isBlurred ? "false" : "true");
  });

  wrapper.appendChild(blurred);
  return wrapper;
};

const processTextNode = (node) => {
  if (node.parentNode.closest(".censored-hate-word")) return;

  const parent = node.parentNode;
  const words = node.textContent.split(/\s+/);

  const fragment = document.createDocumentFragment();
  let processed = 0;

  words.forEach((word, i) => {
    setTimeout(() => {
      fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: word })
      })
      .then(res => res.json())
      .then(data => {
        let element;
        if (data.result === "hate") {
          element = createBlurredWord(word);  // Teks disensor dengan blur
        } else {
          element = document.createTextNode(word);
        }

        fragment.appendChild(element);
        if (i < words.length - 1) {
          fragment.appendChild(document.createTextNode(" "));
        }

        processed++;
        if (processed === words.length) {
          try {
            if (node.parentNode) {
              parent.replaceChild(fragment, node);
            }
          } catch (err) {
            console.warn("Replace failed:", err);
          }
        }
      })
      .catch(err => console.error("Fetch error:", err));
    }, i * 100);  // Delay 100ms untuk setiap kata
  });
};

const scanAndCensor = () => {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode: (node) => {
      if (
        node.parentNode &&
        ["SCRIPT", "STYLE", "NOSCRIPT", "IFRAME"].includes(node.parentNode.tagName)
      ) {
        return NodeFilter.FILTER_REJECT;
      }
      return node.textContent.trim().length > 3
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  let node;
  while ((node = walker.nextNode())) {
    processTextNode(node);
  }
};

const observeDOM = (callback) => {
  const observer = new MutationObserver(() => {
    // Cek apakah elemen baru relevan
    if (document.querySelector(".comments-section")) {
      callback();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,  // Hanya kalau ada perubahan di subtree tertentu
  });
};

window.addEventListener("load", () => {
  scanAndCensor();           // Saat pertama load
  observeDOM(scanAndCensor); // Saat elemen baru muncul
});
