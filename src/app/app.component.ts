import { AfterViewInit, Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { SharedState } from './shared/store/shared.state'
import { checkIsOnline } from './shared/store/shared.actions'
import { MDCList } from '@material/list'
import { MDCDrawer } from '@material/drawer/component'
import { MDCTopAppBar } from '@material/top-app-bar/component'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  // public drawer: MDCDrawer

  constructor(private store: Store<SharedState>) {
    this.store.dispatch(checkIsOnline())
  }

  ngAfterViewInit(): void {
    // const list = MDCList.attachTo(document.querySelector('.mdc-list'))
    // list.wrapFocus = true

    // this.drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'))
    // this.drawer.open = false
    // this.drawer.list.wrapFocus = true


    const topAppBarElement = document.querySelector('.mdc-top-app-bar')
    const listEl = document.querySelector('.mdc-drawer .mdc-list')
    const drawerElement = document.querySelector('.mdc-drawer')
    const mainContentEl = document.querySelector('.main-content')

// Initialize either modal or permanent drawer

    const initModalDrawer = () => {
      drawerElement.classList.add('mdc-drawer--modal')
      const drawer = MDCDrawer.attachTo(drawerElement)
      drawer.open = false

      const topAppBar = MDCTopAppBar.attachTo(topAppBarElement)
      topAppBar.setScrollTarget(mainContentEl)
      topAppBar.listen('MDCTopAppBar:nav', () => {
        drawer.open = !drawer.open
      })

      listEl.addEventListener('click', (event) => {
        drawer.open = false
      })

      return drawer
    }

    const initPermanentDrawer = () => {
      drawerElement.classList.remove('mdc-drawer--modal')
      const list = new MDCList(listEl)
      list.wrapFocus = true
      return list
    }

    let drawer = window.matchMedia('(max-width: 900px)').matches ?
      initModalDrawer() : initPermanentDrawer()

// Toggle between permanent drawer and modal drawer at breakpoint 900px

    const resizeHandler = () => {
      if (window.matchMedia('(max-width: 900px)').matches && drawer instanceof MDCList) {
        drawer.destroy()
        drawer = initModalDrawer()
      } else if (window.matchMedia('(min-width: 900px)').matches && drawer instanceof MDCDrawer) {
        drawer.destroy()
        drawer = initPermanentDrawer()
      }
    }
    window.addEventListener('resize', resizeHandler)

  }
}
