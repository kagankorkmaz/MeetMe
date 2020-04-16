
var text='{ "events" : [' +
'{ "start_date": "2017-06-24 12:00", "end_date": "2017-06-24 16:00", "text": "French Open", "details": "Philippe-Chatrier Court Paris, FRA" },' +
	'{ "start_date": "2017-06-22 12:00", "end_date": "2017-06-22 13:00", "text": "French Open", "details": "Philippe-Chatrier Court Paris, FRA" },' +
	'{ "start_date": "2017-06-24 14:23", "end_date": "2017-06-24 16:00", "text": "French Open", "details": "Philippe-Chatrier Court Paris, FRA" } ]}';

var text2='{ "events" : [' +
'{ "start_date": "2017-06-24 15:00", "end_date": "2017-06-24 20:00", "text": "French Open", "details": "Philippe-Chatrier Court Paris, FRA" },' +
	'{ "start_date": "2017-06-22 12:30", "end_date": "2017-06-22 13:00", "text": "French Open", "details": "Philippe-Chatrier Court Paris, FRA" },' +
	'{ "start_date": "2017-06-24 18:00", "end_date": "2017-06-24 21:00", "text": "French Open", "details": "Philippe-Chatrier Court Paris, FRA" } ]}';


var userCalendars=[];
userCalendars.push(text);
userCalendars.push(text2);



var datesGMT=[];
var currEv=new Date()
var endEv=new Date();
var i,k;
for (k=0;k<userCalendars.length;k++){
	var JSON_array = JSON.parse(userCalendars[k]);
for (i=0;i<JSON_array.events.length;i++) {
	currEv=new Date(JSON_array.events[i].start_date);
	if (datesGMT.map(Number).indexOf(+currEv)==-1){
		datesGMT.push(currEv);}
	currEv=new Date(JSON_array.events[i].end_date);
	if (datesGMT.map(Number).indexOf(+currEv)==-1){
		datesGMT.push(currEv);
		}
	endEv=new Date(JSON_array.events[i].end_date);
	endEv.setSeconds(endEv.getSeconds()+1);
	if (datesGMT.map(Number).indexOf(+endEv)==-1){
		datesGMT.push(endEv);}
}
}

var date_sort_asc = function (date1, date2) {
  if (date1 > date2) return 1;
  if (date1 < date2) return -1;
  return 0;
};

var date_sort_desc = function (date1, date2) {
  if (date1 > date2) return -1;
  if (date1 < date2) return 1;
  return 0;
};

datesGMT.sort(date_sort_asc);

var beginDayTime=new Date(datesGMT[0]);
beginDayTime.setHours(0);
beginDayTime.setMinutes(0);
beginDayTime.setSeconds(0);
datesGMT.unshift(beginDayTime);
var endDayTime=new Date(datesGMT[datesGMT.length-1]);
endDayTime.setHours(23);
endDayTime.setMinutes(59);
endDayTime.setSeconds(59);
datesGMT.push(endDayTime);

console.log(datesGMT);

var dict = {};
var j;
for(j=0;j<datesGMT.length;j++) {
	dict[datesGMT[j]]=j;
}
//console.log(dict);

var arr=Array(userCalendars.length).fill(null).map(() => Array(datesGMT.length).fill(0));

for (k=0;k<userCalendars.length;k++){
	var JSON_array = JSON.parse(userCalendars[k]);
	for (i=0;i<JSON_array.events.length;i++){
		for(j=dict[new Date(JSON_array.events[i].start_date)];j<dict[new Date(JSON_array.events[i].end_date)]+1;j++){
			arr[k][j]=1;
		}
		//console.log(dict[new Date(JSON_array.events[i].end_date)]);
	}
}

//console.log(arr);
var busyTimeIndex=[];
var u;
for (i=0;i<arr[0].length;i++) {
	for (j=0;j<arr.length;j++) {
		if(arr[j][i]===1){
			busyTimeIndex.push(i);
			break;
		}
	}
}

//console.log(busyTimeIndex);

var busyTime={};
var slots=[];
busyTime.slots=slots;

var count;
console.log('Busy time slots are:');
for (i=0;i<busyTimeIndex.length-1;i++){
	
	count=i;
	while (busyTimeIndex.includes(busyTimeIndex[i]+1)){
		i=i+1;
	}	
	
	console.log(datesGMT[busyTimeIndex[count]]+' - '+datesGMT[busyTimeIndex[i]])
	
	var slot = {
    "startTime": datesGMT[busyTimeIndex[count]],
    "endTime": datesGMT[busyTimeIndex[i]]
	}
	
	busyTime.slots.push(slot);
}

console.log(JSON.stringify(busyTime));

var fs = require('fs');

fs.writeFile('./busyTimeSlots.json', JSON.stringify(busyTime, null ,2), err => {
if(err){
	console.log(err);
} else{
	console.log('File successfully written!')
}

});



