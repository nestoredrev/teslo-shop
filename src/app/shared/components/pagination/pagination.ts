import { Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'pagination',
  imports: [RouterLink],
  templateUrl: './pagination.html',
})
export class PaginationComponent {
  public readonly pages = input<number>(0);
  public readonly currentPage = input<number>(1);

  // linkedSignal to initiate a signal that stays in sync with the input currentPage
  public activePage = linkedSignal(this.currentPage);


  getPageList = computed( () => {
    return Array.from({ length: this.pages() }, (_, i) => i + 1);
  })
}
