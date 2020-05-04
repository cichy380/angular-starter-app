import { AfterViewInit, Component } from '@angular/core'
import { Store } from '@ngrx/store'
import { SharedState } from './shared/store/shared.state'
import { checkIsOnline } from './shared/store/shared.actions'
import { MDCList } from '@material/list'
import { MDCDrawer } from '@material/drawer/component'
import { MDCTopAppBar } from '@material/top-app-bar/component'
import { takeUntil } from 'rxjs/operators'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private drawer: MDCDrawer | MDCList

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

    const topAppBar = MDCTopAppBar.attachTo(topAppBarElement)
    topAppBar.setScrollTarget(mainContentEl)

    const initModalDrawer = () => {
      drawerElement.classList.add('mdc-drawer--modal')
      const drawer = MDCDrawer.attachTo(drawerElement)
      drawer.open = false

      // drawer.listen('MDCDrawer:closed', () => console.log('MDCDrawer:closed'))

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

    this.drawer = window.matchMedia('(max-width: 900px)').matches ?
      initModalDrawer() : initPermanentDrawer()

// Toggle between permanent drawer and modal drawer at breakpoint 900px

    const resizeHandler = () => {
      if (window.matchMedia('(max-width: 900px)').matches && this.drawer instanceof MDCList) {
        console.log('small')
        this.drawer.destroy()
        this.drawer = initModalDrawer() // return MDCDrawer
      } else if (window.matchMedia('(min-width: 901px)').matches && this.drawer instanceof MDCDrawer) {
        console.log('big')
        if (this.drawer.open) {
          console.log('this.drawer.listen...')
          this.drawer.listen('MDCDrawer:closed', drawerClosedHandler)
          this.drawer.open = false
        } else {
          this.drawer.destroy()
          this.drawer = initPermanentDrawer() // return MDCList
        }
        // setTimeout(() => {
        //   this.drawer.destroy()
        //   this.drawer = initPermanentDrawer() // return MDCList
        // }, 1000)

      }
    }
    window.addEventListener('resize', resizeHandler)

    const drawerClosedHandler = () => {
      console.log('MDCDrawer:closed')
      if (window.matchMedia('(min-width: 901px)').matches) {
        console.log('this.drawer.destroy()')
        this.drawer.unlisten('MDCDrawer:closed', drawerClosedHandler)
        this.drawer.destroy()
        this.drawer = initPermanentDrawer() // return MDCList
      }
    }
  }

  public openDrawer() {
    if (this.drawer instanceof MDCDrawer) {
      (this.drawer as MDCDrawer).open = true
      // const fun = () => console.log('MDCDrawer:closed');
      // (this.drawer as MDCDrawer).unlisten('MDCDrawer:closed', fun);
      // (this.drawer as MDCDrawer).listen('MDCDrawer:closed', fun)
    }
  }
}
