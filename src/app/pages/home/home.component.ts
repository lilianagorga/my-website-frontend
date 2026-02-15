import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../../models/project.model';
import { PORTFOLIO_PROJECTS } from '../../data/portfolio.data';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  featuredProjects: Project[] = [];

  constructor() {}

  ngOnInit(): void {
    this.featuredProjects = PORTFOLIO_PROJECTS.slice(0, 3);
  }
}
