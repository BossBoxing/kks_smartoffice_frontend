import { HttpParameterCodec } from "@angular/common/http";


export class Encoder implements HttpParameterCodec{ 
    encodeKey(key: string): string { return encodeURIComponent(key); }

    encodeValue(value: string): string { return this.serializeValue(value); }
  
    decodeKey(key: string): string { return decodeURIComponent(key); }
  
    decodeValue(value: string) { return decodeURIComponent(value); }

    serializeValue(value) {
        let type = typeof(value);
        if (value && type === "object") {
            if(value instanceof Date) return value.toJSON();
            else return JSON.stringify(value);
        }
        if (value === null || value === undefined) {
          return "";
        }
        return encodeURIComponent(value);
      }
}