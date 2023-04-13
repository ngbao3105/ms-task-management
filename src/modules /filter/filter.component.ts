import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';
import { IFilterChange, IFilterMenuOption } from 'src/interface/filter.interface';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterComponent {
  public isShowMenu: false;
  @Input() icon: string = 'filter';
  @Input() menuOptions: IFilterMenuOption[];
  @Output() filterClicked = new EventEmitter<IFilterChange>()


  onOptionChanged(event: MatCheckboxChange, option: IFilterMenuOption) {
    this.filterClicked?.emit({ checked: event?.checked, option: option })
  }
}
