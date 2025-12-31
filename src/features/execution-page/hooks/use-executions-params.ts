import { useQueryStates } from "nuqs";
import { executionsParams } from "../server/params";

export const useExecutionsParams = () => {
  return useQueryStates(executionsParams);
};
