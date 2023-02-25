import * as moment from "moment";
declare var $: any;

export class CalendarYvv{
	public calenderTemplateId: any;
	public calenderStartDay: any;
	public todayDate: any;
	public funcPer: any;
	public funcNext: any;
	public funcPrev: any;
	public currentSelected: any;

	// public selectedDays: any;
	public pendingLeaves:any;
    public approvedLeaves:any;
    public rejectedLeaves:any;
    public cancledLeaves:any;

    public selectedBackgroundColor: any;
	public selectedTextColor: any;
	public bg: any;
	public textColor: any;
	public btnH: any;
	public inicioDia: any;
	public currentMonth: any;
	public currentYear: any;
	public totalDaysInMonth: any;
	public shortDayArray: any;
	public fullDayArray: any;

	constructor(calenderTemplateId="", todayDate="", calenderStartDay="Monday") {

		this.calenderTemplateId = calenderTemplateId; // html id of calender div
		this.calenderStartDay = calenderStartDay; // calender start day 
		this.todayDate = todayDate==""?moment().format("Y-M-D"):todayDate; // today date

		this.funcPer = function(e:any){}; // funcion a ejecutar al lanzar el evento click
		this.funcNext = false; // funcion a ejecutar al lanzar el evento click
		this.funcPrev = false; // funcion a ejecutar al lanzar el evento click
		this.currentSelected = moment().format("Y-M-D"); // elemento seleccionado

        // this.selectedDays = []; // dias importantes
        this.pendingLeaves = [];
        this.approvedLeaves = [];
        this.rejectedLeaves = [];
        this.cancledLeaves = [];

		this.selectedBackgroundColor = "#28a7454d"; // color de los dias importantes
		this.selectedTextColor = "#28a745"; // color de texto de dias importantes

		this.bg = "bg-white"; // color de fondo de la cabecera
		this.textColor = "text-dark"; // color de texto en la cabecera
		this.btnH = "btn-outline-primary"; // color de boton normal
	}
    
	startElements(){
		this.todayDate = this.corregirMesA(this.todayDate);
		this.inicioDia = moment(this.todayDate).format("dddd"); // inicio dia del mes
		this.currentMonth = this.todayDate.split("-")[1]*1; // mes seleccionado
		this.currentYear = this.todayDate.split("-")[0]*1; // año seleccionado
		this.totalDaysInMonth = moment(this.todayDate).daysInMonth()*1; // cantidad de dias del mes
		this.shortDayArray = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
		this.fullDayArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
	}

	createCalendar(){
		this.startElements();
		var cont = $(this.calenderTemplateId);
		var cntCale = $("<div class='calendar-yvv w-100 border' style='border-radius:10px'>");
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
		var cont = $("<div  style='border-top-left-radius:10px;border-top-right-radius:10px;' class='d-flex justify-content-between p-2 align-items-center border "+this.bg+" "+this.textColor+"'>");
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
		var firstDay = this.firtsMayus(this.calenderStartDay);
		var diasOrd = this.ordenarDiasMes(firstDay);

		var cont = $("<div class='d-flex w-100 border "+this.bg+" "+this.textColor+"'>");

		diasOrd.fechCort.forEach(function(e){
			var div = $("<div class='d-flex flex-fill w-100 justify-content-center p-2'>").html(e);
			cont.append(div);
		});
		return cont;
	}

	createDaysMont(){
		var firstDateOfMonth = this.corregirMesA(this.currentYear + "-" + this.currentMonth + "-01");
		var firstDayOfMonth = moment(firstDateOfMonth).format("dddd");
		var diaInicio = this.firtsMayus(firstDayOfMonth); //this.firtsMayus(this.inicioDia);
		var daysArray = this.ordenarDiasMes(this.firtsMayus(this.calenderStartDay));
		var posMes = daysArray.fechLarg.indexOf(diaInicio);

		var cnt = 0;
		var cntG = $("<div class='w-100'>");

		var cont = $("<div class='d-flex w-100'>");
		var emptyTag = "<div class='d-flex flex-fill w-100 justify-content-center pt-3 pb-3 btn' style='color:transparent'>";
		for(var j=0;j<posMes;j++){
			var div = $(emptyTag).html("0");
			cont.append(div);
			cnt++;
		}
		for(var i=0;i<this.totalDaysInMonth;i++){

			var fechNow = this.currentYear+"-"+this.currentMonth+"-"+(i+1);
			var div:any = $("<div class='d-flex flex-fill w-100 justify-content-center pt-3 pb-3' data-date='"+fechNow+"'>").html((i+1).toString());
			var clas_e = this;
			var _ind = (this.totalDaysInMonth+posMes)%7;

			//today date color change
            var today = moment(this.todayDate,'Y-MM-D');
            this.todayDate = today.format('Y-M-D');
            if(this.todayDate == fechNow)
            {
                // div = $("<div class='current-date-selected d-flex flex-fill w-100 justify-content-center pt-3 pb-3 btn "+this.btnD+"' data-date='"+fechNow+"' style='color: "+this.selectedTextColor+"; font-weight: bold;'>").html((i+1).toString());
				div = $("<div class='current-date-selected btn-rounded-success d-flex flex-fill w-100 justify-content-center pt-3 pb-3' data-date='"+fechNow+"'>").html((i+1).toString());
			}
			

            // pending leaves colored
			if(this.pendingLeaves.indexOf(i+1)!=-1){
				div = $("<div class='pending-leave-date d-flex flex-fill w-100 justify-content-center pt-3 pb-3 text-warning font-weight-bold' data-date='"+fechNow+"' >").html((i+1).toString());
			}

            // approved leaves colored
			if(this.approvedLeaves.indexOf(i+1)!=-1){
				div = $("<div class='approved-leave-date d-flex flex-fill w-100 justify-content-center pt-3 pb-3 text-success font-weight-bold' data-date='"+fechNow+"' >").html((i+1).toString());
			}

             // rejected leaves colored
			if(this.rejectedLeaves.indexOf(i+1)!=-1){
				div = $("<div class='rejedted-leave-date d-flex flex-fill w-100 justify-content-center pt-3 pb-3 text-danger font-weight-bold' data-date='"+fechNow+"'>").html((i+1).toString());
			}

            // cancled leaves colored
			if(this.cancledLeaves.indexOf(i+1)!=-1){
				div = $("<div class='cancled-leave-date d-flex flex-fill w-100 justify-content-center pt-3 pb-3 text-muted font-weight-bold' data-date='"+fechNow+"'>").html((i+1).toString());
			}


            // // selected days colored
			// if(this.selectedDays.indexOf(i+1)!=-1){
			// 	div = $("<div class='d-flex flex-fill w-100 justify-content-center pt-3 pb-3' data-date='"+fechNow+"' style='color: "+this.selectedTextColor+"; font-weight: bold;'>").html((i+1).toString());
			// }

			div.on("click", function(e:any){
				var daySelec = $(e.target).attr("data-date");
				clas_e.currentSelected = daySelec;
				clas_e.funcPer(clas_e)
			});
			cont.append(div);
			if(cnt==6){
				//div.on("click", this.funcPer);
				cntG.append(cont);
				cont = $("<div class='d-flex w-100'>");
				cnt = 0;
			}else if(this.totalDaysInMonth==(i+1)){
				for(var j=0;j<(7-_ind);j++){
					var div = $(emptyTag).html("0");
					cont.append(div);
					cnt++;
				}
				cntG.append(cont);
				cont = $("<div class='d-flex w-100'>");
				cnt = 0;
			}else{
				//cont.append(div);
				cnt++;
			}
		}
		return cntG;
	}
	ordenarDiasMes(dia:any){
		var posMes = this.fullDayArray.indexOf(dia);
		var fechCort = [];
		var fechLarg = [];

		for(var i=posMes;i<this.shortDayArray.length;i++){
			fechCort.push(this.shortDayArray[i]);
			fechLarg.push(this.fullDayArray[i]);
		}
		for(var j=0;j<posMes;j++){
			fechCort.push(this.shortDayArray[j]);
			fechLarg.push(this.fullDayArray[j]);
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
		ev.currentMonth--;
		if(ev.currentMonth==0){
			ev.currentYear--;
			ev.currentMonth=12;
		}
		var day = ev.todayDate.split("-")[2]*1;
		ev.todayDate = ev.currentYear + "-" + ev.currentMonth + "-" + day;
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
		ev.currentMonth++;
		if(ev.currentMonth==13){
			ev.currentYear++;
			ev.currentMonth=1;
		}
		var day = ev.todayDate.split("-")[2]*1;
		ev.todayDate = ev.currentYear + "-" + ev.currentMonth + "-" + day;
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

