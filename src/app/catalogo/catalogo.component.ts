import { Component, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ApiService } from '../service/api.service';
import { Producto } from '../model/producto';
import { Carro } from '../model/carro';
import { MatDialog } from '@angular/material/dialog';
import { CarroCompraComponent } from '../dialog/carro-compra/carro-compra.component';
import { Descuento } from '../model/descuento';

export interface Task {
  name: string;
  completed: boolean;
  color: ThemePalette;
  subtasks?: Task[];
}

/**
 * @title página inicial. Catalogo de productos por marca.
 */
@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})


export class CatalogoComponent implements OnInit {

  task: Task = {
    name: 'Todas las marcas',
    completed: false,
    color: 'primary',
    subtasks: []
  };

  carro: Carro = new Carro();
  allComplete: boolean = false;
  products: Producto[] = [];
  productsFiltered: Producto[] = [];
  constructor(
    private apiService: ApiService,
    public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.apiService.getProductosAll().subscribe((response: any) => {
      this.products = response;
      this.productsFiltered = response;
    });
    this.apiService.getMarcasAll().subscribe((response: string[]) => {
      this.task.subtasks = [];
      response.forEach(element => {
        this.task.subtasks?.push({ name: element, completed: true, color: 'primary' })
      });;
    });
    this.apiService.getDiscountAll().subscribe((response: Descuento[]) => {
      this.carro.descuentos = response;
    });
  }

  openCarro() {
    const dialogRef = this.dialog.open(CarroCompraComponent, {
      width: '80em',
      maxHeight:'90vh', 
      data: {carro: this.carro}
    });

    dialogRef.afterClosed().subscribe(
    );
  }

  addToCarro(prod: Producto) {
    this.carro.carrito.push(prod);
  }

  hasDiscount(prod: Producto): boolean {
    if(!prod.discount) return false;
    return ((prod.discount.threshold - prod.price) < 0);
  }

  someComplete(): boolean {
    if (this.task.subtasks == null) {
      return false;
    }
    return this.task.subtasks.filter(t => t.completed).length > 0 && !this.allComplete;
    this.filterCatalogo();
  }

  updateAllComplete() {
    this.allComplete = this.task.subtasks != null && this.task.subtasks.every(t => t.completed);
    this.filterCatalogo();
  }

  setAll(completed: boolean) {
    this.allComplete = completed;
    if (this.task.subtasks == null) {
      return;
    }
    this.task.subtasks.forEach(t => t.completed = completed);
    this.filterCatalogo();
  }

  filterCatalogo() {
    this.productsFiltered = this.products;
    this.task.subtasks?.forEach(m => {
      if (!m.completed) {
        this.productsFiltered = this.productsFiltered.filter(product => product.brand !== m.name)
      }
    }
    );
  }
}

