import * as moment from "moment";
declare var $: any;


export class CalendarYvv{
	public etiqueta: any;
	public primerDia: any;
	public todayDate: any;
	public funcPer: any;
	public funcNext: any;
	public funcPrev: any;
	public currentSelected: any;
	
	public bg: any;
	public textColor: any;
	public btnH: any;
	public btnD: any;
	public __author: any;
	public __email: any;
	public __version: any;
	public inicioDia: any;
	public mesSeleccionado: any;
	public anioSeleccionado: any;
	public cantDias: any;
	public diasCoto: any;
	public diasLargo: any;

    public pendingLeaves:any;
    public approvedLeaves:any;
    public rejectedLeaves:any;
    public cancledLeaves:any;
	constructor(etiqueta="", todayDate="", primerDia="Lunes") {
		this.etiqueta = etiqueta; // etiqueta donde se mostrará
		this.primerDia = primerDia; // inicio de la semana
		this.todayDate = todayDate==""?moment().format("Y-M-D"):todayDate; // día actual seleccionado

		this.funcPer = function(e:any){}; // funcion a ejecutar al lanzar el evento click
		this.funcNext = false; // funcion a ejecutar al lanzar el evento click
		this.funcPrev = false; // funcion a ejecutar al lanzar el evento click
		this.currentSelected = moment().format("Y-M-D"); // elemento seleccionado

        this.pendingLeaves =[];
        this.approvedLeaves = [];
        this.rejectedLeaves =[];
        this.cancledLeaves =[];

		this.bg = "bg-white"; // color de fondo de la cabecera
		this.textColor = "text-dark"; // color de texto en la cabecera
		this.btnH = "btn-outline-primary"; // color de boton normal
		this.btnD = "btn-rounded-success";// color de boton al pasar el mouse - "btn-outline-dark";

	}
	startElements(){
		this.todayDate = this.corregirMesA(this.todayDate);
		this.inicioDia = moment(this.todayDate).format("dddd"); // inicio dia del mes
		this.mesSeleccionado = this.todayDate.split("-")[1]*1; // mes seleccionado
		this.anioSeleccionado = this.todayDate.split("-")[0]*1; // año seleccionado
		this.cantDias = moment(this.todayDate).daysInMonth()*1; // cantidad de dias del mes
		this.diasCoto = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		this.diasLargo = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	}
	createCalendar(){
		this.startElements();
		var cont = $(this.etiqueta);
		var cntCale = $("<div class='calendar-yvv w-100 border' style='border-radius:15px'>");
		var headerCalendar = this.createHeaderM();
		var daysLettCalendar = this.createDayTag();
		var daysNumCalendar = this.createDaysMont();

		cont.html("");
		cntCale.append(headerCalendar);
		cntCale.append(daysLettCalendar);
		cntCale.append(daysNumCalendar);
		cont.append(cntCale);
	}
	createHeaderM(){
		var cont = $("<div style='border-top-right-radius:15px;border-top-left-radius:15px;' class='d-flex justify-content-between p-2 border align-items-center "+ this.bg +" "+this.textColor+"'>");
		var arrowL = $("<span class='btn "+this.btnH+"'>").html("<");
		var arrowR = $("<span class='btn "+this.btnH+"'>").html(">");
		var title = $("<span class='text-uppercase'>").html(moment(this.todayDate).format("MMMM - Y"));
		var _this = this;

		arrowL.on("click", function(e:any){
			_this.mesAnterior(_this)
		});
		arrowR.on("click", function(e:any){
			_this.mesSiguiente(_this)
		});
		cont.append(arrowL);
		cont.append(title);
		cont.append(arrowR);
		return cont;
	}
	createDayTag(){
		var newPrimerDia = this.firtsMayus(this.primerDia);
		var diasOrd = this.ordenarDiasMes(newPrimerDia);

		var cont = $("<div class='d-flex  w-100 border "+this.bg+" "+this.textColor+"'>");

		diasOrd.fechCort.forEach(function(e){
			var div = $("<div class='d-flex  flex-fill w-100 justify-content-center p-2'>").html(e);
			cont.append(div);
		});
		return cont;
	}
	createDaysMont(){
		var diaSelected = this.corregirMesA(this.anioSeleccionado + "-" + this.mesSeleccionado + "-01");
		var primerDiaMes = moment(diaSelected).format("dddd");
		var diaInicio = this.firtsMayus(primerDiaMes); //this.firtsMayus(this.inicioDia);
		var diasOrd = this.ordenarDiasMes(this.firtsMayus(this.primerDia));
		var posMes = diasOrd.fechLarg.indexOf(diaInicio);

		var cnt = 0;
		var cntG = $("<div class='w-100'>");

		var cont = $("<div class='d-flex  w-100 '>");
		var emptyTag = "<div class='d-flex  flex-fill w-100 justify-content-center pt-3 pb-3 btn' style='color:transparent'>";
		for(var j=0;j<posMes;j++){
			var div = $(emptyTag).html("0");
			cont.append(div);
			cnt++;
		}
		for(var i=0;i<this.cantDias;i++){
			var fechNow = this.anioSeleccionado+"-"+this.mesSeleccionado+"-"+(i+1);
			var div = $("<div class='d-flex  flex-fill w-100 justify-content-center pt-3 pb-3 btn "+this.btnD+"' data-date='"+fechNow+"'>").html(i+1);
			var clas_e = this;
			var _ind = (this.cantDias+posMes)%7;

			//dia seleccionado
            var today = moment(this.todayDate,'Y-MM-D');
            this.todayDate = today.format('Y-M-D');
			if(this.todayDate==fechNow){
				div = $("<div class='current-date-selected d-flex  flex-fill w-100 justify-content-center pt-3 pb-3 btn "+this.btnD+"' data-date='"+fechNow+"'>").html(i+1);
			}


            //pending leaves
			if(this.pendingLeaves.indexOf(i+1)!=-1){
				div = $("<div class='d-flex flex-fill w-100 justify-content-center pt-3 pb-3 btn "+this.btnD+" text-warning font-weight-bold pending-leave-date' data-date='"+fechNow+"'>").html(i+1);
			}
             //approved leaves
		    if(this.approvedLeaves.indexOf(i+1)!=-1){
				div = $("<div class='d-flex flex-fill w-100 justify-content-center pt-3 pb-3 btn "+this.btnD+" text-success font-weight-bold approved-leave-date' data-date='"+fechNow+"'>").html(i+1);
			}

             //rejected leaves
			if(this.rejectedLeaves.indexOf(i+1)!=-1){
				div = $("<div class='d-flex flex-fill w-100 justify-content-center pt-3 pb-3 btn "+this.btnD+" text-danger font-weight-bold rejected-leave-date' data-date='"+fechNow+"'>").html(i+1);
			}

              //cancled leaves
			if(this.cancledLeaves.indexOf(i+1)!=-1){
				div = $("<div class='d-flex flex-fill w-100 justify-content-center pt-3 pb-3 btn "+this.btnD+" text-default font-weight-bold cancled-leave-date' data-date='"+fechNow+"'>").html(i+1);
			}


			div.on("click", function(e:any){
				var daySelec = $(e.target).attr("data-date");
				clas_e.currentSelected = daySelec;
				clas_e.funcPer(clas_e)
			});
			cont.append(div);
			if(cnt==6){
				//div.on("click", this.funcPer);
				cntG.append(cont);
				cont = $("<div class='d-flex  w-100 '>");
				cnt = 0;
			}else if(this.cantDias==(i+1)){
				for(var j=0;j<(7-_ind);j++){
					var div = $(emptyTag).html("0");
					cont.append(div);
					cnt++;
				}
				cntG.append(cont);
				cont = $("<div class='d-flex  w-100 '>");
				cnt = 0;
			}else{
				//cont.append(div);
				cnt++;
			}
		}
		return cntG;
	}
	ordenarDiasMes(dia:any){
		var posMes = this.diasLargo.indexOf(dia);
		var fechCort = [];
		var fechLarg = [];

		for(var i=posMes;i<this.diasCoto.length;i++){
			fechCort.push(this.diasCoto[i]);
			fechLarg.push(this.diasLargo[i]);
		}
		for(var j=0;j<posMes;j++){
			fechCort.push(this.diasCoto[j]);
			fechLarg.push(this.diasLargo[j]);
		}
		return {fechCort, fechLarg};
	}
	firtsMayus(letter:any){
		var lett = "";
		for(var i=0;i<letter.length;i++){
			if(i==0) lett += "" + letter[i].toUpperCase();
			else lett += "" + letter[i].toLowerCase();
		}
		return lett;
	}
	mesAnterior(ev:any){
		ev.mesSeleccionado--;
		if(ev.mesSeleccionado==0){
			ev.anioSeleccionado--;
			ev.mesSeleccionado=12;
		}
		var day = ev.todayDate.split("-")[2]*1;
		ev.todayDate = ev.anioSeleccionado + "-" + ev.mesSeleccionado + "-" + day;
		ev.todayDate = ev.corregirMesA(ev.todayDate);
		ev.cantDias = moment(ev.todayDate).daysInMonth()*1;
		ev.createCalendar();

		if(this.funcPrev){
			this.funcPrev(ev)
		}else{
			ev.createCalendar();
		}
	}
	mesSiguiente(ev:any){
		ev.mesSeleccionado++;
		if(ev.mesSeleccionado==13){
			ev.anioSeleccionado++;
			ev.mesSeleccionado=1;
		}
		var day = ev.todayDate.split("-")[2]*1;
		ev.todayDate = ev.anioSeleccionado + "-" + ev.mesSeleccionado + "-" + day;
		ev.todayDate = ev.corregirMesA(ev.todayDate);
		ev.cantDias = moment(ev.todayDate).daysInMonth()*1;

		if(this.funcNext){
			this.funcNext(ev)
		}else{
			ev.createCalendar();
		}
	}
	corregirMesA(_f:any){
		var fec = _f.split("-");
		fec[1] = (fec[1]<10&&fec[1].length==1)?("0"+fec[1]):fec[1];
		fec[2] = (fec[2]<10&&fec[2].length==1)?("0"+fec[2]):fec[2];
		return fec.join("-");
	}
}
