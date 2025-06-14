import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  FinancialProductService,
  FinancialProduct,
} from './financial-product.service';
import { catchError, finalize, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-financial-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './financial-product-form.component.html',
  styleUrls: ['./financial-product-form.component.css'],
})
export class FinancialProductFormComponent implements OnInit {
  productForm: FormGroup;
  today: string = new Date().toISOString().split('T')[0];
  idExists = false;
  submitted = false;
  loading = false;
  error: string | null = null;
  isEditMode = false;
  productId: string | null = null;
  pageTitle = 'Formulario de Registro';

  constructor(
    private fb: FormBuilder,
    private productService: FinancialProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.productForm = this.fb.group({
      id: [
        { value: '', disabled: false },
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
        ],
      ],
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
        ],
      ],
      description: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      logo: ['', Validators.required],
      releaseDate: ['', Validators.required],
      reviewDate: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Verificar si estamos en modo edición
    this.route.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      this.isEditMode = !!this.productId;

      if (this.isEditMode) {
        this.pageTitle = 'Editar Producto';
        this.loadProduct(this.productId!);

        // Desactivar el campo ID en modo edición
        this.productForm.get('id')?.disable();
      }
    });
  }

  // Cargar los datos del producto a editar
  loadProduct(id: string): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        // Formato de fechas a YYYY-MM-DD para el input date
        const releaseDateFormatted = product.date_release.substring(0, 10);
        const revisionDateFormatted = product.date_revision.substring(0, 10);

        this.productForm.patchValue({
          id: product.id,
          name: product.name,
          description: product.description,
          logo: product.logo,
          releaseDate: releaseDateFormatted,
          reviewDate: revisionDateFormatted,
        });

        this.loading = false;
      },
      error: (err) => {
        this.error =
          'No se pudo cargar el producto. Verifique el ID e intente nuevamente.';
        this.loading = false;
        console.error('Error cargando producto:', err);
      },
    });
  }

  // Verificar si el ID ya existe usando la API
  checkIdExists() {
    if (this.isEditMode) return; // No verificar en modo edición

    const id = this.productForm.get('id')?.value;
    if (!id) return;

    this.productService
      .verifyId(id)
      .pipe(
        catchError((err) => {
          console.error('Error verificando ID:', err);
          return of({ isValid: true });
        })
      )
      .subscribe((response) => {
        console.log('Respuesta de verificación de ID:', response);
        this.idExists = response?.isValid === false;
      });
  }

  onReset() {
    if (this.isEditMode && this.productId) {
      // En modo edición, recargar los datos originales
      this.loadProduct(this.productId);
    } else {
      // En modo creación, limpiar el formulario
      this.productForm.reset();
    }
    this.submitted = false;
    this.idExists = false;
    this.error = null;
  }

  onSubmit() {
    this.submitted = true;
    this.error = null;

    if (this.productForm.invalid || (!this.isEditMode && this.idExists))
      return;

    // Preparar objeto para enviar a la API
    const formValues = this.productForm.getRawValue(); // Obtiene valores incluyendo los campos deshabilitados
    const product: FinancialProduct = {
      id: formValues.id,
      name: formValues.name,
      description: formValues.description,
      logo: formValues.logo,
      date_release: this.formatDate(formValues.releaseDate),
      date_revision: this.formatDate(formValues.reviewDate),
    };

    this.loading = true;

    // Decidir si crear o actualizar
    const request = this.isEditMode
      ? this.productService.updateProduct(product)
      : this.productService.createProduct(product);

    request
      .pipe(
        catchError((error) => {
          this.error =
            `Error al ${this.isEditMode ? 'actualizar' : 'crear'} el producto: ` +
            (error.message || 'Intente nuevamente');
          return of(null);
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe((result) => {
        if (result) {
          alert(
            `Producto financiero ${this.isEditMode ? 'actualizado' : 'creado'} exitosamente`
          );
          this.router.navigate(['/']);
        }
      });
  }

  // Función auxiliar para formatear la fecha en el formato esperado por la API
  private formatDate(dateString: string): string {
    // Asegurar que esté en formato YYYY-MM-DD
    return dateString;
  }
}
