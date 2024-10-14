import data from "./data.js";
import {
  divideArray,
  fetchBooks,
  fetchSingleBook,
  getPartsBasedOnBreakpoint,
  getWishList,
  navigateToBook,
  showBookDetails,
  updateWishList,
} from "./utils.js";

const rootElement = document.getElementById("root");
const navbar = document.querySelector(".navbar");
export const gallery = document.querySelector(".gallery");
export const singleBook = document.querySelector(".singleBook");
export const wishListGallery = document.querySelector(".wishlist");

const createGallery = async (bookList, container) => {
  container.innerHTML = null;
  const wishList = getWishList();

  for (const book of bookList) {
    const card = document.createElement("div");
    card.className =
      "flex flex-col rounded-lg bg-white overflow-hidden shadow-sm hover:shadow-lg shadow-slate-300";

    const imageContainer = document.createElement("div");
    imageContainer.className = "relative group hover:cursor-pointer grow";
    imageContainer.addEventListener("click", async () => {
      navigateToBook(book.id);
    });

    const image = document.createElement("img");
    image.src = book.formats["image/jpeg"];
    image.alt = book.title;
    image.className = "w-full h-auto";

    const titleWrapper = document.createElement("div");
    titleWrapper.className = "title-wrapper";

    const title = document.createElement("abbr");
    title.innerText = book.title;
    title.title = book.title;
    title.className = "title";

    const love = document.createElement("span");
    love.className = "love";
    love.innerHTML = `<i class='fa-sharp fa-${
      wishList.has(book.id) ? "solid" : "regular"
    } fa-heart'></i>`;
    love.addEventListener("click", () => {
      const response = confirm(
        `Want to ${wishList.has(book.id) ? "remove from" : "add to"} wishlist?`
      );
      if (response) {
        updateWishList(book.id);
        if (new URL(window.location.href).pathname === "/wishlist") {
          const wishedListIds = getWishList();
          const wishListBooks = bookList.filter((book) =>
            wishedListIds.has(book.id)
          );
          createGallery(Array.from(wishListBooks), wishListGallery);
        } else {
          createGallery(bookList, container);
        }
      }
    });

    titleWrapper.append(love, title);

    const id = document.createElement("span");
    id.innerText = book.id;
    id.className =
      "px-2 py-1 border rounded opacity-80 font-bold text-sm absolute top-2 left-2 bg-white";

    const overlay = document.createElement("div");
    overlay.className =
      "absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300";

    const authorContainer = document.createElement("div");
    const authorNames = book.authors[0]?.name
      .split(",")
      .map((name) => name.trim());

    const authorHeader = document.createElement("div");
    authorHeader.innerText = "Authors";
    authorHeader.className = "text-center py-2 border-b font-bold";

    const authorList = document.createElement("div");
    authorList.className = "flex flex-col mt-2 gap-2 text-center";
    if (book.authors.length) {
      for (const authorName of authorNames) {
        const author = document.createElement("div");
        author.innerText = authorName;
        authorList.appendChild(author);
      }
    } else {
      authorList.innerText = "No author found";
    }

    authorContainer.append(authorHeader, authorList);

    overlay.appendChild(authorContainer);
    imageContainer.append(image, id, overlay);

    card.append(imageContainer, titleWrapper);
    container.appendChild(card);
  }
};

window.addEventListener("load", () => {
  const bookList = data.results;

  document.querySelectorAll(".navlink").forEach((navlink) => {
    navlink.addEventListener("click", (event) => {
      event.preventDefault();
      const route = new URL(event.target.href).pathname;
      navigateTo(route);
    });
  });

  createGallery(bookList, gallery);

  const navigateTo = (route) => {
    gallery.classList.add("hidden");
    singleBook.classList.add("hidden");
    wishListGallery.classList.add("hidden");

    if (route === "/") {
      gallery.classList.remove("hidden");
      createGallery(bookList, gallery);
      window.history.pushState({}, "Home", "/");
    } else {
      wishListGallery.classList.remove("hidden");
      const wishedListIds = getWishList();
      const wishList = bookList.filter((book) => wishedListIds.has(book.id));
      createGallery(Array.from(wishList), wishListGallery);
      window.history.pushState({}, "Wishlist", "/wishlist");
    }
  };

  window.onpopstate = () => {
    if (window.location.pathname === "/wishlist") {
      navigateTo("/wishlist");
    } else {
      navigateTo("/");
    }
  };
});
window.addEventListener("resize", createGallery);
