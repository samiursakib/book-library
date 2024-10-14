import constants from "./constants.js";
import data from "./data.js";
import { gallery, singleBook, wishListGallery } from "./script.js";

const filterOptions = [
  { name: "fiction", textColor: "#5700a9", bgColor: "#c383ff" },
  { name: "literature", textColor: "#1824fa", bgColor: "#9ba0ff" },
  { name: "biography", textColor: "#00c69b", bgColor: "#b7ece0" },
  { name: "drama", textColor: "#008724", bgColor: "#a4d7b1" },
  { name: "psychology", textColor: "#8ea400", bgColor: "#edfb8d" },
  { name: "history", textColor: "#bc7100", bgColor: "#edbe76" },
  { name: "poetry", textColor: "#b00000", bgColor: "#e89595" },
  { name: "horror", textColor: "#9c0075", bgColor: "#f792de" },
  { name: "politics", textColor: "#1f1f1f", bgColor: "#cdcdcd" },
  { name: "religious", textColor: "#bc7100", bgColor: "#edbe76" },
];

export const fetchBooks = async () => {
  try {
    const response = await fetch(constants.allBooksUrl);
    if (!response.ok) {
      throw new Error(
        "Network response was not okay during fetching all books"
      );
    }
    const result = await response.json();
    return result.results;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const fetchSingleBook = async (id) => {
  try {
    const response = await fetch(`${constants.allBooksUrl}/${id}`);
    if (!response.ok) {
      throw new Error(
        "Network response was not okay during feching book's data"
      );
    }
    const result = await response.json();
    console.log(result);
    return result;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const divideArray = (array) => {
  const parts = getPartsBasedOnBreakpoint();
  const partSize = Math.ceil(array.length / parts);
  const dividedArray = [];
  for (let i = 0; i < parts; i++) {
    dividedArray.push(array.slice(i * partSize, (i + 1) * partSize));
  }
  return dividedArray;
};

export const getPartsBasedOnBreakpoint = () => {
  const isSmallScreen = window.matchMedia("(max-width: 480px)").matches;
  const isMediumScreen = window.matchMedia(
    "(min-width: 481px) and (max-width: 1023px)"
  ).matches;
  const isLargeScreen = window.matchMedia("(min-width: 1024px)").matches;
  //   console.log(
  //     isSmallScreen ? 1 : 0,
  //     isMediumScreen ? 1 : 0,
  //     isLargeScreen ? 1 : 0
  //   );
  if (isSmallScreen) {
    return 1;
  } else if (isMediumScreen) {
    return 3;
  } else if (isLargeScreen) {
    return 5;
  }
};

export const showBookDetails = (id) => {
  const books = data.results;
  const book = books?.find((book) => book.id === id);
  if (book) {
    gallery.classList.add("hidden");
    wishListGallery.classList.add("hidden");
    singleBook.classList.remove("hidden");
    singleBook.innerHTML = "";

    const bookDetailsContainer = document.createElement("div");
    bookDetailsContainer.className =
      "flex flex-col md:flex-row gap-4 [&>*]:w-1/2 mt-12 h-[500px]";

    const imageWrapper = document.createElement("div");
    const image = document.createElement("img");
    image.src = book.formats["image/jpeg"];
    image.alt = book.formats["image/jpeg"];
    image.className = "max-h-[500px] w-full rounded-md";

    imageWrapper.appendChild(image);
    const details = document.createElement("div");
    details.className = "flex flex-col gap-4";

    const title = document.createElement("div");
    title.className = "text-4xl font-extralight";
    title.innerText = book.title;

    const authors = document.createElement("div");
    authors.className = "";
    authors.innerText = "Written by " + book.authors[0]?.name ?? "Unknown";

    const topics = filterOptions.filter((option) =>
      book.subjects.some((value) => value.includes(option.name))
    );

    const genre = document.createElement("div");
    const ul = document.createElement("ul");
    ul.className = "flex flex-wrap gap-4";
    for (let topic of topics) {
      const li = document.createElement("li");
      li.className = `genre-badge text-[${topic.textColor}] bg-[${topic.bgColor}]`;
      li.innerText = topic.name.charAt(0).toUpperCase() + topic.name.slice(1);
      ul.appendChild(li);
    }
    genre.appendChild(ul);

    const downloadItem = document.createElement("div");
    const downloadCount = document.createElement("span");
    downloadCount.className = "font-bold";
    downloadCount.innerText = book.download_count;
    const downloadCountBefore = document.createElement("span");
    downloadCountBefore.innerText = "Downloaded ";
    const downloadCountAfter = document.createElement("span");
    downloadCountAfter.innerText = " times";

    downloadItem.append(downloadCountBefore, downloadCount, downloadCountAfter);

    const backWrapper = document.createElement("div");
    backWrapper.innerHTML = "<i class='fa-solid fa-arrow-left'></i>";
    const backButton = document.createElement("button");
    backButton.style.marginLeft = "10px";
    backButton.innerText = "Go Back";
    backButton.onclick = () => window.history.back();

    backWrapper.appendChild(backButton);
    details.append(title, authors, genre, downloadItem, backWrapper);
    bookDetailsContainer.append(imageWrapper, details);
    singleBook.append(bookDetailsContainer);
  }
};

export const navigateToBook = (id) => {
  window.history.pushState({ id }, `Book ${id}`, `/books/${id}`);
  showBookDetails(id);
};

export const updateWishList = (id) => {
  const bookSet = new Set(getWishList());
  if (bookSet.has(id)) {
    bookSet.delete(id);
  } else {
    bookSet.add(id);
  }
  localStorage.setItem("wishList", JSON.stringify(Array.from(bookSet)));
};

export const getWishList = () => {
  return localStorage.getItem("wishList")
    ? new Set(JSON.parse(localStorage.getItem("wishList")))
    : [];
};
