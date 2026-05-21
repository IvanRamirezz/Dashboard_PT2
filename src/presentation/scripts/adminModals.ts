// src/presentation/scripts/adminModals.ts

function openModal(id: string): void {
  document.getElementById(id)?.classList.remove("hidden");
}

function closeModal(id: string): void {
  document.getElementById(id)?.classList.add("hidden");
}

function initApproveModals(): void {
  document.querySelectorAll<HTMLButtonElement>(".open-approve-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const profesorId = btn.dataset.id;
      const input = document.getElementById("approve-profesor-id") as HTMLInputElement | null;
      if (input && profesorId) input.value = profesorId;
      openModal("approveModal");
    });
  });
}

function initRejectModals(): void {
  document.querySelectorAll<HTMLButtonElement>(".open-reject-modal").forEach((btn) => {
    btn.addEventListener("click", () => {
      const profesorId = btn.dataset.id;
      const input = document.getElementById("reject-profesor-id") as HTMLInputElement | null;
      if (input && profesorId) input.value = profesorId;
      openModal("rejectModal");
    });
  });
}

function initAdminModals(): void {
  initApproveModals();
  initRejectModals();
}

// Exponer al scope global para botones con onclick en el HTML
window.openModal = openModal;
window.closeModal = closeModal;

// Inicializar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", initAdminModals);