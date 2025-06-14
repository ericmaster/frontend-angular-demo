import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FinancialProductService, FinancialProduct } from './financial-product.service';
import { ConfirmationModalComponent } from '../shared/confirmation-modal.component';

@Component({
  selector: 'app-financial-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ConfirmationModalComponent],
  templateUrl: './financial-products.component.html',
  styleUrls: ['./financial-products.component.css']
})
export class FinancialProductsComponent implements OnInit {
  products: FinancialProduct[] = [];
  filteredProducts: FinancialProduct[] = [];
  searchTerm: string = '';
  loading: boolean = false;
  error: string | null = null;
  openDropdownId: string | null = null; // ID del dropdown abierto actualmente
  
  // Modal de confirmación
  showDeleteModal = false;
  productToDelete: FinancialProduct | null = null;
  deleteLoading = false;
  
  // Paginación
  pageSize: number = 5;
  pageSizeOptions: number[] = [5, 10, 20];
  
  constructor(private productService: FinancialProductService) {}
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.loading = true;
    this.error = null;
    
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = [...data];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading products:', err);
        this.error = 'No se pudieron cargar los productos. Por favor, intente nuevamente.';
        this.loading = false;
      }
    });
  }
  
  search(event: Event): void {
    const term = (event.target as HTMLInputElement).value.toLowerCase();
    this.searchTerm = term;
    
    if (term.trim() === '') {
      this.filteredProducts = [...this.products];
    } else {
      this.filteredProducts = this.products.filter(product => 
        product.name.toLowerCase().includes(term) || 
        product.description.toLowerCase().includes(term) ||
        product.id.toLowerCase().includes(term)
      );
    }
  }
  
  onPageSizeChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.pageSize = Number(select.value);
  }
  
  isValidLogoUrl(url: string): boolean {
    if (!url) return false;
    
    // Verificar si es una URL de imagen válida o un path relativo
    return url.match(/\.(jpeg|jpg|gif|png|svg|webp)$/i) !== null || 
           url.startsWith('http') || 
           url.startsWith('/assets/');
  }
  
  getInitials(name: string): string {
    if (!name) return 'NA';
    const words = name.split(' ').filter(word => word.length > 0);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0].substring(0, 2).toUpperCase();
  }
  
  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // Método para manejar el menú desplegable
  toggleDropdown(id: string): void {
    if (this.openDropdownId === id) {
      this.openDropdownId = null; // Cerrar el dropdown si ya está abierto
    } else {
      this.openDropdownId = id; // Abrir el dropdown seleccionado
    }
  }
  
  // Método para iniciar el proceso de eliminación: muestra el modal de confirmación
  deleteProduct(id: string): void {
    const product = this.products.find(p => p.id === id);
    if (product) {
      this.productToDelete = product;
      this.showDeleteModal = true;
    }
    this.openDropdownId = null; // Cerrar el dropdown
  }
  
  // Método para confirmar la eliminación del producto
  confirmDelete(): void {
    if (!this.productToDelete) return;
    
    this.deleteLoading = true;
    this.productService.deleteProduct(this.productToDelete.id).subscribe({
      next: () => {
        // Actualizar la lista de productos después de eliminar
        this.loadProducts();
        this.closeDeleteModal();
        this.deleteLoading = false;
      },
      error: (err) => {
        console.error('Error al eliminar el producto:', err);
        this.error = 'No se pudo eliminar el producto. Por favor, intente nuevamente.';
        this.closeDeleteModal();
        this.deleteLoading = false;
      }
    });
  }
  
  // Método para cerrar el modal de confirmación
  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.productToDelete = null;
  }
  
  // Cerrar el dropdown al hacer clic fuera
  closeDropdown(): void {
    this.openDropdownId = null;
  }
}
