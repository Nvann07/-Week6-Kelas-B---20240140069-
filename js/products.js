// ===== 1. FETCH API - DATA PRODUK =====
const API_URL = "https://dummyjson.com/products";

const statusBox = document.getElementById("status");
const productList = document.getElementById("product-list");

// Format harga ke dollar (DummyJSON memakai USD)
function formatHarga(angka) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(angka);
}

// Tampilkan pesan loading
function tampilkanLoading() {
  statusBox.className = "status loading";
  statusBox.innerHTML = '<span class="spinner" aria-hidden="true"></span><span>Memuat data produk...</span>';
  productList.innerHTML = "";
}

// Tampilkan pesan error + tombol coba lagi
function tampilkanError(pesan) {
  statusBox.className = "status error";
  statusBox.innerHTML = "";

  const teks = document.createElement("span");
  teks.textContent = "Gagal memuat produk: " + pesan;

  const tombol = document.createElement("button");
  tombol.type = "button";
  tombol.className = "btn";
  tombol.textContent = "Coba lagi";
  tombol.addEventListener("click", ambilProduk);

  statusBox.append(teks, tombol);
}

// Sembunyikan status setelah sukses
function sembunyikanStatus() {
  statusBox.className = "status";
  statusBox.innerHTML = "";
}

// Render daftar produk ke halaman menggunakan DOM
function renderProduk(daftarProduk) {
  productList.innerHTML = "";

  if (daftarProduk.length === 0) {
    tampilkanError("tidak ada data produk yang tersedia.");
    return;
  }

  const fragment = document.createDocumentFragment();

  daftarProduk.forEach((produk) => {
    const li = document.createElement("li");
    li.className = "product-card";

    const img = document.createElement("img");
    img.src = produk.thumbnail;
    img.alt = produk.title;
    img.loading = "lazy";

    const info = document.createElement("div");
    info.className = "product-info";

    const nama = document.createElement("h3");
    nama.className = "product-name";
    nama.textContent = produk.title;

    const kategori = document.createElement("span");
    kategori.className = "product-category";
    kategori.textContent = produk.category;

    const harga = document.createElement("span");
    harga.className = "product-price";
    harga.textContent = formatHarga(produk.price);

    info.append(nama, kategori, harga);
    li.append(img, info);
    fragment.appendChild(li);
  });

  productList.appendChild(fragment);
}

// Fungsi utama: ambil data dari API
async function ambilProduk() {
  tampilkanLoading();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Server merespons dengan status " + response.status);
    }

    const data = await response.json(); // olah response JSON
    sembunyikanStatus();
    renderProduk(data.products);
  } catch (error) {
    tampilkanError(error.message || "periksa koneksi internet kamu.");
  }
}

// Jalankan saat halaman dibuka
document.addEventListener("DOMContentLoaded", ambilProduk);