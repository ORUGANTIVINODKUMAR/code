const chartOfAccounts = {
  generalTown: {
    /* ================= FUND META ================= */
    meta: {
      code: "10",
      label: "GENERAL TOWN FUND"
    },

    /* ================= REVENUES ================= */
    Revenues: {
      meta: {
        label: "REVENUES"
      },
      accounts: [
        { code: "400", name: "Property Tax" },
        { code: "404", name: "Replacement Tax" },
        { code: "408", name: "Interest Income" },
        { code: "407", name: "Passport Income" },
        { code: "410", name: "Miscellaneous Income" },
        { code: "418", name: "TOIRMA Refund" }
      ]
    },

    /* ================= ADMINISTRATION ================= */
    Administration: {
      meta: {
        code: "101",
        label: "ADMINISTRATION"
      },

      Personnel: {
        meta: { label: "PERSONNEL" },
        accounts: [
          { code: "500", name: "Salaries" },
          { code: "502", name: "Health Insurance" },
          { code: "504", name: "Unemployment Insurance" },
          { code: "506", name: "Worker's Compensation" },
          { code: "508", name: "Social Security Contribution" }
        ]
      },

      "Contractual Services": {
        meta: { label: "CONTRACTUAL SERVICES" },
        accounts: [
          { code: "516", name: "Maintenance Service/Supplies-Vehicle" },
          { code: "518", name: "Maintenance Service-Grounds" },
          { code: "520", name: "Maintenance Service-Building" },
          { code: "522", name: "Maintenance Service-Equipment" },
          { code: "524", name: "Accounting Service" },
          { code: "526", name: "Legal Service" },
          { code: "528", name: "Postage" },
          { code: "530", name: "Telephone" },
          { code: "532", name: "Publishing" },
          { code: "534", name: "Printing / Public Relations" },
          { code: "536", name: "Dues" },
          { code: "538", name: "Travel Expense / Meeting" },
          { code: "540", name: "Training" },
          { code: "542", name: "Utilities" },
          { code: "544", name: "Worker's Compensation / Liability Insurance" },
          { code: "550", name: "Battery Recycling" },
          { code: "570", name: "Contract Payment - Ride in Kane" }
        ]
      },

      Commodities: {
        meta: { label: "COMMODITIES" },
        accounts: [
          { code: "560", name: "Office Supplies" },
          { code: "561", name: "Operating Supplies" }
        ]
      },

      "Capital Outlay": {
        meta: { label: "CAPITAL OUTLAY" },
        accounts: [
          { code: "574", name: "Transfer - General Assistance" },
          { code: "578", name: "Equipment" },
          { code: "579", name: "Building Reserve" },
          { code: "599", name: "Contingencies" }
        ]
      },

      "Other Expenditures": {
        meta: { label: "OTHER EXPENDITURES" },
        accounts: [
          { code: "580", name: "Miscellaneous Expense" },
          { code: "604", name: "Social Service Agency Misc. Grants" },
          { code: "608", name: "Community Room Expenses / Supplies" },
          { code: "610", name: "Youth Programs" }
        ]
      }
    },

    /* ================= ASSESSOR ================= */
    Assessor: {
      meta: {
        code: "102",
        label: "ASSESSOR"
      },

      Personnel: {
        meta: { label: "PERSONNEL" },
        accounts: [
          { code: "500", name: "Salaries" },
          { code: "502", name: "Health Insurance" },
          { code: "504", name: "Unemployment Insurance" },
          { code: "508", name: "Social Security Contribution" }
        ]
      },

      "Contractual Services": {
        meta: { label: "CONTRACTUAL SERVICES" },
        accounts: [
          { code: "522", name: "Maintenance Service-Equipment" },
          { code: "524", name: "Maintenance Service-Vehicle" },
          { code: "528", name: "Postage" },
          { code: "530", name: "Telephone" },
          { code: "532", name: "Publishing" },
          { code: "534", name: "Printing" },
          { code: "536", name: "Dues" },
          { code: "538", name: "Travel Expenses" },
          { code: "540", name: "Training" },
          { code: "541", name: "Publications" }
        ]
      },

      Commodities: {
        meta: { label: "COMMODITIES" },
        accounts: [
          { code: "560", name: "Office Supplies" }
        ]
      },

      "Capital Outlay": {
        meta: { label: "CAPITAL OUTLAY" },
        accounts: [
          { code: "578", name: "Equipment - Computer" },
          { code: "582", name: "Vehicle" }
        ]
      },

      "Other Expenditures": {
        meta: { label: "OTHER EXPENDITURES" },
        accounts: [
          { code: "599", name: "Contingencies" },
          { code: "580", name: "Professional Services" }
        ]
      }
    }
  },
  generalAssistance: {
  /* ================= FUND META ================= */
    meta: {
      code: "20",
      label: "GENERAL ASSISTANCE FUND"
    },
    /* ================= REVENUES ================= */
    Revenues: {
      meta: {
        label: "REVENUES"
      },
      accounts: [
        { code: "400", name: "Property Tax" },
        { code: "403", name: "Interfund - General Town" },
        { code: "408", name: "Interest Income" },
        { code: "410", name: "Miscellaneous Income" },
        { code: "412", name: "Reimb. Other Townships" }
      ]
    },
    /* ================= ADMINISTRATION ================= */
    Administration: {
      meta: {
        code: "201",
        label: "ADMINISTRATION"
      },

      Personnel: {
        meta: { label: "PERSONNEL" },
        accounts: [
          { code: "500", name: "Salaries" },
          { code: "502", name: "Health Insurance" },
          { code: "504", name: "Unemployment Insurance" },
          { code: "506", name: "Worker's Compensation" },
          { code: "508", name: "Social Security Contribution" }
        ]
      },

      "Contractual Services": {
        meta: { label: "CONTRACTUAL SERVICES" },
        accounts: [
          { code: "532", name: "Publishing" },
          { code: "534", name: "Printing / Public Relations" },
          { code: "538", name: "Travel Expenses" }
        ]
      },

      Commodities: {
        meta: { label: "COMMODITIES" },
        accounts: [
          { code: "560", name: "Office Supplies" }
        ]
      },

      "Capital Outlay": {
        meta: { label: "CAPITAL OUTLAY" },
        accounts: [
          { code: "574", name: "Equipment" }
        ]
      },

      "Other Expenditures": {
        meta: { label: "OTHER EXPENDITURES" },
        accounts: [
          { code: "576", name: "Miscellaneous Expense" }
        ]
      }
    },

    /* ================= HOME RELIEF ================= */
    "Home Relief": {
      meta: {
        code: "202",
        label: "HOME RELIEF"
      },

      "Commodities & Contractual Services": {
        meta: { label: "COMMODITIES & CONTRACTUAL SERVICES" },
        accounts: [
          { code: "600", name: "Physician Service" },
          { code: "602", name: "Hospital Service – In Patient" },
          { code: "604", name: "Hospital Service – Out Patient" },
          { code: "606", name: "Drugs" },
          { code: "608", name: "Dental Service" },
          { code: "610", name: "Other Medical Services" },
          { code: "612", name: "Funeral & Burial Service" },
          { code: "614", name: "Shelter" },
          { code: "616", name: "Utility Payment" },
          { code: "618", name: "Ambulance" },
          { code: "620", name: "Workfare" },
          { code: "622", name: "Miscellaneous" },
          { code: "624", name: "Fuel" },
          { code: "626", name: "Food" },
          { code: "628", name: "Emergency Assistance" },
          { code: "630", name: "Disaster Assistance" },
          { code: "632", name: "GA Catastrophe Insurance" },
          { code: "699", name: "Contingencies" }
        ]
      },

      "Other Expenditures": {
        meta: { label: "OTHER EXPENDITURES" },
        accounts: [
          { code: "580", name: "Miscellaneous Expense" }
        ]
      }
    }
  },


  cemetery: {
    meta: { code: "12", label: "CEMETERY FUND" },
    Revenues: { meta: { label: "REVENUES" }, accounts: [] },
    Expenditures: { meta: { code: "121", label: "EXPENDITURES" }, accounts: [] }
  },

  insurance: {
    meta: { code: "13", label: "INSURANCE FUND" },
    Revenues: { meta: { label: "REVENUES" }, accounts: [] },
    Expenditures: { meta: { code: "131", label: "EXPENDITURES" }, accounts: [] }
  },

  socialSecurity: {
    meta: { code: "14", label: "SOCIAL SECURITY FUND" },
    Revenues: { meta: { label: "REVENUES" }, accounts: [] },
    Expenditures: { meta: { code: "141", label: "EXPENDITURES" }, accounts: [] }
  },

  retirement: {
    /* ================= FUND META ================= */
    meta: {
      code: "300",
      label: "ILLINOIS MUNICIPAL RETIREMENT FUND"
    },

    /* ================= REVENUES ================= */
    Revenues: {
      meta: { label: "REVENUES" },
      accounts: [
        { code: "400", name: "Property Tax" },
        { code: "404", name: "Replacement Tax" },
        { code: "408", name: "Interest Income" }
      ]
    },

    /* ================= EXPENDITURES ================= */
    Expenditures: {
      meta: {
        code: "310",
        label: "EXPENDITURES"
      },

      Personnel: {
        meta: { label: "PERSONNEL" },
        accounts: [
          { code: "510", name: "Retirement Contribution" }
        ]
      }
    }
  },


  roadBridge: {
    meta: {
      code: "20",
      label: "ROAD & BRIDGE"
    },

    /* ================= NON-DEPARTMENTAL REVENUE ================= */
    Revenues: {
      meta: { label: "NON-DEPARTMENTAL REVENUE" },
      accounts: [
        { code: "400", name: "Property Tax" },
        { code: "402", name: "Replacement Tax" },
        { code: "408", name: "Interest Income" },
        { code: "414", name: "Intergovernmental" },
        { code: "416", name: "Program Fees" },
        { code: "418", name: "Sale of Fixed Assets" },
        { code: "420", name: "Miscellaneous" }
      ]
    },

    /* ================= ROAD DISTRICT ADMINISTRATION ================= */
    Administration: {
      meta: {
        code: "201",
        label: "ROAD DISTRICT ADMINISTRATION"
      },

      Expenditure: {
        meta: { label: "EXPENDITURE" },
        accounts: [
          { code: "500", name: "Wages" },
          { code: "502", name: "Taxes & Benefits" },
          { code: "504", name: "Other Employee Costs" },
          { code: "520", name: "Administrative Services" },
          { code: "530", name: "Utilities" },
          { code: "516", name: "Maintenance Services" },
          { code: "560", name: "Administrative Supplies" },
          { code: "580", name: "Community Support" },
          { code: "582", name: "Individual Support" },
          { code: "599", name: "Miscellaneous" }
        ]
      }
    },

    /* ================= ROAD MAINTENANCE ================= */
    Maintenance: {
      meta: {
        code: "202",
        label: "ROAD MAINTENANCE"
      },

      Expenditure: {
        meta: { label: "EXPENDITURE" },
        accounts: [
          { code: "500", name: "Wages" },
          { code: "502", name: "Taxes & Benefits" },
          { code: "504", name: "Other Employee Costs" },
          { code: "520", name: "Administrative Services" },
          { code: "516", name: "Program Services" },
          { code: "530", name: "Utilities" },
          { code: "518", name: "Maintenance Services" },
          { code: "560", name: "Maintenance Supplies" },
          { code: "599", name: "Miscellaneous" },
          { code: "699", name: "Contingency" }
        ]
      }
    }
  },



  permanentRoad: {
    meta: {
      code: "24",
      label: "R&B SPECIAL ROAD IMPROVEMENT"
    },

    /* ================= NON-DEPARTMENTAL REVENUE ================= */
    Revenues: {
      meta: { label: "NON-DEPARTMENTAL REVENUE" },
      accounts: [
        { code: "400", name: "Property Tax" },
        { code: "408", name: "Interest Income" },
        { code: "414", name: "Intergovernmental" },
        { code: "416", name: "Program Fees" },
        { code: "420", name: "Miscellaneous" }
      ]
    },

    /* ================= ROAD MAINTENANCE ================= */
    Maintenance: {
      meta: {
        code: "241",
        label: "ROAD MAINTENANCE"
      },

      Expenditure: {
        meta: { label: "EXPENDITURE" },
        accounts: [
          { code: "500", name: "Wages" },
          { code: "502", name: "Taxes & Benefits" },
          { code: "520", name: "Administrative Services" },
          { code: "516", name: "Program Services" },
          { code: "530", name: "Utilities" },
          { code: "518", name: "Maintenance Services" },
          { code: "560", name: "Maintenance Supplies" },
          { code: "570", name: "Capital" },
          { code: "599", name: "Miscellaneous" },
          { code: "699", name: "Contingency" }
        ]
      }
    },

    
  },


  equipmentBuilding: {
    meta: {
      code: "22",
      label: "R&B BUILDING & EQUIPMENT"
    },

    /* ================= NON-DEPARTMENTAL REVENUE ================= */
    Revenues: {
      meta: { label: "NON-DEPARTMENTAL REVENUE" },
      accounts: [
        { code: "400", name: "Property Tax" },
        { code: "408", name: "Interest Income" },
        { code: "418", name: "Sale of Assets" }
      ]
    },

    /* ================= NON-DEPARTMENTAL EXPENDITURE ================= */
    Expenditures: {
      meta: {
        code: "221",
        label: "NON-DEPARTMENTAL EXPENDITURE"
      },
      accounts: [
        { code: "520", name: "Administrative Services" },
        { code: "570", name: "Capital" },
        { code: "599", name: "Miscellaneous" },
        { code: "699", name: "Contingency" }
      ]
    }
  },


  motorFuelTax: {
    meta: {
      code: "24",
      label: "R&B TORT JUDGMENT & LIABILITY INSURANCE"
    },

    /* ================= NON-DEPARTMENTAL REVENUE ================= */
    Revenues: {
      meta: { label: "NON-DEPARTMENTAL REVENUE" },
      accounts: [
        { code: "400", name: "Property Tax" },
        { code: "408", name: "Interest Income" }
      ]
    },

    /* ================= NON-DEPARTMENTAL EXPENDITURE ================= */
    Expenditures: {
      meta: {
        code: "241",
        label: "NON-DEPARTMENTAL EXPENDITURE"
      },
      accounts: [
        { code: "510", name: "Taxes & Benefits" },
        { code: "544", name: "Insurance" },
        { code: "599", name: "Miscellaneous" },
        { code: "699", name: "Contingency" }
      ]
    }
  }



};

export default chartOfAccounts;
