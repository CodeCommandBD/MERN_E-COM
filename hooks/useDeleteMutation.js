import { showToast } from "@/lib/showToast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

const useDeleteMutation = (querykey, deleteEndpoint, onDeleteSuccess) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async({ids, deleteType}) => {
        const {data: response} = await axios({
            url: deleteEndpoint,
            method: deleteType === 'PD' ? 'DELETE' : 'PUT',
            data: {ids, deleteType}
        })
        if(!response.success){
            throw new Error(response.message)
        }
        return response
    },
    onSuccess: (data) => {
        showToast('success', data.message || 'Operation completed successfully')
        queryClient.invalidateQueries([querykey])
        // Call the custom onDeleteSuccess callback if provided
        if (onDeleteSuccess && typeof onDeleteSuccess === 'function') {
          onDeleteSuccess(data)
        }
    },
    onError: (error) => {
        showToast('error', error.message)
    }
  });
};

export default useDeleteMutation