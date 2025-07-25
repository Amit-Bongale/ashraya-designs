const itemsPerPage = 15;
const gallery = document.querySelector("#gallery");
const pagination = document.querySelector("#pagination");
let currentPage = 1;
let currentFilter = "all";

const allItems = Array.from(gallery.children);

function filterItems(filter) {
  currentFilter = filter;
  currentPage = 1;
  showPage();
}

function showPage() {
  const visibleItems = allItems.filter(
    (item) => currentFilter === "all" || item.dataset.category === currentFilter
  );
  const totalPages = Math.ceil(visibleItems.length / itemsPerPage);

  allItems.forEach((item) => (item.style.display = "none"));

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  visibleItems
    .slice(start, end)
    .forEach((item) => (item.style.display = "block"));

  pagination.innerHTML = "";
  for (let i = 1; i <= totalPages; i++) {
    const li = document.createElement("li");
    li.className = `page-item ${i === currentPage ? "active" : ""}`;
    li.innerHTML = `<a class="page-link" href="#" class="pagination-button">${i}</a>`;
    li.addEventListener("click", (e) => {
      e.preventDefault();
      currentPage = i;
      showPage();
    });
    pagination.appendChild(li);
  }
}

// Filter button click
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".filter-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filterItems(btn.dataset.filter);
  });
});

// Modal logic
const modal = document.getElementById("imageModal");
const modalImg = document.getElementById("modalImage");
const modalClose = document.getElementById("modalClose");
const modalNext = document.getElementById("modalNext");
const modalPrev = document.getElementById("modalPrev");
let modalIndex = 0;

const getVisibleImages = () => {
  return Array.from(document.querySelectorAll(".masonry-item"))
    .filter((item) => item.style.display !== "none")
    .map((item) => item.querySelector("img"));
};

function openModal(index) {
  const images = getVisibleImages();
  if (!images[index]) return;
  modalImg.src = images[index].src;
  modal.style.display = "flex";
  modalIndex = index;
}

document.addEventListener("click", (e) => {
  if (e.target.matches(".masonry-item img")) {
    const images = getVisibleImages();
    const index = images.indexOf(e.target);
    openModal(index);
  }
});

modalClose.onclick = () => (modal.style.display = "none");
modal.onclick = (e) => {
  if (e.target === modal) modal.style.display = "none";
};

modalNext.onclick = () =>
  openModal((modalIndex + 1) % getVisibleImages().length);
modalPrev.onclick = () => {
  modalIndex =
    (modalIndex - 1 + getVisibleImages().length) % getVisibleImages().length;
  openModal(modalIndex);
};

// Initialize
showPage();
