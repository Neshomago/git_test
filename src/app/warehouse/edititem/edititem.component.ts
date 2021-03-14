import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from 'src/app/services/warehouse.service';

@Component({
  selector: 'app-edititem',
  templateUrl: './edititem.component.html',
  styleUrls: ['./edititem.component.scss']
})
export class EdititemComponent implements OnInit {
  
  id: number | undefined;
  theItemWarehouse: any =[];
  edit = false;
  
  currentIndex = -1;
  
  changesItem: any = {
    serial:'',
    activation:'',
    warehouserId:5,
    used:0,
    location:'',
    status:'',
    statusDescription:'',
    warranty_period:12,
  };

  trackingInfo: any ={
    itemId:'',
    userId:'',
    changes:'',
    type:'Edit Item',
    desciptionTrack:'Made Modifications on item details',
    rawData:'',
    userTraza:''
  }

  nombre: any;

  constructor(
    private service: WarehouseService,
    private route:ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) {
    if(localStorage.getItem('nombre')) {
      this.nombre = localStorage.getItem('nombre'); 
    }
   }

  ngOnInit(): void {
    this.id = +this.getWarehouseItemIso(this.route.snapshot.paramMap.get('id'));
    this.getCategoryList();
    this.getWarehouses();
    this.getTrackingData();
  }

  editFields(){
    this.edit = !this.edit;
  }

  getWarehouseItemIso(id:any):any{
    this.service.getItemIso(id).subscribe(
      (data)=>{
        this.theItemWarehouse = data[0];
        this.changesItem.name = data[0].name;
        this.changesItem.categoryId = data[0].categoryId;
        this.changesItem.serial = data[0].serial;
        this.changesItem.activation = data[0].activation;
        this.changesItem.warehouseId = data[0].warehouseId;
        this.changesItem.used = data[0].used;
        this.changesItem.location = data[0].location;
        this.changesItem.status = data[0].status;
        this.changesItem.statusDescription = data[0].statusDescription;
        this.changesItem.warranty_period = data[0].warranty_period;
        this.trackingInfo.itemId = data[0].serial;
        console.log('tracking info: ', this.trackingInfo);
      },
      error => {console.log(error);
      });
  }

  updateChanges(id:any){
    this.service.updateWarehouseItem(id, this.changesItem).subscribe(
      (data)=>{
        this.theItemWarehouse.name = this.changesItem.name;
        this.theItemWarehouse.categoryId = this.changesItem.categoryId;
        this.theItemWarehouse.serial = this.changesItem.serial;
        this.theItemWarehouse.activation = this.changesItem.activation;
        this.theItemWarehouse.warehouseId = this.changesItem.warehouseId;
        this.theItemWarehouse.used = this.changesItem.used;
        this.theItemWarehouse.location = this.changesItem.location;
        this.theItemWarehouse.status = this.changesItem.status;
        this.theItemWarehouse.statusDescription = this.changesItem.statusDescription;
        this.theItemWarehouse.warranty_period = this.changesItem.warranty_period;
        this.changesItem = data;
        this._snackBar.open("Item Updated Succesfully", "OK", { duration:3500, panelClass: "success",});
        console.log(data);
      });
  }


  saveItemTrack() {
    this.service.trackingItem(this.trackingInfo).subscribe(
      data => {
        this.theItemWarehouse.serial = this.trackingInfo.itemId;
        this.nombre = this.trackingInfo.userId;
        console.log(data);
      },
      error => {
        console.log(error)
      }
    );
  }

  warehouses:any=[];
  getWarehouses(){
    this.service.getWarehouseList().subscribe(
      data => {this.warehouses = data}
    );
  }

  categoryList:any =[];
  getCategoryList(){
    this.service.getCategories().subscribe(
      (data) => { this.categoryList = data;
    });
  }

  trackingData:any =[];
  getTrackingData(){
    this.service.getTrackingData(this.theItemWarehouse.serial).subscribe(
      (data) => { this.trackingData = data}
    );
  }
}

