import { Descuento } from "./descuento";
import { Producto } from "./producto";

export class Carro {
    carrito: Producto[] = [];
    descuentos: Descuento[] = [];
    

    public Carro() {
    };

    getTotalCarro(): number {
        let total = 0;
        this.carrito.forEach(p => total = total + p.price)
        return total;
    }

    getTotalByBrand(brand: string): number {
        let total = 0;
        this.carrito.forEach(p => { if (p.brand = brand) total = total + p.price })
        return total;
    }
}