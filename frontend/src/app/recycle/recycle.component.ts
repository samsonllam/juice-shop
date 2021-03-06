import { ConfigurationService } from '../Services/configuration.service'
import { UserService } from '../Services/user.service'
import { RecycleService } from '../Services/recycle.service'
import { Component, OnInit } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

library.add(faPaperPlane)
dom.watch()

@Component({
  selector: 'app-recycle',
  templateUrl: './recycle.component.html',
  styleUrls: ['./recycle.component.scss']
})
export class RecycleComponent implements OnInit {

  public requestorControl: FormControl = new FormControl({ value: '', disabled: true }, [])
  public recycleAddressControl: FormControl = new FormControl('',[Validators.required,Validators.minLength(20),Validators.maxLength(180)])
  public recycleQuantityControl: FormControl = new FormControl('',[Validators.required,Validators.min(10),Validators.max(1000)])
  public pickUpDateControl: FormControl = new FormControl()
  public pickup: FormControl = new FormControl(false)
  public topImage: string
  public bottomImage: string
  public recycles: any
  public recycle: any = {}
  public userEmail: any
  public confirmation: any

  constructor (private recycleService: RecycleService, private userService: UserService, private configurationService: ConfigurationService) { }

  ngOnInit () {

    this.configurationService.getApplicationConfiguration().subscribe((config: any) => {
      if (config && config.application && config.application.recyclePage) {
        this.topImage = 'assets/public/images/products/' + config.application.recyclePage.topProductImage
        this.bottomImage = 'assets/public/images/products/' + config.application.recyclePage.bottomProductImage
      }
    },(err) => console.log(err))

    this.initRecycle()
    this.findAll()
  }

  initRecycle () {
    this.userService.whoAmI().subscribe((data) => {
      this.recycle = {}
      this.recycle.UserId = data.id
      this.userEmail = data.email
      this.requestorControl.setValue(this.userEmail)
    },(err) => console.log(err))
  }

  save () {
    this.recycle.address = this.recycleAddressControl.value
    this.recycle.quantity = this.recycleQuantityControl.value
    if (this.pickup.value) {
      this.recycle.isPickUp = this.pickup.value
      this.recycle.date = this.pickUpDateControl.value
    }

    this.recycleService.save(this.recycle).subscribe((savedRecycle: any) => {
      this.confirmation = 'Thank you for using our recycling service. We will ' + (savedRecycle.isPickup ? ('pick up your pomace on ' + savedRecycle.pickupDate) : 'deliver your recycle box asap') + '.'
      this.initRecycle()
      this.resetForm()
    },(err) => console.log(err))
  }

  findAll () {
    this.recycleService.find().subscribe((recycles) => {
      this.recycles = recycles
    }, (error) => {
      console.log(error)
    })
  }

  resetForm () {
    this.recycleAddressControl.setValue('')
    this.recycleAddressControl.markAsPristine()
    this.recycleAddressControl.markAsUntouched()
    this.recycleQuantityControl.setValue('')
    this.recycleQuantityControl.markAsPristine()
    this.recycleQuantityControl.markAsUntouched()
    this.pickUpDateControl.setValue('')
    this.pickUpDateControl.markAsPristine()
    this.pickUpDateControl.markAsUntouched()
    this.pickup.setValue(false)
  }

}
