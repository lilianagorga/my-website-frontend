import { Component, OnInit } from '@angular/core';
import { Project } from '../../models/project.model';
import { PORTFOLIO_PROJECTS } from '../../data/portfolio.data';

@Component({
  selector: 'app-projects',
  standalone: true,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss'
})
export class ProjectsComponent implements OnInit {
  projects: Project[] = [];
  loading = false;

  constructor() {}

  ngOnInit(): void {
    this.projects = PORTFOLIO_PROJECTS;
  }
}
