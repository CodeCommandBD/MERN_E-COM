import { toast } from "react-toastify";
import { Bounce } from "react-toastify";

export const showToast = ( type, message) => {
  let option = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  };

  switch(type){
    case 'info':
        toast.info(message, option)
        break
    case 'success':
        toast.success(message, option)
        break
    case 'warning':
        toast.warning(message, option)
        break
    case 'error':
        toast.error(message, option)
        break
    default:
        toast(message, option)
        break
  }
};
