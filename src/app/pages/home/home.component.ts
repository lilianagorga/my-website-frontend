import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PORTFOLIO_PROJECTS } from '../../data/portfolio.data';

@Component({
  selector: 'app-home',
  imports: [RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent {
  featuredProjects = PORTFOLIO_PROJECTS.slice(0, 3);

  getSafeImageUrl(url: string | undefined | null): string {
    if (url && (url.startsWith('/') || url.startsWith('https://'))) {
      return url;
    }
    return '/projects/placeholder.svg';
  }
}
