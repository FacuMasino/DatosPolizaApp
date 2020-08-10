var testjs = {
    "InstallmentPlan": [
        {
            "InstallmentPlanData": {
                "Plans": [
                    {
                        "Active": true,
                        "DownPayment": {
                            "Amount": 0,
                            "Currency": "ars",
                            "Description": "$0,00"
                        },
                        "ID": "PP-AGP-VRL6",
                        "Installment": {
                            "Amount": 11717.15,
                            "Currency": "ars",
                            "Description": "$11.717,15"
                        },
                        "Name": "Agraria particulares - 6 cuotas",
                        "Note": null,
                        "Total": {
                            "Amount": 70305,
                            "Currency": "ars",
                            "Description": "$70.305,00"
                        }
                    }
                ]
            },
            "PaymentMethod": {
                "CBU": null,
                "Collector": {
                    "Code": "producer",
                    "Description": "Agente"
                },
                "CreditCardNumber": null,
                "PaymentEntity": null,
                "Method": {
                    "Code": "responsive",
                    "Description": "Efectivo"
                },
                "PaymentType": null,
                "SendCouponsBy": {
                    "Code": "mail",
                    "Description": "Correo Postal"
                }
            },
            "Premium": {
                "ChangeInCost": {
                    "Amount": 70305,
                    "Currency": "ars",
                    "Description": "$70.305,00"
                },
                "InstallmentFees": {
                    "Amount": 0,
                    "Currency": "ars",
                    "Description": "$0,00"
                },
                "TotalCost": {
                    "Amount": 70305,
                    "Currency": "ars",
                    "Description": "$70.305,00"
                },
                "TotalPremium": {
                    "Amount": 51169.39,
                    "Currency": "ars",
                    "Description": "$51.169,39"
                },
                "TotalTaxesSurcharges": {
                    "Amount": 19135.61,
                    "Currency": "ars",
                    "Description": "$19.135,61"
                }
            }
        }
    ],
    "HasError": false,
    "HasWarning": false,
    "HasInformation": true,
    "Messages": [
        {
            "NombreServicio": "",
            "VersionServicio": "",
            "Description": "OK",
            "MessageBeautiful": "Obtención de pagos realizado con éxito.",
            "StackTrace": null,
            "ErrorLevel": 0
        }
    ]
};

console.log(testjs.InstallmentPlan[0].PaymentMethod.Method.Description);