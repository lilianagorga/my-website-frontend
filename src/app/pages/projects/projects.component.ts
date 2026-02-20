import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PORTFOLIO_PROJECTS } from '../../data/portfolio.data';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent {
  projects = PORTFOLIO_PROJECTS;

  getSafeImageUrl(url: string | undefined | null): string {
    if (url && (url.startsWith('/') || url.startsWith('https://'))) {
      return url;
    }
    return '/projects/placeholder.svg';
  }
}
