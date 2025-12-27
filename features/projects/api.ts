
import { ApiListResponseProjectDto, ApiProjectDetailResponseDto, SearchRequest, ProjectType } from './types';
import { Language } from '../../types';

// In a real app, you would import axios and call the endpoint
// import axios from 'axios'; 
// const API_BASE_URL = 'https://cogito.wyvernp.id.vn/api/v1';

// Extend the Request to include language
interface SearchRequestWithLang extends SearchRequest {
    language?: Language;
}

export const fetchProjects = async (request: SearchRequestWithLang = { pageIndex: 0, pageSize: 10, language: 'en' }): Promise<ApiListResponseProjectDto> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  const isVi = request.language === 'vi';

  // Returning the specific mock data provided, BUT localized based on request
  return {
    "pagination": {
        "pageIndex": 0,
        "pageSize": 10,
        "sort": null,
        "totalRows": 2,
        "keyword": ""
    },
    "rows": [
        {
            "id": 1,
            "name": isVi ? "Hệ thống kho dược phẩm - Nhà thuốc Út Nhân" : "Pharmacy Inventory System - Ut Nhan Phamarcy",
            "description": isVi 
                ? "Hệ thống quản lý kho cho chuỗi nhà thuốc Út Nhân, quản lý nhập khẩu từ nhà phân phối và cung cấp cho các cửa hàng bán lẻ." 
                : "This is an system built for chains of pharmacy (Ut Nhan) system to manage their inventory which imports from distributors and supplies for their sale stores.",
            "detail": "[{\"id\":\"7216f16e-9315-4437-a65e-3a363cdff538\",\"type\":\"paragraph\", ... }]", 
            "thumbnailUrl": "https://ik.imagekit.io/flamefoxeswyvernp/lecogito/project/thumbnail/national-cancer-institute-fTQHPb6r4wQ-unsplash_9pq1e9Ufh.jpg",
            "published": false,
            "sourceUrl": "",
            "demoUrl": "https://pi-admin-client.vercel.app",
            "type": "OFFICIAL",
            "createdDate": null,
            "lastModifiedDate": "2024-05-02T08:10:43.46888"
        },
        {
            "id": 2,
            "name": isVi ? "Bảng tính Han 📝" : "Han Spreadsheet 📝",
            "description": isVi 
                ? "Một trình chỉnh sửa bảng tính dựa trên web được sử dụng trong hệ sinh thái nội bộ Hanbiro." 
                : "A web-based spreadsheet editor used in internal Hanbiro ecosystem for drafting any kind of spreadsheet document such as Approval, Mail, Task,...",
            "detail": "[ ... ]", 
            "thumbnailUrl": "https://ik.imagekit.io/flamefoxeswyvernp/lecogito/project/thumbnail/how-to-automatically-generate-charts-and-reports-in-google-sheets-within-spreadsheet-google_vAej_d-PJ.jpg",
            "published": false,
            "sourceUrl": "",
            "demoUrl": "https://vndev.hanbiro.com/ngw/app/excel",
            "type": "OFFICIAL",
            "createdDate": null,
            "lastModifiedDate": "2024-05-02T08:47:15.35575"
        }
    ],
    "message": "Success",
    "success": true,
    "status": 200
  };
};

export const fetchProjectById = async (id: number): Promise<ApiProjectDetailResponseDto> => {
    // Note: In a real app, we would pass language here too to get the translated 'detail' JSON.
    // For brevity in this mock, returning the static JSON but assuming backend handles language context via headers.
    await new Promise(resolve => setTimeout(resolve, 600));

    const MOCK_DETAIL_DATA: ApiProjectDetailResponseDto = {
        "status": 200,
        "message": "Success",
        "success": true,
        "data": {
            "id": 1,
            "name": "Pharmacy Inventory System - Ut Nhan Phamarcy",
            "description": "This is an system built for chains of pharmacy (Ut Nhan) system to manage their inventory which imports from distributors and supplies for their sale stores.",
            "detail": "[{\"id\":\"7216f16e-9315-4437-a65e-3a363cdff538\",\"type\":\"paragraph\",\"props\":{\"textColor\":\"default\",\"backgroundColor\":\"default\",\"textAlignment\":\"left\"},\"content\":[{\"type\":\"text\",\"text\":\"This is an system built for chains of pharmacy system to manage their inventory which imports from distributors and supplies for their sale stores. This system written mainly in \",\"styles\":{}},{\"type\":\"text\",\"text\":\".NET\",\"styles\":{\"bold\":true}},{\"type\":\"text\",\"text\":\" and deploy automatically using \",\"styles\":{}},{\"type\":\"text\",\"text\":\"Docker/GithubAction\",\"styles\":{\"bold\":true}},{\"type\":\"text\",\"text\":\" Web admin client written in \",\"styles\":{}},{\"type\":\"text\",\"text\":\"React\",\"styles\":{\"bold\":true}},{\"type\":\"text\",\"text\":\" and utilized \",\"styles\":{}},{\"type\":\"text\",\"text\":\"React's ecosystem\",\"styles\":{\"bold\":true}},{\"type\":\"text\",\"text\":\" (Tanstack Query, Tanstack Table, Mantis).\",\"styles\":{}}],\"children\":[]}]",
            "thumbnailUrl": "https://ik.imagekit.io/flamefoxeswyvernp/lecogito/project/thumbnail/national-cancer-institute-fTQHPb6r4wQ-unsplash_9pq1e9Ufh.jpg",
            "published": false,
            "sourceUrl": "",
            "demoUrl": "https://pi-admin-client.vercel.app",
            "type": "OFFICIAL" as ProjectType,
            "createdDate": null,
            "lastModifiedDate": "2024-05-02T08:10:43.46888"
        }
    };
    
    return MOCK_DETAIL_DATA;
};
