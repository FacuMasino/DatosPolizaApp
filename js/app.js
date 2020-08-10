
async function GetInfo(pcId)
{
	const Params = {
		method: "POST",
		body: "pcID="+pcId,
		headers: {
			"Content-Type": "application/x-www-form-urlencoded"
		}
	}
  return fetch("/ver", Params)
}

async function BtnVerDatos(id)
{
	var pcId = "";
	document.getElementById("full_name").value ="";
	document.getElementById("payment_method").value = "";
	document.getElementById("discount_perc").value =  "";
	document.getElementById("ccCBU_number").value =  "";
	document.getElementById("CC_Entity").value =  "";
	document.getElementById("pc_status").value = "";
	document.getElementById("BtnVer").innerHTML = "Cargando...";
	try
	{
		let JsonRes = await GetInfo(document.getElementById(id).value)
		if(JsonRes.ok)
		{
			JsonRes = await JsonRes.json();
			if(JsonRes.HasError)
			{
				document.getElementById("full_name").value = JsonRes.AcName;
				document.getElementById("payment_method").value = JsonRes.PaymentMethod;
				document.getElementById("discount_perc").value = JsonRes.Discount + "%";
				document.getElementById("ccCBU_number").value = JsonRes.CBU;
				document.getElementById("ccCBU_number").value = JsonRes.CCard;
				document.getElementById("CC_Entity").value = JsonRes.CCEntity;
				document.getElementById("pc_status").value = JsonRes.Status;
				alert("Ocurrió un error: " + JsonRes.Msg)

			} else {
				document.getElementById("full_name").value = JsonRes.AcName;
				document.getElementById("payment_method").value = JsonRes.PaymentMethod;
				document.getElementById("discount_perc").value = JsonRes.Discount + "%";
				document.getElementById("pc_status").value = JsonRes.Status;
				if(JsonRes.PaymentMethod != "Efectivo")
				{
					if(JsonRes.CBU != null)
					{
						document.getElementById("ccCBU_number").value = JsonRes.CBU;
					} else {
						document.getElementById("ccCBU_number").value = JsonRes.CCard;
						document.getElementById("CC_Entity").value = JsonRes.CCEntity;
					}
					
				}
			}
			
		}
		else
		{
			alert("Ocurrió un error. ");
		}
	}
	catch (e)
	{
		alert("catched: " + e);
	}
	//alert(pcId);
	document.getElementById("BtnVer").innerHTML = "Ver Datos";
	
}