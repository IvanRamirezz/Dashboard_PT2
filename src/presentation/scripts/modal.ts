// src/presentation/scripts/modal.ts

export function openModal(id: string): void {
  document.getElementById(id)?.classList.remove("hidden");
}

export function closeModal(id: string): void {
  const modal = document.getElementById(id);
  if (!modal) return;

  modal.classList.add("hidden");

  if (id === "successModal") clearUpdatedParam();
}

function clearUpdatedParam(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("updated");
  window.history.replaceState({}, "", url);
}