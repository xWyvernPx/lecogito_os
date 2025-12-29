import { PageResponseDto, PaginationParams } from "@/types";

interface GetParams {
	paging?: PaginationState;
	sort?: SortingState;
	keyword?: string;
	group?: string;
	provider?: string;
	createdDate?: {
		from?: Date;
		to?: Date
	};
	filter : ProjectFilter
}

export const ProjectApi = {
	getAll: async (params: PaginationParams): Promise<PageResponseDto<any>> => {
		const response = axiosClient.get<ListResponseObject<any>>(BlogApiEndpoints.Project, {
			params: {
				"pageIndex": params.paging.pageIndex ?? 0,
				"pageSize": params.paging.pageSize ?? 10,
				"key": params.keyword,
				...(params?.sort ? {"sort": params?.sort?.map(s => s.id+":"+ (s.desc?"desc":"asc"))} : {}),
				...(params?.filter?.type ? {"type": params?.filter?.type} : {})
			},
		});
		return (await response).data;
	},
	getDetail: async (productId: number | string): Promise<any> => {
		const response = axiosClient.get<ResponseObject<any>>(BlogApiEndpoints.Project + "/" + productId, {});
		return (await response).data;
	},
	create: async (data): Promise<any> => {
		// throw new Error("Implement")
		const response = await axiosClient.post<ResponseObject<boolean>>(BlogApiEndpoints.Project, data);
		return response.data;
	},
	update: async (dto: any): Promise<any> => {
		try {
			const response = await axiosClient.put<ResponseObject<boolean>>(BlogApiEndpoints.Project + "/" + dto.id, dto);
			return response.data;
		} catch {
			return false;
		}
	},
}