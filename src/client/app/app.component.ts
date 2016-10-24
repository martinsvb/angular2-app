import { Component } from '@angular/core';
import { NavbarComponent } from './shared/index';
import { CacheComponent } from './shared/cache/cache.component';

/**
 * This class represents the main application component. Within the @Routes annotation is the configuration of the
 * applications routes, configuring the paths for the lazy loaded components (HomeComponent, AboutComponent).
 */
@Component({
  moduleId: module.id,
  selector: 'sd-app',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor (
    private _cache: CacheComponent
  ) {
    if (!_cache.getItem('user')) {
      _cache.setItem('user', {
        name: 'guest',
        email: 'guest@guest.cz',
        role: 'guest',
        modules: {}
      });
    }
  }
}
