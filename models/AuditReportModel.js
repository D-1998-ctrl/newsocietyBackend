const mongoose = require('mongoose');

const AuditReportSchema = new mongoose.Schema({

    // tempId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'audittemplate'
    // },
    // subject: {
    //     type: String,
    //     // required: true,
    // },
    // tempBody: {
    //     type: String,
    //     // required: true,
    // },

     templates: [
      {
        tempId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "audittemplate", 
          required: true,
        },

        tempName: {
          type: String,
        },
        subject: {
          type: String,
        },
        tempBody: {
          type: String,
        },
      },
    ],
    societyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Society'
    },
    auditorname: {
        type: String,
        // required: true,
    },
    auditoraddress: {
        type: String,
        // required: true,
    },
    auditormobileno: {
        type: String,
        // required: true,
    },
    // 
    presentAuditfromDate: {
        type: Date,

    },
    presentAuditToDate: {
        type: Date,

    },

    AuditcompletedfromDate: {
        type: Date,

    },

    AuditcompletedToDate: {
        type: Date,
    },


    AuditsubmittedDate: {
        type: Date,
    },

    Ordinary: {
        type: Number,
    },

    Normal: {
        type: Number,
    },

    Sympathizer: {
        type: Number,
    },

    Societies: {
        type: Number,
    },

    others: {
        type: Number,
    },

    memberpaidentrancefee: {
        type: Boolean,
    },
    memberapplicationsfilledproperty: {
        type: Boolean,
    },

    membersIMSCRules: {
        type: Boolean,
    },

    membersJMSCRules: {
        type: Boolean,
    },

    decreaseddismissedorregister: {
        type: Boolean,
    },

    resignationdulyaccepted: {
        type: Boolean,
    },

    membersnominations: {
        type: Boolean,
    },

    //
    applicationforshares: {
        type: Boolean,
    },

    Isshareregisteruptodate: {
        type: Boolean,
    },

    entriesincashbook: {
        type: Boolean,
    },

    writtenledger: {
        type: Boolean,
    },

    totalofshareledger: {
        type: Boolean,
    },
    sharecertificatesissued: {
        type: Boolean,
    },

    sharestransfersandrefunds: {
        type: Boolean,
    },
//
    byelawsborrowingssociety: {
        type: Boolean,
    },

    hasitbeenexceeded: {
        type: Boolean,
    },

    permissioncompetentauthority: {
        type: Boolean,
    },

    //5 MEETINGS:

    AnnualGeneralMeetingDate: {
        type: Date
    },

    SpecialGeneralMeetingFromDate: {
        type: Date
    },

    SpecialGeneralMeetingToDate: {
        type: Date
    },
    NoOfBoardMeetings: {
        type: String
    },
    NoOfSubCommitteeMeetings: {
        type: String
    },
    NoofotherMeetings: {
        type: String
    },

    
    //6 RECTIFICATION REPORTS 
    //(i) 
    societysubmittedauditrectification: {
        type: Boolean
    },
    // if yes
    societysubmittedauditrectificationDate: {
        type: Date
    },
    //if no
    societysubmittedauditrectificationReson: {
        type: String
    },

    //(ii)
    importantpointsmentionedneglectedSociety: {
        type: Boolean
    },

    //if yes
    generalremarks: {
        type: String
    },

    //7 AUDIT FEE :
    //i)
    auditfees: {
        type: String
    },

    //ii)
    detailsaboutoutstandingauditfees: {
        type: String
    },

    //8 INTERNAL OR LOCAL AUDIT
    internallocalaudit: {
        type: String
    },
    //ii
    CoordinationbetweenAuditor: {
        type: String
    },
    // 9 MANAGING DIRECTOR/MANAGER/ SECRETARY 
    Nameofofficer: {
        type: String
    },

    PaydrawnGrade: {
        type: String
    },

    otherallowances: {
        type: String
    },

    whetherismember: {
        type: Boolean
    },
    hasBorrowed: {
        type: String
    },
    otherAmountsDue: {
        type: Boolean
    },
    listofStaff: {
        type: String
    },
    //BREACHES : 
    hasCopyOfActRulesByeLaws: {
        type: Boolean
    },

    //ii)
    //1
    SectionNo: {
        type: String
    },
    //2
    RulesNos: {
        type: String
    },
    //3
    ByeLawsNo: {
        type: String
    },
    //iii
    rulesundertheByelaws: {
        type: Boolean
    },

    //11 PROFIT AND LOSS
    Profitorloss: {
        type: String
    },

    netProfitDistributed: {
        type: String
    },

    // 12.(A) CASH, BANK BALANCE AND SECURITIES :
    //i
    amountcounted: {
        type: String
    },
    //ii
    producedByDesignation: {
        type: String
    },
    //iii
    infoaccordingCashBook: {
        type: Boolean
    },
    //iv
    ArrangementssafetyCash: {
        type: Boolean
    },
    //B.BANK BALANCES 
    BankReconciliationstatement: {
        type: String
    },

    //C.SECURITIES 
    //i
    physicallysecurities: {
        type: Boolean
    },
    //ii
    dividendscollected: {
        type: Boolean
    },
    //iii
    relevantcertificates: {
        type: Boolean
    },
    //iv
    investmentregister: {
        type: Boolean
    },

    //13 Movable and immovable property 
    //1
    Isrelevantregister:{
       type: Boolean 
    },
    //2
    Verifypropertyphysically:{
        type:String
    },
    //3
    Verifyimmovableproperty :{
     type:String
    },
    //4
    propertydulyinsured :{
       type:String
    },
    //5
    //i
    depreciationcharges:{
        type: Boolean 
    },
    //ii
    rateofdepreciation:{
      type:String  
    },

    //14 
  draftofauditmemo :{
    type: Boolean 
  },

  //form no 28 // 
//1. BORROWINGS 
AgencysanctioningLoan:{
    type:String  
},

Purposeloansanctioned:{
    type:String  
},

loansanctionedAmount:{
    type:String 
},

Maximumamountdrawn:{
type:String 
},

Repaymentsmade:{
type:String 
},

Outstanding:{
    type:String 
},

Amountoverdueifany:{
    type:String
},


Remarks:{
    type:String 
},


// ii
repaymentsloanspunctual:{
    type:Boolean
},

conditionslaiddown:{
 type:Boolean   
},

necessarydocuments:{
    type:Boolean 
},

//GOVERNMENT FINANCIAL ASSISTANCE 
amountsubsidysanctioned:{
     type:String 
},

Hassanctionedamount:{
   type:Boolean  
},

//MEMBERSHIP
financialassistancemembership:{
   type:String 
},

certificatesfromofficers:{
    type:String
},

declarationfrommembers:{
    type:String
},

// LANDS AND THEIR DEVELOPMENT
detailslandsforconstructions:{
    type:String
},

titledeeds:{
    type:Boolean  
},

ConstructionFlats:{
     type:String
},

Constructionroads:{
     type:String
},

OpenSpace:{
     type:String
},

Otherpurposes:{
   type:String 
},

layoutsapproved:{
type:Boolean     
},

completioncertificates:{
type:Boolean     
},

//CONSTRUCTION OF BUILDINGS
 buildingconstructioncommenced:{
    type:Boolean
 },

Noofhousesflats:{
    type:String 
},

flatsallottedmembers:{
   type:Boolean 
},

termsconditionscontracts:{
    type:String 
},

contractsproperlysanctioned:{
    type:Boolean
} ,

tendersofquotation:{
    type:Boolean
},

workprogresscertificate:{
    type:Boolean
},

architectsemployed:{
  type:Boolean  
},


constructioncompletedtoplans:{
  type:Boolean  
},

propertyregister:{
  type:Boolean  
},

measurementbook:{
  type:Boolean  
},

Stockregisters:{
  type:Boolean  
},

valuationcertificates:{
  type:Boolean  
},

expenditureallocated:{
  type:Boolean  
},


buildingaccordingplans:{
    type:String
} ,

flatownersociety:{
     type:Boolean 
},

constructioninsured:{
     type:Boolean 
},

 promotersobligation:{
    type:Boolean
 },

 Examineagreements:{
    type:Boolean
 },

 favorofmembers:{
    type:Boolean
 },

 Societysinkingfund:{
    type:Boolean
 },

  Amountsrepaymentloan :{
    type:Boolean
 },
 Municipaltaxes  :{
    type:Boolean
 },

 Leaserent:{
    type:Boolean
 },

  Servicecharges:{
    type:Boolean
 },

   Contributionsinkingfund:{
    type:Boolean
 },


 //LOANS TO MEMBERS
 recoveriesofloan:{
    type:Boolean
 },

amountsofoverdues:{
    type:String
},

recoveroverdues:{
     type:String
},

//EXPENDITURE
expenditureapproved:{
    type:Boolean
},

/////////////////////////////////////////////SCHEDULES//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
ScheduleI:{
    type:Boolean
},
ScheduleII:{
    type:Boolean
},
ScheduleIII:{
    type:Boolean
},
ScheduleIIIA:{
    type:Boolean
},
ScheduleIV:{
    type:Boolean
},
ScheduleV:{
    type:Boolean
},
/// AUDIT PERIOD: - 1st April 2023 To 31st March 2024
// WhethersocietyhasLoan :{
//     type:Boolean
// },

// cashinhandproperlyvalued :{
//     type:Boolean
// },

// societytakengivenLoans :{
//     type:Boolean 
// },


})

const AuditReportModel = mongoose.model(' auditreport', AuditReportSchema);
module.exports = AuditReportModel;