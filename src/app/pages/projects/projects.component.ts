import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '../../models/project.model';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = true;

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
        this.loading = false;
      },
      error: () => {
        this.projects = [];
        this.loading = false;
      }
    });
  }
}
