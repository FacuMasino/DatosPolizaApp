
async function viewRenewals()
{
	const Url = '/getRenewals';
	const Params = {
		headers: {
			//"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzIwNjI5NTg5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InNjb3R0aTI5ODciLCJVc2VySWQiOjMxMDUzLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcm9kdWN0b3IiLCJIYXNoZWRQYXNzd29yZCI6IjEyYWQyODk1NjU4OTZkZmNhYmQ1NWVhZTNjZmJjZTU0NTdjNDMyNGUiLCJuYmYiOjE1OTU0MTYyOTEsImV4cCI6MTYwMDYwMDI5MX0.p9Jwyxd43n7UbyUDxIIImiFcCD-bVIvbyDf5xqx5m4Q",
		},
		method: "GET"
	}
  return fetch(Url, Params)

}

async function getDiscount(pc)
{
	const Url = '/descuento?pc=' + pc;
	const Params = {
		headers: {
			//"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzIwNjI5NTg5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InNjb3R0aTI5ODciLCJVc2VySWQiOjMxMDUzLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcm9kdWN0b3IiLCJIYXNoZWRQYXNzd29yZCI6IjEyYWQyODk1NjU4OTZkZmNhYmQ1NWVhZTNjZmJjZTU0NTdjNDMyNGUiLCJuYmYiOjE1OTU0MTYyOTEsImV4cCI6MTYwMDYwMDI5MX0.p9Jwyxd43n7UbyUDxIIImiFcCD-bVIvbyDf5xqx5m4Q",
		},
		method: "GET"
	}
  return fetch(Url, Params)

}

var motos = [];

async function getRenewals(){
    
    let renewals = await viewRenewals()
    renewals = await renewals.json();

    for(i = 0; i <= renewals.count -1;i++){
        let moto = renewals.renewals[i];
        
        let descuento = "-";

        if(moto.renewalStatus.description != "Renovada"){
            descuento = await (await getDiscount(moto.renewalPolicyPeriodId)).json();
            if(descuento.HasError){
                console.log("Error en " + moto.renewalPolicyPeriodId + " " + descuento.message);
                descuento = "Err";
            } else {
                descuento = descuento.descuento;
            }
        }

        motos.push({
            "Socio": moto.clientName,
            "Patente": moto.vehicleLicensePlate,
            "Vigencia": moto.effectiveDate,
            "Estado": moto.renewalStatus.description,
            "Productor": moto.producerCode,
            "Descuento": descuento,
            "Suma Anterior": moto.vehiclePreviousStatedAmount,
            "Suma Nueva": moto.vehicleStatedAmount,
            "Poliza": "<a target='_blank' href='https://pas.sancristobal.com.ar/PortalSCNet/PortalPas/AccesoAPortalPas.aspx?Destino=PolizaIndividual&casa=5&ramo=21&polizaNro=" + moto.policyNumber + "'>" + moto.policyNumber + "</a>",
            "Editar": "<a target='_blank' href='https://portalpas.sancristobal.com.ar/EmissionAutomovil/Index?usuario=scotti2987&cuit=2320629589&publicId="+ moto.renewalPolicyPeriodId +"&isquote=false'>" + moto.renewalPolicyPeriodId + "</a>"
        });

        //console.log(moto.clientName + " " + moto.policyNumber);
    }

    let myBooks = motos;
    console.log(motos);
    var col = [];
    for (var i = 0; i < myBooks.length; i++) {
        for (var key in myBooks[i]) {
            if (col.indexOf(key) === -1) {
                col.push(key);
            }
        }
    }

    // CREATE DYNAMIC TABLE.
    var table = document.createElement("table");

    // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

    var tr = table.insertRow(-1);                   // TABLE ROW.

    for (var i = 0; i < col.length; i++) {
        var th = document.createElement("th");      // TABLE HEADER.
        th.innerHTML = col[i];
        tr.appendChild(th);
    }

    // ADD JSON DATA TO THE TABLE AS ROWS.
    for (var i = 0; i < myBooks.length; i++) {

        tr = table.insertRow(-1);

        for (var j = 0; j < col.length; j++) {
            var tabCell = tr.insertCell(-1);
            if(myBooks[i][col[j]] == "Renovada"){
                tr.bgColor = "#3dcc98";
            }
            tabCell.innerHTML = myBooks[i][col[j]];
        }
    }

    // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
    var divContainer = document.getElementById("showData");
    divContainer.innerHTML = "";
    divContainer.appendChild(table);
}