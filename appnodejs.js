const fetch = require("node-fetch");
//document.cookie = ".ASPXAUTH=E7D30513149B9D5C8CC1A44CB3C1A540DBC9F77F939BFD29E5E7F9FEED0C80091BD20368C562AE7FE51780F586A24AF0E4AC0D00414B81A5C382B71BBE2855D92750A1AD86931E9B6F59243DC6943DD5C1258ED28C768B452C4D94BF2D50E9F5CACC10894300DA726402EA15DFF6FF72DB264CA92D5DE9052E0B8228A6FF0AE4A5B380591095BA85B339192041FD1667; SameSite=None";
async function GetPcSummaryAuto(PcN)
{
	const UrlPcSummaryAuto = 'https://api.sancristobal.com.ar/policyinfoapi/api/Summary/HeaderPolicyDetails?policyNumber=' + PcN;
	const Params = {
		headers: {
			"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyMzIwNjI5NTg5IiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvbmFtZSI6InNjb3R0aTI5ODciLCJVc2VySWQiOjMxMDUzLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJQcm9kdWN0b3IiLCJIYXNoZWRQYXNzd29yZCI6IjEyYWQyODk1NjU4OTZkZmNhYmQ1NWVhZTNjZmJjZTU0NTdjNDMyNGUiLCJuYmYiOjE1OTU0MTYyOTEsImV4cCI6MTYwMDYwMDI5MX0.p9Jwyxd43n7UbyUDxIIImiFcCD-bVIvbyDf5xqx5m4Q"
		},
		method: "GET"
	}
  return fetch(UrlPcSummaryAuto, Params)
	//.then(res=>{alert(res.account.name)})
      //.then(response => response.json())
      //.then(json => {
      //  return json
	  //});
	  //.then(response => {return response});
}

async function GetPcPaymentInfo(pcId)
{
	const UrlPcSummaryAuto = 'https://portalpas.sancristobal.com.ar/Payments/GetInstallmentPlan?PolicyPeriodId=' + pcId;
	const Params = {
		headers: {
			"Cookie": ".ASPXAUTH=E7D30513149B9D5C8CC1A44CB3C1A540DBC9F77F939BFD29E5E7F9FEED0C80091BD20368C562AE7FE51780F586A24AF0E4AC0D00414B81A5C382B71BBE2855D92750A1AD86931E9B6F59243DC6943DD5C1258ED28C768B452C4D94BF2D50E9F5CACC10894300DA726402EA15DFF6FF72DB264CA92D5DE9052E0B8228A6FF0AE4A5B380591095BA85B339192041FD1667",
			//'Access-Control-Allow-Credentials': 'true',
		},
		method: "GET",
		//mode: 'cors',
		//credentials: "include"
		
	}
  return fetch(UrlPcSummaryAuto, Params)
	//.then(res=>{alert(res.account.name)})
      //.then(response => response.json())
      //.then(json => {
      //  return json
	  //});
	  //.then(response => {return response});
}

async function BtnVerDatos(id)
{
	var pcId = "";
	console.log("Cargando...");
	try
	{
		let JsonRes = await GetPcSummaryAuto(id);
		console.log("se esta ejecutando..");
		if(JsonRes.ok)
		{
			JsonRes = await JsonRes.json();
			console.log(JsonRes.account.name)
			//document.getElementById("payment_method").value = JsonRes.stateAccount.paymentMethod;
			pcId = JsonRes.policyInfo.policyPeriodId;
			let JsonRes2 = await GetPcPaymentInfo(pcId);
			JsonRes2 = await JsonRes2.json();
			//alert(JsonRes2.InstallmentPlan);
            //console.log(JsonRes2.InstallmentPlan.PaymentMethod.Method.Description);
			console.log(JSON.stringify(JsonRes2));
		}
		else
		{
			console.log("Ocurrió un error: " +  JSON.parse(await JsonRes.text()).message);
		}
		return "s";
		
	}
	catch (e)
	{
		console.log("catched: " + e);
	}
	//alert(pcId);
	//document.getElementById("BtnVer").innerHTML = "Ver Datos";
}

console.log("go!");
BtnVerDatos("01-05-01-30315451")
	.then(res => {console.log("ok0")})
//GetPcSummaryAuto("01-05-01-30315451")
	
console.log("ok");