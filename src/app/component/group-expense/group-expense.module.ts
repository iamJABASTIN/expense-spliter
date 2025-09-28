import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GroupExpenseComponent } from './group-expense.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [GroupExpenseComponent],
  imports: [CommonModule, FormsModule, HttpClientModule],
  exports: [GroupExpenseComponent]
})
export class GroupExpenseModule {}
