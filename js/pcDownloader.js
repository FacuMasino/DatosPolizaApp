const OPTIONS = {Frente: "1", Tarjeta: "2", Pago: "3", Todo: "4"};

// CORREGIR BUCLE INFINITO CUANDO NO SE PUEDE OBTENER GETVEHICLES (NRO DE VEHICULOS) en FOR

async function getBinary(policyNumber, vhN, option)
{
	const URL_PAGO = 'https://api.sancristobal.com.ar/policyinfoapi/api/Report/DownloadReciboPagoTarjetaAutoxInciso?policyNumber=' + policyNumber + "&vehicleNumber="+vhN;
    const URL_FRENTE = 'https://api.sancristobal.com.ar/policyinfoapi/api/Report/DownloadFrentePoliza?policyNumber=' + policyNumber + '&vehicleNumber=' + vhN + '&clausulas=0';
    const URL_TARJETA = 'https://api.sancristobal.com.ar/policyinfoapi/api/Report/DownloadTarjetaSeguroObligatorio?policyNumber='+ policyNumber + '&vehicleNumber=' + vhN + '&endoso=0';
    const Params = {
		headers: {
			//"Cookie": ".ASPXAUTH=" + authCKey,
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzIwNjI5NTg5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InNjb3R0aTI5ODciLCJVc2VySWQiOjMxMDUzLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcm9kdWN0b3IiLCJIYXNoZWRQYXNzd29yZCI6IjEyYWQyODk1NjU4OTZkZmNhYmQ1NWVhZTNjZmJjZTU0NTdjNDMyNGUiLCJuYmYiOjE1OTU0MTYyOTEsImV4cCI6MTYwMDYwMDI5MX0.p9Jwyxd43n7UbyUDxIIImiFcCD-bVIvbyDf5xqx5m4Q",
		},
		method: "GET"
    }
    switch(option){
        case OPTIONS.Frente:
            console.log("Fetching URL_FRENTE");
            return fetch(URL_FRENTE, Params);
        case OPTIONS.Tarjeta:
            console.log("Fetching URL_Tarjeta");
            return fetch(URL_TARJETA, Params);
        case OPTIONS.Pago:
			console.log("Fetching URL_PAGO");
            return fetch(URL_PAGO,Params);
    }
}

async function getVehicles(policyNumber){
	const Url = '/getVehicles?policyNumber=' + policyNumber;
  	return fetch(Url);
}

async function downloadPc(policyNumber, option)
{
	policyNumber = document.getElementById(policyNumber).value;
	let vehicleData = await (await getVehicles(policyNumber)).json();
	vehicleCount = Object.keys(vehicleData).length;
	console.log(vehicleData);
	console.log("Cantidad de vehículos: " + vehicleCount);
    switch(option){
        case OPTIONS.Pago:
			console.log("OPTIONS: Comprobantes de pago");
            for(i=0; i <= vehicleCount-1;i++){
                await getBinary(policyNumber,i,OPTIONS.Pago)
                .then(res => res.arrayBuffer()
                .then(buffer => download(buffer,"Comprobante" + "_" + vehicleData[i] +"_" + policyNumber + ".pdf","application/pdf")));
            }
            break;
        case OPTIONS.Frente:
            console.log("OPTIONS: Frente de Póliza");
            for(i=0; i <= vehicleCount-1;i++){
                console.log("Descargando Frente " + vehicleData[i]);
                await getBinary(policyNumber,i,OPTIONS.Frente)
                .then(res => res.arrayBuffer()
                .then(buffer => download(buffer,"FrentePóliza" + "_" + vehicleData[i] +"_" + policyNumber + ".pdf","application/pdf")));
            }
            break;
        case OPTIONS.Tarjeta:
            console.log("OPTIONS: Tarjeta");
            for(i=0; i <= vehicleCount-1;i++){
                await getBinary(policyNumber,i,OPTIONS.Tarjeta)
                .then(res => res.arrayBuffer()
                .then(buffer => download(buffer,"Tarjeta" + "_" + vehicleData[i] +"_" + policyNumber + ".pdf","application/pdf")));
            }
            break;
    }

}

// For Testing:
// downloadPc("01-05-01-30204769",1);

function download(data, strFileName, strMimeType) {

		var self = window, // this script is only for browsers anyway...
			defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
			mimeType = strMimeType || defaultMime,
			payload = data,
			url = !strFileName && !strMimeType && payload,
			anchor = document.createElement("a"),
			toString = function(a){return String(a);},
			myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
			fileName = strFileName || "download",
			blob,
			reader;
			myBlob= myBlob.call ? myBlob.bind(self) : Blob ;
	  
		if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
			payload=[payload, mimeType];
			mimeType=payload[0];
			payload=payload[1];
		}


		if(url && url.length< 2048){ // if no filename and no mime, assume a url was passed as the only argument
			fileName = url.split("/").pop().split("?")[0];
			anchor.href = url; // assign href prop to temp anchor
		  	if(anchor.href.indexOf(url) !== -1){ // if the browser determines that it's a potentially valid url path:
        		var ajax=new XMLHttpRequest();
        		ajax.open( "GET", url, true);
        		ajax.responseType = 'blob';
        		ajax.onload= function(e){ 
				  download(e.target.response, fileName, defaultMime);
				};
        		setTimeout(function(){ ajax.send();}, 0); // allows setting custom ajax headers using the return:
			    return ajax;
			} // end if valid url?
		} // end if url?


		//go ahead and download dataURLs right away
		if(/^data:([\w+-]+\/[\w+.-]+)?[,;]/.test(payload)){
		
			if(payload.length > (1024*1024*1.999) && myBlob !== toString ){
				payload=dataUrlToBlob(payload);
				mimeType=payload.type || defaultMime;
			}else{			
				return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
					navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
					saver(payload) ; // everyone else can save dataURLs un-processed
			}
			
		}else{//not data url, is it a string with special needs?
			if(/([\x80-\xff])/.test(payload)){			  
				var i=0, tempUiArr= new Uint8Array(payload.length), mx=tempUiArr.length;
				for(i;i<mx;++i) tempUiArr[i]= payload.charCodeAt(i);
			 	payload=new myBlob([tempUiArr], {type: mimeType});
			}		  
		}
		blob = payload instanceof myBlob ?
			payload :
			new myBlob([payload], {type: mimeType}) ;


		function dataUrlToBlob(strUrl) {
			var parts= strUrl.split(/[:;,]/),
			type= parts[1],
			indexDecoder = strUrl.indexOf("charset")>0 ? 3: 2,
			decoder= parts[indexDecoder] == "base64" ? atob : decodeURIComponent,
			binData= decoder( parts.pop() ),
			mx= binData.length,
			i= 0,
			uiArr= new Uint8Array(mx);

			for(i;i<mx;++i) uiArr[i]= binData.charCodeAt(i);

			return new myBlob([uiArr], {type: type});
		 }

		function saver(url, winMode){

			if ('download' in anchor) { //html5 A[download]
				anchor.href = url;
				anchor.setAttribute("download", fileName);
				anchor.className = "download-js-link";
				anchor.innerHTML = "downloading...";
				anchor.style.display = "none";
 				anchor.addEventListener('click', function(e) {
 					e.stopPropagation();
 					this.removeEventListener('click', arguments.callee);
 				});
				document.body.appendChild(anchor);
				setTimeout(function() {
					anchor.click();
					document.body.removeChild(anchor);
					if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(anchor.href);}, 250 );}
				}, 66);
				return true;
			}

			// handle non-a[download] safari as best we can:
			if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
				if(/^data:/.test(url))	url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
				if(!window.open(url)){ // popup blocked, offer direct download:
					if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
				}
				return true;
			}

			//do iframe dataURL download (old ch+FF):
			var f = document.createElement("iframe");
			document.body.appendChild(f);

			if(!winMode && /^data:/.test(url)){ // force a mime that will download:
				url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
			}
			f.src=url;
			setTimeout(function(){ document.body.removeChild(f); }, 333);

		}//end saver




		if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
			return navigator.msSaveBlob(blob, fileName);
		}

		if(self.URL){ // simple fast and modern way using Blob and URL:
			saver(self.URL.createObjectURL(blob), true);
		}else{
			// handle non-Blob()+non-URL browsers:
			if(typeof blob === "string" || blob.constructor===toString ){
				try{
					return saver( "data:" +  mimeType   + ";base64,"  +  self.btoa(blob)  );
				}catch(y){
					return saver( "data:" +  mimeType   + "," + encodeURIComponent(blob)  );
				}
			}

			// Blob but not URL support:
			reader=new FileReader();
			reader.onload=function(e){
				saver(this.result);
			};
			reader.readAsDataURL(blob);
		}
		return true;
	}; /* end download() */