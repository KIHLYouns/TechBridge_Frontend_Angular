import { Component, OnInit } from '@angular/core';
import { User } from '../../../../shared/database.model';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-user-list',
  standalone: false,
  templateUrl: './admin-user-list.component.html',
  styleUrls: ['./admin-user-list.component.scss']
})
export class AdminUserListComponent implements OnInit {
  users: User[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  searchQuery: string = '';

  constructor(private adminService: AdminService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading = true;
    this.errorMessage = null;
    
    this.adminService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = 'Failed to load users.';
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  toggleSuspend(user: User): void {
    if (!user.id) return;
    
    const originalSuspendedAt = user.is_suspend;
    user.is_suspend = !user.is_suspend;

    this.adminService.toggleSuspendUser(user.id).subscribe({
      next: (response) => {
        const index = this.users.findIndex(u => u.id === response.user.id);
        if (index > -1) {
          this.users[index] = response.user;
        }
      },
      error: (err) => {
        user.is_suspend = originalSuspendedAt;
        this.errorMessage = err.error?.message || 'Failed to update user suspension status.';
        console.error(err);
      }
    });
  }

  get filteredUsers(): User[] {
    if (!this.searchQuery.trim()) {
      return this.users;
    }
    
    const query = this.searchQuery.toLowerCase();
    return this.users.filter(user => 
      user.username?.toLowerCase().includes(query) || 
      user.email?.toLowerCase().includes(query)
    );
  }
}
