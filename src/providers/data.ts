import { MOCK_SUBJECTS } from "@/constants/mock-data";
import { BaseRecord, DataProvider, GetListParams, GetListResponse } from "@refinedev/core";


export const dataprovider: DataProvider = {
  getList: async <TData extends BaseRecord = BaseRecord>({
    resource
  }: GetListParams): Promise<GetListResponse<TData>> => {
    if (resource !== 'subjects') return {
        data: [] as TData[],
        total: 0
    }

    return {
      data: MOCK_SUBJECTS as unknown as TData[],
      total: MOCK_SUBJECTS.length
    }
  },

  getOne: async () => {throw new Error('Func not present in mock')},
  create: async () => {throw new Error('Func not present in mock')},
  update: async () => {throw new Error('Func not present in mock')},
  deleteOne: async () => {throw new Error('Func not present in mock')},

  getApiUrl: () => ''
}