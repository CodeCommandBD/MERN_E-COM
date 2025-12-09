import { showToast } from "@/lib/showToast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

const useDeleteMutation = (
  querykey,
  deleteEndpoint,
  onDeleteSuccess,
  options = {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: async ({ ids, deleteType }) => {
      const { data: response } = await axios({
        url: deleteEndpoint,
        method: deleteType === "PD" ? "DELETE" : "PUT",
        data: { ids, deleteType },
      });
      if (!response.success) {
        throw new Error(response.message);
      }
      return response;
    },
    onSuccess: async (data) => {
      showToast("success", data.message || "Operation completed successfully");

      // Invalidate all queries that start with the querykey
      // This will match queries like ["support-data", {...}]
      await queryClient.invalidateQueries({
        queryKey: [querykey],
        exact: false, // Match all queries that start with this key
        refetchType: "active",
      });

      // Call the custom onDeleteSuccess callback if provided
      if (onDeleteSuccess && typeof onDeleteSuccess === "function") {
        onDeleteSuccess(data);
      }
    },
    onError: (error) => {
      showToast("error", error.message);
    },
  });
};

export default useDeleteMutation;
