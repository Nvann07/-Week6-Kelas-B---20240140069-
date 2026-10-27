// ===== 2. FORM - DOM & EVENT HANDLING =====
const form = document.getElementById("register-form");
const resultBox = document.getElementById("result");
const resetBtn = document.getElementById("btn-reset");
const catatan = document.getElementById("catatan");
const counter = document.getElementById("counter");

// Aturan validasi tiap field
const rules = {
  nama: (v) => {
    if (!v.trim()) return "Nama wajib diisi.";
    if (v.trim().length < 3) return "Nama minimal 3 karakter.";
    return "";
  },
  email: (v) => {
    if (!v.trim()) return "Email wajib diisi.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return "Format email tidak valid.";
    return "";
  },
  telepon: (v) => {
    if (!v.trim()) return "Nomor HP wajib diisi.";
    if (!/^(\+62|62|0)8[0-9]{8,12}$/.test(v.trim())) return "Gunakan nomor HP Indonesia, contoh 081234567890.";
    return "";
  },
  workshop: (v) => (v ? "" : "Pilih salah satu workshop."),
  setuju: (checked) => (checked ? "" : "Centang pernyataan ini untuk melanjutkan."),
};

// Ambil nilai input (checkbox memakai checked)
function ambilNilai(nama) {
  const el = form.elements[nama];
  return el.type === "checkbox" ? el.checked : el.value;
}

// Validasi satu field dan tampilkan pesannya di DOM
function validasiField(nama) {
  const pesan = rules[nama](ambilNilai(nama));
  const wrapper = form.elements[nama].closest(".field");
  document.getElementById("error-" + nama).textContent = pesan;
  wrapper.classList.toggle("invalid", pesan !== "");
  wrapper.classList.toggle("valid", pesan === "");
  return pesan === "";
}

// Event: input / change / blur -> validasi langsung
Object.keys(rules).forEach((nama) => {
  const el = form.elements[nama];
  const eventName = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
  el.addEventListener(eventName, () => validasiField(nama));
  el.addEventListener("blur", () => validasiField(nama));
});

// Event: input -> hitung karakter catatan
catatan.addEventListener("input", () => {
  counter.textContent = catatan.value.length + " / " + catatan.maxLength;
});

// Event: submit -> validasi semua, lalu tampilkan hasil
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const semuaValid = Object.keys(rules).map(validasiField).every(Boolean);

  if (!semuaValid) {
    resultBox.hidden = true;
    const pertamaError = form.querySelector(".field.invalid input, .field.invalid select");
    if (pertamaError) pertamaError.focus();
    return;
  }

  tampilkanHasil({
    nama: form.elements.nama.value.trim(),
    email: form.elements.email.value.trim(),
    telepon: form.elements.telepon.value.trim(),
    workshop: form.elements.workshop.value,
    catatan: form.elements.catatan.value.trim() || "-",
  });

  resetForm();
});

// Event: click -> kosongkan form
resetBtn.addEventListener("click", () => {
  resetForm();
  resultBox.hidden = true;
});

// Buat elemen hasil secara dinamis (DOM)
function tampilkanHasil(data) {
  resultBox.innerHTML = "";

  const judul = document.createElement("h3");
  judul.textContent = "Terima kasih, " + data.nama + "! Pendaftaranmu berhasil.";

  const daftar = document.createElement("dl");
  const baris = [
    ["Email", data.email],
    ["Nomor HP", data.telepon],
    ["Workshop", data.workshop],
    ["Catatan", data.catatan],
  ];

  baris.forEach(([label, isi]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = isi;
    daftar.append(dt, dd);
  });

  resultBox.append(judul, daftar);
  resultBox.hidden = false;
  resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Reset isian dan penanda validasi
function resetForm() {
  form.reset();
  counter.textContent = "0 / " + catatan.maxLength;
  form.querySelectorAll(".field").forEach((f) => f.classList.remove("valid", "invalid"));
  form.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}