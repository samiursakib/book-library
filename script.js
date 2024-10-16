import {
  fetchBooksByPage,
  filterOptions,
  getWishList,
  updateWishList,
} from "./utils.js";

const rootElement = document.getElementById("root");
const navbar = document.querySelector(".navbar");
export const gallery = document.querySelector(".gallery");
export const singleBook = document.querySelector(".singleBook");
export const wishListGallery = document.querySelector(".wishlist");
const filter = document.querySelector(".filter");
const search = document.querySelector(".search");
const filterOptionList = document.querySelector(".filter-options");
export const pagination = document.querySelector(".pagination");
const loader = document.querySelector(".loader");

const createGallery = async (bookList, container) => {
  const showBookDetails = (id) => {
    const book = bookList?.find((book) => book.id === id);
    if (book) {
      gallery.classList.add("hidden");
      wishListGallery.classList.add("hidden");
      singleBook.classList.remove("hidden");
      singleBook.innerHTML = "";

      const bookDetailsContainer = document.createElement("div");
      bookDetailsContainer.className =
        "flex flex-col md:flex-row gap-8 [&>*]:w-1/2 mt-12 h-[500px]";

      const imageWrapper = document.createElement("div");
      imageWrapper.className = "w-full h-full";
      const image = document.createElement("img");
      image.src = book.formats["image/jpeg"];
      image.alt = book.formats["image/jpeg"];
      image.className = "w-full h-full rounded-md object-cover";

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

      downloadItem.append(
        downloadCountBefore,
        downloadCount,
        downloadCountAfter
      );

      const backWrapper = document.createElement("span");
      backWrapper.innerHTML = "<i class='fa-solid fa-arrow-left'></i>";
      const backButton = document.createElement("button");
      backButton.style.marginLeft = "10px";
      backButton.innerText = "Go Back";
      backWrapper.onclick = () => window.history.back();

      backWrapper.appendChild(backButton);
      details.append(title, authors, genre, downloadItem, backWrapper);
      bookDetailsContainer.append(imageWrapper, details);
      singleBook.append(bookDetailsContainer);
    }
  };

  const navigateToBook = (id) => {
    window.history.pushState({ id }, `Book ${id}`, `/books/${id}`);
    pagination.style.display = "none";
    showBookDetails(id);
  };

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
    love.addEventListener("click", async () => {
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
          await createGallery(Array.from(wishListBooks), wishListGallery);
        } else {
          await createGallery(bookList, container);
        }
      }
    });

    titleWrapper.append(love, title);

    const id = document.createElement("div");
    id.innerText = book.id;
    id.className =
      "px-2 mb-2 text-center rounded opacity-80 font-bold text-sm bg-white";

    const overlay = document.createElement("div");
    overlay.className =
      "p-2 absolute inset-0 bg-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 overflow-auto";

    const authorContainer = document.createElement("div");
    const authorNames = book.authors[0]?.name
      .split(",")
      .map((name) => name.trim());

    const authorHeader = document.createElement("div");
    authorHeader.innerText = "Authors";
    authorHeader.className = "border-b font-bold text-xs";

    const authorList = document.createElement("div");
    authorList.className = "flex flex-col mt-2 gap-1 text-center text-sm";
    if (book.authors.length) {
      for (const authorName of authorNames) {
        const author = document.createElement("div");
        author.innerText = authorName;
        authorList.appendChild(author);
      }
    } else {
      authorList.innerText = "No author found";
    }

    const topics = filterOptions.filter((option) =>
      book.subjects.some((value) => value.includes(option.name))
    );
    const genre = document.createElement("div");
    const genreHeader = document.createElement("div");
    genreHeader.innerText = "Genre";
    genreHeader.className = "mt-4 mb-2 border-b font-bold text-xs";
    const ul = document.createElement("ul");
    ul.className = "flex flex-col gap-2";
    for (let topic of topics) {
      const li = document.createElement("li");
      li.className = "flex justify-center";
      const span = document.createElement("span");
      span.className = `genre-badge text-[${topic.textColor}] bg-[${topic.bgColor}] text-xs`;
      span.innerText = topic.name.charAt(0).toUpperCase() + topic.name.slice(1);
      li.appendChild(span);
      ul.appendChild(li);
    }
    genre.append(genreHeader, ul);

    authorContainer.append(id, authorHeader, authorList, genre);

    overlay.appendChild(authorContainer);
    imageContainer.append(image, overlay);

    card.append(imageContainer, titleWrapper);
    container.appendChild(card);
  }
  loader.classList.add("hidden");
};

window.addEventListener("load", async () => {
  let pageNo = 1;
  const bookList = await fetchBooksByPage(pageNo);

  const input = document.createElement("input");
  input.type = "text";
  input.className =
    "border border-gray py-1 pl-3 outline-none border-r-0 rounded-bl-md rounded-tl-md";
  input.addEventListener("input", async (event) => {
    const filteredBookList = bookList.filter((book) =>
      book.title.toLowerCase().includes(event.target.value.toLowerCase())
    );
    await createGallery(filteredBookList, gallery);
  });

  const searchIcon = document.createElement("span");
  searchIcon.innerHTML =
    '<i class="fas fa-search border p-2 rounded-br-md rounded-tr-md"></i>';
  search.append(input, searchIcon);

  const optionsWrapper = document.createElement("div");
  optionsWrapper.className =
    "p-2 flex flex-col gap-1 w-40 bg-white border filter-options hidden absolute top-full right-0 z-10 rounded-md";
  for (let option of filterOptions) {
    const optionElement = document.createElement("div");
    optionElement.classList =
      "px-2 hover:bg-slate-100 rounded hover:cursor-pointer";
    optionElement.innerText =
      option.name.charAt(0).toUpperCase() + option.name.slice(1);
    optionElement.onclick = async (event) => {
      const filteredBookList = bookList.filter((book) =>
        book.subjects.some((value) =>
          value.toLowerCase().includes(event.target.innerText.toLowerCase())
        )
      );
      await createGallery(filteredBookList, gallery);
    };
    optionsWrapper.appendChild(optionElement);
  }
  filter.addEventListener("blur", () => {
    optionsWrapper.classList.add("hidden");
  });
  filter.appendChild(optionsWrapper);
  filter.addEventListener("click", () => {
    optionsWrapper.classList.toggle("hidden");
  });

  document.querySelectorAll(".navlink").forEach((navlink) => {
    navlink.addEventListener("click", (event) => {
      event.preventDefault();
      const route = new URL(event.target.href).pathname;
      navigateTo(route);
    });
  });

  loader.classList.add("hidden");
  await createGallery(bookList, gallery);

  const prev = document.createElement("button");
  prev.className =
    "border px-4 py-1 border-slate-400 rounded hover:bg-slate-100";
  prev.innerText = "Prev";
  prev.onclick = async () => {
    pageNo--;
    gallery.classList.add("hidden");
    loader.classList.remove("hidden");
    const bookList = await fetchBooksByPage(pageNo);
    gallery.classList.remove("hidden");
    await createGallery(bookList, gallery);
  };
  const next = document.createElement("button");
  next.className = "border px-4 py-1 border-slate-400 rounded";
  next.innerText = "Next";
  next.onclick = async () => {
    pageNo++;
    gallery.classList.add("hidden");
    loader.classList.remove("hidden");
    const bookList = await fetchBooksByPage(pageNo);
    gallery.classList.remove("hidden");
    await createGallery(bookList, gallery);
  };

  pagination.append(prev, next);

  const navigateTo = async (route) => {
    gallery.classList.add("hidden");
    singleBook.classList.add("hidden");
    wishListGallery.classList.add("hidden");

    if (route === "/") {
      gallery.classList.remove("hidden");
      pagination.style.display = "flex";
      await createGallery(bookList, gallery);
      window.history.pushState({}, "Home", "/");
    } else {
      pagination.style.display = "none";
      wishListGallery.classList.remove("hidden");
      const wishedListIds = getWishList();
      const wishList = bookList.filter((book) => wishedListIds.has(book.id));
      await createGallery(Array.from(wishList), wishListGallery);
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
