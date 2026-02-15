import { Component } from '@angular/core';
import { SOCIAL_LINKS } from '../../data/portfolio.data';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();
  socialLinks = SOCIAL_LINKS;
}
