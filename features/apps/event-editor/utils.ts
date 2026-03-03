// @ts-ignore
import EXIF from 'exif-js';

// Helper to convert EXIF DMS to Decimal
export const convertDMSToDD = (dms: number[], ref: string) => {
    let dd = dms[0] + dms[1] / 60 + dms[2] / 3600;
    if (ref === "S" || ref === "W") {
        dd = dd * -1;
    }
    return dd;
};

export const extractGPS = (file: File): Promise<{ lat: number, lng: number } | undefined> => {
    return new Promise((resolve, reject) => {
        try {
            EXIF.getData(file as any, function(this: any) {
                try {
                    const latData = EXIF.getTag(this, "GPSLatitude");
                    const latRef = EXIF.getTag(this, "GPSLatitudeRef");
                    const lngData = EXIF.getTag(this, "GPSLongitude");
                    const lngRef = EXIF.getTag(this, "GPSLongitudeRef");
                
                if (latData && latRef && lngData && lngRef) {
                    const lat = convertDMSToDD(latData, latRef);
                    const lng = convertDMSToDD(lngData, lngRef);
                    resolve({ lat, lng });
                } else {
                    resolve(undefined);
                }
            } catch (e) {
                console.error("EXIF Parsing Error", e);
                resolve(undefined);
            }
        });
    } catch (e) {
        console.error("File Reading Error", e);
        reject(e);
    }});
};
