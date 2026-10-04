const menuBtn = document.querySelector(".menu-btn");
const navMenu = document.querySelector(".nav-menu");

if (menuBtn && navMenu) {
  menuBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
    menuBtn.setAttribute(
      "aria-expanded",
      navMenu.classList.contains("open") ? "true" : "false"
    );
  });
}

const rsvpForm = document.querySelector("#event-rsvp-form");
if (rsvpForm) {
  const rsvpEvents = {
    "autumn-author-night": {
      title: "Autumn Author Night",
      description: "Meet local writers, hear short readings, and enjoy a cozy evening among fellow book lovers.",
      date: "September 30",
      time: "4:00 PM",
      venue: "Downtown, 125 Story Lane"
    },
    "childrens-story-hour": {
      title: "Children's Story Hour",
      description: "A welcoming story session for young readers and their families.",
      date: "September 12",
      time: "10:30 AM",
      venue: "Downtown, 125 Story Lane"
    },
    "romance-book-club": {
      title: "Romance Book Club",
      description: "Share favorite romantic reads and meet fellow book lovers for a relaxed discussion.",
      date: "September 18",
      time: "6:00 PM",
      venue: "Downtown, 125 Story Lane"
    },
    "local-author-signing": {
      title: "Local Author Signing",
      description: "Meet a local author, hear about their latest book, and get a copy signed.",
      date: "September 26",
      time: "2:00 PM",
      venue: "Downtown, 125 Story Lane"
    }
  };
  const event = rsvpEvents[new URLSearchParams(window.location.search).get("event")];
  const eventName = document.querySelector("#rsvp-event-name");
  const eventDescription = document.querySelector("#rsvp-event-description");
  const confirmation = document.querySelector("#rsvp-confirmation");
  const confirmationText = document.querySelector("#rsvp-confirmation-text");
  const nameInput = document.querySelector("#rsvp-name");

  if (event) {
    eventName.textContent = event.title;
    eventDescription.textContent = event.description;
    document.querySelector("#rsvp-event-date").textContent = event.date;
    document.querySelector("#rsvp-event-time").textContent = event.time;
    document.querySelector("#rsvp-event-venue").textContent = event.venue;
    nameInput.addEventListener("input", () => nameInput.setCustomValidity(""));

    rsvpForm.addEventListener("submit", submitEvent => {
      submitEvent.preventDefault();
      const name = nameInput.value.trim();
      if (!name) {
        nameInput.setCustomValidity("Enter your name.");
        nameInput.reportValidity();
        return;
      }
      nameInput.setCustomValidity("");
      confirmationText.textContent = `${name}, you're RSVP'd for ${event.title}.`;
      confirmation.showModal();
    });
  } else {
    eventName.textContent = "Event not found";
    eventDescription.textContent = "Choose an event from the events page to register.";
    rsvpForm.hidden = true;
    document.querySelector("#rsvp-event-details").hidden = true;
    document.querySelector("#rsvp-event-error").hidden = false;
  }
}

const loadMore = document.querySelector(".load-more");
if (loadMore) {
  loadMore.addEventListener("click", () => {
    const grid = document.querySelector(".catalogue-grid");
    const books = [
      { title: "Moonlit Pages", priceCents: 1599, image: "images/Client3_Book1.png", description: "A cozy story for readers who love a little romance and plenty of cheese.", genres: "fiction romance" },
      { title: "The Quiet Library", priceCents: 1899, image: "images/Client3_Book2.png", description: "A thoughtful story set among shelves, secrets, and late-night readers.", genres: "fiction children" },
      { title: "Golden Chapter", priceCents: 1799, image: "images/Client3_Book3.png", description: "A magical fantasy adventure filled with sorcery and unexpected twists.", genres: "fiction fantasy" }
    ];
    books.forEach(book => {
      const item = document.createElement("article");
      item.className = "catalogue-card";
      item.tabIndex = 0;
      item.dataset.genres = book.genres;
      item.dataset.priceCents = book.priceCents;
      const media = document.createElement("div");
      media.className = "product-media";
      const image = document.createElement("img");
      image.className = "product-image";
      image.src = book.image;
      image.alt = `Cover image for ${book.title}`;
      const description = document.createElement("p");
      description.className = "product-description";
      description.textContent = book.description;
      media.append(image, description);
      const title = document.createElement("h3");
      title.textContent = book.title;
      const price = document.createElement("p");
      price.className = "book-price";
      price.textContent = `$${(book.priceCents / 100).toFixed(2)}`;
      const addButton = document.createElement("button");
      addButton.type = "button";
      addButton.dataset.addToCart = "";
      addButton.setAttribute("aria-label", `Add ${book.title} to cart`);
      addButton.textContent = "+";
      item.append(media, title, price, addButton);
      grid.appendChild(item);
    });
    filterCatalogue(activeGenre);
    loadMore.textContent = "More books loaded";
    loadMore.disabled = true;
  });
}

const genreChips = document.querySelectorAll(".filter-chip[data-genre]");
const genreStatus = document.querySelector(".genre-status");
const catalogueSearch = document.querySelector("#catalogue-search");
const catalogueSearchForm = document.querySelector("#catalogue-search-form");
const validGenres = new Set(["nonfiction", "fiction", "children", "history", "fantasy", "romance"]);
const requestedGenre = new URLSearchParams(window.location.search).get("genre");
let activeGenre = validGenres.has(requestedGenre) ? requestedGenre : "all";
let searchTerm = "";

function filterCatalogue(genre) {
  const cards = document.querySelectorAll(".catalogue-card");
  const normalizedSearch = searchTerm.toLocaleLowerCase();
  let visibleCount = 0;

  cards.forEach(card => {
    const genres = (card.dataset.genres || "").split(/\s+/);
    const searchableText = [
      card.querySelector("h3")?.textContent,
      card.querySelector(".product-description")?.textContent,
      card.querySelector(".product-image")?.alt,
      card.dataset.genres
    ].join(" ").toLocaleLowerCase();
    const matchesGenre = genre === "all" || genres.includes(genre);
    const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch);
    const visible = matchesGenre && matchesSearch;
    card.hidden = !visible;
    if (visible) visibleCount += 1;
  });

  genreChips.forEach(chip => {
    const selected = chip.dataset.genre === genre;
    chip.classList.toggle("active", selected);
    chip.setAttribute("aria-pressed", String(selected));
  });

  if (genreStatus) {
    const label = [...genreChips].find(chip => chip.dataset.genre === genre)?.textContent || "All";
    const searchDescription = normalizedSearch ? ` matching “${searchTerm}”` : "";
    genreStatus.textContent = visibleCount
      ? `Showing ${visibleCount} ${visibleCount === 1 ? "item" : "items"} in ${label}${searchDescription}.`
      : normalizedSearch
        ? `No items match “${searchTerm}” in ${label}.`
        : `No items are currently listed in ${label}.`;
  }
}

if (catalogueSearch) {
  catalogueSearch.addEventListener("input", () => {
    searchTerm = catalogueSearch.value.trim();
    filterCatalogue(activeGenre);
  });
}

if (catalogueSearchForm) {
  catalogueSearchForm.addEventListener("submit", event => {
    event.preventDefault();
    searchTerm = catalogueSearch.value.trim();
    filterCatalogue(activeGenre);
  });
}

if (genreChips.length) {
  genreChips.forEach(chip => {
    chip.addEventListener("click", () => {
      activeGenre = chip.dataset.genre;
      const url = new URL(window.location.href);
      if (activeGenre === "all") url.searchParams.delete("genre");
      else url.searchParams.set("genre", activeGenre);
      window.history.replaceState({}, "", url);
      filterCatalogue(activeGenre);
    });
  });
  filterCatalogue(activeGenre);
}

const catalogueGrid = document.querySelector(".catalogue-grid");
const cartPanel = document.querySelector("#shopping-cart");
const cartToggle = document.querySelector(".cart-toggle");
const cartItems = document.querySelector(".cart-items");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total strong");
const cartStorageKey = "bookhaven-cart";
let cart = [];

try {
  const savedCart = JSON.parse(localStorage.getItem(cartStorageKey) || "[]");
  if (Array.isArray(savedCart)) {
    cart = savedCart.filter(item =>
      item && typeof item.id === "string" && typeof item.title === "string" &&
      Number.isInteger(item.priceCents) && item.priceCents >= 0 &&
      Number.isInteger(item.quantity) && item.quantity > 0
    );
  }
} catch {
  cart = [];
}

function saveCart() {
  try {
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
  } catch {
    // Cart remains usable for this page view if storage is unavailable.
  }
}

function formatPrice(priceCents) {
  return `$${(priceCents / 100).toFixed(2)}`;
}

function renderCart() {
  if (!cartItems) return;
  cartItems.replaceChildren();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCents = cart.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);
  cartCount.textContent = itemCount;
  cartTotal.textContent = formatPrice(totalCents);

  if (cart.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.className = "cart-empty";
    emptyMessage.textContent = "Your cart is empty.";
    cartItems.appendChild(emptyMessage);
    return;
  }

  cart.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item";
    const name = document.createElement("span");
    name.className = "cart-item-name";
    name.textContent = item.title;
    const subtotal = document.createElement("span");
    subtotal.textContent = formatPrice(item.priceCents * item.quantity);
    const controls = document.createElement("div");
    controls.className = "cart-item-controls";

    [
      { action: "decrease", label: `Decrease quantity of ${item.title}`, text: "−" },
      { action: "increase", label: `Increase quantity of ${item.title}`, text: "+" },
      { action: "remove", label: `Remove ${item.title} from cart`, text: "Remove" }
    ].forEach(control => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.cartAction = control.action;
      button.dataset.productId = item.id;
      button.setAttribute("aria-label", control.label);
      button.textContent = control.text;
      controls.appendChild(button);
    });

    const quantity = document.createElement("span");
    quantity.className = "cart-item-quantity";
    quantity.textContent = `Qty ${item.quantity}`;
    controls.insertBefore(quantity, controls.lastChild);
    row.append(name, subtotal, controls);
    cartItems.appendChild(row);
  });
}

if (catalogueGrid && cartPanel && cartToggle) {
  catalogueGrid.addEventListener("click", event => {
    const button = event.target.closest("[data-add-to-cart]");
    if (!button) return;

    const product = button.closest(".catalogue-card");
    const title = product.querySelector("h3").textContent.trim();
    const id = title.toLowerCase();
    const priceCents = Number.parseInt(product.dataset.priceCents, 10);
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, title, priceCents, quantity: 1 });
    }
    saveCart();
    renderCart();
  });

  cartToggle.addEventListener("click", () => {
    cartPanel.hidden = !cartPanel.hidden;
    cartToggle.setAttribute("aria-expanded", String(!cartPanel.hidden));
  });

  cartItems.addEventListener("click", event => {
    const button = event.target.closest("[data-cart-action]");
    if (!button) return;
    const item = cart.find(cartItem => cartItem.id === button.dataset.productId);
    if (!item) return;

    if (button.dataset.cartAction === "increase") item.quantity += 1;
    if (button.dataset.cartAction === "decrease") item.quantity -= 1;
    if (button.dataset.cartAction === "remove" || item.quantity <= 0) {
      cart = cart.filter(cartItem => cartItem.id !== item.id);
    }
    saveCart();
    renderCart();
  });

  renderCart();
}
