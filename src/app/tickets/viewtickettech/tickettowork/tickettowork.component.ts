import { Component, OnInit } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { UsersService } from 'src/app/services/users.service';
import { TicketService } from '../../../services/ticket.service';
import { ActivatedRoute, Router} from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

// Uploading photos
// import { UploadFilesService } from 'src/app/services/upload-files.service';
// import { HttpEventType, HttpResponse } from '@angular/common/http';
// import { Observable } from 'rxjs';


/* PDF IMPORTING TO SAVE*/
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ViewChild } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler } from '@angular/common/http';
import { WarehouseService } from 'src/app/services/warehouse.service';

// To upload files
import { /* ViewChild,*/ ElementRef  } from '@angular/core';
import { HttpEventType, HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';  
import { catchError, map } from 'rxjs/operators';  
import { UploadFilesService } from  '../../../services/upload-files.service';


@Component({
  selector: 'app-tickettowork',
  templateUrl: './tickettowork.component.html',
  styleUrls: ['./tickettowork.component.scss']
})
export class TickettoworkComponent implements OnInit {
  id: number | undefined;
  theTicketData : any;

  newtags: any = [];
  TechnicianList: any = [];
  unserialTags: any = [];
  warehouseData:any = [];
  tagsarray: any = [];

  equipmentArrayData: any = [];
  ticketVersion ={ version: 1, status: ''};

  //currentTicket = null;
  currentIndex = -1;
  //ticketinView: any;

  AgencyList: any = [];
  FilteredAgency: any = [];

  theTicketUpdate: any = {
    agencyId: '',
    code: '',
    priority:'',
    description:'',
    type:''
  };

  agencyToUpdate: any = {
    name:'',
    certification:'',
    address:'',
    phone:'',
    email:'',
    managerId:''
  };

  tickStatus ={ status:'ABORTED'};
  customerId = 'CUSTOME581785f34f4f3';
  categoryList: any = [];

  @ViewChild("fileUpload", {static: false}) fileUpload: ElementRef | undefined; files  = [];  

  constructor(private service:TicketService,
    private usersService: UsersService,
    private route:ActivatedRoute,
    private router: Router,
    private whservice:WarehouseService,
    private _snackBar: MatSnackBar,
    private http: HttpClient,
    private uploadService: UploadFilesService
    ) { }

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    this.getAgencyListName();
    this.getUnserializedItems(ticketId);
    this.id = +this.getTicketIndividual(this.route.snapshot.paramMap.get('id'));
    this.Technicians_List();
    this.getTags();
    this.allestimentoTicketList(ticketId);
    this.getCategoryList();
  }

  getAgencyListName(){
    this.service.getAgencyName(this.customerId).subscribe(agency => {
      this.AgencyList = agency;
    })
  }

  getTicketIndividual(id:any):any{
    this.service.getTicketIso(id).subscribe((data)=> {
      this.theTicketData = data[0];
      this.theTicketUpdate.agencyId = data[0].agencyId;
      this.theTicketUpdate.code = data[0].code;
      this.theTicketUpdate.type = data[0].type;
      this.theTicketUpdate.description = data[0].description;
      this.theTicketUpdate.priority = data[0].priority;
      let agenciaSelected:any = this.AgencyList.find((a:any) => a.id === parseInt(this.theTicketUpdate.agencyId, 10));
      this.agencyToUpdate.name = agenciaSelected.name;
    },
    error =>{console.log(error);
    });
  }

  getTags(){
    this.service.getTagList().subscribe(data => {
      this.newtags = data;
    });
  }

  getCategoryList(){
    this.whservice.getCategories().subscribe(
      (data) => { this.categoryList = data;
    });
  }

  Technicians_List(){
    this.usersService.getTechnicianList().subscribe(
      data => this.TechnicianList = data
      );
  }

  getUnserializedItems(id:any){
    this.service.getTicketEquipmentList(id).subscribe(
      (tag) => { this.unserialTags = tag;
        console.log("datos a serializar: ",this.unserialTags);
      }
      );
  }

  allestimentoTicketList(ticketId: any){
    this.service.getTicketEquipmentList(ticketId).subscribe(
      data => {this.equipmentArrayData = data;
      console.log("allestimentoTicket: ",this.equipmentArrayData);}
    );
  }

  deleteTicket(id:number){
    if (confirm('Are you sure you want to abort the ticket?')){
        this.service.deleteTicket(id, this.tickStatus).subscribe(
          (data) => { this.tickStatus = data;
            this._snackBar.open("Ticket Aborted Succesfully", "OK", { duration:3500, panelClass: "success",});
            this.router.navigateByUrl("/tickets");
          });
      }
}

// setDefaultDate(){
//   let year, month, day, hour, minute, second;

//   year = this.techDate.getFullYear();
//   month = this.techDate.getMonth()+1;
//   day = this.techDate.getDate();
//   hour = this.techDate.getHours();
//   minute = this.techDate.getMinutes();
//   second = this.techDate.getSeconds();

//   this.TechnicianModel.assignedDate = year+'-'+month+'-'+day+' '+'0'+hour+':'+'0'+minute+':'+'0'+second;
//   console.warn('prueba date format: ',this.TechnicianModel.assignedDate);
// }


assigned_tags = '';
resolvedticket: any = {
  version: 6,
  status: 'RESOLVED',
  assigned_tags: '',
};
resolved(id: any){
  this.service.updateTicketVersion(id, this.resolvedticket).subscribe(
    (data) => { this.theTicketData = data;
      this._snackBar.open(data, "OK", { duration:3500, panelClass: "success",});
  });
}

urls=[];
onselect(e){
  if(e.taget.files){
    for(let i = 0; i < File.length;i++){
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[i]);
      reader.onload=(events)=>{
        this.urls.push(events.target.result)
      }
    }
  }

}


@ViewChild('dataPdf')
filename= "_tid_";
rptDownload(): void{
  const DATA = document.getElementById('dataPdfReport') as HTMLDivElement;
    
  html2canvas(DATA).then(canvas => {
      
      let fileWidth = 208;
      let fileHeight = canvas.height * fileWidth / canvas.width;
      
      const FILEURI = canvas.toDataURL('image/png')
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 5;
      PDF.internal.scaleFactor = 30;
      PDF.addImage(FILEURI, 'PNG',5,position,fileWidth-(fileWidth * 0.05), fileHeight-(fileHeight * 0.05));
      
      PDF.save('RPT_'+this.theTicketData.code+ this.filename +this.theTicketData.id+'.pdf');
  });     
}

}
