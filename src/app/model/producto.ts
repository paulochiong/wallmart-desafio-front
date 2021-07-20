import { Descuento } from "./descuento";
export interface Producto{
    id: number,
    brand: string,
    description: string,
    image: string,
    price: number,
    discount: Descuento;
}