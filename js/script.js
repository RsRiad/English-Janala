// call
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN";
  window.speechSynthesis.speak(utterance);
}

const loginAccess = (event) => {
  event.preventDefault(); // Prevent form submission

  const password = document.getElementById("Pass").value; // Get password input value

  if (password === "123456") {
    Swal.fire({
      title: "Login Successful",
      icon: "success",
      draggable: true,
    });

    // Show and hide relevant sections
    document.getElementById("navbar").classList.remove("hidden");
    document.getElementById("mainpart").classList.remove("hidden");
    document.getElementById("hero").classList.add("hidden");
    document.getElementById("footer").classList.remove("hidden");
    document.getElementById("come").classList.remove("hidden");

    document
      .getElementById("navbar")
      .classList.add("fixed", "top-0", "left-0", "w-full", "z-50");
  } else {
    Swal.fire({
      title: "Login Error",
      text: "Incorrect password. Please try again.",
      icon: "error",
      draggable: true,
    });
  }
};

// scroll
const faq = document.getElementById("faq-btn");
const faqSection = document.getElementById("faq");
faq.addEventListener("click", (event) => {
  event.preventDefault();
  faqSection.scrollIntoView({ behavior: "smooth" });
});
// const voca=document.getElementById("learn-btn");
// const vocaSection = document.getElementById('come');
// voca.addEventListener("click", (event) => {
//     event.preventDefault();
//     vocaSection.scrollIntoView({ behavior: "smooth" });
// });

//logout
const logout = document.getElementById("logout-btn");
logout.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("navbar").classList.add("hidden");
  document.getElementById("mainpart").classList.add("hidden");
  document.getElementById("hero").classList.remove("hidden");
  document.getElementById("footer").classList.add("hidden");
});
//voca buttons

const loadLessons = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => {
      displayLessons(data);
    });
};
let activeButton = null;
const displayLessons = (lessons) => {
  const btnContainer = document.getElementById("voca-btn-container");
  const names = lessons.data;
  //console.log(names);
  names.forEach((element) => {
    // console.log(element)
    let div = document.createElement("div");
    div.innerHTML = `
        <button class="btn btn-outline btn-primary" id="${element.id}">
        <i class="fa-solid fa-book-open"></i>Lesson -${element.level_no} 
        </button>
       `;
    btnContainer.appendChild(div);

    let button = div.querySelector(".btn");
    button.addEventListener("click", () => {
      if (activeButton) {
        activeButton.classList.remove("btn-active");
      }
      button.classList.add("btn-active");
      activeButton = button;
      loadWords(element.level_no);
    });
  });
};

const loadWords = (id) => {
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then((res) => res.json())
    .then((data) => {
      displayWords(data.data);
    });
};
const displayModal = (id) => {
  fetch(`https://openapi.programming-hero.com/api/word/${id}`)
    .then((res) => res.json())
    .then((data) => displayWordInfo(data));
};
const displayWordInfo = (word) => {
  console.log(word.data);

  const getSynonym = word.data.synonyms;
  let synonym = "";
  if (getSynonym.length > 0) {
    synonym = getSynonym
      .map(
        (word) =>
          `<span class="px-2 py-1 bg-blue-100 rounded-lg">${word}</span>`
      )
      .join("");
  } else {
    synonym = `<p class="text-gray-600">কোনো সমার্থক শব্দ পাওয়া যায় নি।</p>`;
  }

  document.getElementById("word_details").innerHTML = `
    <div class="modal-box">
        <div class="border border-blue-100 p-4 rounded-lg">
            <h2 class="text-xl font-bold">${word.data.word} 
              <span class="text-gray-800">
                ( <i class="fa-solid fa-microphone-lines"></i>: ${word.data.pronunciation} )
              </span>
            </h2>
            <p class="mt-3 font-semibold">Meaning</p>
            <p class="text-gray-700">${word.data.meaning}</p>
            <p class="mt-3 font-semibold">Example</p>
            <p class="text-gray-700">${word.data.sentence}</p>
            <p class="mt-3 font-semibold">সমার্থক শব্দগুলো</p>
            <div class="flex space-x-2 mt-2">${synonym} 
        </div>
        <form method="dialog">
            <button class="flex justify-center mx-auto btn btn-active mt-3 btn-primary text-white py-2 rounded-lg">Complete Learning</button>
        </form>
    </div>
  
  `;
  document.getElementById("word_details").showModal();
  console.log(getSynonym);
};

const displayWords = (words) => {
  console.log(words);
  const wordsArea = document.getElementById("voca-lesson-container");
  wordsArea.innerHTML = ``;

  if (words.length == 0) {
    document.getElementById("voca-lesson-container").classList.remove("grid");
    document.getElementById("no-lesson").classList.add("hidden");
    wordsArea.innerHTML = `
           <div class="bg-gray-50 text-center py-20 rounded-2xl grid place-items-center gap-3">
              <img src="./assets/alert-error.png" alt="alert">
              <p class="text-sm text-gray-400">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
              <h1 class="text-2xl">নেক্সট Lesson এ যান</h1>
            </div>
            `;
    return;
  }
  wordsArea.classList.add("grid", "grid-cols-3", "gap-4");
  words.forEach((word) => {
    //const card=document.getElementById("voca-lesson-container");

    document.getElementById("no-lesson").classList.add("hidden");
    let div = document.createElement("div");

    div.innerHTML = `
        <div class="bg-white rounded-lg p-9 grid gap-5 shadow-lg w-96">
            <div class="grid place-items-center">
                <h1 class="font-bold text-xl">${word.word}</h1>
                <p>Meaning / Pronunciation</p>
                <h1 class="font-semi-bold text-gray-700 text-xl">"${
                  word.meaning === null ? `❌Not found` : word.meaning
                } / ${word.pronunciation}"</h1>
            </div>
            <div class="flex justify-between">
           
                <button onclick="displayModal(${
                  word.id
                })"  class="btn btn-square"><i class="fa-solid fa-circle-info"></i></button>
                <button onclick="pronounceWord('${
                  word.word
                }')" class="btn btn-square"><i class="fa-solid fa-volume-high"></i></button>
            </div>
        </div>
        
        `;
    wordsArea.appendChild(div);
  });
};
loadLessons();
