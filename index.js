const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const console = require("console");

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

//<Firebase>
var admin = require('firebase-admin');
var serviceAccount = require("./appverdatoskey.json");

var authCKey = ""; //Clave de auth para Cookie .ASPXAUTH

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://appverdatos.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("tkn");

//Obtener
async function getAuthKey(){
    ref.once("value", function(data) {
    authCKey = (data.val().tknid0.content);
    console.log("Clave .ASPXAUTH Actualizada. > " + authCKey)
    });
}

//Guardar Clave
async function setAuthKey(aKey)
{
    var dbAuthCKey = ref.child('tknid0');
        return dbAuthCKey.set({testing: 'algo', content: aKey})
            .then(function() {
                return('Clave agregada: ' + aKey);
            })
            .catch(function(error) {
                return('Ocurrió un error: ' + error.message);
            });
}
//</Firebase>

var port = process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

let PcData = {
	AcName: '',
	PaymentMethod: '',
	CCard:'',
	CCEntity: '',
	CBU:null,
	Discount:null,
	Status: null,
	pc: null,
	HasError: Boolean,
	Msg: ''
}

/*async function GetPcSummaryAuto(PcN)
{
	const UrlPcSummaryAuto = 'https://api.sancristobal.com.ar/policyinfoapi/api/Summary/HeaderPolicyDetails?policyNumber=' + PcN;
	const Params = {
		headers: {
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzIwNjI5NTg5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InNjb3R0aTI5ODciLCJVc2VySWQiOjMxMDUzLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcm9kdWN0b3IiLCJIYXNoZWRQYXNzd29yZCI6IjEyYWQyODk1NjU4OTZkZmNhYmQ1NWVhZTNjZmJjZTU0NTdjNDMyNGUiLCJuYmYiOjE1OTU0MTYyOTEsImV4cCI6MTYwMDYwMDI5MX0.p9Jwyxd43n7UbyUDxIIImiFcCD-bVIvbyDf5xqx5m4Q"
		},
		method: "GET"
	}
  return fetch(UrlPcSummaryAuto, Params)

}*/

async function getVehicles(pcId){
    //https://api.sancristobal.com.ar/policyinfoapi/api/InfoRisk/Vehicles?policyPeriodId=pc:13359640&page=1&pageSize=50
   	const Url = 'https://api.sancristobal.com.ar/policyinfoapi/api/InfoRisk/Vehicles?policyPeriodId=' + pcId + '&page=1&pageSize=50';
	const Params = {
		headers: {
			"Cookie": ".ASPXAUTH=" + authCKey,
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzIwNjI5NTg5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InNjb3R0aTI5ODciLCJVc2VySWQiOjMxMDUzLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcm9kdWN0b3IiLCJIYXNoZWRQYXNzd29yZCI6IjEyYWQyODk1NjU4OTZkZmNhYmQ1NWVhZTNjZmJjZTU0NTdjNDMyNGUiLCJuYmYiOjE1OTU0MTYyOTEsImV4cCI6MTYwMDYwMDI5MX0.p9Jwyxd43n7UbyUDxIIImiFcCD-bVIvbyDf5xqx5m4Q",
		},
		method: "GET"
	}
    return fetch(Url, Params) 
}

async function GetPcSummaryAuto(PcN)
{
	const UrlPcSummaryAuto = 'https://portalpas.sancristobal.com.ar/PolicySearch/getPolicyByPolicyNumber?PolicyNumber=' + PcN;
	const Params = {
		headers: {
			"Cookie": ".ASPXAUTH=" + authCKey,
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzIwNjI5NTg5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InNjb3R0aTI5ODciLCJVc2VySWQiOjMxMDUzLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcm9kdWN0b3IiLCJIYXNoZWRQYXNzd29yZCI6IjEyYWQyODk1NjU4OTZkZmNhYmQ1NWVhZTNjZmJjZTU0NTdjNDMyNGUiLCJuYmYiOjE1OTU0MTYyOTEsImV4cCI6MTYwMDYwMDI5MX0.p9Jwyxd43n7UbyUDxIIImiFcCD-bVIvbyDf5xqx5m4Q",
		},
		method: "GET"
	}
  return fetch(UrlPcSummaryAuto, Params)

}

async function GetPcPaymentInfo(pcId,Discount = Boolean)
{
	const UrlPcSummaryAuto = 'https://portalpas.sancristobal.com.ar/Payments/GetInstallmentPlan?PolicyPeriodId=' + pcId;
	const UrlPcDiscount = 'https://portalpas.sancristobal.com.ar/CommercialAlternatives/getCommercialAlternatives?policyPeriodId=' + pcId;
	const Params = {
		headers: {
			"Cookie": ".ASPXAUTH="+ authCKey,
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzIwNjI5NTg5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InNjb3R0aTI5ODciLCJVc2VySWQiOjMxMDUzLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcm9kdWN0b3IiLCJIYXNoZWRQYXNzd29yZCI6IjEyYWQyODk1NjU4OTZkZmNhYmQ1NWVhZTNjZmJjZTU0NTdjNDMyNGUiLCJuYmYiOjE1OTU0MTYyOTEsImV4cCI6MTYwMDYwMDI5MX0.p9Jwyxd43n7UbyUDxIIImiFcCD-bVIvbyDf5xqx5m4Q",
		},
		method: "GET",
	}
	if(!Discount) {
		return fetch(UrlPcSummaryAuto, Params)
	} else {
		return fetch(UrlPcDiscount, Params)
	}
  
}

async function getRenewals(){
    const opts = {
        "page": 1,
        "pageSize": 100,
        "refresh": false,
        "isAvailable": true,
        "isRejected": true,
        "isPending": true,
        "isLocked": true,
        "isIssued": false,
        "producerCode": "05-002987",
        "orderBy": "RenewalStatus",
        "sortDirection": "ASC",
        "policyProductCode": "CA7CommAuto",
        "policyTypeCode": "CA7_Motorcycle"
    }
    
    //UPDATE AUTHKEY
    getAuthKey();
	
	const Params = {
	method: "POST",
	body: JSON.stringify(opts),
		headers: {
	    "Content-Type": "application/json",
		//"Cookie": ".ASPXAUTH="+ authCKey,
	    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzIwNjI5NTg5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InNjb3R0aTI5ODciLCJVc2VySWQiOjMxMDUzLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcm9kdWN0b3IiLCJIYXNoZWRQYXNzd29yZCI6IjEyYWQyODk1NjU4OTZkZmNhYmQ1NWVhZTNjZmJjZTU0NTdjNDMyNGUiLCJuYmYiOjE1OTU0MTYyOTEsImV4cCI6MTYwMDYwMDI5MX0.p9Jwyxd43n7UbyUDxIIImiFcCD-bVIvbyDf5xqx5m4Q"
		}
	}
    return fetch("https://api.sancristobal.com.ar/portalpas/api/renewals", Params)    
}

async function VerDatos(id)
{
	console.log("Cargando...");
	try
	{
		let JsonRes = await GetPcSummaryAuto(id);
		if(JsonRes.ok)
		{
			JsonRes = await JsonRes.json();

			//console.log(JsonRes.account.name)
			if(JsonRes.HasError)
			{
				PcData.HasError = true;
				PcData.Msg = "[PcSummary]Error al obtener póliza: " +  JsonRes.Messages[0].Description;
				return PcData;
			}

			PcData.pc = JsonRes.PolicySummary[0].PolicyPeriodID;

			if(JsonRes.PolicySummary[0].Companyname == null)
			{
				PcData.AcName = JsonRes.PolicySummary[0].FirstName + " " + JsonRes.PolicySummary[0].LastName;
			} else {
				PcData.AcName = JsonRes.PolicySummary[0].Companyname;
			}

			if(JsonRes.PolicySummary[0].Poliza.AccountPaymentMethod == "responsive")
			{
				PcData.PaymentMethod = "Efectivo";
			} 
			else if (JsonRes.PolicySummary[0].Poliza.AccountPaymentMethod == "creditcard")
			{
				PcData.PaymentMethod = "Tarjeta de Crédito";
			} else if (JsonRes.PolicySummary[0].Poliza.AccountPaymentMethod == "directDebit") {
				PcData.PaymentMethod = "Débito Directo";
			} else {
				PcData.PaymentMethod = JsonRes.PolicySummary[0].Poliza.AccountPaymentMethod;
			}
			
			// Si la póliza está cancelada intenta obtener CBU o CC del policysummary, 
			// porque GetPcPaymentInfo va a dar error por estar canc
			if(JsonRes.PolicySummary[0].CancDate != null)
			{
				PcData.Status = "Cancelada";
				if(PcData.PaymentMethod == "Débito Directo")
				{
					if(JsonRes.PolicySummary[0].Poliza.CreditCardNumberCBU != null)
					{
						console.log("no es null?");
						PcData.CBU = JsonRes.PolicySummary[0].Poliza.CreditCardNumberCBU;

					} else {
						
						PcData.CBU = "No se pudo obtener.";
						console.log(PcData.CBU);
					}

				} else {
					PcData.CCard = JsonRes.PolicySummary[0].Poliza.CreditCardNumberCBU;
					PcData.CCEntity = "No se pudo obtener.";
				}
				
			} else {
				PcData.Status = JsonRes.PolicySummary[0].Status;
			}

			let JsonRes2 = await GetPcPaymentInfo(PcData.pc, false);

			if(JsonRes2.ok)
			{
				JsonRes2 = await JsonRes2.json();

				if(JsonRes2.HasError)
				{
					PcData.HasError = true;
					PcData.Msg = "[InfoPago]Error: " +  JsonRes2.Messages[0].MessageBeautiful;
					if(PcData.PaymentMethod != "Efectivo")
					{
						if(JsonRes.PolicySummary[0].Poliza.CreditCardNumberCBU != null)
						{
							if(PcData.PaymentMethod == "Tarjeta de Crédito")
							{
								PcData.CCEntity = "No se pudo Obtener.";
								PcData.CCard = JsonRes.PolicySummary[0].Poliza.CreditCardNumberCBU;
							} else {
								PcData.CBU = JsonRes.PolicySummary[0].Poliza.CreditCardNumberCBU;
							}

						} else {
							PcData.CCEntity = "No se pudo obtener.";
							PcData.CBU = "No se pudo obtener.";
							PcData.CCard = "No se pudo obtener.";
						}

					}

					console.log(JSON.stringify(JsonRes2));
					//return PcData;
				} else {

					if(PcData.PaymentMethod != "Efectivo")
					{
						if(JsonRes2.InstallmentPlan[0].PaymentMethod.CBU != null)
						{
							console.log("hay cbu");
							PcData.CBU = JsonRes2.InstallmentPlan[0].PaymentMethod.CBU;
						} else {
							PcData.CCard = JsonRes2.InstallmentPlan[0].PaymentMethod.CreditCardNumber;
							PcData.CCEntity = JsonRes2.InstallmentPlan[0].PaymentMethod.PaymentEntity.Description;
						}
					}
				}

				let JsonRes3 = await GetPcPaymentInfo(PcData.pc, true);

				if(JsonRes3.ok)
				{
					
					JsonRes3 = await JsonRes3.json();
					if(JsonRes3.ComercialAlternatives != null)
					{
						let Discounts = 0;
						let Alternatives = Object.keys(JsonRes3.ComercialAlternatives).length;
						for(i=0;i < Alternatives;i++) 
						{
							Discounts += JsonRes3.ComercialAlternatives[i].CreditDebit;
						}																	
						PcData.Discount = Discounts * 100;
					}															

				} else {
					PcData.Discount = "No se pudo obtener " + JsonRes3.statusText;
					PcData.Msg = JSON.parse(await JsonRes3.text()).message;
				}

				if(!PcData.HasError)
				{
					PcData.HasError = false;
				}
				return PcData;

			} else {
				PcData.HasError = true;
				PcData.Msg = "Error al obtener plan de pagos: " + JSON.parse(await JsonRes2.text()).message;
				return PcData;
			}
		} else {

			PcData.HasError = true;
			PcData.Msg = "Error al obtener póliza: " +  JSON.parse(await JsonRes.text()).message;
			return PcData;
		}
		
	}
	catch (e)
	{
		PcData.HasError = true;
		PcData.Msg = "Error Catch: " + e;
		console.log("Error Catch: " + e + e.stack);
		return PcData;
	}
	//alert(pcId);
	//document.getElementById("BtnVer").innerHTML = "Ver Datos";
	
}

async function getPcId(pcN) {
    let res = await GetPcSummaryAuto(pcN);
    if(res.ok){
        let resJson = await res.json();
        if(resJson.HasError){
            return 1;
        } else {
            return resJson.PolicySummary[0].PolicyPeriodID;
        }
    }
}

async function getDiscount(pc){

    let JsonRes = await GetPcPaymentInfo(pc, true);

    if(JsonRes.ok)
    {
        
        JsonRes = await JsonRes.json();
        if(JsonRes.ComercialAlternatives != null)
        {
            let Discounts = 0;
            let Alternatives = Object.keys(JsonRes.ComercialAlternatives).length;
            for(i=0;i < Alternatives;i++) 
            {
                Discounts += JsonRes.ComercialAlternatives[i].CreditDebit;
            }																	
            return {"descuento":Discounts * 100, "HasError": false};
        }else {
            return {"descuento":"0","HasError":false};
        }														

    } else {
        return {"HasError": true, "message": "No se pudo obtener " + JsonRes.statusText};
        //PcData.Msg = JSON.parse(await JsonRes3.text()).message;
    }  
}

app.get('/', function (req, res) {
    //Actualizar AuthKey Cookie header
    getAuthKey();

    // Enviar index
    res.sendFile(path.join(__dirname  + "/index.html"));
	});

app.get('/js/app.js', function(req,res){
    res.sendFile(path.join(__dirname + '/js/app.js')); 
});

app.get('/js/pcDownloader.js', function(req,res){
    res.sendFile(path.join(__dirname + "/js/pcDownloader.js"));
});

app.get('/js/renovacionesmotos.js', async function(req,res){
    res.sendFile(path.join(__dirname + "/js/renovacionesmotos.js"));
});

app.get('/renovacionesmotos', async function(req,res){
    res.sendFile(path.join(__dirname + "/renovacionesmotos.html"));
});

app.get('/descuento', async function(req,res){
    res.header('Access-Control-Allow-Origin', '*');
    try {
        if(req.query.pc.length > 0)
        {
            resp = await getDiscount(req.query.pc);
            res.send(resp);
            //console.log(await setAuthKey(req.query.key))
        } else {
            res.status(200).send("Consulta inválida, falta pc.");
        }
    }
    catch(e) {
        res.status(500).send("Consulta inválida. " + e + " " + e.stack);
    }
});

app.get('/setAuthKey', async function(req,res){
    res.header('Access-Control-Allow-Origin', '*');
    try {
        if(req.query.key.length > 0)
        {
            resp = await setAuthKey(req.query.key);
            res.send(resp);
            //console.log(await setAuthKey(req.query.key))
        } else {
            res.status(500).send("Consulta inválida, no se ingresó clave");
        }
    }
    catch(e) {
        res.status(500).send("Consulta inválida. " + e + " " + e.stack);
    }
})

app.get('/getRenewals', async function(req,res){
    res.header('Access-Control-Allow-Origin', '*');
    try {
        resp = await getRenewals();
        resp = await resp.json();
        res.send(resp);
    }
    catch {
        res.status(500).send("Ocurrió un error en la app");
    }
})

app.get('/getVehicles', async function(req,res){
    res.header('Access-Control-Allow-Origin', '*');
    try {
        if(req.query.policyNumber.length > 0)
        {
            pcN = await getPcId(req.query.policyNumber);
            if(pcN == 1){
                res.status(500).send("Error en consulta a San Cristóbal API");
            } else {
                resp = await getVehicles(pcN);
                if(resp.ok){

                    let vehicleData = [];
                    let vehicles = await resp.json();

                    for(i=0;i <= vehicles.count - 1;i++){
                        vehicleData.push(vehicles.vehicles[i].licensePlate);
                    }

                    res.send(JSON.stringify(vehicleData));

                } else {
                    res.status(500).send("Error en consulta a San Cristóbal API");
                }
            }
        } else {
            res.status(500).send("Consulta inválida, no se ingresó pc");
        }
    }
    catch (e) {
        console.log("Error Catch: " + e + e.stack);
        res.status(500).send(JSON.stringify(e + e.stack));
    }
})


app.post('/ver',async function(req, res) {
	var pcID = req.body.pcID;
	PcData = {
		AcName: '',
		PaymentMethod: '',
		CCard:'',
		CCEntity: '',
		CBU:null,
		Discount:null,
		Status: null,
		pc: null,
		HasError: Boolean,
		Msg: ''
	}
	console.log(pcID);
	res.send(await VerDatos(pcID));
	console.log("Listo.");
	//VerDatos(pcID)
		//.then(resp => {res.send.bind(res)(resp)})
	});

app.listen(port, () => {
    console.log("El servidor está inicializado en el puerto 3000");
   });

   
   
