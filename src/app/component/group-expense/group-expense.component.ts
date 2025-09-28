import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface CustomSplit {
  user: string;
  amount: number;
}

@Component({
  selector: 'app-group-expense',
  templateUrl: './group-expense.component.html',
  styleUrls: ['./group-expense.component.scss']
})
export class GroupExpenseComponent implements OnInit {
  groupName = '';
  memberEmails = '';
  groups: any[] = [];
  selectedGroup: any = null;
  expenseDesc = '';
  expenseAmount: number = 0;
  paidByEmail = '';
  splitType = 'equal';
  customSplits = '';
  groupExpenses: any[] = [];
  balances: any = {};
  apiUrl = 'http://localhost:3000/v1/api';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Optionally, fetch groups for the logged-in user here
  }

  createGroup() {
    const members = this.memberEmails.split(',').map(e => e.trim()).filter(e => e);
    const groupNames = this.groupName.split(',').map(n => n.trim()).filter(n => n);
    groupNames.forEach(name => {
      this.http.post(`${this.apiUrl}/group/create`, {
        name,
        members,
        createdBy: members[0] || '' // use first member as creator for simplicity
      }).subscribe((group: any) => {
        this.groups.push(group);
        // Only clear fields after last group
        if (name === groupNames[groupNames.length - 1]) {
          this.groupName = '';
          this.memberEmails = '';
        }
      });
    });
  }

  selectGroup(group: any) {
    this.selectedGroup = group;
    this.fetchGroupExpenses();
    this.fetchBalances();
  }

  addExpense() {
    let splitAmong = this.selectedGroup.members;
    let customSplitsArr: CustomSplit[] = [];
    if (this.splitType === 'custom') {
      customSplitsArr = this.customSplits.split(',').map(cs => {
        const [email, amount] = cs.split(':');
        return { user: email.trim(), amount: Number(amount) };
      });
    }
    this.http.post(`${this.apiUrl}/group-expense/add`, {
      group: this.selectedGroup._id,
      description: this.expenseDesc,
      amount: this.expenseAmount,
      paidBy: this.paidByEmail, // Should be user ID, needs backend support
      splitAmong,
      splitType: this.splitType,
      customSplits: customSplitsArr
    }).subscribe(() => {
      this.expenseDesc = '';
      this.expenseAmount = 0;
      this.paidByEmail = '';
      this.customSplits = '';
      this.fetchGroupExpenses();
      this.fetchBalances();
    });
  }

  fetchGroupExpenses() {
    this.http.get(`${this.apiUrl}/group-expense/group/${this.selectedGroup._id}`)
      .subscribe((expenses: any) => {
        this.groupExpenses = expenses;
      });
  }

  fetchBalances() {
    this.http.get(`${this.apiUrl}/group-expense/group/${this.selectedGroup._id}/balances`)
      .subscribe((balances: any) => {
        this.balances = balances;
      });
  }
}
