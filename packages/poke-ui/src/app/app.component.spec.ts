import {
  TestBed,
  async,
} from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'

describe('AppComponent', () => {
  beforeEach(async(() => {
    return TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
      ],
      declarations: [
        AppComponent,
      ],
    }).compileComponents()
  }))

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    return expect(app).toBeTruthy()
  })

  it('should have as title \'poke-ui\'', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    return expect(app.title).toEqual('poke-ui')
  })

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent)
    fixture.detectChanges()
    const compiled = fixture.nativeElement // eslint-disable-line @typescript-eslint/no-unsafe-assignment
    return expect(compiled.querySelector('.content span').textContent) // eslint-disable-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      .toContain('poke-ui app is running!')
  })
})
