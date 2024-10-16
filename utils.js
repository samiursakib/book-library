import constants from "./constants.js";
import data from "./data.js";
import { gallery, pagination, singleBook, wishListGallery } from "./script.js";

export const filterOptions = [
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

export const fetchBooksByPage = async (pageNo) => {
  try {
    const response = await fetch(constants.fetchBooksByPage + pageNo);
    if (!response.ok) {
      throw new Error("Network response was not okay");
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
