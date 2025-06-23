import Swal from 'sweetalert2';

export const showSuccess = (msg = 'Operación exitosa') =>
  Swal.fire({ icon: 'success', title: msg, showConfirmButton: false, timer: 1500 });

export const showError = (msg = 'Ocurrió un error') =>
  Swal.fire({ icon: 'error', title: 'Error', text: msg });

export const showConfirm = async (
    title = '¿Seguro que quieres eliminar esto?',
    text = 'Esta acción no se puede deshacer.',
    confirmText = 'ELIMINAR',
    cancelText = 'Cancelar'
) => {
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: confirmText,
        cancelButtonText: cancelText,
        reverseButtons: true,
    });

    return result.isConfirmed;
};