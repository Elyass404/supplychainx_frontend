import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common'; // Needed for currency pipes etc
import { RouterLink } from '@angular/router';   // Needed for navigation buttons
import { RawMaterialService } from '../../../api/raw-material.service';
import { RawMaterial } from '../../../api/raw-material-model';

// DECORATOR: @Component
// This tells Angular: "This class controls a part of the screen."
@Component({
  selector: 'app-raw-material-list',
  standalone: true,
  imports: [CommonModule, RouterLink], 
  templateUrl: './raw-material-list.html',
  styleUrls: [] 
})
export class RawMaterialList implements OnInit {

  // DEPENDENCY INJECTION (Modern Style)
  // Instead of the constructor, we use 'inject()'. It's cleaner.
  private materialService = inject(RawMaterialService);

  // --- STATE (The Data) ---

  // 1. The raw list from the database
  materials = signal<RawMaterial[]>([]);
  
  // 2. Loading state (good UX)
  isLoading = signal<boolean>(true);

  // 3. The Filter Switch (True = Show only critical, False = Show all)
  showCriticalOnly = signal<boolean>(false);

  // COMPUTED SIGNAL
  // This is magic. It automatically recalculates whenever 'materials' OR 'showCriticalOnly' changes.
  // We don't need to manually filter inside a function. Angular does it for us.
  filteredMaterials = computed(() => {
    const all = this.materials();
    const isFilterOn = this.showCriticalOnly();

    if (isFilterOn) {
      // Return only items where stock < minStock
      return all.filter(m => m.stock < m.stockMin);
    }
    return all;
  });

  // --- LIFECYCLE (When the page loads) ---
  
  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    
    // Subscribe to the Service
    this.materialService.getAll().subscribe({
      next: (data) => {
        console.log('📦 Raw Materials loaded:', data);
        this.materials.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error loading materials', err);
        this.isLoading.set(false);
      }
    });
  }

  // Toggle the filter switch
  toggleFilter() {
    // .update() takes the current value and flips it
    this.showCriticalOnly.update(value => !value);
  }

  // DELETE FUNCTION
  onDelete(material: RawMaterial) {
    // Confirm with user
    const confirmed = window.confirm(`Are you sure you want to delete ${material.name}?`);
    
    if (confirmed) {
      // Call Service
      this.materialService.delete(material.id).subscribe({
        next: () => {
          console.log('Deleted successfully');
          // Remove item from the signal immediately (Updates UI instantly)
          this.materials.update(current => current.filter(m => m.id !== material.id));
        },
        error: (err) => {
          console.error('Delete failed', err);
          alert('Could not delete material. It might be used in production.');
        }
      });
    }
  }
}