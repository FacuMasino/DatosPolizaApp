const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const path = require("path");
const fetch = require("node-fetch");
const { Console } = require("console");

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

async function GetPcSummaryAuto(PcN)
{
	const UrlPcSummaryAuto = 'https://portalpas.sancristobal.com.ar/PolicySearch/getPolicyByPolicyNumber?PolicyNumber=' + PcN;
	const Params = {
		headers: {
			//"Cookie": ".ASPXAUTH=1B5B1F932446A6BFED12A3FAD49B368B66B988B56E7F8454EF4E2E58582D82247DB0F1D6882566D94092D0A17288335E83489F65B14499DE60DC871DF1C9793C7F6ED718B2BB4465D9F6AFA1B96660B99CF9E4BF56190473F1199D0802041E57CC74489E6DF1581C5D15E8981FA252DA10596E5D90C03D9C2F94AE29FEDB315E4F4164949C2E57BF0D6E08C47E93BF6E",
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
			//"Cookie": ".ASPXAUTH=1B5B1F932446A6BFED12A3FAD49B368B66B988B56E7F8454EF4E2E58582D82247DB0F1D6882566D94092D0A17288335E83489F65B14499DE60DC871DF1C9793C7F6ED718B2BB4465D9F6AFA1B96660B99CF9E4BF56190473F1199D0802041E57CC74489E6DF1581C5D15E8981FA252DA10596E5D90C03D9C2F94AE29FEDB315E4F4164949C2E57BF0D6E08C47E93BF6E",
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

async function VerDatos(id)
{
	var pcId = "";
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

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname  + "/index.html"));
	});

app.get('/js/app.js', function(req,res){
    res.sendFile(path.join(__dirname + '/js/app.js')); 
});

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

   
   
