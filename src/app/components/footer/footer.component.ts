import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SOCIAL_LINKS } from '../../data/portfolio.data';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  socialLinks = SOCIAL_LINKS;
}
