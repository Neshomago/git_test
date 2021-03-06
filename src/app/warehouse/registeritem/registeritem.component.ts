import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ItemWarehouse } from 'src/app/tickets';
import { WarehouseService } from 'src/app/services/warehouse.service';
import { AgencyService } from 'src/app/services/agency.service';
import { stringify } from '@angular/compiler/src/util';
@Component({
  selector: 'app-registeritem',
  templateUrl: './registeritem.component.html',
  styleUrls: ['./registeritem.component.scss']
})
export class RegisteritemComponent implements OnInit {
  
  nombre: any;
  zRoleA: any;
  zRoleC: any;
  zRoleE: any;
  zRoleT: any;
  iniciales:any;
  surname: any;
  userId: any;

  warehouses:any =[];

  customerId = localStorage.getItem('customerId');
  
 

  invoiceDate=new Date();
    itemModel: any = {
      name: '',
      description:'',
      serial: '',
      warehouseId: 5,
      location:'WAREHOUSE',
      locationId:5,
      used: 0,
      warrantyPeriod: 12,
      categoryId: 0,
      createdBy: localStorage.getItem('id'),
      // isMoving: 0,
      supplier: '',
      isDelete: 0,
      status:'',
      invoice_purchase: '',
      warranty_invoiceDate:'',
      //registerDate: new Date,
      //statusDetails: '',
      //userId: 0,
      //activationCode: '',
      //technicianNotes:'',
      //vehicle_Id: 0,
      //technicianId: 0,
      //technicianAssigned: '',
      //agencyId: 0,
      //customerId: 0,
      //dateofArrive: undefined,
      //dateofRemoval: undefined
  }

  trackingInfo: any ={
    itemId:'',
    userId:'',
    changes:'',
    type:'Register',
    descriptionTrack:'New item to warehouse',
    rawData: String(JSON.stringify(this.itemModel))
    // userTraza:''
  }

  category:any ={
    category_name:''
  }

 selectedWarehouse = '';


  constructor(private _snackBar:MatSnackBar, private router:Router, private service:WarehouseService,
    private agencyService: AgencyService) { 
    if(localStorage.getItem('zRoleA')) {
      this.zRoleA = localStorage.getItem('zRoleA'); 
    }

    if(localStorage.getItem('zRoleC')) {
      this.zRoleC = localStorage.getItem('zRoleC'); 
    }

    if(localStorage.getItem('zRoleE')) {
      this.zRoleE = localStorage.getItem('zRoleE'); 
    }
    
    if(localStorage.getItem('zRoleT')) {
      this.zRoleT = localStorage.getItem('zRoleT'); 
    }
  
    if(localStorage.getItem('nombre')) {
      this.nombre = localStorage.getItem('nombre'); 
    }
  
    if(localStorage.getItem('surname')) {
      this.surname = localStorage.getItem('surname'); 
    }

    if(localStorage.getItem('id')) {
      this.userId = localStorage.getItem('id'); 
    }
  }

  ngOnInit(): void {
    this.getCategoryList();
    this.getWarehouses();
  }

  
  categoryList:any =[];
  getCategoryList(){
    this.service.getCategories().subscribe(
      (data) => { this.categoryList = data;
    });
  }

  addCategory(){
    this.service.addCategory(this.category).subscribe(
      data => {this.category = data;
      console.log(this.category + "Was added to category list")}
    );
    this.category = [];
    this.getCategoryList();
  }

  getWarehouses(){
    this.selectedWarehouse = this.itemModel.warehouseId;
    this.service.getWarehouseList().subscribe(
      data => {this.warehouses = data}
    );
  }

  agencies: any = [];
  getAgencies(){
    this.agencyService.getAgencyList().subscribe(
      (data)=>{
        this.agencies = data
      }
    );
  }
  
    setDefaultDate(){
      let year, month, day, hour, minute, second;
  
      year = this.invoiceDate.getFullYear();
      month = this.invoiceDate.getMonth()+1;
      day = this.invoiceDate.getDate();
      hour = this.invoiceDate.getHours();
      minute = this.invoiceDate.getMinutes();
      second = this.invoiceDate.getSeconds();
  
      this.itemModel.warranty_invoiceDate = year+'-'+month+'-'+day+' '+'0'+hour+':'+'0'+minute+':'+'0'+second;
    }

  addItem(){
    this.setDefaultDate();
    this.service.addItemWarehouse(this.itemModel).subscribe(
      (data) => { this.itemModel = data;
        console.log('items guardados: ', this.itemModel);
        console.log('Item Registered succesfully', data);
      this._snackBar.open("Item Registered Succesfully", "OK", { duration:3500, panelClass: "success",});
      this.router.navigateByUrl("/warehouse"); },
      (error) => { 
        console.log('Datos no guardados', this.itemModel);
        console.log('Failed to Register Item', error);
      this._snackBar.open("Failed to Register Item", "OK", { duration:3500, panelClass: "error",}); },
    );
  }

  saveItemTrack() {
    this.trackingInfo.userId = String(localStorage.getItem('id'));
    this.trackingInfo.itemId = this.itemModel.serial;
    this.service.trackingItem(this.trackingInfo).subscribe(
      (data) => {
        console.log(data);
      },
      error => {
        console.log(error)
      }
    );
    // console.log(this.trackingInfo);
  }

  saveItem(){
    this.addItem();
    this.saveItemTrack();
  }



}
