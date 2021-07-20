import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Carro } from 'src/app/model/carro';
import { Producto } from 'src/app/model/producto';
import { Descuento } from 'src/app/model/descuento';

@Component({
  selector: 'app-carro-compra',
  templateUrl: './carro-compra.component.html',
  styleUrls: ['./carro-compra.component.css']
})
export class CarroCompraComponent implements OnInit {

  displayedColumns: string[] = ['Producto', 'Detalle', 'Monto a pagar'];
  ofertasList: string[] = [];
  descuentoDado: string[] = [];
  totalDiscount: number = 0;
  descuentosMap: Map<string, Descuento> = new Map<string, Descuento>();

  dataSource: Producto[] = [];

  carro: Carro = new Carro;

  constructor(
    public dialogRef: MatDialogRef<CarroCompraComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    if (data.carro) {
      this.dataSource = data.carro.carrito;
      this.carro = data.carro;
    }
  }

  ngOnInit(): void {
    this.getDiscountTotal();
  }

  getDiscountTotal() {
    this.carro.descuentos.forEach(element => {
      this.descuentosMap.set(element.brand, element);
    });;
    this.totalDiscount = 0;
    let brandsIn: Map<string, number> = new Map();
    let brandsInArray: string[] = [];
    this.carro.carrito.forEach(p => {
      if (!brandsIn.has(p.brand)) {
        brandsIn.set(p.brand, p.price);
        brandsInArray.push(p.brand)
      }
      else {
        let toCalculate = brandsIn.get(p.brand);
        let aux = 0;
        if (toCalculate)
          aux = toCalculate + p.price;
        brandsIn.delete(p.brand);
        brandsIn.set(p.brand, aux);
      }
    });
    brandsInArray.forEach(b => {
      let totalAcumuladoMarca = brandsIn.get(b);
      let totalNecesarioMarca = this.descuentosMap.get(b)?.threshold;
      let descuento = this.descuentosMap.get(b)?.discount;
      if (totalAcumuladoMarca && totalNecesarioMarca && descuento) {
        if (totalNecesarioMarca <= totalAcumuladoMarca) {
          this.totalDiscount = this.totalDiscount + descuento;
          this.descuentoDado.push("Se aplicó un descuento de $" + descuento + " por haber comprado $" +
            totalAcumuladoMarca + " de productos " + b);
        }
        else
          this.ofertasList.push("Agrega $" + (totalNecesarioMarca - totalAcumuladoMarca) +
            " más en productos " + b + " y aprovecha un  descuento total de $" + descuento +
            " en tu compra!");
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
